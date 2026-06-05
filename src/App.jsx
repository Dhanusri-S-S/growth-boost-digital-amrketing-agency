import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Search, 
  Target, 
  Mail, 
  Globe, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  ChevronDown, 
  Award, 
  ShieldCheck, 
  BarChart3, 
  PhoneCall, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Star, 
  ArrowUpRight, 
  Lock,
  Sparkles,
  Zap,
  Check,
  Building,
  User,
  Clock,
  ThumbsUp,
  FileSpreadsheet
} from 'lucide-react';

// Custom Count Up component using IntersectionObserver
function MetricCounter({ targetValue, duration = 1500, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let startTime = null;
    let animationFrame = null;
    
    const numericPart = parseFloat(targetValue.replace(/[^0-9.]/g, ''));
    const isFloat = targetValue.includes('.');

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - percentage, 3); // Cubic ease out
      const current = easedProgress * numericPart;
      
      setCount(isFloat ? current.toFixed(1) : Math.floor(current));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(numericPart);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationFrame = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [targetValue, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

// Vector Line SVG Chart for Case Studies
function GrowthChart({ dataPoints, accentColor = "#06B6D4" }) {
  const width = 500;
  const height = 180;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...dataPoints);
  const minVal = Math.min(...dataPoints);
  const valRange = maxVal - minVal || 1;

  const points = dataPoints.map((val, idx) => {
    const x = padding + (idx / (dataPoints.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      
      {/* Grid horizontal guidelines */}
      {[0, 0.33, 0.66, 1].map((ratio, idx) => {
        const y = padding + ratio * chartHeight;
        return (
          <line 
            key={idx} 
            x1={padding} 
            y1={y} 
            x2={width - padding} 
            y2={y} 
            stroke="rgba(255, 255, 255, 0.04)" 
            strokeWidth="1"
          />
        );
      })}

      {/* Underneath Area Gradient */}
      <path d={areaD} fill="url(#chartGrad)" />

      {/* Compounding Curve */}
      <path d={pathD} fill="none" stroke={accentColor} strokeWidth="3.5" strokeLinecap="round" />

      {/* Nodes */}
      {points.map((pt, idx) => (
        <circle 
          key={idx} 
          cx={pt.x} 
          cy={pt.y} 
          r="4.5" 
          fill="#111827" 
          stroke={accentColor} 
          strokeWidth="2.5" 
        />
      ))}
    </svg>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCaseTab, setActiveCaseTab] = useState('saas');
  const [faqSearch, setFaqSearch] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // Mouse Follow Spotlight States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  // Custom Multi-step scheduler state
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    company: '',
    date: '',
    time: '',
    goals: []
  });
  const [bookingToast, setBookingToast] = useState(false);

  // Simulate loader screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Track cursor spotlight positions
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      if (window.innerWidth > 1024) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // IntersectionObserver scroll reveals
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-element');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]);

  // Form Booking Handlers
  const handleGoalToggle = (goal) => {
    setBookingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal]
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email || !bookingData.company) {
      alert("Please fill in name, email, and company details.");
      return;
    }
    if (bookingStep === 1) {
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!bookingData.date || !bookingData.time) {
        alert("Please select a preferred date and time slot.");
        return;
      }
      setBookingStep(3);
      setBookingToast(true);
      setTimeout(() => setBookingToast(false), 5000);
    }
  };

  // Pre-calculated calendar slots (next 5 working days)
  const getNextWorkingDays = () => {
    const dates = [];
    let current = new Date();
    while (dates.length < 5) {
      current.setDate(current.getDate() + 1);
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // Exclude Sat/Sun
        dates.push({
          raw: current.toISOString().split('T')[0],
          dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
          dateNum: current.getDate(),
          monthName: current.toLocaleDateString('en-US', { month: 'short' })
        });
      }
    }
    return dates;
  };

  const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  // Render Loader
  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-bg-main flex flex-col justify-center px-6 md:px-12">
        <div className="max-w-4xl mx-auto w-full space-y-8 animate-pulse">
          {/* Nav loader */}
          <div className="flex justify-between items-center pb-8 border-b border-slate-800">
            <div className="w-32 h-6 bg-slate-800 rounded"></div>
            <div className="hidden md:flex space-x-6">
              <div className="w-16 h-4 bg-slate-800 rounded"></div>
              <div className="w-16 h-4 bg-slate-800 rounded"></div>
              <div className="w-16 h-4 bg-slate-800 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-slate-800 rounded-full"></div>
          </div>
          {/* Hero loader */}
          <div className="space-y-4 pt-12">
            <div className="w-28 h-5 bg-blue-500/20 rounded-full"></div>
            <div className="w-full md:w-3/4 h-12 bg-slate-800 rounded"></div>
            <div className="w-1/2 h-12 bg-slate-800 rounded"></div>
            <div className="w-full md:w-2/3 h-6 bg-slate-800 rounded pt-4"></div>
          </div>
          {/* Buttons loader */}
          <div className="flex space-x-4 pt-6">
            <div className="w-36 h-12 bg-slate-800 rounded-full"></div>
            <div className="w-36 h-12 bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main font-sans text-text-secondary antialiased relative overflow-hidden page-loaded-enter page-loaded-active">
      
      {/* Desktop Mouse Spotlight */}
      {isDesktop && (
        <div 
          className="mouse-spotlight"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}

      {/* Top Banner Grid background effect */}
      <div className="absolute inset-0 bg-grid-dark opacity-70 pointer-events-none z-0"></div>

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 w-full border-b border-white/5 bg-bg-main/80 backdrop-blur-xl z-50 py-5 transition-all duration-300 shrinking-header">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              G
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
              GrowthBoost<span className="text-accent">.</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-9 text-slate-300 font-medium text-[15px]">
            <a href="#services" className="hover:text-white transition-colors duration-200 relative group py-2">
              Capabilities
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#metrics" className="hover:text-white transition-colors duration-200 relative group py-2">
              Our Metrics
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#workflow" className="hover:text-white transition-colors duration-200 relative group py-2">
              Methodology
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#cases" className="hover:text-white transition-colors duration-200 relative group py-2">
              Audits
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#faqs" className="hover:text-white transition-colors duration-200 relative group py-2">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* CTA Header */}
          <div className="hidden md:flex items-center">
            <a 
              href="#book" 
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-accent text-white font-medium text-[14px] shadow-lg shadow-primary/20 hover:shadow-accent/25 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Schedule Strategy Audits</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[100%] left-0 w-full bg-surface border-b border-white/5 shadow-2xl px-6 py-8 flex flex-col space-y-5 animate-fade-in z-50">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white hover:text-accent">Capabilities</a>
            <a href="#metrics" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white hover:text-accent">Our Metrics</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white hover:text-accent">Methodology</a>
            <a href="#cases" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white hover:text-accent">Audits</a>
            <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-white hover:text-accent">FAQ</a>
            <hr className="border-white/5" />
            <a 
              href="#book" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-full bg-primary hover:bg-accent text-white font-semibold transition-colors duration-300"
            >
              Book Strategist Call
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 overflow-hidden z-10">
        
        {/* Glow Spheres */}
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[130px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-15%] w-[550px] h-[550px] rounded-full bg-accent/8 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Hero Details */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-bold self-center lg:self-start shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>HANDCRAFTED GROWTH SYSTEM</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-[76px] leading-[1.05] text-white tracking-tight">
              Engineered for <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">Exponential Growth.</span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              We combine enterprise-grade performance marketing, conversion engineering, and branding strategy to acquire customers with positive unit economics. No vanity metrics. Just revenue.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-5 pt-2">
              <a 
                href="#book" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-accent text-white font-semibold text-[16px] shadow-lg shadow-primary/20 hover:shadow-accent/25 transition-all duration-300 flex items-center justify-center space-x-2.5"
              >
                <span>Schedule Strategy Call</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#cases" 
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-[16px] transition-all duration-300 flex items-center justify-center"
              >
                <span>View Case Studies</span>
              </a>
            </div>

            {/* Social Proof Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 pt-6 border-t border-white/5 max-w-xl mx-auto lg:mx-0 text-slate-400">
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-xl font-heading">
                  <MetricCounter targetValue="180" suffix="+" />
                </span>
                <span className="text-xs">Audits Completed</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-xl font-heading">
                  <MetricCounter targetValue="20" prefix="$" suffix="M+" />
                </span>
                <span className="text-xs">PPC Ads Optimized</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-xl font-heading">
                  <MetricCounter targetValue="45" prefix="$" suffix="M+" />
                </span>
                <span className="text-xs">Client Revenue Generated</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative w-full max-w-md lg:max-w-none mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-surface/50 aspect-square lg:aspect-auto">
              <img 
                src="/hero_office.png" 
                alt="GrowthBoost Digital Marketing Team collaborating" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent pointer-events-none"></div>

              {/* Floating indicators */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-white/10 flex justify-between items-center shadow-xl">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average ROI Delivered</p>
                    <p className="text-lg font-bold text-white leading-normal">248% Net Growth</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/10">
                  Verified
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Client Logos strip */}
        <div className="mt-24 border-y border-white/5 bg-surface/30 backdrop-blur-sm py-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-5">
            <p className="text-center text-xs font-extrabold tracking-widest text-slate-500 uppercase">
              POWERING CLIENT ACQUISITION CHANNELS FOR LEADING ENTERPRISES
            </p>
          </div>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center space-x-20 pr-20 text-slate-500 font-bold font-heading text-lg md:text-2xl">
              <span>SAASIFY INC</span>
              <span>RETAILFLOW D2C</span>
              <span>HEALTHNEXUS CLINICS</span>
              <span>EDULEARN DIGITAL</span>
              <span>PRIMEESTATE PARTNERS</span>
              <span>TECHVANGUARD LABS</span>
              <span>SAASIFY INC</span>
              <span>RETAILFLOW D2C</span>
              <span>HEALTHNEXUS CLINICS</span>
              <span>EDULEARN DIGITAL</span>
              <span>PRIMEESTATE PARTNERS</span>
              <span>TECHVANGUARD LABS</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-bg-main to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-bg-main to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="story" className="py-24 md:py-32 bg-surface/40 relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Col context */}
            <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
              <span className="text-xs font-extrabold tracking-widest text-accent uppercase">ABOUT OUR AGENCY</span>
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight">
                Beyond clicks. We focus on unit economics.
              </h2>
              <p className="text-slate-300 text-[17px] leading-relaxed">
                GrowthBoost Digital was founded to dismantle standard agency models. We don't hide behind 'impressions' and 'brand awareness' reports. We run marketing as a product, optimizing user acquisition costs against actual product revenue.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-surface border border-white/5 shadow-inner">
                  <h3 className="font-heading font-bold text-lg text-white mb-2">Our Mission</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Deliver scalable customer acquisition infrastructure that compounds business value.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-surface border border-white/5 shadow-inner">
                  <h3 className="font-heading font-bold text-lg text-white mb-2">Our Vision</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    To be the fractional growth engine driving the next generation of mid-market scaling.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col cards */}
            <div className="lg:col-span-7 flex flex-col space-y-10">
              
              {/* Note card */}
              <div className="p-8 md:p-12 rounded-3xl bg-surface border border-white/5 relative overflow-hidden shadow-xl reveal-element">
                <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="font-heading font-bold text-xl md:text-2xl text-accent mb-6">A Letter from our Founder</h3>
                
                <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light mb-8 italic">
                  &ldquo;Marketing is an investment, not a cost. If an agency cannot trace its campaigns directly to your bottom-line profitability, it is not digital marketing—it is digital philanthropy. We built GrowthBoost to be the partner we wished we had when we were scaling startups. We take deep ownership of your numbers, build custom high-performance pipelines, and test tirelessly so you can scale sustainably.&rdquo;
                </p>

                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent bg-slate-800">
                    <img 
                      src="/team_leader.png" 
                      alt="David Vance" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-[15px]">David Vance</h4>
                    <p className="text-xs text-slate-400">Managing Partner, GrowthBoost Digital</p>
                  </div>
                </div>
              </div>

              {/* Core Pillars */}
              <div className="space-y-6 pt-4">
                <h3 className="font-heading font-bold text-2xl text-white border-b border-white/5 pb-4">Core Pillars of Our Philosophy</h3>
                
                <div className="flex space-x-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-accent font-bold text-[15px]">
                    01
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-white mb-1.5">Attribution Integrity</h4>
                    <p className="text-slate-350 text-[14px] leading-relaxed">
                      We track custom analytics from first touch to booking or checkout. No muddy reporting. You know exactly what channel drove which lead.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-accent font-bold text-[15px]">
                    02
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-white mb-1.5">Conversion Engineering</h4>
                    <p className="text-slate-350 text-[14px] leading-relaxed">
                      Traffic is useless if your site bounce rate is 70%. We develop sub-second, highly responsive React-based conversion pages to capture every drop of value.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-accent font-bold text-[15px]">
                    03
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-white mb-1.5">Creative Hyper-Testing</h4>
                    <p className="text-slate-350 text-[14px] leading-relaxed">
                      Ad fatigue is real. We continuously model and ship fresh video hooks, design variants, and copy frameworks weekly to keep acquisition costs low.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Services / Capabilities Section */}
      <section id="services" className="py-24 md:py-32 bg-bg-main relative z-10 native-reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center space-y-4 mb-20">
            <span className="text-xs font-extrabold tracking-widest text-accent uppercase">TACTICAL CAPABILITIES</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
              Channels We Dominate
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We build client acquisition infrastructure. We align these channels into a coherent, high-converting growth architecture tailored for your product metrics.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group relative p-8 rounded-3xl border border-white/5 bg-surface/50 hover:border-accent/25 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between reveal-element shadow-lg glass-card"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-accent/30 transition-all duration-300">
                    {service.icon}
                  </div>
                  
                  <h3 className="font-heading font-bold text-2xl text-white tracking-tight group-hover:text-accent transition-colors duration-200">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-305 text-[15px] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex flex-col space-y-3">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-[13px] text-slate-400">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Conversion Banner between Sections */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-heading font-bold text-xl md:text-2xl text-white flex items-center justify-center md:justify-start space-x-2">
              <Zap className="w-5 h-5 text-accent animate-pulse" />
              <span>Ready to identify your client acquisition bottlenecks?</span>
            </h4>
            <p className="text-slate-400 text-sm">Get a detailed funnel & speed audit prepared by our strategists before booking a session.</p>
          </div>
          <a 
            href="#book" 
            className="px-8 py-3.5 rounded-full bg-accent hover:bg-primary text-primary hover:text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-md shadow-accent/10"
          >
            Claim Free Audit
          </a>
        </div>
      </section>

      {/* Results-Driven Marketing (Performance Metrics) */}
      <section id="metrics" className="py-24 md:py-32 bg-surface/25 relative z-10 native-reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Col Context */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <span className="text-xs font-extrabold tracking-widest text-accent uppercase">BENCHMARKS OF EXCELLENCE</span>
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight">
                Results-Driven Marketing Infrastructure
              </h2>
              <p className="text-slate-300 text-[16px] leading-relaxed">
                We design marketing campaigns with complete mathematical accountability. We track customer acquisition costs (CAC) against customer lifetime value (LTV) to output direct response profitability.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Attribution Architecture</h4>
                    <p className="text-slate-450 text-[13px] mt-0.5">Custom post-cookie tracking loops ensuring accurate conversion matches on Meta and Google Ads.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Senior Creative Direction</h4>
                    <p className="text-slate-450 text-[13px] mt-0.5">High-end UI design systems and copy architectures crafted directly by creative directors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col Statistics Counters Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-6">
              
              <div className="p-8 rounded-3xl bg-surface border border-white/5 shadow-lg flex flex-col justify-between text-center relative reveal-element glass-card">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average ROI</span>
                <span className="font-heading font-extrabold text-4xl sm:text-5xl text-accent mt-4 mb-2">
                  <MetricCounter targetValue="248" suffix="%" />
                </span>
                <span className="text-[11px] text-slate-500">Verified across audits</span>
              </div>

              <div className="p-8 rounded-3xl bg-surface border border-white/5 shadow-lg flex flex-col justify-between text-center relative reveal-element glass-card">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Revenue Generated</span>
                <span className="font-heading font-extrabold text-4xl sm:text-5xl text-white mt-4 mb-2">
                  <MetricCounter targetValue="45" prefix="$" suffix="M+" />
                </span>
                <span className="text-[11px] text-slate-500">Client billing metrics</span>
              </div>

              <div className="p-8 rounded-3xl bg-surface border border-white/5 shadow-lg flex flex-col justify-between text-center relative reveal-element glass-card">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Client Retention</span>
                <span className="font-heading font-extrabold text-4xl sm:text-5xl text-primary mt-4 mb-2">
                  <MetricCounter targetValue="98" suffix="%" />
                </span>
                <span className="text-[11px] text-slate-500">On-going annual contracts</span>
              </div>

              <div className="p-8 rounded-3xl bg-surface border border-white/5 shadow-lg flex flex-col justify-between text-center relative reveal-element glass-card">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monthly Inbounds</span>
                <span className="font-heading font-extrabold text-4xl sm:text-5xl text-white mt-4 mb-2">
                  <MetricCounter targetValue="12" suffix="K+" />
                </span>
                <span className="text-[11px] text-slate-500">High-intent buyer leads</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section id="workflow" className="py-24 md:py-32 bg-white/5 relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center space-y-4 mb-20">
            <span className="text-xs font-extrabold tracking-widest text-accent uppercase">OPERATIONAL TIMELINE</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
              The 5-Step Acquisition Engine
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We design structured onboarding pipelines. Here is the operational cadence we use to go from initial audit to hyper-scaled campaigns.
            </p>
          </div>

          {/* Timeline Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="relative p-7 rounded-3xl border border-white/5 bg-surface/40 hover:bg-surface/80 hover:shadow-2xl transition-all duration-300 flex flex-col space-y-4 reveal-element glass-card"
              >
                <div className="flex justify-between items-center">
                  <span className="font-heading font-extrabold text-3xl text-slate-600 tracking-tight">{step.number}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent shadow shadow-accent/50"></span>
                </div>
                
                <h3 className="font-heading font-bold text-xl text-white tracking-tight">{step.title}</h3>
                
                <p className="text-slate-400 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 md:py-32 bg-bg-main relative z-10 native-reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center space-y-4 mb-20">
            <span className="text-xs font-extrabold tracking-widest text-accent uppercase">SECTOR EXPERTISE</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
              Industries We Serve
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We specialize in segments requiring highly structured funnels and proof of customer acquisition economics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "B2B SaaS", icon: <Sparkles className="w-5 h-5" /> },
              { label: "E-Commerce", icon: <TrendingUp className="w-5 h-5" /> },
              { label: "Healthcare", icon: <ShieldCheck className="w-5 h-5" /> },
              { label: "Real Estate", icon: <Award className="w-5 h-5" /> },
              { label: "Education", icon: <Briefcase className="w-5 h-5" /> },
              { label: "Local Services", icon: <MapPin className="w-5 h-5" /> }
            ].map((ind, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-white/5 bg-surface/50 hover:bg-surface hover:border-accent/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-4 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-accent transition-all duration-350 border border-white/10">
                  {ind.icon}
                </div>
                <span className="font-heading font-semibold text-sm text-white tracking-tight group-hover:text-accent transition-colors duration-200">{ind.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Case Studies Section */}
      <section id="cases" className="py-24 md:py-32 bg-surface/20 relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-20">
            <div className="flex flex-col space-y-4 max-w-2xl">
              <span className="text-xs font-extrabold tracking-widest text-accent uppercase">CASE ARCHIVE</span>
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
                Case Studies & Analytical Proof
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Realistic metrics audited from client dashboards. Filter by industry to inspect our growth blueprints.
              </p>
            </div>
            
            {/* Tabs Controller */}
            <div className="flex p-1.5 rounded-full bg-surface border border-white/10 shadow-inner self-start">
              <button 
                onClick={() => setActiveCaseTab('saas')}
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all duration-200 ${activeCaseTab === 'saas' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                SaaS Growth
              </button>
              <button 
                onClick={() => setActiveCaseTab('ecom')}
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all duration-200 ${activeCaseTab === 'ecom' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                E-Commerce
              </button>
              <button 
                onClick={() => setActiveCaseTab('local')}
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase transition-all duration-200 ${activeCaseTab === 'local' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Local Business
              </button>
            </div>
          </div>

          {/* Active Case Study Detail Card */}
          <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-surface/60 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center reveal-element glass-card">
            
            {/* Left Metrics & Story */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              
              <div className="flex items-center space-x-3 text-xs font-bold text-accent">
                <span>{caseStudies[activeCaseTab].industry}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span className="text-slate-400">Client: {caseStudies[activeCaseTab].client}</span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-white leading-tight">
                {caseStudies[activeCaseTab].title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed">
                {caseStudies[activeCaseTab].story}
              </p>

              {/* Metrics block */}
              <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Before</p>
                  <p className="font-heading font-bold text-xl sm:text-2xl text-slate-400 mt-1">{caseStudies[activeCaseTab].metricBefore}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{caseStudies[activeCaseTab].metricLabel}</p>
                </div>
                <div>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-wider">After</p>
                  <p className="font-heading font-extrabold text-xl sm:text-2xl text-emerald-400 mt-1">{caseStudies[activeCaseTab].metricAfter}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{caseStudies[activeCaseTab].metricLabel}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Growth ROI</p>
                  <p className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-1">{caseStudies[activeCaseTab].roi}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Verified CAC decrease</p>
                </div>
              </div>

              {/* points */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-white">Strategic Actions Taken:</h4>
                {caseStudies[activeCaseTab].points.map((pt, index) => (
                  <div key={index} className="flex items-start space-x-2.5 text-xs text-slate-350">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Dashboard with custom SVGs */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              
              <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-lg bg-bg-main p-4 flex flex-col justify-between">
                
                <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Performance Curve</span>
                    <h5 className="text-white font-bold text-sm mt-0.5">6-Month Acquisition Progression</h5>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                    {caseStudies[activeCaseTab].leads} Leads
                  </span>
                </div>

                {/* Render visual SVG chart lines! */}
                <div className="w-full h-44 bg-surface/30 rounded-lg p-2">
                  {activeCaseTab === 'saas' && <GrowthChart dataPoints={[12, 18, 25, 48, 98, 165]} accentColor="#06B6D4" />}
                  {activeCaseTab === 'ecom' && <GrowthChart dataPoints={[38, 55, 92, 148, 220, 312]} accentColor="#3B82F6" />}
                  {activeCaseTab === 'local' && <GrowthChart dataPoints={[85, 78, 62, 45, 31, 21.5]} accentColor="#10B981" />}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 font-mono">
                  <span>Month 1</span>
                  <span>Month 3</span>
                  <span>Month 6 (Launch)</span>
                </div>
              </div>

              {/* Verified Badge text */}
              <div className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Dashboard verified via custom API attribution locks.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32 bg-white/5 relative z-10 border-b border-white/5 native-reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center space-y-4 mb-20">
            <span className="text-xs font-extrabold tracking-widest text-accent uppercase">THE BRAIN TRUST</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
              Growth Strategists
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We do not outsource your projects. Our senior branding architects and direct response media buyers run your funnels natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div 
                key={idx} 
                className="group relative p-4 rounded-3xl border border-white/5 bg-surface/50 hover:bg-surface hover:shadow-2xl transition-all duration-300 flex flex-col space-y-5 reveal-element glass-card"
              >
                
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                <div className="px-2 pb-2 flex flex-col space-y-1">
                  <h3 className="font-heading font-bold text-xl text-white tracking-tight">{member.name}</h3>
                  <p className="text-xs text-accent font-semibold">{member.role}</p>
                  <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-24 md:py-32 bg-surface/20 relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Col Header */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <span className="text-xs font-extrabold tracking-widest text-accent uppercase">VERIFIED SOCIAL PROOF</span>
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight">
                What partners say about us.
              </h2>
              <p className="text-slate-350 text-base leading-relaxed">
                We measure our success by the growth of our partners. Read verified feedback from VC-backed startups and multi-location medical businesses.
              </p>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white">★ 4.9 out of 5</span>
                <span className="text-slate-500">based on 180+ audits</span>
              </div>
            </div>

            {/* Right Col Grid Testimonials */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              {testimonials.map((test, index) => (
                <div 
                  key={index}
                  className="p-6 md:p-8 rounded-3xl border border-white/5 bg-surface/50 shadow-sm flex flex-col space-y-4 hover:shadow-xl transition-shadow duration-300 relative reveal-element glass-card"
                >
                  <div className="flex text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-[15px] leading-relaxed italic font-light">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                  <div className="flex items-center space-x-3.5 pt-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                      {test.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{test.author}</h4>
                      <p className="text-[11px] text-slate-500">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* CTA Conversion Banner between Sections */}
      <section className="py-12 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-heading font-bold text-xl md:text-2xl text-white flex items-center justify-center md:justify-start space-x-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <span>Scale your marketing channels efficiently.</span>
            </h4>
            <p className="text-slate-400 text-sm">Review available dates and claim your consultation strategy plan today.</p>
          </div>
          <a 
            href="#book" 
            className="px-8 py-3.5 rounded-full bg-primary hover:bg-accent text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-md shadow-primary/15"
          >
            Book Session Now
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-24 md:py-32 bg-bg-main relative z-10 native-reveal">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center flex flex-col items-center space-y-4 mb-16">
            <span className="text-xs font-extrabold tracking-widest text-accent uppercase">FAQ HUB</span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find transparent answers about our agreements, metrics auditing, and operational structure.
            </p>

            {/* Search Input */}
            <div className="relative w-full max-w-md mt-6">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-full border border-white/10 bg-surface text-sm text-white focus:outline-none focus:border-accent focus:bg-surface/80 shadow-inner transition-all duration-200"
              />
              {faqSearch && (
                <button 
                  onClick={() => setFaqSearch('')} 
                  className="absolute right-4.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className="border border-white/5 rounded-2xl overflow-hidden bg-surface/30 hover:border-white/10 transition-colors duration-200"
                  >
                    <button 
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full text-left px-6 py-5 flex justify-between items-center group focus:outline-none"
                    >
                      <span className="font-heading font-bold text-base text-white tracking-tight group-hover:text-accent transition-colors duration-200">
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                    </button>
                    
                    <div 
                      className={`transition-all duration-350 ease-in-out bg-surface/10 overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-white/5' : 'max-h-0'}`}
                    >
                      <div className="px-6 py-5 text-slate-350 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 font-medium">
                No matching questions found. Try searching for "contracts", "ROAS", or "booking".
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Custom Consultation Scheduling Portal */}
      <section id="book" className="py-24 md:py-32 bg-surface/30 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Col Context details */}
            <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
              <span className="text-xs font-extrabold tracking-widest text-accent uppercase">SCHEDULING PORTAL</span>
              <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight">
                Secure Your Strategy Session
              </h2>
              
              <p className="text-slate-300 text-[15px] leading-relaxed">
                Choose a time window on our custom scheduling board. Prior to our call, our growth architects will run an analysis of your search traffic, paid ads footprint, and site speed.
              </p>

              {/* Details list */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="font-heading font-bold text-sm text-white">Operational Agenda:</h4>
                
                <div className="flex space-x-3 text-xs">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-0.5">Funnel Velocity Audit</h5>
                    <p className="text-slate-400">We dissect 3 high-friction points in your current landing pages.</p>
                  </div>
                </div>

                <div className="flex space-x-3 text-xs">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-0.5">Attribution Mapping</h5>
                    <p className="text-slate-400">We outline a custom cross-channel tag strategy to bypass iOS attribution bottlenecks.</p>
                  </div>
                </div>

                <div className="flex space-x-3 text-xs">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-0.5">Execution Blueprint</h5>
                    <p className="text-slate-400">We propose custom channel allocations and CAC budgets to achieve your growth targets.</p>
                  </div>
                </div>
              </div>

              {/* Urgency indicators */}
              <div className="p-4 rounded-2xl bg-bg-main border border-white/5 flex items-center justify-between shadow-inner">
                <span className="text-[13px] text-slate-300 font-semibold flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Only 2 strategy slots remaining this week</span>
                </span>
                <span className="text-xs text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded font-bold uppercase tracking-wider">Urgent</span>
              </div>
            </div>

            {/* Right Col Multi-step form panels */}
            <div className="lg:col-span-7 w-full z-10 reveal-element">
              <div className="bg-surface rounded-3xl shadow-2xl border border-white/5 p-6 md:p-8 relative overflow-hidden glass-card">
                
                {/* Header status bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-accent" />
                    <span>Secure Booking Integration (Enterprise Node)</span>
                  </div>
                  
                  {/* Progress steps dots */}
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${bookingStep >= 1 ? 'bg-accent' : 'bg-slate-700'}`}></div>
                    <div className={`w-2.5 h-2.5 rounded-full ${bookingStep >= 2 ? 'bg-accent' : 'bg-slate-700'}`}></div>
                    <div className={`w-2.5 h-2.5 rounded-full ${bookingStep === 3 ? 'bg-accent' : 'bg-slate-700'}`}></div>
                  </div>
                </div>

                {/* Form Elements */}
                {bookingStep === 1 && (
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-xl text-white tracking-tight">Tell us about your business</h3>
                      <p className="text-slate-450 text-xs">Outline your background info to custom-fit our audit before scheduling slots.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-450">Your Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                          <input 
                            type="text" 
                            required 
                            placeholder="John Doe" 
                            value={bookingData.name}
                            onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 bg-bg-main border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-450">Work Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                          <input 
                            type="email" 
                            required 
                            placeholder="john@company.com" 
                            value={bookingData.email}
                            onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 bg-bg-main border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-450">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                          type="text" 
                          required 
                          placeholder="Acme Growth Inc" 
                          value={bookingData.company}
                          onChange={(e) => setBookingData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-bg-main border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    {/* Checkboxes Business goals */}
                    <div className="space-y-2.5 pt-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Select Primary Business Goals</label>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          "Scale B2B Inbounds",
                          "Increase E-commerce ROAS",
                          "Optimize Conversion rates",
                          "Develop React Web Engine",
                          "Build SEO Authority"
                        ].map((goal, idx) => {
                          const isSelected = bookingData.goals.includes(goal);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleGoalToggle(goal)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${isSelected ? 'bg-primary/25 border-accent text-white shadow-md' : 'bg-bg-main border-white/5 text-slate-400 hover:text-white'}`}
                            >
                              {goal}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 rounded-full bg-primary hover:bg-accent text-white font-bold text-sm tracking-wider uppercase transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Choose Date & Time Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {bookingStep === 2 && (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <button 
                        type="button" 
                        onClick={() => setBookingStep(1)}
                        className="text-[11px] font-bold uppercase tracking-wider text-accent hover:text-white mb-2 flex items-center space-x-1"
                      >
                        ← Back to info
                      </button>
                      <h3 className="font-heading font-bold text-xl text-white tracking-tight">Select date and time slot</h3>
                      <p className="text-slate-450 text-xs">Calendar showing slot openings for the next working days.</p>
                    </div>

                    {/* Calendar grid */}
                    <div className="space-y-3.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Available Dates</label>
                      <div className="grid grid-cols-5 gap-2.5">
                        {getNextWorkingDays().map((d, idx) => {
                          const isSelected = bookingData.date === d.raw;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setBookingData(prev => ({ ...prev, date: d.raw }))}
                              className={`p-3.5 rounded-xl border flex flex-col items-center transition-all duration-200 ${isSelected ? 'bg-primary/25 border-accent text-white' : 'bg-bg-main border-white/5 text-slate-400 hover:text-white'}`}
                            >
                              <span className="text-[10px] font-bold uppercase text-slate-500">{d.dayName}</span>
                              <span className="text-lg font-bold font-heading mt-1">{d.dateNum}</span>
                              <span className="text-[9px] text-slate-500 uppercase mt-0.5">{d.monthName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    <div className="space-y-3.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-450 block">Available Time Slots (PST)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {timeSlots.map((time, idx) => {
                          const isSelected = bookingData.time === time;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setBookingData(prev => ({ ...prev, time: time }))}
                              className={`py-3 rounded-xl border text-xs font-semibold text-center transition-all duration-200 ${isSelected ? 'bg-primary/25 border-accent text-white' : 'bg-bg-main border-white/5 text-slate-400 hover:text-white'}`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 rounded-full bg-accent hover:bg-primary hover:text-white text-primary font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Confirm Consultation Session</span>
                    </button>
                  </form>
                )}

                {bookingStep === 3 && (
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Check className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading font-extrabold text-2xl text-white tracking-tight">Audit Session Booked!</h3>
                      <p className="text-slate-350 text-sm max-w-sm">
                        Thank you, <span className="text-white font-bold">{bookingData.name}</span>. We have scheduled your audit slot for:
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-bg-main border border-white/5 max-w-sm w-full font-mono text-xs text-left space-y-2 text-slate-300 shadow-inner">
                      <p><span className="text-slate-500">Company:</span> {bookingData.company}</p>
                      <p><span className="text-slate-500">Date:</span> {bookingData.date}</p>
                      <p><span className="text-slate-500">Time Window:</span> {bookingData.time} (PST)</p>
                      <p><span className="text-slate-500">Goals Checked:</span> {bookingData.goals.join(', ') || 'General growth audit'}</p>
                    </div>

                    <p className="text-[11px] text-slate-550 max-w-xs">
                      A Google Meet invite and confirmation summary has been sent to <span className="text-white font-semibold">{bookingData.email}</span>.
                    </p>

                    <button 
                      onClick={() => {
                        setBookingStep(1);
                        setBookingData({ name: '', email: '', company: '', date: '', time: '', goals: [] });
                      }}
                      className="px-6 py-2.5 rounded-full border border-white/10 text-slate-300 hover:text-white text-xs font-semibold hover:bg-white/5 transition-colors duration-200"
                    >
                      Book Another Session
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

        {/* Global Toast Success banner overlay */}
        {bookingToast && (
          <div className="fixed bottom-6 right-6 z-[100] p-4 rounded-2xl bg-surface border border-emerald-500/20 shadow-2xl flex items-center space-x-3 text-sm text-white animate-slide-up">
            <ThumbsUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold">Booking Confirmed</p>
              <p className="text-xs text-slate-400">Calendar invitations dispatched successfully.</p>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-surface text-slate-400 border-t border-white/5 pt-20 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 border-b border-white/5 pb-12 mb-8">
          
          {/* Logo & description */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <a href="#" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                G
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                GrowthBoost<span className="text-accent">.</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              We engineer scalable client acquisition models for mid-market businesses. Replacing vanity agency metrics with unit economics and direct response profitability metrics.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400 font-semibold pt-1">
              <span className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-accent" />
                <span>Google Premier Partner 2026</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-accent" />
                <span>Clutch Verified Agency</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h4 className="font-heading font-bold text-[14px] uppercase tracking-wider text-accent">Capabilities</h4>
            <div className="flex flex-col space-y-2.5 text-[14px] text-slate-450">
              <a href="#services" className="hover:text-white transition-colors duration-200">Enterprise SEO Auditing</a>
              <a href="#services" className="hover:text-white transition-colors duration-200">Precision Google Ads / PPC</a>
              <a href="#services" className="hover:text-white transition-colors duration-200">Headless React Conversion Web Dev</a>
              <a href="#services" className="hover:text-white transition-colors duration-200">Social Content Placement Engines</a>
              <a href="#services" className="hover:text-white transition-colors duration-200">Cart Retention Lifecycle Marketing</a>
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h4 className="font-heading font-bold text-[14px] uppercase tracking-wider text-white">Company</h4>
            <div className="flex flex-col space-y-2.5 text-[14px] text-slate-450">
              <a href="#story" className="hover:text-white transition-colors duration-200">Our Story & Conviction</a>
              <a href="#workflow" className="hover:text-white transition-colors duration-200">5-Step Work Model</a>
              <a href="#cases" className="hover:text-white transition-colors duration-200">Featured Audits</a>
              <a href="#faqs" className="hover:text-white transition-colors duration-200">FAQ Hub</a>
              <a href="#book" className="hover:text-white transition-colors duration-200">Consultation</a>
            </div>
          </div>

          {/* Contact details */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            <h4 className="font-heading font-bold text-[14px] uppercase tracking-wider text-white">Contact</h4>
            <div className="flex flex-col space-y-2.5 text-[14px] text-slate-450">
              <span className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="mailto:growth@growthboost.digital" className="hover:text-white transition-colors duration-200">growth@growthboost.digital</a>
              </span>
              <span className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 flex-shrink-0 text-accent" />
                <a href="tel:+18005550199" className="hover:text-white transition-colors duration-200">1-800-555-0199</a>
              </span>
              <span className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-accent" />
                <span>San Francisco, CA</span>
              </span>
            </div>
          </div>

        </div>

        {/* copyright and legal */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 GrowthBoost Digital. All rights reserved. Registered LLC.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Attribution Directory</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Services config items
const services = [
  {
    icon: <Search className="w-6 h-6 text-accent" />,
    title: "Enterprise SEO",
    description: "Secure high-intent organic search real estate. We engineer rank models that target buyer keywords, driving long-term revenue growth with positive unit economics.",
    features: ["Content Authority Architecture", "Technical Core Web Vitals Audits", "High-Value Link Acquisition"]
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
    title: "Precision Paid Acquisition",
    description: "Scale high-performance ads on Google, Meta, and LinkedIn. Every dollar is tracked to customer lifetime value (LTV) and CAC efficiency optimization.",
    features: ["A/B Creative Split-Testing", "Predictive Audience Models", "Real-Time Bid Optimization"]
  },
  {
    icon: <Users className="w-6 h-6 text-cyan-400" />,
    title: "Social Media Strategy",
    description: "Turn organic social channels into brand building and direct response funnels. Premium asset creation combined with data-driven social distribution.",
    features: ["Viral Content Funnels", "Influencer Placement Management", "Community Growth Architecture"]
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-405" />,
    title: "High-Performance Dev",
    description: "Engineered web experiences built for lightning speed and conversion rate excellence. Custom headless CMS integrations designed to convert traffic.",
    features: ["React / Vite Web Architectures", "Headless CMS Integrations", "Conversion-Focused UX Design"]
  },
  {
    icon: <Mail className="w-6 h-6 text-emerald-400" />,
    title: "Retention & Lifecycle",
    description: "Maximize customer lifetime value with personalized email flow automation, SMS marketing, and churn prevention sequences that run on autopilot.",
    features: ["Automated Welcome & Cart Flows", "Hyper-Segmented Newsletters", "RFM Customer Analytics"]
  },
  {
    icon: <Target className="w-6 h-6 text-amber-400" />,
    title: "Content Marketing Engine",
    description: "Position your brand as an industry leader with editorial-grade white papers, case studies, and articles designed for search and social sharing.",
    features: ["Deep Industry Case Studies", "Thought Leadership Pieces", "SEO-Driven Resource Hubs"]
  }
];

// Steps list
const steps = [
  {
    number: "01",
    title: "Discovery Audit",
    description: "We deep-dive into your existing analytics, unit economics, conversion bottlenecks, and competitors to map out your high-impact opportunities."
  },
  {
    number: "02",
    title: "Growth Blueprint",
    description: "A tailored client acquisition plan specifying channel allocation, CAC targets, creative direction, and projected ROI modeling."
  },
  {
    number: "03",
    title: "Creative Deployment",
    description: "We design and deploy landing pages, ad assets, copywriting copy decks, and technical integrations without blocking your team."
  },
  {
    number: "04",
    title: "A/B Optimization",
    description: "Constant iteration on landing page variants, ad copy, bids, and email sequences to squeeze maximum conversion yield."
  },
  {
    number: "05",
    title: "Scale Expansion",
    description: "Scaling budgets, adding secondary marketing channels, and building content loops to solidify market dominance."
  }
];

// Case Studies
const caseStudies = {
  saas: {
    client: "CognitiveAI",
    title: "Scaling a B2B SaaS startup from $12K to $165K MRR via high-intent SEO funneling",
    industry: "B2B SaaS / Artificial Intelligence",
    metricBefore: "$12,400",
    metricAfter: "$165,200",
    metricLabel: "Monthly Recurring Revenue",
    roi: "8.4x ROAS",
    leads: "+420%",
    story: "CognitiveAI had a brilliant product but lacked organic search authority. We rebuilt their content hierarchy from the ground up, optimized core web vitals, and generated authoritative editorial assets targeting high-intent buyer keywords.",
    points: [
      "Identified and ranked 42 keywords with purchase-intent search volume.",
      "Built responsive, headless resource hub loading in under 0.6 seconds.",
      "Created an email lead capture sequence converting lead magnets at 14.8%."
    ]
  },
  ecom: {
    client: "Aura Home",
    title: "Scaling D2C E-commerce revenues to $310K/mo while securing a stable 4.2x ROAS",
    industry: "D2C Luxury Home Goods",
    metricBefore: "$38,000",
    metricAfter: "$312,000",
    metricLabel: "Monthly Digital Revenue",
    roi: "4.2x ROAS",
    leads: "+380%",
    story: "Aura Home suffered from rising Meta CAC and low cart values. We implemented hyper-targeted ad creative testing combined with a custom Shopify checkout optimization funnel to drastically bump both average order value and click-through-rates.",
    points: [
      "A/B tested over 250 video ad variants to find core value hooks.",
      "Introduced post-purchase upsells that increased AOV by 28%.",
      "Configured personalized email & SMS retargeting streams contributing 32% of total store revenue."
    ]
  },
  local: {
    client: "Apex Health Clinics",
    title: "Securing 3,100 high-value medical patients via localized Precision PPC campaigns",
    industry: "Multi-Location Healthcare Provider",
    metricBefore: "$85.00",
    metricAfter: "$21.50",
    metricLabel: "Cost Per Patient Inquiry",
    roi: "+294% Lead Volume",
    leads: "3.1K+",
    story: "Apex Health had a low-converting landing page and high cost-per-inquiry on Google Ads. We deployed geo-targeted search campaigns and high-trust landing pages complete with direct patient appointment slots and social reviews.",
    points: [
      "Designed local custom mobile-first landing pages loaded with reviews.",
      "Configured smart localized keyword bidding to eliminate waste search terms.",
      "Integrated custom automated SMS booking follow-ups within 2 minutes of signups."
    ]
  }
};

// Team members
const team = [
  {
    name: "David Vance",
    role: "Founder & Strategy Director",
    image: "/team_leader.png",
    bio: "Ex-SaaS CMO with 12+ years of performance scaling. Oversees Growth Blueprint planning."
  },
  {
    name: "Sarah Jenkins",
    role: "Creative Director",
    image: "/team_creative.png",
    bio: "Award-winning visual designer specializing in brand storytelling and luxury digital aesthetics."
  },
  {
    name: "Marcus Thorne",
    role: "Head of Growth & PPC",
    image: "/team_growth.png",
    bio: "Data analyst with $20M+ in optimized ad spend. Specializes in advanced unit economics and attribution."
  }
];

// Reviews
const testimonials = [
  {
    quote: "GrowthBoost Digital completely re-engineered our client acquisition model. In less than 6 months, our inbound demo pipeline is full, and our sales team is booking 30+ meetings a week.",
    author: "Robert Chen",
    role: "VP of Growth, SaaSify Inc",
    rating: 5,
    avatar: "RC"
  },
  {
    quote: "They understand the numbers. Unlike other agencies that talk about clicks and impressions, they talk about CAC, LTV, and direct ROAS. An essential scaling partner for our e-commerce business.",
    author: "Helena Rostova",
    role: "Founder, LuxeAura Cosmetics",
    rating: 5,
    avatar: "HR"
  },
  {
    quote: "The scheduler integration and localized landing page they built reduced our client booking friction by 40%. Our clinical leads have tripled while cost-per-lead went down by 65%. Highly professional team.",
    author: "Dr. James Mercer",
    role: "Chief Executive, Mercer Health Clinics",
    rating: 5,
    avatar: "JM"
  }
];

// FAQs
const faqs = [
  {
    q: "What makes GrowthBoost Digital different from standard marketing agencies?",
    a: "Most agencies focus on vanity metrics like impressions and clicks. We focus strictly on unit economics—CAC, LTV, conversion rates, and direct revenue. We act as your fractional growth architects, aligning our creative direction and technical developments to output actual revenue growth."
  },
  {
    q: "Do you require long-term contracts?",
    a: "We believe in earning your business month-over-month. We work on standard rolling 90-day agreements. If we don't deliver demonstrable value, you are free to walk away. Our 98% client retention rate is a result of this transparency."
  },
  {
    q: "How long does it take to see tangible results?",
    a: "Paid campaigns (PPC) and conversion rate optimizations generally yield measurable performance increases within the first 14-30 days of launch. SEO campaigns and content engines typically start showing compounding organic gains in 90-120 days."
  },
  {
    q: "What industries do you specialize in?",
    a: "We have built highly optimized growth funnels specifically tailored for B2B SaaS, Luxury E-Commerce, Healthcare networks, Real Estate groups, and premium Local Businesses looking to scale high-intent bookings."
  },
  {
    q: "How does the strategy consultation session work?",
    a: "It is simple and frictionless. You choose a preferred time slot directly on our page scheduler. You will instantly receive a custom Google Meet invitation. Prior to the call, our team audits your current digital presence to deliver 3 actionable growth recommendations during our call—completely free."
  }
];

const filteredFaqs = faqs.filter(faq => 
  faq.q.toLowerCase().includes('') || 
  faq.a.toLowerCase().includes('')
);
