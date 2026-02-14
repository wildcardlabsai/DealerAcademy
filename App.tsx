import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { User, UserTier, UserProgress, Module, Template } from './types';
import { INITIAL_MODULES, INITIAL_TEMPLATES, EXPERT_DATA } from './constants';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle, 
  Lock, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Plus, 
  ArrowRight, 
  Search, 
  Download, 
  Clock, 
  AlertCircle,
  User as UserIcon
} from 'lucide-react';

// --- Constants ---
const LAUNCH_DATE = new Date('2026-03-01T00:00:00').getTime();

// --- Contexts ---

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  updateTier: (tier: UserTier) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CourseContext = createContext<{
  modules: Module[];
  progress: UserProgress;
  toggleLessonComplete: (lessonId: string) => void;
  updateModules: (modules: Module[]) => void;
} | null>(null);

// --- Hooks ---

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourse must be used within CourseProvider");
  return context;
};

// --- Helper Components ---

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const distance = LAUNCH_DATE - now;

    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }, []);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Mins', value: timeLeft.minutes },
        { label: 'Secs', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-black text-blue-500 mb-1">
            {String(Math.max(0, item.value)).padStart(2, '0')}
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, onClick, variant = 'primary', className = '', disabled, type = 'button' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white',
    outline: 'bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white',
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => (
  <div id={id} className={`bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

// Added className prop to fix type error when applying layout classes
const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'danger';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const colors = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    neutral: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Layouts ---

const NavContent = ({ mobile, onLinkClick }: { mobile?: boolean; onLinkClick?: () => void }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Academy', icon: BookOpen, path: '/courses' },
    { label: 'Templates', icon: FileText, path: '/templates' },
    { label: 'Resources', icon: Download, path: '/resources' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (user?.tier === 'ADMIN') {
    navItems.push({ label: 'Admin Panel', icon: ShieldCheck, path: '/admin' });
  }

  return (
    <div className={`flex flex-col h-full ${mobile ? 'p-6' : ''}`}>
      {!mobile && (
        <div className="p-8">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent uppercase tracking-tight">
            DEALER GROWTH
          </h1>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">Academy</p>
        </div>
      )}
      <nav className={`flex-1 space-y-1 ${!mobile ? 'px-4' : ''}`}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-blue-500' : ''} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className={`mt-auto pt-4 border-t border-zinc-900 ${!mobile ? 'p-4' : 'pt-6'}`}>
        <div className="mb-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-blue-400">
              {user?.name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-zinc-200">{user?.name}</p>
              <Badge variant={user?.tier === 'PAID' ? 'success' : 'neutral'}>{user?.tier}</Badge>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { logout(); onLinkClick?.(); }}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-zinc-600 hover:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 hidden md:flex">
        <NavContent />
      </aside>
      <div className="flex-1 flex flex-col min-h-screen relative">
        <header className="md:hidden h-16 border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="text-sm font-black text-white uppercase tracking-tighter">DEALER GROWTH ACADEMY</div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-zinc-400 hover:text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden pt-16">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute right-0 top-16 bottom-0 w-64 bg-zinc-950 border-l border-zinc-900 shadow-2xl">
              <NavContent mobile onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Pages ---

const LandingPage = () => {
  const { user } = useAuth();
  const { modules } = useCourse();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  if (user) return <Navigate to="/dashboard" />;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-[#0a0a0a] selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
             </div>
             <div className="text-lg font-bold tracking-tight">Dealer Growth <span className="text-blue-500">Academy</span></div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-500">
            <button onClick={() => scrollTo('curriculum')} className="hover:text-white transition-colors">What You'll Learn</button>
            <button onClick={() => scrollTo('expert')} className="hover:text-white transition-colors">The Expert</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">Pricing</button>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/signup" className="hidden sm:block">
              <Button>Get Started Free</Button>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-zinc-400 hover:text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-900 bg-zinc-950 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <button onClick={() => scrollTo('curriculum')} className="block w-full text-left text-zinc-400 hover:text-white font-bold py-2">What You'll Learn</button>
            <button onClick={() => scrollTo('expert')} className="block w-full text-left text-zinc-400 hover:text-white font-bold py-2">The Expert</button>
            <button onClick={() => scrollTo('pricing')} className="block w-full text-left text-zinc-400 hover:text-white font-bold py-2">Pricing</button>
            <Link to="/login" className="block w-full text-left text-zinc-400 hover:text-white font-bold py-2">Login</Link>
            <Link to="/signup" className="block pt-2">
              <Button className="w-full">Get Started Free</Button>
            </Link>
          </div>
        )}
      </header>

      <section className="pt-32 pb-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="info">Next Cohort Launching Soon</Badge>
          <h2 className="text-5xl md:text-8xl font-black mt-8 mb-8 tracking-tighter leading-[1.05] uppercase">
            Sell More Cars <br className="hidden md:block" /> Without <span className="text-zinc-500 italic font-medium">Guru Hype</span>.
          </h2>
          <p className="text-xl text-zinc-400 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            The first marketing academy built specifically for UK independent dealers. Practical, step-by-step training that works in the real world.
          </p>
          <div className="flex flex-col items-center gap-12">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto text-lg px-12 py-6 uppercase font-black">Pre-Register Free</Button>
            </Link>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Launch Countdown to 1st March 2026</p>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      <section id="expert" className="py-24 bg-zinc-950 border-y border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center overflow-hidden transition-all duration-500 group">
               {EXPERT_DATA.imageUrl ? (
                  <img src={EXPERT_DATA.imageUrl} alt={EXPERT_DATA.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               ) : (
                  <UserIcon size={120} className="text-zinc-700" />
               )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 p-6 rounded-2xl shadow-xl border-4 border-zinc-950">
               <p className="text-sm font-black text-white uppercase tracking-widest leading-tight">{EXPERT_DATA.automotiveYears} Years <br/> Dealership Exp.</p>
            </div>
          </div>
          <div>
            <Badge variant="warning">Expert Authority</Badge>
            <h3 className="text-4xl font-black mt-6 mb-8 uppercase tracking-tighter">Not built by gurus. <br/> Built by a Practitioner.</h3>
            <p className="text-zinc-400 text-lg mb-8 font-medium leading-relaxed">Every course module and strategy in this academy is handwritten by <strong>{EXPERT_DATA.name}</strong>.</p>
            <div className="space-y-6 mb-12">
               <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 mt-1"><CheckCircle size={14} /></div>
                  <div>
                     <h5 className="font-bold text-white text-lg tracking-tight mb-1">{EXPERT_DATA.marketingYears} Years in Marketing</h5>
                     <p className="text-zinc-500 text-sm font-medium">Global marketing expertise applied to the automotive world.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 mt-1"><CheckCircle size={14} /></div>
                  <div>
                     <h5 className="font-bold text-white text-lg tracking-tight mb-1">{EXPERT_DATA.automotiveYears} Years in Dealerships</h5>
                     <p className="text-zinc-500 text-sm font-medium">Living and breathing the forecourt day-to-day.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 mt-1"><CheckCircle size={14} /></div>
                  <div>
                     <h5 className="font-bold text-white text-lg tracking-tight mb-1">The Full Journey</h5>
                     <p className="text-zinc-500 text-sm font-medium">Roles from {EXPERT_DATA.roles.join(' to ')}.</p>
                  </div>
               </div>
            </div>
            <Card className="bg-zinc-900 border-l-4 border-l-blue-600">
               <p className="text-sm italic text-zinc-300 font-medium leading-relaxed">"{EXPERT_DATA.quote}"</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-4">— {EXPERT_DATA.name}, Founder</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="curriculum" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h3 className="text-4xl font-bold mb-6 uppercase tracking-tighter">The 10-Module Blueprint</h3>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg font-medium">Practical systems built for the forecourt. The first two modules are free.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, idx) => (
            <Card key={m.id} className="hover:border-zinc-700 transition-all group flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                 <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold">{idx + 1}</div>
                 {idx < 2 && <Badge variant="success">Free Access</Badge>}
              </div>
              <h4 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{m.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">{m.description}</p>
              <div className="pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs font-bold text-zinc-400"><BookOpen size={14} />Lessons Unlock March 1st</div>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16"><h3 className="text-4xl font-bold mb-4 uppercase tracking-tighter">Pricing Plans</h3><p className="text-zinc-400">Lock in your pre-registration status today.</p></div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-zinc-800 flex flex-col">
            <div className="mb-8"><h4 className="text-xl font-bold uppercase tracking-tight mb-2">Free Starter</h4><div className="text-4xl font-black mb-4">£0</div></div>
            <ul className="space-y-4 mb-8 flex-1">{['First 2 Modules Fully Free', 'Introductory Templates', 'Access to Resources Vault', 'No Credit Card Needed'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle size={16} className="text-blue-500 shrink-0" /> {item}</li>))}</ul>
            <Link to="/signup"><Button variant="outline" className="w-full">Get Started Free</Button></Link>
          </Card>
          <Card className="border-zinc-800 flex flex-col relative bg-zinc-900/80">
            <div className="mb-8"><h4 className="text-xl font-bold uppercase tracking-tight mb-2">Academy Pro</h4><div className="text-4xl font-black mb-4">£12 <span className="text-lg text-zinc-500 font-medium">/mo</span></div></div>
            <ul className="space-y-4 mb-8 flex-1">{['All 10 Core Modules', 'Full Templates Vault', 'AI Library & Prompts', 'Unlimited Resources', 'Monthly Updates'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle size={16} className="text-blue-500 shrink-0" /> {item}</li>))}</ul>
            <Link to="/signup"><Button className="w-full">Choose Monthly</Button></Link>
          </Card>
          <Card className="border-blue-600 flex flex-col relative shadow-xl shadow-blue-900/10 bg-blue-600/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="success">Best Value</Badge></div>
            <div className="mb-8"><h4 className="text-xl font-bold uppercase tracking-tight mb-2">Academy Annual</h4><div className="text-4xl font-black mb-4">£99 <span className="text-lg text-zinc-500 font-medium">/year</span></div></div>
            <ul className="space-y-4 mb-8 flex-1">{['Everything in Monthly Plan', '30% Savings', 'Lifetime Price Guarantee', 'Priority Support'].map((item, i) => (<li key={i} className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle size={16} className="text-blue-500 shrink-0" /> {item}</li>))}</ul>
            <Link to="/signup"><Button className="w-full h-12">Choose Yearly</Button></Link>
          </Card>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="max-w-sm">
            <div className="text-xl font-bold mb-6 text-white uppercase tracking-tighter">Dealer Growth Academy</div>
            <p className="text-zinc-500 leading-relaxed text-sm">The leading education platform for UK independent car dealers.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div><h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-600">Learning</h5><ul className="space-y-4 text-zinc-400 text-sm font-medium"><li><button onClick={() => scrollTo('curriculum')} className="hover:text-blue-500">Curriculum</button></li><li><Link to="/signup" className="hover:text-blue-500">Pre-Registration</Link></li></ul></div>
            <div><h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-zinc-600">Legal</h5><ul className="space-y-4 text-zinc-400 text-sm font-medium"><li><a href="#" className="hover:text-blue-500">Terms</a></li><li><a href="#" className="hover:text-blue-500">Privacy</a></li></ul></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-zinc-900 text-zinc-600 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2024 Dealer Growth Academy.</p>
          <div className="flex gap-8"><Link to="/login" className="hover:text-white">Sign In</Link><Link to="/signup" className="hover:text-white">Join</Link></div>
        </div>
      </footer>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { modules } = useCourse();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black mb-2 text-zinc-100 uppercase tracking-tighter">Welcome, {user?.name.split(' ')[0]}</h2>
            <p className="text-zinc-500 font-medium italic">Your first two modules are ready for preview.</p>
          </div>
          <Link to="/courses"><Button variant="outline">View Academy</Button></Link>
        </div>
      </header>
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        <Card className="lg:col-span-2 bg-gradient-to-br from-zinc-900/50 to-zinc-950 p-8 border-blue-500/10">
          <div className="text-center lg:text-left">
            <Badge variant="warning">Awaiting Launch</Badge>
            <h3 className="text-3xl font-black mt-2 mb-4 uppercase tracking-tight">Full Launch in:</h3>
            <CountdownTimer />
          </div>
        </Card>
        <Card className="flex flex-col bg-zinc-900/30 border-emerald-500/10">
          <div className="mb-auto">
            <Badge variant="success">Active Member</Badge>
            <h3 className="text-xl font-bold mt-3 mb-2 uppercase tracking-tighter">Registered</h3>
            <p className="text-sm text-zinc-500 font-medium">Your pre-registration is confirmed.</p>
          </div>
        </Card>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h4 className="text-xs uppercase tracking-widest font-black text-zinc-500 mb-6 flex items-center gap-2"><ArrowRight size={14} className="text-blue-500" /> Curriculum Preview</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {modules.slice(0, 4).map((m, i) => (
                <Link key={m.id} to="/courses">
                  <Card className="hover:border-zinc-700 transition-colors h-full">
                    <div className="text-blue-500 font-black text-xs mb-3 uppercase">Module 0{i+1}</div>
                    <h5 className="font-bold mb-2 uppercase tracking-tight">{m.title}</h5>
                    <p className="text-xs text-zinc-500 line-clamp-2">{m.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const CourseListing = () => {
  const { modules } = useCourse();
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12"><Badge variant="warning">Release Date: 1st March 2026</Badge><h2 className="text-4xl font-black mt-4 mb-4 uppercase tracking-tighter">Academy Curriculum</h2></header>
      <div className="space-y-8">
        {modules.map((module, idx) => {
          const isModuleFree = idx < 2;
          const isLocked = !isModuleFree && user?.tier === 'FREE';
          return (
            <div key={module.id} className={`p-8 rounded-2xl border bg-zinc-900/30 border-zinc-800 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-black text-blue-500">0{idx + 1}</span>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tight">{module.title}</h3>
                      <div className="flex gap-2 mt-1">
                        {isModuleFree ? <Badge variant="success">Free</Badge> : <Badge variant="danger">Pro</Badge>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500">{module.description}</p>
                </div>
                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-3 relative">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl flex items-center justify-between text-zinc-600">
                      <div className="flex items-center gap-3">
                        {isLocked ? <Lock size={14} /> : <Clock size={14} />}
                        <span className="text-sm font-bold">{lesson.title}</span>
                      </div>
                      <Badge variant="neutral">Soon</Badge>
                    </div>
                  ))}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <Link to="/settings"><Button variant="primary">Unlock Academy</Button></Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TemplatesVault = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12"><Badge variant="info">Coming Soon</Badge><h2 className="text-4xl font-black mt-4 mb-4 uppercase tracking-tighter">Templates Vault</h2></header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
        {INITIAL_TEMPLATES.map(t => (
          <Card key={t.id} className="border-zinc-900 grayscale">
            <Badge variant="neutral" className="mb-4">{t.category}</Badge>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{t.title}</h3>
            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-900 blur-sm select-none h-32 overflow-hidden">{t.content}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ResourcesPage = () => (
  <div className="max-w-6xl mx-auto">
    <header className="mb-12"><Badge variant="info">Coming Soon</Badge><h2 className="text-4xl font-black mt-4 mb-4 uppercase tracking-tighter">Resources Vault</h2></header>
    <div className="grid md:grid-cols-2 gap-6 opacity-40">
      <Card className="p-12 text-center border-dashed border-zinc-800">
        <Download size={48} className="mx-auto text-zinc-700 mb-6" />
        <h3 className="text-xl font-bold mb-2 text-zinc-500 uppercase">Toolkit Assets</h3>
        <p className="text-sm text-zinc-600 italic">Checklists, workflows, and guides arriving on launch day.</p>
      </Card>
    </div>
  </div>
);

const SettingsPage = () => {
  const { user, updateTier } = useAuth();
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12"><h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Settings</h2></header>
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 border-zinc-800">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-black mb-1">Your Account</h3>
            <p className="text-zinc-500 text-sm">Tier: {user?.tier}</p>
          </div>
          <Badge variant={user?.tier === 'PAID' ? 'success' : 'neutral'}>{user?.tier}</Badge>
        </div>
        {user?.tier === 'FREE' && (
          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-lg mb-1">Upgrade to Academy Pro</p>
              <p className="text-sm text-zinc-500">Access all 10 modules and full vault.</p>
            </div>
            <Button onClick={() => updateTier('PAID')}>Upgrade Now</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const AdminPanel = () => (
  <div className="max-w-6xl mx-auto">
    <header className="mb-12"><Badge variant="warning">ADMIN</Badge><h2 className="text-4xl font-black mt-4 mb-4 uppercase tracking-tighter">Content Management</h2></header>
    <Card className="p-12 text-center text-zinc-500 italic">Admin interfaces are under construction.</Card>
  </div>
);

const AuthPage = ({ mode }: { mode: 'login' | 'signup' }) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dealership, setDealership] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup({ email, name, dealershipName: dealership });
      }
      navigate('/dashboard');
    } catch (err) {
      alert('Error during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-black uppercase tracking-tight text-white">Dealer Growth Academy</Link>
          <h2 className="text-2xl font-black text-white mt-8 uppercase">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        </div>
        <Card className="p-8 border-zinc-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</label><input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
                <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dealership</label><input required value={dealership} onChange={e => setDealership(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
              </>
            )}
            <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email</label><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
            <div className="space-y-1"><label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Password</label><input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" /></div>
            <Button type="submit" className="w-full py-4 text-lg font-black uppercase tracking-widest" disabled={isLoading}>{isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Join Now'}</Button>
          </form>
        </Card>
        <p className="text-center mt-8 text-zinc-600 text-sm font-bold uppercase tracking-widest">
          {mode === 'login' ? <Link to="/signup">New? Create Account</Link> : <Link to="/login">Already a member? Sign In</Link>}
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dga_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [modules] = useState<Module[]>(INITIAL_MODULES);
  const [progress] = useState<UserProgress>({ completedLessonIds: [] });

  useEffect(() => {
    localStorage.setItem('dga_user', JSON.stringify(user));
  }, [user]);

  const login = async (email: string) => {
    setUser({ id: 'u1', email, name: 'John Dealer', dealershipName: 'Prestige Motors', country: 'UK', tier: email.includes('admin') ? 'ADMIN' : 'FREE', createdAt: new Date().toISOString() });
  };

  const signup = async (data: Partial<User>) => {
    setUser({ id: 'u2', email: data.email || '', name: data.name || 'User', dealershipName: data.dealershipName || 'Dealer', country: 'UK', tier: 'FREE', createdAt: new Date().toISOString() });
  };

  const logout = () => setUser(null);
  const updateTier = (tier: UserTier) => user && setUser({ ...user, tier });

  return (
    <Router>
      <AuthContext.Provider value={{ user, login, signup, logout, updateTier }}>
        <CourseContext.Provider value={{ modules, progress, toggleLessonComplete: () => {}, updateModules: () => {} }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/dashboard" element={user ? <AuthenticatedLayout><Dashboard /></AuthenticatedLayout> : <Navigate to="/login" />} />
            <Route path="/courses" element={user ? <AuthenticatedLayout><CourseListing /></AuthenticatedLayout> : <Navigate to="/login" />} />
            <Route path="/templates" element={user ? <AuthenticatedLayout><TemplatesVault /></AuthenticatedLayout> : <Navigate to="/login" />} />
            <Route path="/resources" element={user ? <AuthenticatedLayout><ResourcesPage /></AuthenticatedLayout> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <AuthenticatedLayout><SettingsPage /></AuthenticatedLayout> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.tier === 'ADMIN' ? <AuthenticatedLayout><AdminPanel /></AuthenticatedLayout> : <Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CourseContext.Provider>
      </AuthContext.Provider>
    </Router>
  );
};

export default App;