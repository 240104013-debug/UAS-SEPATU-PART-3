import React, { useState } from 'react';
import { X, Copy, Check, Database, ShieldCheck, Terminal, ExternalLink, Key, Layers } from 'lucide-react';
import { SUPABASE_SQL_SETUP } from '../lib/seedData';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'sql'>('steps');

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121316] border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#16171b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">
                Konfigurasi Database Supabase
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs text-zinc-400">
                  {isSupabaseConfigured
                    ? 'Terkoneksi ke Supabase Project Anda'
                    : 'Mode Katalog Siap Pakai (Belum terhubung ke Supabase Live)'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 px-6 bg-[#0f1012]">
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'steps'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Langkah-Langkah Integrasi
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Script SQL Lengkap (6 Tabel)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-800/40">
              Ready
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'steps' ? (
            <div className="space-y-6 text-sm text-zinc-300">
              
              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">Buat Project di Supabase</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Buka situs resmi <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline inline-flex items-center gap-1 font-semibold">Supabase.com <ExternalLink className="w-3 h-3" /></a>, daftar atau login, lalu klik tombol <strong>New Project</strong>. Pilih region terdekat (misal: Singapore) dan masukkan nama project: <code>toko-sepatu-rizal</code>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-white text-base">Eksekusi Script SQL Otomatis</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Di Dashboard Supabase Anda, buka menu <strong>SQL Editor</strong> di bilah navigasi kiri. Klik <strong>New Query</strong>, salin script SQL di bawah ini, lalu klik <strong>RUN</strong>.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleCopySql}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Script SQL Lengkap'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('sql')}
                      className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                    >
                      Lihat isi query SQL
                    </button>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                    <p className="font-semibold text-zinc-300">Tabel yang otomatis dibuat & diamankan dengan RLS:</p>
                    <p>• <code>categories</code>, <code>products</code>, <code>customers</code>, <code>orders</code>, <code>order_items</code>, <code>faqs</code></p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base">Salin Kredensial API ke Environment Variables</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Masuk ke menu <strong>Project Settings → API</strong> di Supabase. Salin URL dan Anon Key publik (jangan pernah menggunakan <code>service_role</code> di frontend untuk keamanan):
                  </p>
                  <div className="bg-black/60 p-3 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1">
                    <p><span className="text-red-400">VITE_SUPABASE_URL</span>="https://[PROJECT-REF].supabase.co"</p>
                    <p><span className="text-red-400">VITE_SUPABASE_ANON_KEY</span>="eyJhbGciOi..."</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-emerald-400 text-base">Website Otomatis Terhubung Live!</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Setelah variabel disimpan dan dimuat, website akan otomatis membaca data produk langsung dari tabel <code>products</code> dan <code>categories</code> Anda secara real-time. Jika belum disetel, website tetap berjalan sempurna menggunakan katalog terverifikasi Toko Rizal.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">schema.sql (6 Tables + RLS Policies + Seeds)</span>
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
                </button>
              </div>
              <pre className="p-4 bg-black/80 border border-zinc-800 rounded-2xl text-[12px] font-mono text-zinc-300 overflow-x-auto max-h-[420px] leading-relaxed select-all">
                {SUPABASE_SQL_SETUP}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141518] border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Row Level Security (RLS) diaktifkan secara ketat</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
