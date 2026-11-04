import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { CategoriesPage } from './pages/CategoriesPage';
import { Contact } from './pages/Contact';
import { Product } from './types/database';
import { formatRupiah } from './lib/supabase';
import { Check, ArrowRight } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productFilterParams, setProductFilterParams] = useState<{ categoryId?: string; brand?: string }>({});
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const { lastAddedProduct, dismissNotification } = useCart();

  const handleNavigate = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params) {
      setProductFilterParams(params);
    } else {
      setProductFilterParams({});
    }
    setCurrentView(view);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('detail');
  };

  const handleCategorySelect = (categoryId: string) => {
    setProductFilterParams({ categoryId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('products');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d0e] text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Banner (Slim single-line promotional notice) */}
      <div className="bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="font-extrabold uppercase text-[10px] bg-black/30 px-2 py-0.5 rounded">Promo Eksklusif</span>
        <span>Gratis Ongkir ke Seluruh Indonesia untuk Transaksi di atas Rp 2.000.000 · Garansi 100% Original</span>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSupabaseGuide={() => setIsSupabaseModalOpen(true)}
      />

      {/* Toast Notification when adding item */}
      {lastAddedProduct && (
        <aside
          role="status"
          aria-label="Notifikasi Keranjang"
          className="fixed top-24 right-4 z-50 bg-[#141518] border border-zinc-700 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-white">
              {lastAddedProduct.product.name}
            </p>
            <p className="text-[11px] text-zinc-400">
              Size {lastAddedProduct.size} · {lastAddedProduct.color}
            </p>
          </div>
          <button
            onClick={() => {
              dismissNotification();
              handleNavigate('cart');
            }}
            className="text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-4 shrink-0"
          >
            Lihat Keranjang
          </button>
        </aside>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'products' && (
          <Products
            initialCategoryId={productFilterParams.categoryId}
            initialBrand={productFilterParams.brand}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('products')}
            onNavigateToCart={() => handleNavigate('cart')}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            onSelectCategory={handleCategorySelect}
          />
        )}

        {currentView === 'cart' && (
          <Cart
            onNavigateToCheckout={() => handleNavigate('checkout')}
            onNavigateToProducts={() => handleNavigate('products')}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            onBackToCart={() => handleNavigate('cart')}
            onOrderSuccess={(orderId) => {
              console.log('Order success:', orderId);
            }}
          />
        )}

        {currentView === 'about' && (
          <About />
        )}

        {currentView === 'contact' && (
          <Contact />
        )}
      </main>

      {/* Floating Grounded Chatbot */}
      <Chatbot
        onSelectProduct={handleViewProduct}
        onNavigateToProducts={(slug) => {
          handleNavigate('products', slug ? { categoryId: slug } : undefined);
        }}
      />

      {/* Supabase Setup Modal */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
