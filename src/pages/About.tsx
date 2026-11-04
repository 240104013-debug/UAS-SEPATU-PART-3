import React from 'react';
import { ShieldCheck, Trophy, Sparkles, MapPin, Phone, Mail, Clock, CheckCircle2, Ruler } from 'lucide-react';

export const About: React.FC = () => {
  const sizeChart = [
    { eu: 39, us: 6.5, uk: 6, cm: 24.5 },
    { eu: 40, us: 7.0, uk: 6.5, cm: 25.0 },
    { eu: 41, us: 8.0, uk: 7.5, cm: 26.0 },
    { eu: 42, us: 8.5, uk: 8.0, cm: 26.5 },
    { eu: 43, us: 9.5, uk: 9.0, cm: 27.5 },
    { eu: 44, us: 10.0, uk: 9.5, cm: 28.0 },
    { eu: 45, us: 11.0, uk: 10.5, cm: 29.0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profil Resmi & Standar Mutu</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight">
          Tentang Toko Sepatu Olahraga Rizal
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Didirikan dengan dedikasi tinggi terhadap dunia olahraga dan atletik di Indonesia. Kami hadir untuk menyediakan sepatu olahraga performa kelas dunia dari merek ternama dengan keaslian 100% tanpa kompromi.
        </p>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">
              Visi & Misi Kami
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase">
              Mendukung Setiap Langkah & Prestasi Olahragawan
            </h2>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Toko Sepatu Olahraga Rizal lahir dari kecintaan mendalam terhadap dunia lari, basket, dan sepak bola. Kami memahami bahwa sepatu olahraga bukan hanya sekadar alas kaki, melainkan instrumen penting pelindung sendi, peningkat kecepatan, dan penentu kenyamanan latihan harian Anda.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Oleh karena itu, setiap koleksi yang masuk ke gudang kami melewati inspeksi ketat untuk memastikan keaslian nomor seri, kualitas bantalan midsole, dan daya cengkeram outsole. Kami bermitra secara langsung dengan jaringan distributor resmi Nike, Adidas, Puma, dan Jordan.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800">
              <span className="font-mono text-2xl font-black text-red-500 block">15.000+</span>
              <span className="text-xs text-zinc-400 font-semibold mt-0.5 block">Pasang Sepatu Terjual</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800">
              <span className="font-mono text-2xl font-black text-white block">99.8%</span>
              <span className="text-xs text-zinc-400 font-semibold mt-0.5 block">Tingkat Kepuasan Pelanggan</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
          <img
            src="/src/assets/images/hero_sports_shoes_1793759787842.jpg"
            alt="Toko Sepatu Olahraga Rizal Store"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white">
            <h3 className="font-display font-bold text-sm uppercase">Pusat Distribusi Resmi Jakarta</h3>
            <p className="text-xs text-zinc-300">Menjangkau pengiriman kilat ke seluruh 38 provinsi di Indonesia.</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
            Standar Pelayanan
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase">
            Keunggulan Layanan Toko Rizal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Garansi 100% Original</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Jaminan ganti rugi penuh 2x lipat jika terbukti barang yang Anda terima adalah tiruan / replika.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Tukar Ukuran Fleksibel</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Kekecilan atau kebesaran? Anda berhak menukar ukuran dalam waktu 7 hari kerja sejak paket tiba.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Kurasi Atlet Profesional</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Semua seri yang kami tawarkan telah teruji secara biomekanika untuk stabilitas, traksi, dan daya tahan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-white">Respon CS Cepat 7 Hari</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tim asisten pelanggan kami standby setiap hari untuk konsultasi tipe kaki dan panduan sizing.
            </p>
          </div>
        </div>
      </div>

      {/* Sizing Chart Guide */}
      <div className="bg-[#121316] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-2">
              <Ruler className="w-5 h-5 text-red-500" />
              <span>Panduan Konversi Ukuran Sepatu (Size Chart)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Ukur panjang telapak kaki Anda dari tumit hingga ujung jempol terpanjang dalam satuan centimeter (cm).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Ukuran EU (Indonesia)</th>
                <th className="py-3 px-4">Ukuran US (Pria)</th>
                <th className="py-3 px-4">Ukuran UK</th>
                <th className="py-3 px-4">Panjang Kaki (Centimeter)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {sizeChart.map((row) => (
                <tr key={row.eu} className="hover:bg-zinc-850/40">
                  <td className="py-3.5 px-4 font-bold text-white">{row.eu}</td>
                  <td className="py-3.5 px-4">{row.us}</td>
                  <td className="py-3.5 px-4">{row.uk}</td>
                  <td className="py-3.5 px-4 text-red-400 font-bold">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Location & Working Hours */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Alamat Store Fisik</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Jl. Pemuda Olahraga No. 88, Rawamangun, Pulo Gadung, Jakarta Timur, DKI Jakarta 13220 (Dekat Stadion Velodrome).
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
            <Clock className="w-4 h-4 text-red-500" />
            <span>Jam Operasional Toko</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Senin - Minggu: 09:00 - 21:00 WIB<br />
            Layanan Pengiriman Paket Online Berjalan Setiap Hari Tanpa Libur.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
            <Phone className="w-4 h-4 text-red-500" />
            <span>Kontak Langsung</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            WhatsApp CS: +62 821-8888-7492<br />
            Email Bantuan: cs@rizalsport.com
          </p>
        </div>
      </div>

    </div>
  );
};
