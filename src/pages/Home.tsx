import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, Trophy, Activity, Sparkles, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types/database';
import { getProducts, getCategories, getFallbackCategoryImage } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

interface HomeProps {
  onNavigate: (view: string, params?: any) => void;
  onViewProduct: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        const [allProds, allCats] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setTotalProductsCount(allProds.length);
        const featured = allProds.filter(p => p.is_featured);
        setFeaturedProducts(featured.length > 0 ? featured : allProds);
        setCategories(allCats);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO CAMPAIGN BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0d0e11] to-[#0c0d0e] pt-6 pb-12 sm:pt-10 sm:pb-20 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 z-10">
              
              {/* Brand Tagline Kicker */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500">
                <span className="w-6 h-0.5 bg-red-600 rounded-full" />
                <span>KOLEKSI RESMI 2026 · PERFORMANCE GRADE</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-black text-4xl sm:text-5xl xl:text-6xl text-white tracking-tighter uppercase leading-[1.05]">
                TEMUKAN SEPATU <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  OLAHRAGA
                </span>{' '}
                <span className="text-red-500">TERBAIKMU</span>
              </h1>

              {/* Subtitle / Description */}
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Bawa performa latihan dan pertandinganmu ke level puncak. Koleksi sepatu lari, basket, sepak bola, dan gym terdepan dengan teknologi bantalan mutakhir dari Nike, Adidas, Puma, dan Jordan.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('products')}
                  className="flex items-center gap-3 px-7 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-950/50 hover:shadow-red-900/40 active:scale-95 transition-all group"
                >
                  <span>Belanja Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('categories')}
                  className="px-6 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 font-display font-bold text-sm uppercase tracking-wider transition-all"
                >
                  Jelajahi Kategori
                </button>
              </div>

              {/* Live Metric / Social Proof adjacent to claim */}
              <div className="pt-6 border-t border-zinc-800/80 flex items-center gap-8 text-xs text-zinc-400">
                <div>
                  <span className="block font-display font-bold text-lg text-white font-mono">100%</span>
                  <span>Produk Original Resmi</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <span className="block font-display font-bold text-lg text-white font-mono">7 Hari</span>
                  <span>Garansi Tukar Ukuran</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <span className="block font-display font-bold text-lg text-white font-mono">15.000+</span>
                  <span>Atlet & Pelari Puas</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-700/60 bg-[#16171b] shadow-2xl shadow-red-950/20 group flex items-center justify-center p-6">
                <img
                  src={featuredProducts[0]?.image_url || "/src/assets/images/hero_sports_shoes_1793759787842.jpg"}
                  alt={featuredProducts[0]?.product_name || "Sepatu Olahraga Rizal Sport"}
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== "/src/assets/images/hero_sports_shoes_1793759787842.jpg") {
                      img.src = "/src/assets/images/hero_sports_shoes_1793759787842.jpg";
                    }
                  }}
                />
                
                {/* Visual Glow scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Badge Overlay */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white backdrop-blur-md bg-black/60 p-4 rounded-2xl border border-white/10">
                  <div className="min-w-0 pr-3">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest block truncate">
                      {featuredProducts[0]?.brand ? `${featuredProducts[0].brand} · Pilihan Unggulan` : 'Unggulan Pekan Ini'}
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                      {featuredProducts[0]?.product_name || featuredProducts[0]?.name || 'Koleksi Sepatu Olahraga'}
                    </h3>
                    {featuredProducts[0]?.sku && (
                      <span className="text-[10px] font-mono text-zinc-400 block">
                        SKU: {featuredProducts[0].sku}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (featuredProducts[0]) {
                        onViewProduct(featuredProducts[0]);
                      } else {
                        onNavigate('products');
                      }
                    }}
                    className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white shrink-0 shadow-md"
                    title="Lihat Detail Produk"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. BRAND PARTNERS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 px-8 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-wrap items-center justify-around gap-8 text-zinc-400">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Merek Terpercaya:
          </span>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-zinc-300 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('products', { brand: 'Nike' })}>
            NIKE
          </span>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-zinc-300 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('products', { brand: 'Adidas' })}>
            ADIDAS
          </span>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-zinc-300 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('products', { brand: 'Puma' })}>
            PUMA
          </span>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-zinc-300 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('products', { brand: 'Jordan' })}>
            JORDAN
          </span>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (PRODUK UNGGULAN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Pilihan Terbaik Atlet</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight uppercase">
              Produk Unggulan
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Sepatu performa tinggi dengan teknologi terdepan untuk kecepatan dan kestabilan.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors shrink-0"
          >
            <span>Lihat Semua Koleksi ({totalProductsCount} Produk)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-zinc-900/60 rounded-2xl h-80 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={onViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. CATEGORIES SECTION (KATEGORI SEPATU) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
            Eksplorasi Disiplin
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight uppercase">
            Kategori Sepatu Olahraga
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Pilih sepatu yang didesain spesifik untuk cabang olahraga favoritmu.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-zinc-900 rounded-2xl h-72 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => {
              const fallback = getFallbackCategoryImage(category.name || category.slug || category.id);
              return (
                <div
                  key={category.id}
                  onClick={() => onNavigate('products', { categoryId: category.id })}
                  className="group relative h-72 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 cursor-pointer hover:border-zinc-700 transition-all shadow-lg"
                >
                  <img
                    src={category.image_url || fallback}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== fallback) {
                        img.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                      Kategori
                    </span>
                    <h3 className="font-display font-black text-xl text-white uppercase group-hover:text-red-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                      <span>Lihat Koleksi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-red-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. KEUNGGULAN TOKO (STORE ADVANTAGES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-[#101114] border border-zinc-800">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
              Standar Toko Sepatu Olahraga Rizal
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Kami tidak sekadar menjual sepatu, kami memastikan setiap langkah dan lompatan Anda didukung oleh perlengkapan olahraga terbaik dan terpercaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                100% Original & Bergaransi Resmi
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Setiap pasang sepatu diambil langsung dari distributor resmi Nike, Adidas, Puma, dan Jordan. Jaminan uang kembali 200% jika terbukti tidak asli.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Bantalan Responsif & Teruji
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Kami kurasi sepatu dengan teknologi busa terbaik (ZoomX, Boost, Nitro Foam) untuk perlindungan sendi dan pengembalian energi saat berolahraga berat.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Konsultasi & Garansi Tukar Size
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Khawatir ukuran sepatu tidak cocok? Layanan customer service kami siap memandu ukuran kaki Anda dan melayani penukaran size dalam 7 hari.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
