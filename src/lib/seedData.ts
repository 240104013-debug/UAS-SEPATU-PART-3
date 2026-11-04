import { Category, Product, FAQ } from '../types/database';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-running',
    name: 'Running',
    slug: 'running',
    description: 'Sepatu lari berteknologi tinggi dengan bantalan responsif untuk lari marathon maupun jogging harian.',
    image_url: '/src/assets/images/product_running_shoe_1793759789134.jpg'
  },
  {
    id: 'cat-basketball',
    name: 'Basketball',
    slug: 'basketball',
    description: 'Sepatu basket dengan dukungan ankle superior, cengkeraman maksimal di lapangan, dan bantalan benturan.',
    image_url: '/src/assets/images/product_basketball_shoe_1793759790682.jpg'
  },
  {
    id: 'cat-football',
    name: 'Sepak Bola & Futsal',
    slug: 'football',
    description: 'Sepatu bola dan futsal ringan dengan traksi aerodinamis untuk akselerasi dan kontrol bola presisi.',
    image_url: '/src/assets/images/product_soccer_cleats_1793759790770.jpg'
  },
  {
    id: 'cat-training',
    name: 'Training & Gym',
    slug: 'training',
    description: 'Sepatu latihan multi-fungsi dengan stabilitas lateral tinggi untuk crossfit, angkat beban, dan kardio.',
    image_url: '/src/assets/images/product_trainer_sneaker_1793759790756.jpg'
  }
];

