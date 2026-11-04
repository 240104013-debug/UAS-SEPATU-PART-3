import React, { useState, useEffect } from 'react';
import { ArrowRight, Layers, Sparkles, RefreshCcw } from 'lucide-react';
import { Category, Product } from '../types/database';
import { getCategories, getProducts, getFallbackCategoryImage } from '../lib/supabase';

interface CategoriesPageProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts()
      ]);

      setCategories(cats);

      // Count products per category
      const counts: Record<string, number> = {};
      cats.forEach(c => {
        counts[c.id] = 0;
      });

      prods.forEach(p => {
        if (p.category_id && counts[p.category_id] !== undefined) {
          counts[p.category_id]++;
        } else if (p.categories?.id && counts[p.categories.id] !== undefined) {
          counts[p.categories.id]++;
        }
      });
      setProductCounts(counts);
    } catch (e: any) {
      console.error('Error fetching categories:', e);
      setError('Gagal memuat kategori dari database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 mb-1">
          <Layers className="w-4 h-4" />
          <span>Katalog Disiplin Olahraga</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Kategori Sepatu Olahraga
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Setiap cabang olahraga memiliki tuntutan traksi dan perlindungan berbeda. Temukan spesifikasi yang tepat untuk kebutuhan Anda.
        </p>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchCategoryData}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-80 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl bg-[#121316] border border-zinc-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-display font-bold text-lg text-white">
              Tidak Ada Kategori Ditemukan
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Tabel categories di database belum terisi atau sedang dalam proses sinkronisasi.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={fetchCategoryData}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Muat Ulang</span>
            </button>
            <button
              onClick={() => onSelectCategory('all')}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              Lihat Semua Produk
            </button>
          </div>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const count = productCounts[cat.id] ?? 0;
            const fallbackSrc = getFallbackCategoryImage(cat.name || cat.slug || cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-all shadow-xl"
              >
                <img
                  src={cat.image_url || fallbackSrc}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== fallbackSrc) {
                      img.src = fallbackSrc;
                    }
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                      Koleksi Resmi
                    </span>
                    {count > 0 && (
                      <span className="text-[11px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                        {count} Model Sepatu
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase group-hover:text-red-400 transition-colors">
                    {cat.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                  
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                    <span>Lihat Seluruh Sepatu {cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
