import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronRight, Package, ArrowUpRight } from 'lucide-react';
import { Product, Category, FAQ } from '../types/database';
import { getProducts, getCategories, getFAQs, formatRupiah, isSupabaseConfigured } from '../lib/supabase';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  products?: Product[];
  timestamp: Date;
}

interface ChatbotProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToProducts: (categorySlug?: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onSelectProduct, onNavigateToProducts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Selamat datang di Toko Sepatu Olahraga Rizal. Saya asisten virtual resmi toko. Anda bisa bertanya mengenai ketersediaan stok, harga, ukuran, merek (Nike, Adidas, Puma, Jordan), maupun garansi toko. Ada yang bisa saya bantu?',
      timestamp: new Date()
    }
  ]);

  // Load catalog for strictly grounded answers
  useEffect(() => {
    async function loadData() {
      try {
        const [p, c, f] = await Promise.all([
          getProducts(),
          getCategories(),
          getFAQs()
        ]);
        setProducts(p);
        setCategories(c);
        setFaqs(f);
      } catch (err) {
        console.error('Failed to load catalog into chatbot:', err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Grounded answer generator: NEVER hallucinations, strictly grounded in database records
  const generateGroundedResponse = (rawQuery: string): { reply: string; matchedProducts?: Product[] } => {
    const q = rawQuery.toLowerCase().trim();

    // 1. Check for FAQ matches
    for (const faq of faqs) {
      const qWords = faq.question.toLowerCase().split(' ');
      const matchScore = qWords.filter(w => w.length > 3 && q.includes(w)).length;
      if (matchScore >= 2 || (q.includes('asli') || q.includes('ori') || q.includes('original')) && faq.question.includes('Original')) {
        return { reply: `${faq.answer}` };
      }
      if ((q.includes('tukar') || q.includes('retur') || q.includes('garansi') || q.includes('kekecilan') || q.includes('kebesaran')) && faq.question.includes('tukar')) {
        return { reply: `${faq.answer}` };
      }
      if ((q.includes('kirim') || q.includes('ongkir') || q.includes('ekspedisi') || q.includes('jne') || q.includes('sicepat')) && faq.question.includes('pengiriman')) {
        return { reply: `${faq.answer}` };
      }
      if ((q.includes('bayar') || q.includes('qris') || q.includes('transfer') || q.includes('cod')) && faq.question.includes('pembayaran')) {
        return { reply: `${faq.answer}` };
      }
      if ((q.includes('lokasi') || q.includes('alamat') || q.includes('toko fisik') || q.includes('buka')) && faq.question.includes('lokasi')) {
        return { reply: `${faq.answer}` };
      }
    }

    // 2. Check for Specific Product or Brand Search
    const foundByBrand = products.filter(p => q.includes(p.brand.toLowerCase()));
    const foundByName = products.filter(p => 
      p.name.toLowerCase().split(' ').some(word => word.length > 3 && q.includes(word))
    );

    // Specific Category Search
    const matchedCategory = categories.find(cat => 
      q.includes(cat.name.toLowerCase()) || q.includes(cat.slug.toLowerCase()) ||
      (q.includes('lari') && cat.slug === 'running') ||
      (q.includes('bola') && cat.slug === 'football') ||
      (q.includes('gym') && cat.slug === 'training')
    );

    if (matchedCategory) {
      const categoryProducts = products.filter(p => p.category_id === matchedCategory.id);
      if (categoryProducts.length > 0) {
        return {
          reply: `Berikut adalah data resmi dari database untuk kategori "${matchedCategory.name}". Kami memiliki ${categoryProducts.length} model sepatu pilihan:`,
          matchedProducts: categoryProducts
        };
      }
    }

    // Size inquiry (e.g. "ukuran 42", "size 44")
    const sizeMatch = q.match(/(?:ukuran|size)\s*(\d{2})/);
    if (sizeMatch && sizeMatch[1]) {
      const targetSize = parseInt(sizeMatch[1], 10);
      const withSize = products.filter(p => p.sizes.includes(targetSize) && p.stock > 0);
      if (withSize.length > 0) {
        return {
          reply: `Ditemukan ${withSize.length} produk di database yang saat ini READY STOCK untuk ukuran ${targetSize}:`,
          matchedProducts: withSize
        };
      } else {
        return {
          reply: `Maaf, berdasarkan data database kami saat ini, belum ada sepatu yang tersedia untuk ukuran ${targetSize}. Silakan cek ukuran lain seperti 40, 41, 42, 43, atau 44.`
        };
      }
    }

    // Specific product match
    const candidateProducts = foundByName.length > 0 ? foundByName : foundByBrand;
    if (candidateProducts.length > 0) {
      const topProducts = candidateProducts.slice(0, 4);
      return {
        reply: `Ditemukan produk yang sesuai di database kami:`,
        matchedProducts: topProducts
      };
    }

    // General price inquiry
    if (q.includes('harga') || q.includes('termurah') || q.includes('termahal')) {
      const sorted = [...products].sort((a, b) => a.price - b.price);
      const cheapest = sorted[0];
      const highest = sorted[sorted.length - 1];
      return {
        reply: `Rentang harga sepatu resmi di toko kami berkisar dari ${formatRupiah(cheapest.price)} (${cheapest.name}) hingga ${formatRupiah(highest.price)} (${highest.name}). Semua produk dijamin 100% Original.`,
        matchedProducts: [cheapest, highest]
      };
    }

    // General Stock inquiry
    if (q.includes('stok') || q.includes('ready')) {
      const inStock = products.filter(p => p.stock > 0);
      return {
        reply: `Saat ini seluruh ${inStock.length} produk di etalase kami berstatus READY STOCK langsung dari gudang. Silakan tanyakan nama merek atau tipe yang ingin Anda ketahui lebih detail.`,
        matchedProducts: inStock.slice(0, 3)
      };
    }

    // Strict Fallback (Anti-Hallucination)
    return {
      reply: `Maaf, informasi tentang "${rawQuery}" tidak ditemukan secara spesifik di database katalog kami. Di Toko Sepatu Olahraga Rizal, kami hanya menyediakan data produk yang terverifikasi (Nike, Adidas, Puma, Jordan). Silakan pilih pertanyaan cepat di bawah atau sebutkan nama sepatu olahraga yang Anda cari.`
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Realistic answering delay
    setTimeout(() => {
      const result = generateGroundedResponse(text);
      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: result.reply,
        products: result.matchedProducts,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'Sepatu Running',
    'Air Jordan',
    'Sepatu Bola',
    'Apakah 100% Original?',
    'Cara Tukar Ukuran',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Buka Chat Customer Service"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-2xl shadow-red-900/50 hover:scale-105 active:scale-95 transition-all duration-200 group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
            Tanya CS Rizal Sport
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#121316] border border-zinc-800 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/80 p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/40">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white">CS Rizal Sport</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/60 font-semibold">
                    {isSupabaseConfigured ? 'Supabase Live' : 'Katalog Terverifikasi'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Data real-time produk, harga & stok
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-red-400" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-red-600 text-white rounded-br-none shadow-md'
                        : 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Render Product Cards inside chat if any matched */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.products.map(prod => (
                        <div
                          key={prod.id}
                          className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-3 hover:border-zinc-700 transition-colors"
                        >
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase">{prod.brand}</p>
                            <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono font-bold text-red-400">
                                {formatRupiah(prod.price)}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                Stok: <strong className="text-zinc-200">{prod.stock}</strong>
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onSelectProduct(prod);
                            }}
                            className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors shrink-0"
                            title="Buka Produk"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="block text-[10px] text-zinc-400 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
                <Bot className="w-4 h-4 text-red-400" />
                <span className="italic">CS Rizal Sport sedang memeriksa database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-zinc-900/60 border-t border-zinc-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya stok, harga, ukuran sepatu..."
              className="flex-1 bg-zinc-800/90 text-white placeholder-zinc-400 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-700 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white transition-all focus:outline-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
