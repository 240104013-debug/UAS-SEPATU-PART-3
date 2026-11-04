import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: 'Ukuran Sepatu',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-5 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
          Pusat Bantuan & Layanan
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Hubungi Toko Sepatu Olahraga Rizal
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Ada pertanyaan seputar ketersediaan stok, rekomendasi tipe sepatu lari, atau panduan tukar ukuran? Tim kami siap melayani Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
              Kontak Cepat & WhatsApp
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-bold">WhatsApp CS</span>
                  <span className="font-mono text-white font-bold">+62 821-8888-7492</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Respon cepat setiap hari 09:00 - 21:00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-bold">Email Resmi</span>
                  <span className="text-white font-semibold">cs@rizalsport.com</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Untuk kemitraan & pengaduan pesanan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-bold">Alamat Store</span>
                  <span className="text-white">
                    Jl. Pemuda Olahraga No. 88, Rawamangun, Jakarta Timur 13220
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] text-zinc-400 uppercase font-bold">Jam Layanan</span>
                  <span className="text-white">
                    Senin - Minggu: 09:00 - 21:00 WIB (Tanpa Hari Libur)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-red-950/20 border border-red-800/40 space-y-2">
            <h4 className="font-bold text-red-400 text-xs uppercase tracking-wider">Garansi Tukar Ukuran 7 Hari</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Jika sepatu yang Anda beli secara online tidak pas di kaki, jangan khawatir! Simpan box asli dan hubungi WhatsApp CS kami untuk instruksi penukaran size.
            </p>
          </div>

        </div>

        {/* Message Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
            Kirim Pesan atau Konsultasi Ukuran
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-white">Pesan Anda Berhasil Terkirim!</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Terima kasih telah menghubungi Toko Sepatu Olahraga Rizal. Tim kami akan segera membalas ke nomor WhatsApp atau email Anda.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxxxxxx"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@anda.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Topik Pertanyaan
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Ukuran Sepatu">Konsultasi Ukuran Sepatu</option>
                    <option value="Ketersediaan Stok">Cek Stok Produk</option>
                    <option value="Garansi Tukar Size">Klaim Garansi Tukar Size</option>
                    <option value="Lainnya">Pertanyaan Umum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Pesan Anda
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pertanyaan Anda mengenai sepatu olahraga..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan Sekarang</span>
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
