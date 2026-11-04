import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, ShieldCheck, RefreshCw, Truck, Check, Share2, AlertCircle } from 'lucide-react';
import { Product } from '../types/database';
import { formatRupiah } from '../lib/supabase';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onNavigateToCart: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onNavigateToCart,
}) => {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<number>(product.sizes?.[0] || 40);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{sharedToast ? 'Link Disalin!' : 'Bagikan'}</span>
        </button>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Big Product Showcase Image */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl bg-[#141518] border border-zinc-800 overflow-hidden shadow-2xl">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />

            {/* Brand Kicker Overlay */}
            <div className="absolute top-5 left-5">
              <span className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white font-display font-black text-xs uppercase tracking-widest border border-white/10">
                {product.brand}
              </span>
            </div>

            {/* In stock floating status */}
            <div className="absolute top-5 right-5">
              {isOutOfStock ? (
                <span className="px-3 py-1.5 rounded-xl bg-red-950/80 backdrop-blur-md text-red-400 text-xs font-bold border border-red-800">
                  Stok Habis
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-bold border border-white/10">
                  Tersedia: {product.stock} Pasang
                </span>
              )}
            </div>
          </div>

          {/* Product Highlights Mini Strip */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block">100% Original</span>
              <span className="text-xs text-white font-medium mt-0.5 block">Distributor Resmi</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block">Garansi Size</span>
              <span className="text-xs text-white font-medium mt-0.5 block">Tukar Dalam 7 Hari</span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block">Kondisi Baru</span>
              <span className="text-xs text-white font-medium mt-0.5 block">Box & Tag Lengkap</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6">
          
          {/* Header & Brand */}
          <div className="space-y-2 border-b border-zinc-800 pb-5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-red-500">
              <span>{product.brand} PERFORMANCE</span>
              {product.is_featured && <span>· UNGGULAN</span>}
            </div>
            
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {product.name}
            </h1>

            {/* Price in Big Indonesian Rupiah */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                {formatRupiah(product.price)}
              </span>
              <span className="text-xs text-zinc-400 font-medium">Termasuk PPN</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Deskripsi Produk</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Pilih Ukuran Sepatu (EU):
              </label>
              <span className="text-[11px] text-zinc-400">Standar Atletik</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes?.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/40 ring-2 ring-red-500 ring-offset-2 ring-offset-[#121316]'
                        : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
              Pilihan Warna:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((col) => {
                const isSelected = selectedColor === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-white text-black font-bold ring-2 ring-white ring-offset-2 ring-offset-[#121316]'
                        : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper & Buy Action */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Jumlah:
              </span>
              
              <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-zinc-400">
                Tersedia {product.stock} pasang
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-display font-bold text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 ${
                  isOutOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Berhasil Masuk Keranjang!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Tambahkan ke Keranjang</span>
                  </>
                )}
              </button>

              {addedSuccess && (
                <button
                  onClick={onNavigateToCart}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Lihat Keranjang Belanja →
                </button>
              )}
            </div>

          </div>

          {/* Guarantees List */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Originalitas Terjamin 100% dengan garansi uang kembali.</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bisa tukar ukuran dalam 7 hari jika size tidak pas.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Siap kirim hari ini untuk pesanan sebelum jam 16:00 WIB.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