// FULL 10 PRODUCTS (Tidak dibatasi 6)
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-nike-alphafly',
    category_id: 'cat-running',
    product_name: 'Nike Air Zoom Alphafly Next% 3 Elite',
    name: 'Nike Air Zoom Alphafly Next% 3 Elite',
    brand: 'Nike',
    sku: 'NK-AF3-01',
    description: 'Sepatu lari kompetisi rekor dunia maraton dengan kombinasi busa ZoomX ultra-ringan, unit Air Zoom ganda di kaki depan, dan pelat serat karbon Flyplate panjang penuh untuk efisiensi energi maksimal.',
    price: 3899000,
    stock: 12,
    size: '40, 41, 42, 43, 44, 45',
    color: 'Hitam / Crimson Red',
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ['Hitam / Crimson Red', 'Putih / Merah Balap', 'All Black Stealth'],
    size_display: '40 - 45',
    color_display: 'Hitam / Crimson Red',
    image_url: '/src/assets/images/product_running_shoe_1793759789134.jpg',
    is_featured: true,
  },
  {
    id: 'prod-jordan-retro-high',
    category_id: 'cat-basketball',
    product_name: 'Air Jordan 6 Retro "Bred Inferno"',
    name: 'Air Jordan 6 Retro "Bred Inferno"',
    brand: 'Jordan',
    sku: 'JD-AJ6-02',
    description: 'Ikon lapangan basket legendaris dengan material kulit premium bertekstur, perforated side panels untuk sirkulasi udara, unit Air-Sole transparan di bagian tumit, dan sol icy translucent yang mencengkeram lantai hardwood.',
    price: 3299000,
    stock: 8,
    size: '40, 41, 42, 43, 44',
    color: 'Hitam / Merah Banteng',
    sizes: [40, 41, 42, 43, 44],
    colors: ['Hitam / Merah Banteng', 'Black Infrared', 'Triple White'],
    size_display: '40 - 44',
    color_display: 'Hitam / Merah Banteng',
    image_url: '/src/assets/images/product_basketball_shoe_1793759790682.jpg',
    is_featured: true,
  },
  {
    id: 'prod-nike-mercurial',
    category_id: 'cat-football',
    product_name: 'Nike Zoom Mercurial Superfly 9 Elite FG',
    name: 'Nike Zoom Mercurial Superfly 9 Elite FG',
    brand: 'Nike',
    sku: 'NK-MC9-03',
    description: 'Sepatu bola level profesional dengan unit 3/4 Zoom Air khusus lapangan rumput alami. Material Vaporposite+ di bagian atas menggabungkan jaring berpola cengkeram untuk sentuhan bola tak tertandingi di kecepatan tinggi.',
    price: 3699000,
    stock: 15,
    size: '39, 40, 41, 42, 43, 44',
    color: 'Hitam / Fiery Crimson / Perak Krom',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['Hitam / Fiery Crimson / Perak Krom', 'Merah Laser / Hitam'],
    size_display: '39 - 44',
    color_display: 'Hitam / Fiery Crimson / Perak Krom',
    image_url: '/src/assets/images/product_soccer_cleats_1793759790770.jpg',
    is_featured: true,
  },
  {
    id: 'prod-adidas-ultrarunner',
    category_id: 'cat-running',
    product_name: 'Adidas Ultra Runner Boost 24 Sport',
    name: 'Adidas Ultra Runner Boost 24 Sport',
    brand: 'Adidas',
    sku: 'AD-URB-04',
    description: 'Kenyamanan tanpa tanding dengan sol midsole Light Boost yang 30% lebih ringan namun menghasilkan energy return luar biasa. Primeknit+ textile upper membalut kaki layaknya kaus kaki atletik.',
    price: 2899000,
    stock: 20,
    size: '39, 40, 41, 42, 43, 44, 45',
    color: 'Hitam Karbon / Merah Aktif',
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ['Hitam Karbon / Merah Aktif', 'Core Black / Cloud White'],
    size_display: '39 - 45',
    color_display: 'Hitam Karbon / Merah Aktif',
    image_url: '/src/assets/images/hero_sports_shoes_1793759787842.jpg',
    is_featured: true,
  },
  {
    id: 'prod-puma-train-max',
    category_id: 'cat-training',
    product_name: 'Puma FUSE 2.0 Apex Trainer',
    name: 'Puma FUSE 2.0 Apex Trainer',
    brand: 'Puma',
    sku: 'PM-FS2-05',
    description: 'Didesain bersama atlet angkat beban dan crossfit dunia. Sol karet PUMAGRIP berdaya tahan ekstrem, heel clip vertikal untuk stabilitas handstand push-up, dan toe box lebar untuk distribusi tenaga optimal.',
    price: 1999000,
    stock: 18,
    size: '40, 41, 42, 43, 44',
    color: 'Anthracite / Flame Red',
    sizes: [40, 41, 42, 43, 44],
    colors: ['Anthracite / Flame Red', 'Black Smoke / Pure White'],
    size_display: '40 - 44',
    color_display: 'Anthracite / Flame Red',
    image_url: '/src/assets/images/product_trainer_sneaker_1793759790756.jpg',
    is_featured: false,
  },
  {
    id: 'prod-adidas-predator-pro',
    category_id: 'cat-football',
    product_name: 'Adidas Predator Accuracy+ FG Elite',
    name: 'Adidas Predator Accuracy+ FG Elite',
    brand: 'Adidas',
    sku: 'AD-PRD-06',
    description: 'Dirancang untuk akurasi tembakan mematikan. Dilengkapi teknologi High Definition Grip karet timbul pada zona strike serta konstruksi laceless HybridTouch yang halus dan presisi.',
    price: 3599000,
    stock: 9,
    size: '40, 41, 42, 43, 44',
    color: 'Core Black / Solar Red / White',
    sizes: [40, 41, 42, 43, 44],
    colors: ['Core Black / Solar Red / White', 'Team Red / Metallic Black'],
    size_display: '40 - 44',
    color_display: 'Core Black / Solar Red / White',
    image_url: '/src/assets/images/product_soccer_cleats_1793759790770.jpg',
    is_featured: false,
  },
  {
    id: 'prod-nike-gt-cut',
    category_id: 'cat-basketball',
    product_name: 'Nike G.T. Cut 3 EP Basketball Pro',
    name: 'Nike G.T. Cut 3 EP Basketball Pro',
    brand: 'Nike',
    sku: 'NK-GTC-07',
    description: 'Sepatu basket berkecepatan tinggi dengan busa ZoomX penuh pertama pada lini basket. Memaksimalkan daya lepas landas saat melakukan crossover dan step-back jumper.',
    price: 2999000,
    stock: 14,
    size: '40, 41, 42, 43, 44, 45',
    color: 'Hitam / Crimson Red',
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ['Hitam / Crimson Red', 'Triple White', 'Volt Lime'],
    size_display: '40 - 45',
    color_display: 'Hitam / Crimson Red',
    image_url: '/src/assets/images/product_basketball_shoe_1793759790682.jpg',
    is_featured: true,
  },
  {
    id: 'prod-puma-nitro-elite',
    category_id: 'cat-running',
    product_name: 'Puma Deviate Nitro Elite 2 Marathon',
    name: 'Puma Deviate Nitro Elite 2 Marathon',
    brand: 'Puma',
    sku: 'PM-DNE-08',
    description: 'Super-shoe berbobot ultra-ringan dengan pelat karbon INNOPLATE dan bantalan gas nitrogen NITRO Elite. Didesain untuk pelari maraton yang mengincar waktu terbaik personal (PB).',
    price: 2799000,
    stock: 16,
    size: '39, 40, 41, 42, 43, 44',
    color: 'Fire Red / Puma Black',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['Fire Red / Puma Black', 'White Nitro', 'Black Stealth'],
    size_display: '39 - 44',
    color_display: 'Fire Red / Puma Black',
    image_url: '/src/assets/images/product_running_shoe_1793759789134.jpg',
    is_featured: false,
  },
  {
    id: 'prod-ua-project-rock',
    category_id: 'cat-training',
    product_name: 'Under Armour Project Rock 6 Training',
    name: 'Under Armour Project Rock 6 Training',
    brand: 'Under Armour',
    sku: 'UA-PR6-09',
    description: 'Sepatu training seri Dwayne Johnson dengan bantalan responsif UA HOVR, klip tumit TPU kokoh untuk latihan beban berat, dan upper UA Clone yang menyesuaikan bentuk kaki.',
    price: 2499000,
    stock: 11,
    size: '40, 41, 42, 43, 44',
    color: 'Black / Red Bull',
    sizes: [40, 41, 42, 43, 44],
    colors: ['Black / Red Bull', 'Pitch Gray / White'],
    size_display: '40 - 44',
    color_display: 'Black / Red Bull',
    image_url: '/src/assets/images/product_trainer_sneaker_1793759790756.jpg',
    is_featured: false,
  },
  {
    id: 'prod-adidas-copa-pure',
    category_id: 'cat-football',
    product_name: 'Adidas Copa Pure 2 Elite FG Leather',
    name: 'Adidas Copa Pure 2 Elite FG Leather',
    brand: 'Adidas',
    sku: 'AD-CPP-10',
    description: 'Sentuhan bola murni klasik dengan balutan kulit Fusionskin premium dan sol Torsionframe ringan. Sangat nyaman untuk gelandang dan pemain yang mengutamakan sentuhan bola sempurna.',
    price: 3199000,
    stock: 10,
    size: '39, 40, 41, 42, 43, 44',
    color: 'Blackout / Solar Red Trim',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['Blackout / Solar Red Trim', 'Pure White / Core Black'],
    size_display: '39 - 44',
    color_display: 'Blackout / Solar Red Trim',
    image_url: '/src/assets/images/hero_sports_shoes_1793759787842.jpg',
    is_featured: false,
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Apakah produk di Toko Sepatu Olahraga Rizal 100% Original?',
    answer: 'Ya, seluruh produk sepatu di Toko Sepatu Olahraga Rizal dijamin 100% Original bergaransi resmi. Kami bekerjasama langsung dengan distributor resmi Nike, Adidas, Puma, Under Armour, dan Jordan di Indonesia.',
    category: 'Produk'
  },
  {
    id: 'faq-2',
    question: 'Berapa lama estimasi pengiriman dan ke mana saja?',
    answer: 'Kami melayani pengiriman ke seluruh wilayah Indonesia (JNE, SiCepat, J&T, Gosend/Grab Instant untuk Jabodetabek). Estimasi pulau Jawa 1-3 hari kerja, luar pulau Jawa 3-6 hari kerja.',
    category: 'Pengiriman'
  },
  {
    id: 'faq-3',
    question: 'Bisa tukar ukuran (size) jika kekecilan atau kebesaran?',
    answer: 'Bisa! Kami menyediakan fasilitas tukar ukuran dalam waktu 7 hari setelah barang diterima, asalkan sepatu belum digunakan di luar ruangan dan kelengkapan box serta tag masih utuh.',
    category: 'Garansi'
  },
  {
    id: 'faq-4',
    question: 'Metode pembayaran apa saja yang didukung?',
    answer: 'Kami mendukung Transfer Bank (BCA, Mandiri, BRI, BNI), QRIS (GoPay, OVO, Dana, ShopeePay), Kartu Kredit/Debit, dan Cash on Delivery (COD) untuk wilayah tertentu.',
    category: 'Pembayaran'
  },
  {
    id: 'faq-5',
    question: 'Di mana lokasi Toko Sepatu Olahraga Rizal?',
    answer: 'Store kami beralamat di Jl. Pemuda Olahraga No. 88, Jakarta Selatan. Buka setiap hari dari pukul 09.00 - 21.00 WIB.',
    category: 'Toko'
  }
];

