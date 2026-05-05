import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  Map as MapIcon, 
  ShieldAlert, 
  LineChart as LineChartIcon,
  MessageSquare,
  ArrowRight,
  Home,
  Info,
  ChevronRight,
  Loader2,
  Send,
  Target,
  Scale
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { chatWithAgent } from './services/aiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initial data fetch
    fetch('/api/tools/sentiment')
      .then(res => res.json())
      .then(data => setDashboardData(data));
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatWithAgent(userMsg, history);
      setMessages(prev => [...prev, { role: 'assistant', content: result.text || 'Thinking...' }]);
      setHistory(result.history);
      
      // Update dashboard if relevant data came back
      if (result.toolResults && result.toolResults.length > 0) {
        // Maybe update some specifically tracked state
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'system', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white font-sans selection:bg-orange-500/30">
      {/* Sidebar navigation */}
      <nav className="fixed left-0 top-0 h-full w-20 border-r border-white/5 flex flex-col items-center py-8 gap-10 bg-[#0E1015] z-50">
        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
          <Building2 size={24} className="text-white" />
        </div>
        
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Home size={20} />} label="Home" />
        <NavButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={20} />} label="Agent" />
        
        <div className="mt-auto">
          <NavButton active={false} onClick={() => {}} icon={<Info size={20} />} label="Info" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pl-20 min-h-screen">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0B0E]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-bold tracking-tighter text-2xl">BAYANAT</span>
            <span className="text-white/40 font-light uppercase text-[10px] tracking-widest mt-1">Real Estate Agent v2026</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <MarketPill label="Salmiya" price="1,200" trend="+2.4%" />
              <MarketPill label=" Sabah Al-Salem" price="1,110" trend="+5.1%" />
            </div>
            <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
              <Search size={18} className="text-white/60" />
            </button>
          </div>
        </header>

        <section className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-12 gap-6"
              >
                {/* Hero / Header */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  <div className="bg-gradient-to-br from-[#1A1C23] to-[#0E1015] rounded-3xl p-8 border border-white/5 overflow-hidden relative">
                    <div className="relative z-10">
                      <h1 className="text-4xl font-bold tracking-tight mb-2">Kuwait Investment <br/><span className="text-orange-500 italic">Heat Map 2026</span></h1>
                      <p className="text-white/60 max-w-md text-sm leading-relaxed">
                        Artificial intelligence suggests Sabah Al-Salem is Currently the highest ROI potential neighborhood following the Metro Hub announcement.
                      </p>
                      <button onClick={() => setActiveTab('chat')} className="mt-6 flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300">
                        Ask Agent for Analysis <ArrowRight size={18} />
                      </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
                       <MapIcon size={300} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <StatCard icon={<TrendingUp size={20} className="text-green-500" />} label="Avg. Yield" value="7.8%" sub="Kuwait Investment Sector" />
                    <StatCard icon={<Target size={20} className="text-blue-500" />} label="Hot Prospect" value="Al Mutla’a" sub="Infrastructure Boom" />
                    <StatCard icon={<Scale size={20} className="text-orange-500" />} label="Sentiment" value="Bullish" sub="Investor Confidence index" />
                  </div>

                  {/* Market Sentiment Bar Chart */}
                  <div className="bg-[#0E1015] rounded-3xl p-8 border border-white/5 h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <TrendingUp size={20} className="text-orange-500" />
                        Area Sentiment Scores
                      </h3>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">2026 Live Data</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="area" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                          contentStyle={{ backgroundColor: '#1A1C23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                          { (dashboardData || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.score > 0.8 ? '#f97316' : '#4b5563'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sidebar Cards */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                   <div className="bg-[#0E1015] rounded-3xl p-6 border border-white/5">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-orange-500" />
                        Risk Anomalies
                      </h3>
                      <div className="space-y-3">
                         <RiskItem area="Salmiya" issue="20% Below Avg" risk="High" color="text-red-400" />
                         <RiskItem area="Hawally" issue="Old Infrastructure" risk="Med" color="text-yellow-400" />
                         <RiskItem area="Al Mutla’a" issue="Construction Delays" risk="Low" color="text-green-400" />
                      </div>
                   </div>

                   <div className="bg-[#0E1015] rounded-3xl p-6 border border-white/5">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MapIcon size={18} className="text-blue-500" />
                        Infrastructure Pipeline
                      </h3>
                      <div className="space-y-4">
                         <PipelineItem title="Al-Zour Metro Station" area="Sabah Al-Salem" date="Q4 2026" />
                         <PipelineItem title="Coastal Highway Expansion" area="Salmiya" date="Ongoing" />
                         <PipelineItem title="Regional Tech Hub" area="Kuwait City" date="2027" />
                      </div>
                   </div>

                   <div className="bg-orange-600 rounded-3xl p-6 text-white overflow-hidden relative group cursor-pointer" onClick={() => setActiveTab('chat')}>
                      <h3 className="font-bold text-xl mb-1 relative z-10">Valuation AI</h3>
                      <p className="text-white/80 text-sm relative z-10 mb-4">Calculate real-time ROI and get legal zoning opinions.</p>
                      <div className="flex items-center gap-2 font-semibold relative z-10 group-hover:translate-x-2 transition-transform">
                        Launch Agent <ChevronRight size={18} />
                      </div>
                      <Building2 size={120} className="absolute -right-4 -bottom-4 opacity-20 rotate-12" />
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-[#0E1015] rounded-3xl border border-white/5 overflow-hidden"
              >
                 <div className="p-4 border-b border-white/5 bg-[#14161B] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center ring-4 ring-orange-500/10">
                        <Building2 size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Bayanat AI Agent</h3>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">MCP Core Active</span>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6 opacity-40">
                         <Building2 size={64} className="text-orange-500" />
                         <div className="space-y-2">
                           <h2 className="text-2xl font-bold">How can I assist your portfolio?</h2>
                           <p className="text-sm max-w-xs">Ask me about ROI in Salmiya, zoning in Hawally, or a custom property valuation.</p>
                         </div>
                         <div className="flex flex-wrap gap-2 justify-center">
                            <QuickQuery onClick={() => setInput("What is the average price in Salmiya?")} text="Salmiya Prices" />
                            <QuickQuery onClick={() => setInput("Calculate ROI for 200k KWD property in Hawally with 900 KWD rent")} text="Calculate ROI" />
                            <QuickQuery onClick={() => setInput("Can I build a 3rd floor in Al Mutla'a?")} text="Zoning Laws" />
                         </div>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-4 max-w-[85%]",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold",
                          msg.role === 'user' ? "bg-white text-black" : "bg-orange-600"
                        )}>
                          {msg.role === 'user' ? 'U' : 'B'}
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed",
                          msg.role === 'user' ? "bg-orange-600 text-white" : "bg-white/5 border border-white/10"
                        )}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center animate-pulse">
                           <Building2 size={16} />
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-2 italic text-white/40 text-sm">
                          <Loader2 size={16} className="animate-spin" />
                          Analyzing market data...
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="p-4 bg-[#14161B] border-t border-white/5">
                    <div className="relative">
                      <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything about Kuwaiti real estate..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                      <button 
                        onClick={handleSend}
                        className="absolute right-2 top-2 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group relative p-3 rounded-2xl transition-all duration-300",
        active ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-white/40 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span className="absolute left-[120%] top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
}

