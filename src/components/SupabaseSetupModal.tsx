import React, { useState } from 'react';
import { X, Copy, Check, Database, ShieldCheck, ExternalLink, Key, Sparkles, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SUPABASE_SQL_SETUP } from '../lib/seedData';
import { getActiveSupabaseCredentials, setSupabaseCredentials, clearSupabaseCredentials, getProducts } from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'steps' | 'sql'>('connect');

  const credentials = getActiveSupabaseCredentials();
  const [inputUrl, setInputUrl] = useState(credentials.url || '');
  const [inputKey, setInputKey] = useState(credentials.key || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const cleanUrl = inputUrl.trim();
    const cleanKey = inputKey.trim();

    if (!cleanUrl.startsWith('https://')) {
      setTestResult({
        success: false,
        message: 'URL Supabase harus diawali dengan https:// (contoh: https://xxxx.supabase.co)'
      });
      setTesting(false);
      return;
    }

    if (!cleanKey || cleanKey.length < 20) {
      setTestResult({
        success: false,
        message: 'Anon Key tidak valid. Pastikan menyalin public anon key dari Project Settings -> API.'
      });
      setTesting(false);
      return;
    }

    // Save
    setSupabaseCredentials(cleanUrl, cleanKey);

    // Test query
    try {
      const prods = await getProducts();
      setTestResult({
        success: true,
        message: `Koneksi Berhasil! Terhubung langsung ke Supabase. Ditemukan ${prods.length} produk di tabel products.`,
        count: prods.length
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Gagal membaca tabel products: ${err?.message || 'Periksa kembali URL dan API Key atau pastikan tabel sudah dibuat'}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setInputUrl('');
    setInputKey('');
    setTestResult(null);
    window.location.reload();
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
                Koneksi Database Supabase
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${credentials.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs text-zinc-400">
                  {credentials.isLive
                    ? 'Terkoneksi ke Supabase Live Database'
                    : 'Katalog Standar Aktif (10 Produk Terverifikasi)'}
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
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'connect'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Koneksi Langsung (URL & Key)</span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'steps'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Panduan Step-by-Step
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Script SQL (10 Produk)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-800/40">
              10 Items
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'connect' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Hubungkan Project Supabase Anda</h3>
                  {credentials.isLive && (
                    <button
                      onClick={handleDisconnect}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Putus Koneksi
                    </button>
                  )}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Masukkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari dashboard Supabase Anda (Project Settings → API). Website akan langsung mengambil seluruh 10 produk dari tabel <code>products</code>.
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-bold">{testResult.message}</p>
                    {testResult.success && (
                      <p className="text-[11px] text-emerald-400">Memuat ulang halaman untuk menyinkronkan katalog...</p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveAndTest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://abcdefghijklm.supabase.co"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <input
                    type="text"
                    required
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[11px] text-zinc-500">
                    *Gunakan anon/public key. Jangan pernah memasukkan service_role key di frontend.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={testing}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all"
                  >
                    {testing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menguji Koneksi & Membaca Produk...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Simpan & Sinkronkan 10 Produk</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('sql')}
                    className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    Belum buat tabel? Salin Script SQL
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-6 text-sm text-zinc-300">
              
              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">Buat Project di Supabase</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Buka situs resmi <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline inline-flex items-center gap-1 font-semibold">Supabase.com <ExternalLink className="w-3 h-3" /></a>, daftar atau login, lalu buat project baru dengan nama <code>toko-sepatu-rizal</code>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-white text-base">Eksekusi Script SQL Otomatis (10 Produk)</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Di Dashboard Supabase Anda, buka menu <strong>SQL Editor</strong>. Buat Query baru, salin script SQL 10 produk kami, lalu klik <strong>RUN</strong>.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleCopySql}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Script SQL 10 Produk'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('sql')}
                      className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                    >
                      Lihat isi query SQL
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base">Hubungkan ke Aplikasi</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Salin URL & Anon Key dari <strong>Project Settings → API</strong>, lalu tempel di tab <strong>Koneksi Langsung</strong> di atas atau simpan di file <code>.env</code>. Seluruh 10 produk akan otomatis tampil di katalog!
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">schema_10_products.sql (Categories + 10 Products + RLS)</span>
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
            <span>Tanpa pembatas limit(6) — Menampilkan seluruh 10 produk</span>
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
