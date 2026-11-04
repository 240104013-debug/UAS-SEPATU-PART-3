import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, FAQ, Order, OrderItem, Customer } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_FAQS } from './seedData';

// Retrieve credentials from environment, URL parameters, or localStorage
export function getActiveSupabaseCredentials(): { url: string; key: string; isLive: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  
  let localUrl = '';
  let localKey = '';
  if (typeof window !== 'undefined') {
    localUrl = (localStorage.getItem('tokorizal_supabase_url') || '').trim();
    localKey = (localStorage.getItem('tokorizal_supabase_key') || '').trim();

    // Support URL query parameters (?supabase_url=...&supabase_key=...) for immediate testing
    try {
      const search = window.location.search;
      if (search) {
        const params = new URLSearchParams(search);
        const queryUrl = params.get('supabase_url') || params.get('url');
        const queryKey = params.get('supabase_key') || params.get('key');
        if (queryUrl && queryKey) {
          localUrl = queryUrl.trim();
          localKey = queryKey.trim();
          localStorage.setItem('tokorizal_supabase_url', localUrl);
          localStorage.setItem('tokorizal_supabase_key', localKey);
        }
      }
    } catch {
      // ignore
    }
  }

  const url = localUrl || envUrl;
  const key = localKey || envKey;

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

// Fallback high quality local image for sports categories
export function getFallbackCategoryImage(identifier: string = ''): string {
  const s = identifier.toLowerCase();
  if (s.includes('run') || s.includes('lari')) {
    return '/src/assets/images/product_running_shoe_1793759789134.jpg';
  }
  if (s.includes('basket')) {
    return '/src/assets/images/product_basketball_shoe_1793759790682.jpg';
  }
  if (s.includes('foot') || s.includes('bola') || s.includes('futsal') || s.includes('soccer')) {
    return '/src/assets/images/product_soccer_cleats_1793759790770.jpg';
  }
  if (s.includes('train') || s.includes('gym') || s.includes('fit')) {
    return '/src/assets/images/product_trainer_sneaker_1793759790756.jpg';
  }
  return '/src/assets/images/hero_sports_shoes_1793759787842.jpg';
}

// Normalize any product row from Supabase products table
export function normalizeProduct(row: any): Product {
  const productName = row.product_name || row.name || 'Produk Sepatu';
  const brand = row.brand || '';
  const sku = row.sku || row.code || '';
  const description = row.description || row.deskripsi || '';
  const price = typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0;
  const stock = typeof row.stock === 'number' ? row.stock : parseInt(row.stock, 10) || 0;
  // Ambil gambar langsung dari kolom image_url tabel products Supabase
  let rawImg = row.image_url ?? row.imageUrl ?? row.image ?? row.gambar_url ?? row.gambar;
  let imageUrl = '';
  if (rawImg !== undefined && rawImg !== null) {
    if (typeof rawImg === 'string') {
      imageUrl = rawImg.trim().replace(/^['"]|['"]$/g, '');
    } else if (typeof rawImg === 'object') {
      imageUrl = (rawImg.publicUrl || rawImg.url || rawImg.src || '').trim();
    }
  }

  // Handle relative Supabase storage paths if user stored relative path
  if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
    const creds = getActiveSupabaseCredentials();
    if (creds.url && (imageUrl.includes('/') || imageUrl.includes('.'))) {
      imageUrl = `${creds.url}/storage/v1/object/public/${imageUrl}`;
    }
  }

  const categoryId = row.category_id || (row.categories?.id) || '';

  // Parse Size: could be number[], string, or number
  const rawSize = row.size !== undefined && row.size !== null ? row.size : row.sizes;
  let sizes: (string | number)[] = [];
  let sizeDisplay = '';

  if (Array.isArray(rawSize)) {
    sizes = rawSize;
    sizeDisplay = rawSize.join(', ');
  } else if (typeof rawSize === 'string') {
    sizeDisplay = rawSize;
    sizes = rawSize.split(/[,;\/]/).map((s: string) => s.trim()).filter(Boolean);
    if (sizes.length === 0 && rawSize.trim()) sizes = [rawSize.trim()];
  } else if (typeof rawSize === 'number') {
    sizeDisplay = String(rawSize);
    sizes = [rawSize];
  } else {
    sizes = ['Standard'];
    sizeDisplay = 'Standard';
  }

  // Parse Color: could be string[], string
  const rawColor = row.color !== undefined && row.color !== null ? row.color : row.colors;
  let colors: string[] = [];
  let colorDisplay = '';

  if (Array.isArray(rawColor)) {
    colors = rawColor.map(String);
    colorDisplay = colors.join(' / ');
  } else if (typeof rawColor === 'string') {
    colorDisplay = rawColor;
    colors = rawColor.split(/[,;\/]/).map((c: string) => c.trim()).filter(Boolean);
    if (colors.length === 0 && rawColor.trim()) colors = [rawColor.trim()];
  } else {
    colors = ['Standard'];
    colorDisplay = 'Standard';
  }

  // Category object
  let categoryObj: Category | undefined = undefined;
  if (row.categories) {
    categoryObj = {
      id: row.categories.id || categoryId,
      name: row.categories.name || row.categories.category_name || row.categories.nama || 'Kategori',
      slug: row.categories.slug || '',
      description: row.categories.description || row.categories.deskripsi,
      image_url: row.categories.image_url
    };
  }

  return {
    id: String(row.id),
    category_id: categoryId,
    product_name: productName,
    name: productName,
    brand,
    sku,
    description,
    price,
    stock,
    size: rawSize,
    color: rawColor,
    sizes,
    colors,
    size_display: sizeDisplay,
    color_display: colorDisplay,
    image_url: imageUrl,
    is_featured: Boolean(row.is_featured),
    created_at: row.created_at,
    categories: categoryObj
  };
}

// Fetch categories from Supabase (with safe column mapping and fallback)
export async function getCategories(): Promise<Category[]> {
  const client = getSupabaseClient();
  if (!client) {
    return INITIAL_CATEGORIES;
  }

  try {
    // Select all columns without strict .order('name') which breaks if column is named differently
    const { data, error } = await client
      .from('categories')
      .select('*');

    if (error) {
      console.warn('Notice saat mengambil kategori dari Supabase:', error.message);
      return INITIAL_CATEGORIES;
    }

    if (!data || data.length === 0) {
      console.warn('Tabel categories di Supabase kosong, menggunakan data kategori standar.');
      return INITIAL_CATEGORIES;
    }

    const mapped: Category[] = data.map((c: any) => {
      const name = c.name || c.category_name || c.nama || c.title || c.slug || 'Kategori Olahraga';
      const slug = c.slug || c.id || name.toLowerCase().replace(/\s+/g, '-');
      const description = c.description || c.deskripsi || '';
      const rawImage = c.image_url || c.image || c.gambar || '';
      const image_url = rawImage.trim() ? rawImage.trim() : getFallbackCategoryImage(slug + ' ' + name);

      return {
        id: String(c.id),
        name,
        slug,
        description,
        image_url
      };
    });

    mapped.sort((a, b) => a.name.localeCompare(b.name));
    return mapped;
  } catch (err) {
    console.error('Error fetching categories from Supabase:', err);
    return INITIAL_CATEGORIES;
  }
}

// Filter and sort products in-memory helper
function filterAndSortProductsList(
  products: Product[],
  options?: {
    categoryId?: string;
    brand?: string;
    searchQuery?: string;
    sortBy?: 'featured' | 'price-asc' | 'price-desc';
  }
): Product[] {
  let list = [...products];

  // Category filter: match against category_id, categories.id, or categories.slug
  if (options?.categoryId && options.categoryId !== 'all') {
    const targetCat = options.categoryId.toLowerCase().trim();
    list = list.filter(p => {
      const catId = (p.category_id || '').toLowerCase();
      const parentCatId = (p.categories?.id || '').toLowerCase();
      const parentCatSlug = (p.categories?.slug || '').toLowerCase();
      const parentCatName = (p.categories?.name || '').toLowerCase();

      return (
        catId === targetCat ||
        parentCatId === targetCat ||
        parentCatSlug === targetCat ||
        parentCatName === targetCat
      );
    });
  }

  // Brand filter
  if (options?.brand && options.brand !== 'all') {
    const targetBrand = options.brand.toLowerCase().trim();
    list = list.filter(p => p.brand && p.brand.toLowerCase() === targetBrand);
  }

  // Search query filter (searches product_name, brand, sku, description)
  if (options?.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(p =>
      (p.product_name && p.product_name.toLowerCase().includes(q)) ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Sort
  if (options?.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Featured first
    list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return list;
}

// Fetch all products directly from Supabase products table
export async function getProducts(options?: {
  categoryId?: string;
  brand?: string;
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc';
}): Promise<Product[]> {
  const client = getSupabaseClient();

  if (!client) {
    // Supabase credentials not set yet, return the 10 catalog products
    return filterAndSortProductsList(INITIAL_PRODUCTS, options);
  }

  try {
    // 1. Fetch categories for safe relation linking
    const categoriesList = await getCategories();
    const categoryMap = new Map<string, Category>();
    categoriesList.forEach(c => {
      categoryMap.set(c.id, c);
      if (c.slug) categoryMap.set(c.slug, c);
    });

    // 2. Query products from Supabase
    // Attempt with categories join first
    let rawList: any[] = [];
    const { data, error } = await client
      .from('products')
      .select('*, categories(*)');

    if (!error && data && data.length > 0) {
      rawList = data;
    } else {
      // Direct query fallback if join syntax threw error (e.g. PostgREST schema cache)
      const { data: directData, error: directErr } = await client
        .from('products')
        .select('*');

      if (!directErr && directData && directData.length > 0) {
        rawList = directData;
      } else if (directErr) {
        console.warn('Notice saat mengambil produk dari Supabase:', directErr.message);
        return filterAndSortProductsList(INITIAL_PRODUCTS, options);
      }
    }

    if (rawList.length === 0) {
      // If table is completely empty in user's Supabase, fallback to INITIAL_PRODUCTS
      return filterAndSortProductsList(INITIAL_PRODUCTS, options);
    }

    // Normalize all rows from Supabase
    const normalized: Product[] = rawList.map(row => {
      const prod = normalizeProduct(row);
      // Link category from categoryMap if not already linked by PostgREST
      if (!prod.categories && prod.category_id && categoryMap.has(prod.category_id)) {
        prod.categories = categoryMap.get(prod.category_id);
      }
      return prod;
    });

    // Apply filtering and sorting
    return filterAndSortProductsList(normalized, options);
  } catch (err: any) {
    console.error('Error fetching products from Supabase:', err);
    return filterAndSortProductsList(INITIAL_PRODUCTS, options);
  }
}

// Fetch single product by ID directly from Supabase
export async function getProductById(id: string): Promise<Product | null> {
  const client = getSupabaseClient();
  if (!client) {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }

  try {
    const categoriesList = await getCategories();
    const categoryMap = new Map(categoriesList.map(c => [c.id, c]));

    const { data, error } = await client
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      const prod = normalizeProduct(data);
      if (!prod.categories && prod.category_id && categoryMap.has(prod.category_id)) {
        prod.categories = categoryMap.get(prod.category_id);
      }
      return prod;
    }

    const { data: directData } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (directData) {
      const prod = normalizeProduct(directData);
      if (!prod.categories && prod.category_id && categoryMap.has(prod.category_id)) {
        prod.categories = categoryMap.get(prod.category_id);
      }
      return prod;
    }

    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  } catch {
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

// Fetch FAQs
export async function getFAQs(): Promise<FAQ[]> {
  const client = getSupabaseClient();
  if (!client) return INITIAL_FAQS;

  try {
    const { data, error } = await client.from('faqs').select('*');
    if (!error && data && data.length > 0) return data as FAQ[];
    return INITIAL_FAQS;
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
      console.warn('Customer insert notice:', customerErr.message);
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
      console.warn('Order items insert notice:', itemsErr.message);
    }

    return { success: true, orderId: newOrder.id };
  } catch (err: any) {
    console.error('Checkout error:', err);
    return { success: false, error: err?.message || 'Terjadi kesalahan saat memproses pesanan' };
  }
}
