import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCcw, PackageX, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { Product, Category } from '../types/database';
import { getProducts, getCategories } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  initialCategoryId?: string;
  initialBrand?: string;
  onViewProduct: (product: Product) => void;
}

export const Products: React.FC<ProductsPageProps> = ({
  initialCategoryId,
  initialBrand,
  onViewProduct
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Brands list
  const brands = ['all', 'Nike', 'Adidas', 'Puma', 'Jordan'];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allCats, allProds] = await Promise.all([
        getCategories(),
        getProducts({
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          brand: selectedBrand !== 'all' ? selectedBrand : undefined,
          searchQuery: searchQuery.trim() || undefined,
        })
      ]);

      setCategories(allCats);

      // Sort
      let sorted = [...allProds];
      if (sortBy === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
      } else {
        // Featured first
        sorted.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      }

      setProducts(sorted);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat katalog produk dari database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedBrand, sortBy, searchQuery]);

  // Sync props if changed
  useEffect(() => {
    if (initialCategoryId) setSelectedCategory(initialCategoryId);
    if (initialBrand) setSelectedBrand(initialBrand);
  }, [initialCategoryId, initialBrand]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 mb-1.5">
            <span>Katalog Resmi</span>
            <span>·</span>
            <span>Toko Sepatu Olahraga Rizal</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            Semua Koleksi Sepatu
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Menampilkan {products.length} model sepatu olahraga pilihan dengan spesifikasi original bergaransi.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="sortBy" className="text-xs text-zinc-400 font-semibold uppercase tracking-wider shrink-0">
            Urutkan:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="featured">Unggulan & Terpopuler</option>
            <option value="price-asc">Harga: Rendah ke Tinggi</option>
            <option value="price-desc">Harga: Tinggi ke Rendah</option>
          </select>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="space-y-4">
        
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama sepatu, seri, atau merek (contoh: Alphafly, Jordan, Boost, Mercurial)..."
            className="w-full bg-[#121316] text-white placeholder-zinc-500 pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-800 focus:outline-none focus:border-red-500 text-sm shadow-inner transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs (Categories) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mr-2 shrink-0 hidden sm:inline">
              Kategori:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Brand Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar shrink-0">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mr-2 shrink-0 hidden sm:inline">
              Merek:
            </span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-all ${
                  selectedBrand === b
                    ? 'bg-white text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {b === 'all' ? 'Semua Merek' : b}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl h-80 animate-pulse border border-zinc-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="py-20 text-center rounded-3xl bg-[#121316] border border-zinc-800/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-zinc-500 mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-display font-bold text-lg text-white">
              Tidak Ada Produk yang Ditemukan
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Kami tidak menemukan sepatu olahraga dengan kriteria pencarian "{searchQuery}" atau filter merek/kategori yang dipilih.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewProduct}
            />
          ))}
        </div>
      )}

    </div>
  );
};
