import React, { useState } from 'react';
import { ShoppingCart, Eye, Check, ImageOff } from 'lucide-react';
import { Product } from '../types/database';
import { formatRupiah } from '../lib/supabase';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || product.size_display || 'Standard';
    const defaultColor = product.colors?.[0] || product.color_display || 'Standard';
    addToCart(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const isOutOfStock = product.stock <= 0;
  const hasValidImage = Boolean(product.image_url && product.image_url.trim() && !imageError);
  const displayName = product.product_name || product.name || 'Produk Sepatu';

  return (
    <div
      onClick={() => onViewDetail(product)}
      className="group flex flex-col bg-[#141518] rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Slot: object-fit contain as requested */}
      <div className="relative aspect-[4/3] w-full bg-[#18191d] flex items-center justify-center p-4 overflow-hidden border-b border-zinc-800/60">
        {hasValidImage ? (
          <img
            src={product.image_url}
            alt={displayName}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Placeholder as strictly requested: "Gambar Tidak Tersedia" */
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 text-zinc-500 w-full h-full bg-zinc-900/50">
            <ImageOff className="w-8 h-8 text-zinc-600" />
            <span className="text-xs font-semibold text-zinc-400">Gambar Tidak Tersedia</span>
            {product.sku && (
              <span className="text-[10px] font-mono text-zinc-500">SKU: {product.sku}</span>
            )}
          </div>
        )}

        {/* Brand Kicker / Status */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[70%]">
          {product.brand && (
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
              {product.brand}
            </span>
          )}
          {product.sku && (
            <span className="text-[10px] font-mono font-medium text-zinc-300 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-700">
              {product.sku}
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="text-[11px] font-bold uppercase text-red-400 bg-red-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-red-800/60">
              Stok Habis
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-400 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-900/40">
              Stok: {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Unboxed Metadata: Category & Sizes directly from database */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5 font-medium flex-wrap">
          <span>{product.categories?.name || 'Sepatu Olahraga'}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Size: <strong className="text-zinc-300 font-mono">{product.size_display || 'Standar'}</strong></span>
        </div>

        {/* Title from product_name */}
        <h3 className="font-display font-bold text-base text-zinc-100 group-hover:text-white line-clamp-1 transition-colors">
          {displayName}
        </h3>

        {/* Color from database */}
        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
          Warna: <span className="text-zinc-300">{product.color_display || 'Standar'}</span>
        </p>

        {/* Price & Action Module */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Harga</span>
            <span className="text-base sm:text-lg font-bold text-white font-mono tracking-tight">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Detail Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(product);
              }}
              title="Lihat Detail Produk"
              className="p-2.5 rounded-xl bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Quick Add To Cart Button */}
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isOutOfStock
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/30 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Masuk</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Beli</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