function MarketPill({ label, price, trend }: { label: string; price: string; trend: string }) {
  return (
    <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
      <span className="text-sm font-semibold">{price} <span className="text-[10px] text-white/40 font-normal">KWD/m²</span></span>
      <span className="text-[10px] text-green-500 font-bold">{trend}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="bg-[#0E1015] rounded-3xl p-6 border border-white/5 flex flex-col gap-4">
      <div className="p-2 bg-white/5 rounded-lg w-fit">{icon}</div>
      <div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="text-sm font-medium text-white/80 mt-1">{label}</div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-white/20 mt-2">{sub}</div>
      </div>
    </div>
  );
}

function RiskItem({ area, issue, risk, color }: { area: string; issue: string; risk: string; color: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/5 transition-colors cursor-default">
      <div>
        <div className="text-xs font-bold uppercase tracking-tighter text-white/40">{area}</div>
        <div className="text-sm font-medium">{issue}</div>
      </div>
      <div className={cn("text-[10px] font-black uppercase tracking-widest border border-current px-2 py-0.5 rounded", color)}>
        {risk}
      </div>
    </div>
  );
}

function PipelineItem({ title, area, date }: { title: string; area: string; date: string }) {
  return (
    <div className="flex gap-4 p-1">
      <div className="w-1 h-10 bg-white/10 rounded-full mt-1 flex-shrink-0" />
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-white/40 uppercase font-bold">{area}</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="text-[10px] text-blue-400 font-bold">{date}</span>
        </div>
      </div>
    </div>
  );
}

function QuickQuery({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs hover:bg-white/10 hover:border-orange-500/50 transition-all"
    >
      {text}
    </button>
  );
}

