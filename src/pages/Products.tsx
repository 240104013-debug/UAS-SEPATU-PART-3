import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw, PackageX, Sparkles, ChevronLeft, ChevronRight, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product, Category } from '../types/database';
import { getProducts, getCategories, getActiveSupabaseCredentials } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  initialCategoryId?: string;
  initialBrand?: string;
  onViewProduct: (product: Product) => void;
  onOpenSupabaseGuide?: () => void;
}

export const Products: React.FC<ProductsPageProps> = ({
  initialCategoryId,
  initialBrand,
  onViewProduct,
  onOpenSupabaseGuide
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProductsMaster, setAllProductsMaster] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Pagination controls
  const [viewMode, setViewMode] = useState<'all' | 'paginated'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const { isLive, url } = getActiveSupabaseCredentials();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allCats, masterProds, filteredProds] = await Promise.all([
        getCategories(),
        getProducts(),
        getProducts({
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          brand: selectedBrand !== 'all' ? selectedBrand : undefined,
          searchQuery: searchQuery.trim() || undefined,
          sortBy
        })
      ]);

      setCategories(allCats);
      setAllProductsMaster(masterProds);
      setProducts(filteredProds);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat produk dari database Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedBrand, sortBy, searchQuery]);

  useEffect(() => {
    if (initialCategoryId) setSelectedCategory(initialCategoryId);
    if (initialBrand) setSelectedBrand(initialBrand);
  }, [initialCategoryId, initialBrand]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('featured');
    setViewMode('all');
    setCurrentPage(1);
  };

  // Extract unique brands dynamically from products in database
  const brandSource = allProductsMaster.length > 0 ? allProductsMaster : products;
  const availableBrands = ['all', ...Array.from(new Set(brandSource.map(p => p.brand).filter(Boolean)))];

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = viewMode === 'all'
    ? products
    : products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Supabase Connection Alert if not yet live */}
      {!isLive && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-200">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Database Supabase Belum Terhubung</p>
              <p className="text-amber-300 text-xs mt-0.5">
                Masukkan Project URL & Anon Key Supabase Anda agar seluruh 10 produk dari tabel <code>products</code> langsung dimuat.
              </p>
            </div>
          </div>
          {onOpenSupabaseGuide && (
            <button
              onClick={onOpenSupabaseGuide}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              Hubungkan Database
            </button>
          )}
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 mb-1.5 flex-wrap">
            <span>Katalog Resmi</span>
            <span>·</span>
            <span>Toko Sepatu Olahraga Rizal</span>
            {isLive ? (
              <>
                <span>·</span>
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[10px] inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Data Supabase Terhubung</span>
                </span>
              </>
            ) : null}
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            Koleksi Produk Sepatu ({products.length})
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Data produk, merek, SKU, ukuran, warna, harga, dan gambar diambil langsung dari tabel <code>products</code> Supabase.
          </p>
        </div>

        {/* View Toggle & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* View mode toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tampilkan Semua ({products.length})
            </button>
            <button
              onClick={() => setViewMode('paginated')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewMode === 'paginated'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Halaman
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="sortBy" className="text-xs text-zinc-400 font-semibold uppercase tracking-wider shrink-0">
              Urutkan Harga:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
            >
              <option value="featured">Unggulan / Terkini</option>
              <option value="price-asc">Harga: Termurah ke Termahal</option>
              <option value="price-desc">Harga: Termahal ke Termurah</option>
            </select>
          </div>

          {/* Refresh data button */}
          <button
            onClick={loadData}
            title="Refresh Data dari Supabase"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
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
            placeholder="Cari berdasarkan product_name, merek, atau SKU..."
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

        {/* Interactive Filter Tabs (Categories & Brands) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Category Tabs: "Semua Kategori" displays ALL products */}
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
              Semua Produk
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
            {availableBrands.map((b) => (
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl h-84 animate-pulse border border-zinc-800" />
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
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}" atau filter kategori yang dipilih.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span>
              Menampilkan <strong className="text-white">{displayedProducts.length}</strong> dari{' '}
              <strong className="text-white">{products.length}</strong> produk di database
            </span>
            {viewMode === 'all' && (
              <span className="text-emerald-400 font-semibold">
                ✓ Seluruh produk ditampilkan
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={onViewProduct}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {viewMode === 'paginated' && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-zinc-800">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-40 transition-colors"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('all')}
                className="text-xs text-red-400 hover:underline sm:ml-4"
              >
                Tampilkan Semua ({products.length})
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
