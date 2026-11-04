import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, FAQ, Order, OrderItem, Customer } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_FAQS } from './seedData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Format Rupiah helper
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error || !data || data.length === 0) {
      console.warn('Supabase categories fetch error or empty, using default catalog:', error?.message);
      return INITIAL_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.warn('Network error fetching categories from Supabase, fallback active:', err);
    return INITIAL_CATEGORIES;
  }
}

// Fetch all products
export async function getProducts(options?: {
  categoryId?: string;
  brand?: string;
  searchQuery?: string;
}): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
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
    let query = supabase.from('products').select('*, categories(*)');

    if (options?.categoryId && options.categoryId !== 'all') {
      query = query.eq('category_id', options.categoryId);
    }

    if (options?.brand && options.brand !== 'all') {
      query = query.ilike('brand', options.brand);
    }

    if (options?.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.trim();
      query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase products returned no records or error, using default catalog:', error?.message);
      // Fallback filter
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
    }

    return data as Product[];
  } catch (err) {
    console.warn('Error fetching products from Supabase:', err);
    return INITIAL_PRODUCTS;
  }
}

// Fetch single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return INITIAL_PRODUCTS.find(p => p.id === id) || null;
    }

    return data as Product;
  } catch {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

// Fetch FAQs
export async function getFAQs(): Promise<FAQ[]> {
  if (!isSupabaseConfigured || !supabase) {
    return INITIAL_FAQS;
  }

  try {
    const { data, error } = await supabase.from('faqs').select('*');
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
  if (!isSupabaseConfigured || !supabase) {
    // Simulated offline/demo mode order
    const mockId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    return { success: true, orderId: mockId };
  }

  try {
    // 1. Create or query customer
    const { data: customerRecord, error: customerErr } = await supabase
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
      console.error('Customer insert error:', customerErr);
      // Even if customer insert fails or table is locked, continue with order
    }

    // 2. Insert Order
    const { data: newOrder, error: orderErr } = await supabase
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

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsErr) {
      console.error('Order items error:', itemsErr);
    }

    return { success: true, orderId: newOrder.id };
  } catch (err: any) {
    console.error('Checkout error:', err);
    return { success: false, error: err?.message || 'Terjadi kesalahan saat memproses pesanan' };
  }
}
