import React from 'react';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../types/database';
import { formatRupiah } from '../lib/supabase';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use default first size and first color
    const defaultSize = product.sizes?.[0] || 40;
    const defaultColor = product.colors?.[0] || 'Original';
    addToCart(product, defaultSize, defaultColor, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => onViewDetail(product)}
      className="group flex flex-col bg-[#141518] rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-[4/3] w-full bg-[#1c1d22] overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Elegant fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern if image is missing */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-zinc-900 text-zinc-600 font-bold text-sm">
          {product.brand} · {product.name}
        </div>

        {/* Brand Kicker / Status Watermark */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
            {product.brand}
          </span>
          {product.is_featured && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-red-800/50">
              Unggulan
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="text-[11px] font-bold uppercase text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-700">
              Habis
            </span>
          ) : (
            <span className="text-[11px] font-medium text-emerald-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
              Stok: {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Unboxed Metadata (Category & Available Sizes) */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5 font-medium">
          <span>{product.categories?.name || 'Sport Footwear'}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Size {product.sizes?.[0]}-{product.sizes?.[product.sizes.length - 1]}</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base text-zinc-100 group-hover:text-white line-clamp-1 transition-colors">
          {product.name}
        </h3>

        {/* Color Variants Note */}
        <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
          {product.colors?.join(' / ')}
        </p>

        {/* Price & Action Module */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Harga</span>
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
