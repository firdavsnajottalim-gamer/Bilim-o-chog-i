import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Library, 
  Film, 
  GraduationCap, 
  BookOpen, 
  School, 
  Search, 
  Send, 
  Sparkles,
  ChevronRight,
  Info,
  MapPin,
  Clock,
  Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { OXFORD_FACTS } from './constants';
import { Fact, ChatMessage } from './types';

const iconMap: Record<string, any> = {
  History,
  Library,
  Film,
  GraduationCap,
  BookOpen,
  School
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredFacts = selectedCategory 
    ? OXFORD_FACTS.filter(f => f.category === selectedCategory)
    : OXFORD_FACTS;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setChatMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "Siz Oxford universiteti bo'yicha mutaxassis gidsiz. Foydalanuvchiga Oxford haqida qiziqarli, aniq va o'zbek tilida ma'lumot bering. Javoblaringiz qisqa va tushunarli bo'lsin."
        }
      });

      const aiMessage: ChatMessage = { role: 'model', text: response.text || "Kechirasiz, ma'lumot topa olmadim." };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-oxford-blue text-white py-6 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <School className="w-8 h-8 text-oxford-gold" />
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight">Oxford Universiteti</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-widest font-medium opacity-80">
            <a href="#tarix" className="hover:text-oxford-gold transition-colors">Tarix</a>
            <a href="#faktlar" className="hover:text-oxford-gold transition-colors">Faktlar</a>
            <a href="#savol-javob" className="hover:text-oxford-gold transition-colors">Savol-Javob</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
              alt="Oxford University" 
              className="w-full h-full object-cover opacity-30 scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-oxford-cream/0 via-oxford-cream/50 to-oxford-cream" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-oxford-gold font-medium tracking-[0.3em] uppercase text-sm mb-4 block">Bilim va An'ana Maskani</span>
              <h2 className="text-5xl md:text-7xl font-serif text-oxford-blue mb-6 leading-tight">
                Dunyodagi Eng Qadimgi <br /> <span className="italic">Bilim O'chog'i</span>
              </h2>
              <p className="text-lg md:text-xl text-oxford-blue/70 max-w-2xl mx-auto font-light leading-relaxed">
                Oxford nafaqat universitet, balki asrlar davomida shakllangan madaniyat, ilm-fan va buyuk shaxslar yetishib chiqqan muqaddas dargohdir.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-white border-y border-oxford-blue/10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-serif text-oxford-gold mb-1">1096</div>
              <div className="text-xs uppercase tracking-widest text-oxford-blue/60 font-semibold">Tashkil topgan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-oxford-gold mb-1">39</div>
              <div className="text-xs uppercase tracking-widest text-oxford-blue/60 font-semibold">Kollejlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-oxford-gold mb-1">250,000+</div>
              <div className="text-xs uppercase tracking-widest text-oxford-blue/60 font-semibold">Bitiruvchilar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-serif text-oxford-gold mb-1">70+</div>
              <div className="text-xs uppercase tracking-widest text-oxford-blue/60 font-semibold">Nobel mukofoti</div>
            </div>
          </div>
        </section>

        {/* Facts Section */}
        <section id="faktlar" className="py-24 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h3 className="text-4xl font-serif text-oxford-blue mb-4">Qiziqarli Faktlar</h3>
              <p className="text-oxford-blue/60 max-w-md">Universitet hayoti va tarixidan eng sara ma'lumotlar to'plami.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['tarix', 'anana', 'ilm-fan', 'qiziqarli'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-oxford-blue text-white border-oxford-blue' 
                      : 'bg-transparent text-oxford-blue/60 border-oxford-blue/20 hover:border-oxford-blue/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredFacts.map((fact) => {
                const Icon = iconMap[fact.icon] || Info;
                return (
                  <motion.div
                    key={fact.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 rounded-2xl border border-oxford-blue/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-12 h-12 bg-oxford-cream rounded-xl flex items-center justify-center mb-6 group-hover:bg-oxford-gold group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-serif text-oxford-blue mb-3">{fact.title}</h4>
                    <p className="text-oxford-blue/70 font-light leading-relaxed mb-4">{fact.description}</p>
                    <div className="flex items-center text-oxford-gold text-xs font-bold uppercase tracking-widest">
                      <span>Batafsil</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Interactive Chat Section */}
        <section id="savol-javob" className="py-24 bg-oxford-blue text-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <Sparkles className="w-10 h-10 text-oxford-gold mx-auto mb-4" />
              <h3 className="text-4xl font-serif mb-4">Oxford Haqida So'rang</h3>
              <p className="text-white/60 font-light">Sun'iy intellekt yordamida universitet haqida istalgan savolingizga javob oling.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
              <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                    <Info className="w-12 h-12" />
                    <p className="text-sm italic">Masalan: "Oxfordda qanday kollejlar bor?" yoki "Universitet kutubxonasi haqida gapirib bering."</p>
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-oxford-gold text-white rounded-tr-none' 
                        : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Savolingizni yozing..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-oxford-gold transition-colors placeholder:text-white/30"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-oxford-gold text-white rounded-xl hover:bg-oxford-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-oxford-cream py-12 px-4 border-t border-oxford-blue/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <School className="w-6 h-6 text-oxford-gold" />
              <span className="text-xl font-serif text-oxford-blue">Oxford Haqida</span>
            </div>
            <p className="text-sm text-oxford-blue/60 font-light leading-relaxed">
              Oxford universiteti haqida qiziqarli ma'lumotlar va interaktiv qo'llanma. Bilim olishdan to'xtamang.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-serif text-lg">Bog'lanish</h5>
            <ul className="space-y-2 text-sm text-oxford-blue/60 font-light">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Oxford OX1 2JD, Buyuk Britaniya</li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> www.ox.ac.uk</li>
              <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> 1096-yildan beri faoliyatda</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-serif text-lg">Ijtimoiy Tarmoqlar</h5>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-oxford-blue/5 flex items-center justify-center hover:bg-oxford-gold hover:text-white transition-all cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-oxford-blue/5 flex items-center justify-center hover:bg-oxford-gold hover:text-white transition-all cursor-pointer">
                <Info className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-oxford-blue/5 text-center text-xs uppercase tracking-widest text-oxford-blue/40 font-bold">
          &copy; 2026 Oxford Haqida. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
}
