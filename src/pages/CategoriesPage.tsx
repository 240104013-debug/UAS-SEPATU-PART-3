import React, { useState, useEffect } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { Category } from '../types/database';
import { getCategories } from '../lib/supabase';

interface CategoriesPageProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-64 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative h-80 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer hover:border-zinc-700 transition-all shadow-xl"
            >
              <img
                src={cat.image_url || '/src/assets/images/hero_sports_shoes_1793759787842.jpg'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                  Koleksi Resmi
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase group-hover:text-red-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed">
                  {cat.description}
                </p>
                
                <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                  <span>Lihat Seluruh Sepatu {cat.name}</span>
                  <ArrowRight className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
