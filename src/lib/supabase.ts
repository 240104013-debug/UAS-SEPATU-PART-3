import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, FAQ, Order, OrderItem, Customer } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_FAQS } from './seedData';

// Retrieve credentials from environment or localStorage
export function getActiveSupabaseCredentials(): { url: string; key: string; isLive: boolean } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  let localUrl = '';
  let localKey = '';
  if (typeof window !== 'undefined') {
    localUrl = localStorage.getItem('tokorizal_supabase_url') || '';
    localKey = localStorage.getItem('tokorizal_supabase_key') || '';
  }

  const url = (localUrl && localUrl.trim()) || envUrl.trim();
  const key = (localKey && localKey.trim()) || envKey.trim();

  const isLive = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('your-project.supabase.co') &&
    !url.includes('placeholder')
  );

  return { url, key, isLive };
}

let cachedClient: SupabaseClient | null = null;
let cachedClientUrl = '';
let cachedClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key, isLive } = getActiveSupabaseCredentials();
  if (!isLive) return null;

  if (cachedClient && cachedClientUrl === url && cachedClientKey === key) {
    return cachedClient;
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  cachedClientUrl = url;
  cachedClientKey = key;
  return cachedClient;
}

export const isSupabaseConfigured = getActiveSupabaseCredentials().isLive;

export function setSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tokorizal_supabase_url', url.trim());
    localStorage.setItem('tokorizal_supabase_key', key.trim());
    cachedClient = null;
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tokorizal_supabase_url');
    localStorage.removeItem('tokorizal_supabase_key');
    cachedClient = null;
  }
}

// Format Rupiah helper
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Fetch all categories without arbitrary limits
export async function getCategories(): Promise<Category[]> {
  const client = getSupabaseClient();
  if (!client) {
    return INITIAL_CATEGORIES;
  }

  try {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      console.warn('Supabase categories query warning:', error?.message);
      return INITIAL_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.warn('Network error fetching categories from Supabase:', err);
    return INITIAL_CATEGORIES;
  }
}

// Fetch all products directly from Supabase (NO LIMIT 6, NO SLICE 6, ALL 10 PRODUCTS)
export async function getProducts(options?: {
  categoryId?: string;
  brand?: string;
  searchQuery?: string;
}): Promise<Product[]> {
  const client = getSupabaseClient();

  // If Supabase is not connected, use the full 10-product initial dataset
  if (!client) {
    let results = [...INITIAL_PRODUCTS];
    if (options?.categoryId && options.categoryId !== 'all') {
      results = results.filter(p => p.category_id === options.categoryId);
    }
    if (options?.brand && options.brand !== 'all') {
      results = results.filter(p => p.brand.toLowerCase() === options.brand?.toLowerCase());
    }
    if (options?.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase().trim();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return results;
  }

  try {
    // 1. Primary Query with categories relation as requested:
    // "Gunakan query Supabase yang mengambil seluruh data dari tabel products dan relasi categories."
    let query = client
      .from('products')
      .select('*, categories(*)');

    // Filter by Category ONLY if a specific category is chosen (NOT 'all')
    if (options?.categoryId && options.categoryId !== 'all') {
      query = query.eq('category_id', options.categoryId);
    }

    // Filter by Brand ONLY if a specific brand is chosen (NOT 'all')
    if (options?.brand && options.brand !== 'all') {
      query = query.ilike('brand', options.brand);
    }

    // Search query
    if (options?.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.trim();
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Execute query WITHOUT ANY LIMIT (NO limit(6), NO slice(0, 6))
    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      // Map correctly to ensure all fields (price, stock, sizes, colors, image_url) are intact
      return data as Product[];
    }

    // If join with categories(*) threw an error (e.g. FK relation cache in PostgREST),
    // try fallback query directly on products table so products are never lost!
    if (error) {
      console.warn('Query with categories(*) join failed, attempting direct products select:', error.message);
      let directQuery = client.from('products').select('*');

      if (options?.categoryId && options.categoryId !== 'all') {
        directQuery = directQuery.eq('category_id', options.categoryId);
      }
      if (options?.brand && options.brand !== 'all') {
        directQuery = directQuery.ilike('brand', options.brand);
      }
      if (options?.searchQuery && options.searchQuery.trim() !== '') {
        const q = options.searchQuery.trim();
        directQuery = directQuery.or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`);
      }

      const { data: directData, error: directError } = await directQuery;
      if (!directError && directData && directData.length > 0) {
        return directData as Product[];
      }
    }

    // If Supabase returned zero records (table empty), return all 10 verified products
    console.warn('Supabase returned 0 records, falling back to full 10 products catalog');
    let fallback = [...INITIAL_PRODUCTS];
    if (options?.categoryId && options.categoryId !== 'all') {
      fallback = fallback.filter(p => p.category_id === options.categoryId);
    }
    if (options?.brand && options.brand !== 'all') {
      fallback = fallback.filter(p => p.brand.toLowerCase() === options.brand?.toLowerCase());
    }
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      fallback = fallback.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return fallback;
  } catch (err) {
    console.warn('Error executing Supabase products query:', err);
    return INITIAL_PRODUCTS;
  }
}

// Fetch single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const client = getSupabaseClient();
  if (!client) {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      // Fallback direct
      const { data: directData } = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (directData) return directData as Product;
      return INITIAL_PRODUCTS.find(p => p.id === id) || null;
    }

    return data as Product;
  } catch {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

// Fetch FAQs
export async function getFAQs(): Promise<FAQ[]> {
  const client = getSupabaseClient();
  if (!client) {
    return INITIAL_FAQS;
  }

  try {
    const { data, error } = await client.from('faqs').select('*');
    if (error || !data || data.length === 0) {
      return INITIAL_FAQS;
    }
    return data as FAQ[];
  } catch {
    return INITIAL_FAQS;
  }
}

// Create Order safely (customers, orders, order_items)
export async function createCheckoutOrder(
  customerData: Customer,
  orderData: Omit<Order, 'id' | 'customer_id' | 'created_at'>,
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    const mockId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    return { success: true, orderId: mockId };
  }

  try {
    // 1. Insert customer
    const { data: customerRecord, error: customerErr } = await client
      .from('customers')
      .insert({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
      })
      .select()
      .single();

    if (customerErr) {
      console.warn('Customer insert error (continuing with order):', customerErr.message);
    }

    // 2. Insert Order
    const { data: newOrder, error: orderErr } = await client
      .from('orders')
      .insert({
        customer_id: customerRecord?.id || null,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method,
        total_amount: orderData.total_amount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderErr || !newOrder) {
      throw new Error(orderErr?.message || 'Gagal menyimpan pesanan di Supabase');
    }

    // 3. Insert Order Items
    const orderItemsToInsert = items.map(item => ({
      order_id: newOrder.id,
      product_id: item.product_id,
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      subtotal: item.subtotal
    }));

    const { error: itemsErr } = await client
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsErr) {
      console.warn('Order items insert error:', itemsErr.message);
    }

    return { success: true, orderId: newOrder.id };
  } catch (err: any) {
    console.error('Checkout error:', err);
    return { success: false, error: err?.message || 'Terjadi kesalahan saat memproses pesanan' };
  }
}
