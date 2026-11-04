import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../lib/supabase';

interface CartProps {
  onNavigateToCheckout: () => void;
  onNavigateToProducts: () => void;
  onViewProduct: (product: any) => void;
}

export const Cart: React.FC<CartProps> = ({
  onNavigateToCheckout,
  onNavigateToProducts,
  onViewProduct
}) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const shippingFee = totalPrice > 0 ? (totalPrice >= 2000000 ? 0 : 35000) : 0;
  const grandTotal = totalPrice + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
            Keranjang Belanja Masih Kosong
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Anda belum menambahkan sepatu olahraga ke keranjang. Temukan koleksi sepatu running, basketball, dan sepak bola terbaik kami sekarang.
          </p>
        </div>
        <div>
          <button
            onClick={onNavigateToProducts}
            className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all inline-flex items-center gap-2"
          >
            <span>Mulai Belanja Sepatu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="font-display font-black text-3xl text-white uppercase tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Periksa pilihan ukuran, warna, dan jumlah pasang sebelum melanjutkan ke pembayaran.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateToProducts}
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lanjut Pilih Sepatu</span>
          </button>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            Kosongkan Keranjang
          </button>
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List (Left Col) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#121316] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-zinc-700"
            >
              
              {/* Product Info with Thumb */}
              <div
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => onViewProduct(item.product)}
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest block">
                    {item.product.brand}
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-white hover:text-red-400 transition-colors">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>Size: <strong className="text-white font-mono">{item.size}</strong></span>
                    <span>·</span>
                    <span>Warna: <strong className="text-white">{item.color}</strong></span>
                  </div>
                  <span className="font-mono text-sm font-bold text-white block pt-1">
                    {formatRupiah(item.product.price)}
                  </span>
                </div>
              </div>

              {/* Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                
                {/* Stepper */}
                <div className="flex items-center rounded-xl bg-zinc-900 border border-zinc-800 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal Item */}
                <div className="text-right min-w-[110px]">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Subtotal</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  title="Hapus dari keranjang"
                  className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))}

          {/* Delivery threshold notice */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {totalPrice >= 2000000
                ? 'Selamat! Pesanan Anda berhak mendapatkan GRATIS ONGKIR ke seluruh Indonesia.'
                : `Tambah belanjaan senilai ${formatRupiah(2000000 - totalPrice)} lagi untuk menikmati GRATIS ONGKIR.`}
            </span>
          </div>
        </div>

        {/* Order Summary (Right Col) */}
        <div className="lg:col-span-4 bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-7 space-y-6">
          <h2 className="font-display font-bold text-base text-white uppercase tracking-wider border-b border-zinc-800 pb-4">
            Ringkasan Belanja
          </h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Total Harga Produk</span>
              <span className="font-mono text-white">{formatRupiah(totalPrice)}</span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>Ongkos Kirim Estimasi</span>
              <span className="font-mono text-white">
                {shippingFee === 0 ? <span className="text-emerald-400 font-bold uppercase text-xs">Gratis</span> : formatRupiah(shippingFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="font-display font-bold text-sm text-white uppercase">
                Total Pembayaran
              </span>
              <span className="font-mono font-black text-xl text-red-500">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToCheckout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-950/40 active:scale-95 transition-all"
          >
            <span>Lanjut ke Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-zinc-400 text-center">
            Transaksi aman dan terenkripsi. Produk original bergaransi resmi.
          </p>
        </div>

      </div>

    </div>
  );
};
