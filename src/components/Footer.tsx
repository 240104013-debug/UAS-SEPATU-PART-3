import React from 'react';
import { Flame, ShieldCheck, RefreshCw, Truck, CreditCard, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#08090a] border-t border-zinc-800/80 text-zinc-400">
      
      {/* Trust Badges Strip */}
      <div className="border-b border-zinc-800/60 bg-[#0e0f12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">100% Original</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Garansi uang kembali 2x lipat jika terbukti tiruan.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tukar Ukuran</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Layanan garansi tukar size mudah dalam 7 hari.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kirim Cepat</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Ekspedisi express terpercaya ke seluruh Indonesia.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-500 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Bayar Aman & COD</h4>
                <p className="text-xs text-zinc-400 mt-0.5">QRIS instan, Transfer Bank, hingga Bayar di Tempat.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/40">
                <Flame className="w-5 h-5 fill-white stroke-none" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight uppercase">
                TOKO SEPATU <span className="text-red-500">RIZAL</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Destinasi resmi sepatu olahraga terkemuka di Indonesia. Menghadirkan performa terbaik dari Nike, Adidas, Puma, dan Jordan untuk para atlet dan pecinta olahraga di seluruh nusantara.
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Buka Setiap Hari: 09:00 - 21:00 WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Jl. Pemuda Olahraga No. 88, Rawamangun, Jakarta</span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Koleksi Sepatu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Kategori Olahraga
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Tentang Rizal Sport
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-white transition-colors">
                  Keranjang Belanja
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4">
              Kategori Sepatu
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Sepatu Running
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Sepatu Basketball
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Sepak Bola & Futsal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Training & Crossfit
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Sneakers Lifestyle
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-200 mb-4">
              Layanan Pelanggan
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300 font-mono">+62 821-8888-7492</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-zinc-300">cs@rizalsport.com</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-block text-xs font-semibold text-red-400 hover:text-red-300 underline underline-offset-4"
                >
                  Panduan Ukuran Sepatu (Size Chart) →
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} Toko Sepatu Olahraga Rizal. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span>Garansi Keaslian Resmi</span>
            <span>·</span>
            <span>Didukung Supabase PostgreSQL</span>
            <span>·</span>
            <span>Indonesia</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