export const SUPABASE_SQL_SETUP = `-- SKEMA SQL LENGKAP UNTUK TOKO SEPATU OLAHRAGA RIZAL (10 PRODUK)
-- Salin dan jalankan seluruh script ini di Supabase Dashboard -> SQL Editor

-- 1. Buat Tabel Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat Tabel Products (Kolom: product_name, brand, sku, size, color, price, stock, description, image_url)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    sku TEXT,
    description TEXT,
    price BIGINT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    size TEXT,
    color TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Buat Tabel Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Buat Tabel Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_amount BIGINT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Buat Tabel Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    price BIGINT NOT NULL,
    quantity INT NOT NULL,
    size INT NOT NULL,
    color TEXT NOT NULL,
    subtotal BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Buat Tabel FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- KEBIJAKAN RLS (Public read untuk katalog & faqs, public create untuk orders/customers)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- SEED DATA AWAL (KATEGORI)
INSERT INTO public.categories (id, name, slug, description, image_url)
VALUES
('cat-running', 'Running', 'running', 'Sepatu lari berteknologi tinggi dengan bantalan responsif.', '/src/assets/images/product_running_shoe_1793759789134.jpg'),
('cat-basketball', 'Basketball', 'basketball', 'Sepatu basket dengan dukungan ankle superior.', '/src/assets/images/product_basketball_shoe_1793759790682.jpg'),
('cat-football', 'Sepak Bola & Futsal', 'football', 'Sepatu bola dan futsal ringan dengan traksi aerodinamis.', '/src/assets/images/product_soccer_cleats_1793759790770.jpg'),
('cat-training', 'Training & Gym', 'training', 'Sepatu latihan multi-fungsi dengan stabilitas lateral.', '/src/assets/images/product_trainer_sneaker_1793759790756.jpg')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- SEED DATA AWAL (SEMUA 10 PRODUK)
INSERT INTO public.products (id, category_id, product_name, brand, sku, description, price, stock, size, color, image_url, is_featured)
VALUES
('prod-nike-alphafly', 'cat-running', 'Nike Air Zoom Alphafly Next% 3 Elite', 'Nike', 'NK-AF3-01', 'Sepatu lari kompetisi rekor dunia maraton dengan kombinasi busa ZoomX ultra-ringan.', 3899000, 12, '40, 41, 42, 43, 44, 45', 'Hitam / Crimson Red', '/src/assets/images/product_running_shoe_1793759789134.jpg', true),
('prod-jordan-retro-high', 'cat-basketball', 'Air Jordan 6 Retro "Bred Inferno"', 'Jordan', 'JD-AJ6-02', 'Ikon lapangan basket legendaris dengan material kulit premium bertekstur.', 3299000, 8, '40, 41, 42, 43, 44', 'Hitam / Merah Banteng', '/src/assets/images/product_basketball_shoe_1793759790682.jpg', true),
('prod-nike-mercurial', 'cat-football', 'Nike Zoom Mercurial Superfly 9 Elite FG', 'Nike', 'NK-MC9-03', 'Sepatu bola level profesional dengan unit 3/4 Zoom Air khusus lapangan rumput.', 3699000, 15, '39, 40, 41, 42, 43, 44', 'Hitam / Fiery Crimson / Perak Krom', '/src/assets/images/product_soccer_cleats_1793759790770.jpg', true),
('prod-adidas-ultrarunner', 'cat-running', 'Adidas Ultra Runner Boost 24 Sport', 'Adidas', 'AD-URB-04', 'Kenyamanan tanpa tanding dengan sol midsole Light Boost yang 30% lebih ringan.', 2899000, 20, '39, 40, 41, 42, 43, 44, 45', 'Hitam Karbon / Merah Aktif', '/src/assets/images/hero_sports_shoes_1793759787842.jpg', true),
('prod-puma-train-max', 'cat-training', 'Puma FUSE 2.0 Apex Trainer', 'Puma', 'PM-FS2-05', 'Didesain bersama atlet angkat beban dunia. Sol karet PUMAGRIP berdaya tahan ekstrem.', 1999000, 18, '40, 41, 42, 43, 44', 'Anthracite / Flame Red', '/src/assets/images/product_trainer_sneaker_1793759790756.jpg', false),
('prod-adidas-predator-pro', 'cat-football', 'Adidas Predator Accuracy+ FG Elite', 'Adidas', 'AD-PRD-06', 'Dirancang untuk akurasi tembakan mematikan dengan teknologi High Definition Grip.', 3599000, 9, '40, 41, 42, 43, 44', 'Core Black / Solar Red / White', '/src/assets/images/product_soccer_cleats_1793759790770.jpg', false),
('prod-nike-gt-cut', 'cat-basketball', 'Nike G.T. Cut 3 EP Basketball Pro', 'Nike', 'NK-GTC-07', 'Sepatu basket berkecepatan tinggi dengan busa ZoomX penuh pertama pada lini basket.', 2999000, 14, '40, 41, 42, 43, 44, 45', 'Hitam / Crimson Red', '/src/assets/images/product_basketball_shoe_1793759790682.jpg', true),
('prod-puma-nitro-elite', 'cat-running', 'Puma Deviate Nitro Elite 2 Marathon', 'Puma', 'PM-DNE-08', 'Super-shoe berbobot ultra-ringan dengan pelat karbon INNOPLATE dan bantalan gas nitrogen NITRO Elite.', 2799000, 16, '39, 40, 41, 42, 43, 44', 'Fire Red / Puma Black', '/src/assets/images/product_running_shoe_1793759789134.jpg', false),
('prod-ua-project-rock', 'cat-training', 'Under Armour Project Rock 6 Training', 'Under Armour', 'UA-PR6-09', 'Sepatu training seri Dwayne Johnson dengan bantalan responsif UA HOVR.', 2499000, 11, '40, 41, 42, 43, 44', 'Black / Red Bull', '/src/assets/images/product_trainer_sneaker_1793759790756.jpg', false),
('prod-adidas-copa-pure', 'cat-football', 'Adidas Copa Pure 2 Elite FG Leather', 'Adidas', 'AD-CPP-10', 'Sentuhan bola murni klasik dengan balutan kulit Fusionskin premium dan sol Torsionframe ringan.', 3199000, 10, '39, 40, 41, 42, 43, 44', 'Blackout / Solar Red Trim', '/src/assets/images/hero_sports_shoes_1793759787842.jpg', false)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  product_name = EXCLUDED.product_name,
  brand = EXCLUDED.brand,
  sku = EXCLUDED.sku,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  size = EXCLUDED.size,
  color = EXCLUDED.color,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured;

-- SEED DATA AWAL (FAQS)
INSERT INTO public.faqs (id, question, answer, category)
VALUES
('faq-1', 'Apakah produk di Toko Sepatu Olahraga Rizal 100% Original?', 'Ya, seluruh produk di Toko Sepatu Olahraga Rizal dijamin 100% Original bergaransi resmi dari distributor resmi Nike, Adidas, Puma, dan Jordan.', 'Produk'),
('faq-2', 'Berapa lama estimasi pengiriman dan ke mana saja?', 'Kami melayani pengiriman ke seluruh wilayah Indonesia (JNE, SiCepat, J&T). Estimasi Jawa 1-3 hari, luar Jawa 3-6 hari.', 'Pengiriman'),
('faq-3', 'Bisa tukar ukuran (size) jika kekecilan atau kebesaran?', 'Bisa! Kami menyediakan fasilitas tukar ukuran dalam waktu 7 hari setelah barang diterima dengan kondisi baru dan box lengkap.', 'Garansi')
ON CONFLICT (id) DO NOTHING;
`;
