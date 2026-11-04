import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, CreditCard, QrCode, Banknote, Building2, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah, createCheckoutOrder } from '../lib/supabase';

interface CheckoutProps {
  onBackToCart: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBackToCart, onOrderSuccess }) => {
  const { cart, totalPrice, clearCart } = useCart();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    postalCode: '12190',
    notes: '',
    paymentMethod: 'qris' as 'transfer' | 'qris' | 'cod' | 'credit_card',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  const shippingFee = totalPrice >= 2000000 ? 0 : 35000;
  const grandTotal = totalPrice + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Mohon lengkapi semua kolom yang wajib diisi (Nama, Email, No. HP, Alamat).');
      return;
    }

    setLoading(true);

    try {
      const customer = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: `${formData.address.trim()}, ${formData.city}, ${formData.province} ${formData.postalCode}`
      };

      const orderData = {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: customer.address,
        payment_method: formData.paymentMethod,
        total_amount: grandTotal,
        status: 'pending' as const
      };

      const items = cart.map(item => ({
        product_id: item.product.id,
        product_name: `${item.product.name} (Size ${item.size}, ${item.color})`,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal: item.product.price * item.quantity
      }));

      const res = await createCheckoutOrder(customer, orderData, items);

      if (!res.success || !res.orderId) {
        throw new Error(res.error || 'Gagal memproses pesanan.');
      }

      setOrderCompletedId(res.orderId);
      clearCart();
      onOrderSuccess(res.orderId);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setLoading(false);
    }
  };

  if (orderCompletedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
        <div className="bg-[#121316] border border-zinc-800 rounded-3xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">
              Transaksi Berhasil Disimpan
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
              Pesanan Anda Telah Diterima!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Nomor Pesanan:{' '}
              <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
                {orderCompletedId}
              </span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs sm:text-sm space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-zinc-800 pb-2">
              Instruksi Pembayaran & Pengiriman
            </h3>
            <p className="text-zinc-300">
              Detail konfirmasi pemesanan telah dikirimkan ke email: <strong>{formData.email}</strong>.
            </p>
            {formData.paymentMethod === 'qris' && (
              <p className="text-zinc-300">
                Silakan scan kode QRIS Toko Sepatu Olahraga Rizal melalui aplikasi mobile banking atau e-wallet (GoPay, OVO, ShopeePay, Dana).
              </p>
            )}
            {formData.paymentMethod === 'transfer' && (
              <p className="text-zinc-300">
                Silakan transfer ke <strong>BCA 8820-9912-34 a/n TOKO SEPATU RIZAL</strong> sejumlah <strong>{formatRupiah(grandTotal)}</strong>.
              </p>
            )}
            {formData.paymentMethod === 'cod' && (
              <p className="text-zinc-300">
                Pesanan akan diproses untuk pengiriman. Siapkan uang tunai pas sejumlah <strong>{formatRupiah(grandTotal)}</strong> kepada kurir.
              </p>
            )}
            <p className="text-zinc-400 text-xs">
              CS kami akan menghubungi nomor <strong>{formData.phone}</strong> melalui WhatsApp untuk update nomor resi pengiriman.
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs uppercase tracking-wider transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToCart}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang</span>
        </button>
      </div>

      <div className="border-b border-zinc-800 pb-4">
        <h1 className="font-display font-black text-3xl text-white uppercase tracking-tight">
          Formulir Checkout & Pengiriman
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Lengkapi data alamat pengiriman dan pilih metode pembayaran resmi Anda.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form & Summary Split */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form (8 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Details Section */}
          <div className="bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-7 space-y-5">
            <h2 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Informasi Pelanggan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Rizal Indriyanto"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Email Aktif *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="nama@email.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Nomor WhatsApp / HP *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-7 space-y-5">
            <h2 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Alamat Pengiriman Sepatu</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan) *
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Jl. Pemuda Raya No. 45 RT 02/05, Kel. Rawamangun, dekat GOR Velodrome"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-7 space-y-5">
            <h2 className="font-display font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-red-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Metode Pembayaran</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                  formData.paymentMethod === 'qris'
                    ? 'border-red-600 bg-red-950/20 text-white ring-1 ring-red-600'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qris"
                  checked={formData.paymentMethod === 'qris'}
                  onChange={handleChange}
                  className="mt-1 accent-red-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <QrCode className="w-4 h-4 text-red-500" />
                    <span>QRIS Instan</span>
                  </div>
                  <p className="text-xs text-zinc-400">GoPay, OVO, Dana, ShopeePay, BCA Mobile</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                  formData.paymentMethod === 'transfer'
                    ? 'border-red-600 bg-red-950/20 text-white ring-1 ring-red-600'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked={formData.paymentMethod === 'transfer'}
                  onChange={handleChange}
                  className="mt-1 accent-red-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span>Transfer Bank Resmi</span>
                  </div>
                  <p className="text-xs text-zinc-400">BCA, Mandiri, BRI, BNI Virtual Account</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-red-600 bg-red-950/20 text-white ring-1 ring-red-600'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="mt-1 accent-red-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <Banknote className="w-4 h-4 text-red-500" />
                    <span>COD (Bayar di Tempat)</span>
                  </div>
                  <p className="text-xs text-zinc-400">Bayar langsung ke kurir saat barang tiba</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                  formData.paymentMethod === 'credit_card'
                    ? 'border-red-600 bg-red-950/20 text-white ring-1 ring-red-600'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleChange}
                  className="mt-1 accent-red-600"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                    <CreditCard className="w-4 h-4 text-red-500" />
                    <span>Kartu Kredit / Debit</span>
                  </div>
                  <p className="text-xs text-zinc-400">Visa, Mastercard, JCB (3D Secure)</p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-7 space-y-6">
            <h2 className="font-display font-bold text-base text-white uppercase tracking-wider border-b border-zinc-800 pb-4">
              Ringkasan Pesanan ({cart.length} Model)
            </h2>

            {/* Items review */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{item.product.name}</p>
                    <p className="text-zinc-400 text-[11px]">Size {item.size} · {item.color} · Qty {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-white shrink-0">
                    {formatRupiah(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal Sepatu</span>
                <span className="font-mono text-white">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Ongkir Express</span>
                <span className="font-mono text-white">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold uppercase text-xs">Gratis</span> : formatRupiah(shippingFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="font-display font-bold text-sm text-white uppercase">
                  Total Tagihan
                </span>
                <span className="font-mono font-black text-xl text-red-500">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-display font-bold text-sm uppercase tracking-wider shadow-xl shadow-red-950/40 active:scale-95 transition-all"
            >
              {loading ? (
                <span>Menyimpan Pesanan ke Supabase...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Buat Pesanan Sekarang</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-zinc-500 space-y-1">
              <p>• Data pesanan dicatat aman ke Supabase.</p>
              <p>• Stok tidak berkurang secara prematur sebelum transaksi berhasil.</p>
              <p>• Garansi pengembalian dan tukar size berlaku 7 hari.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
