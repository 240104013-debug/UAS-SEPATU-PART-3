import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Flame, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenSupabaseGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSupabaseGuide }) => {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Produk' },
    { id: 'categories', label: 'Kategori' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'contact', label: 'Kontak' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d0e]/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Brand Zone */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-5 h-5 fill-white stroke-none" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tighter text-white uppercase leading-none">
                RIZAL <span className="text-red-500">SPORT</span>
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-medium mt-0.5">
                TOKO SEPATU OLAHRAGA
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-2 transition-colors duration-200 whitespace-nowrap focus:outline-none uppercase text-xs tracking-wider ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Supabase status + Cart + Mobile trigger) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Supabase Status Trigger */}
            <button
              onClick={onOpenSupabaseGuide}
              title="Status Database Supabase"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase Aktif' : 'Konfigurasi DB'}</span>
              {isSupabaseConfigured ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-400" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => onNavigate('cart')}
              aria-label="Buka Keranjang Belanja"
              className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-red-600/50 hover:bg-zinc-800/80 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-scale-in">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#121316] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors ${
                currentView === link.id
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-zinc-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupabaseGuide();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-zinc-400" />
                Panduan Supabase & Status
              </span>
              <span className={isSupabaseConfigured ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {isSupabaseConfigured ? 'Terkoneksi' : 'Siap Konfigurasi'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
