import React, { useState, useEffect } from 'react';
import { 
  Layout as WindowIcon, 
  Shield, 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Lock,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { supabase, isConfigured } from './lib/supabase';
import { type User as SupabaseUser } from '@supabase/supabase-js';

// --- Types ---
interface WindowType {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

// --- Data ---
const WINDOW_TYPES: WindowType[] = [
  {
    id: 1,
    name: "Classic Sliding Windows",
    description: "Traditional windows that slide up and down easily. Great for any home and very easy to clean.",
    image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Side-Opening Windows",
    description: "Windows that open like a door. Perfect for letting in lots of fresh air and giving you a full view.",
    image: "https://scontent.fnag4-4.fna.fbcdn.net/v/t39.30808-6/472065939_611515781246772_5777624263143423571_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=f8deg9jdGxkQ7kNvwFnDC2U&_nc_oc=AdqFyAMuFYDjMoD2XMKZR7UlbXfwS1wY5CGRSXDN6bjlwDIxUZSkD5edCxLuKt2KEz4&_nc_zt=23&_nc_ht=scontent.fnag4-4.fna&_nc_gid=E9ZnoO91lBrNyyddCuaY9Q&_nc_ss=7a389&oh=00_Af1GMYt4jQs_AYz1nF75dW8QcaRIzIjHwIZ5T4q5xaVISw&oe=69D579ED"
  },
  {
    id: 3,
    name: "Modern Sliding Windows",
    description: "Simple windows that slide sideways. They save space and look great in modern houses.",
    image: "https://5.imimg.com/data5/SELLER/Default/2023/8/339271354/ZD/IH/AP/3062573/ef19b6c6-045a-4c03-ac4f-bcde3b4dac92-500x500.jpeg"
  },
  {
    id: 4,
    name: "UPVC Arch Windows",
    description: "Beautiful curved windows that add a touch of elegance and style to your home architecture.",
    image: "https://5.imimg.com/data5/SELLER/Default/2025/11/564061533/BA/CQ/TV/18404452/upvc-arch-windows-500x500.png"
  },
  {
    id: 5,
    name: "Premium Wooden Windows",
    description: "High-quality wooden frames that bring warmth and a classic look to your home's interior.",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/10/XG/XW/WK/13812832/teak-wood-window-500x500.jpg"
  },
  {
    id: 6,
    name: "Modern Residential Windows",
    description: "Sleek, large-pane windows designed for modern architecture and maximum natural light.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
  }
];

const STATIC_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Shivanand Malagi",
    rating: 5,
    comment: "Quality of windows are very good, service is also good and quick response from the team.",
    avatar: "https://ui-avatars.com/api/?name=Shivanand+Malagi&background=D4AF37&color=fff"
  },
  {
    id: 2,
    name: "Veerdhaval Upadhye",
    rating: 5,
    comment: "Good quality with reasonable prices & good service.",
    avatar: "https://ui-avatars.com/api/?name=Veerdhaval+Upadhye&background=D4AF37&color=fff"
  },
  {
    id: 3,
    name: "Bhagyesh Nadkarni",
    rating: 5,
    comment: "The team is really good, helpful and has good knowledge about their product. Good quality windows with timely installation.",
    avatar: "https://ui-avatars.com/api/?name=Bhagyesh+Nadkarni&background=D4AF37&color=fff"
  },
  {
    id: 4,
    name: "Parshu Birje",
    rating: 5,
    comment: "Beautiful and professional service & very supportive, quality of the product is also best and with competitive rates, as per our requirements. 👍😊",
    avatar: "https://ui-avatars.com/api/?name=Parshu+Birje&background=D4AF37&color=fff"
  },
  {
    id: 5,
    name: "Nitin Desai",
    rating: 5,
    comment: "Durable uPVC windows, Best Quality from Creative windows at best price and supportive staff. Thank you.",
    avatar: "https://ui-avatars.com/api/?name=Nitin+Desai&background=D4AF37&color=fff"
  },
  {
    id: 6,
    name: "Rajani Hunashyal",
    rating: 5,
    comment: "Very good quality and faster installation and perfect work. Cost is also reasonable..",
    avatar: "https://ui-avatars.com/api/?name=Rajani+Hunashyal&background=D4AF37&color=fff"
  },
  {
    id: 7,
    name: "Sanjana Macha",
    rating: 5,
    comment: "Their service is very good and efficient and all the materials used are top quality my windows and doors were done on time and with any hassle.",
    avatar: "https://ui-avatars.com/api/?name=Sanjana+Macha&background=D4AF37&color=fff"
  }
];

const FAQS: FAQ[] = [
  {
    id: 1,
    question: "How long does it take to install?",
    answer: "Most home window jobs are done in 1 or 2 days. It depends on how many windows you need."
  },
  {
    id: 2,
    question: "Do you have a guarantee?",
    answer: "Yes! We have a lifetime guarantee on our window frames and a 20-year guarantee on the glass."
  },
  {
    id: 3,
    question: "Will these windows save me money?",
    answer: "Yes. Our windows are built to keep heat in during winter and out during summer, which lowers your bills."
  },
  {
    id: 4,
    question: "Is the first visit free?",
    answer: "Yes, we come to your home and give you a price for free. No pressure to buy."
  }
];

// --- Components ---

const Navbar = ({ onLoginClick, user, onLogout }: { onLoginClick: () => void; user: SupabaseUser | null; onLogout: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Windows', href: '#windows' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Write Review', href: '#write-review' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-zinc-950/90 backdrop-blur-md border-b border-gold/20 shadow-lg" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gold p-2 rounded-lg">
            <WindowIcon className="text-zinc-950 w-6 h-6" />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight",
            "text-white"
          )}>
            The Windows Factory
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-gold",
                isScrolled ? "text-zinc-400" : "text-white/90"
              )}
            >
              {link.name}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-zinc-300 text-sm font-medium">{user.email}</span>
              <button 
                onClick={onLogout}
                className="bg-zinc-900 border border-gold/30 text-gold px-6 py-2 rounded-full text-sm font-bold hover:bg-gold hover:text-zinc-950 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-gold text-zinc-950 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gold-light transition-all shadow-lg shadow-gold/20 active:scale-95"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-zinc-900 border-t border-gold/20 p-6 shadow-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-zinc-400 font-medium hover:text-gold"
                >
                  {link.name}
                </a>
              ))}
              {user ? (
                <>
                  <div className="text-zinc-300 text-sm font-medium py-2 border-t border-zinc-800">{user.email}</div>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full bg-zinc-800 border border-gold/30 text-gold py-3 rounded-xl font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full bg-gold text-zinc-950 py-3 rounded-xl font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onClose();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-900 w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 border border-gold/20"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-gold transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <div className="bg-gold/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <WindowIcon className="text-gold w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-zinc-400 mt-2">Access your project and support</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-gold focus:ring-gold" />
              <span className="text-zinc-400">Remember me</span>
            </label>
            <a href="#" className="text-gold font-medium hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-zinc-950 py-3 rounded-xl font-semibold shadow-lg shadow-gold/20 hover:bg-gold-light transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Don't have an account? <button onClick={handleSignUp} className="text-gold font-semibold hover:underline">Sign up</button>
        </p>
      </motion.div>
    </div>
  );
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Start a New Project');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from('contact_submissions')
      .insert([
        { name, email, subject, message }
      ]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-gold w-10 h-10" />
        </div>
        <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
        <p className="text-zinc-400">We'll get back to you as soon as possible.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 text-gold font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Your Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe" 
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-300 ml-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com" 
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-300 ml-1">What do you need?</label>
        <select 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
        >
          <option>Start a New Project</option>
          <option>Fix My Windows</option>
          <option>General Question</option>
          <option>Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-300 ml-1">Message</label>
        <textarea 
          rows={4} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you today?" 
          required
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all resize-none"
        ></textarea>
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-gold text-zinc-950 py-4 rounded-xl font-bold shadow-lg shadow-gold/20 hover:bg-gold-light transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Now'}
      </button>
    </form>
  );
};

const WriteReviewSection = ({ onReviewAdded }: { onReviewAdded: () => void }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!isConfigured) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your AI Studio Secrets.');
      setLoading(false);
      return;
    }
    
    try {
      const { error: supabaseError } = await supabase.from('reviews').insert([{ name, rating, comment }]);
      if (supabaseError) throw supabaseError;
      setSubmitted(true);
      onReviewAdded();
    } catch (err: any) {
      console.error('Error saving review:', err);
      setError(err.message || 'Failed to save review. Please check your connection.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <section className="py-24 bg-zinc-950 border-y border-gold/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-gold/20 p-12 rounded-[3rem]"
          >
            <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-gold w-12 h-12" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Thank You for Your Feedback!</h3>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
              We've saved your review to our records. To help us even more, please post your review directly on Google Maps so others can see it!
            </p>
            <motion.a
              href="https://www.google.com/maps/search/?api=1&query=Creative+Windows+Belagavi"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gold text-zinc-950 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all"
            >
              <Star className="w-6 h-6 fill-current" />
              Post on Google Maps
            </motion.a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="write-review" className="py-24 bg-zinc-950 border-y border-gold/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionHeading 
            title="Share Your Experience" 
            subtitle="We value your feedback. Tell us how we did and help others choose the best windows for their home."
            centered
          />
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-gold/10 p-8 md:p-12 rounded-[3rem]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-2xl text-center">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center gap-4 mb-8">
              <p className="text-zinc-400 font-medium">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "w-10 h-10 transition-colors",
                        (hover || rating) >= star ? "text-gold fill-gold" : "text-zinc-700"
                      )} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 ml-1">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name" 
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 ml-1">Your Review</label>
                <textarea 
                  rows={1}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like about our service?" 
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 bg-gold text-zinc-950 rounded-full font-bold text-lg shadow-lg shadow-gold/20 hover:bg-gold-light transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <p className="text-zinc-500 text-sm mt-6">
                * Your review will be saved to our site and we'll help you post it to Google.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ title, subtitle, centered = false }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={cn("mb-12", centered && "text-center")}>
    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{subtitle}</p>}
    <div className={cn("h-1.5 w-20 bg-gold rounded-full mt-6", centered && "mx-auto")} />
  </div>
);

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>(STATIC_REVIEWS);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      if (data) {
        const dbReviews: Review[] = data.map((r: any) => ({
          id: `db-${r.id}` as any,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=D4AF37&color=fff`
        }));
        setReviews([...dbReviews, ...STATIC_REVIEWS]);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();

    // Listen for real-time changes
    const channel = supabase
      .channel('public:reviews')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, () => {
        fetchReviews();
      })
      .subscribe();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)} 
        user={user}
        onLogout={handleLogout}
      />
      <AnimatePresence>
        {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=2000" 
            alt="Aesthetic Window View" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-gold/20 backdrop-blur-md text-gold px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-6 border border-gold/30">
              Est. 2020 • Master Builders
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] font-display italic">
              Where Every Window <span className="text-gold">Tells a Different Story</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Custom windows made to look beautiful and keep your home comfortable. High quality, great prices, and expert help.
            </p>
            <div className="flex items-center justify-center">
              <button 
                onClick={() => document.getElementById('windows')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-gold text-zinc-950 px-10 py-4 rounded-full text-lg font-bold hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center gap-2 group animate-pulse hover:animate-none"
              >
                See Our Windows <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=600" 
                  alt="Classic Window" 
                  className="rounded-2xl shadow-lg border border-gold/10 w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600" 
                  alt="Modern Window" 
                  className="rounded-2xl shadow-lg border border-gold/10 w-full h-48 object-cover mt-8"
                  referrerPolicy="no-referrer"
                />
                <img 
                  src="https://images.unsplash.com/photo-1527359443443-84a48ace7e02?auto=format&fit=crop&q=80&w=600" 
                  alt="Luxury Window" 
                  className="rounded-2xl shadow-lg border border-gold/10 w-full h-48 object-cover col-span-2"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                <div className="text-zinc-950 text-center">
                  <div className="text-3xl font-bold mb-0.5">10+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest">Years Expertise</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading 
                title="Our Story" 
                subtitle="We have been building high-quality windows for over 10 years. We care about making things right and making them last."
              />
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center border border-gold/20">
                    <CheckCircle2 className="text-gold w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">High Quality</h4>
                    <p className="text-zinc-400">We test every window to make sure it is strong and keeps your home warm.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center border border-gold/20">
                    <CheckCircle2 className="text-gold w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Eco-Friendly</h4>
                    <p className="text-zinc-400">We use materials that are good for the planet and help you save on energy bills.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center border border-gold/20">
                    <CheckCircle2 className="text-gold w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Expert Help</h4>
                    <p className="text-zinc-400">Our team fits your windows perfectly so you don't have to worry about anything.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="What We Do" 
            subtitle="We handle everything from helping you choose the right windows to putting them in your home."
            centered
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <WindowIcon />, title: "Made for You", desc: "We build windows that fit your home perfectly and look exactly how you want." },
              { icon: <Wrench />, title: "Expert Fitting", desc: "Our team puts your windows in correctly so they last a long time and stay strong." },
              { icon: <Shield />, title: "Fixes & Care", desc: "We help you take care of your windows and fix any problems that might happen." },
              { icon: <Clock />, title: "Quick Swap", desc: "We can replace your old windows with new ones very fast with no mess left behind." },
              { icon: <MessageSquare />, title: "Free Advice", desc: "We help you choose the best windows for your house and your budget." },
              { icon: <Shield />, title: "Long Guarantee", desc: "We stand by our work and help you if anything goes wrong with your windows." }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-950 p-8 rounded-3xl shadow-lg hover:shadow-gold/10 transition-all group border border-gold/5"
              >
                <div className="bg-gold/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-zinc-950 transition-colors">
                  {React.cloneElement(service.icon as React.ReactElement, { className: "w-7 h-7" })}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                <p className="text-zinc-400 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Window Types Section */}
      <section id="windows" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Our Windows" 
            subtitle="Choose from our many styles. Each one is built to look great and work perfectly."
            centered
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {WINDOW_TYPES.map((window, idx) => (
              <motion.div
                key={window.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] border border-gold/10"
              >
                <img 
                  src={window.image} 
                  alt={window.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h4 className="text-2xl font-bold text-white mb-2">{window.name}</h4>
                  <p className="text-zinc-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    {window.description}
                  </p>
                  <button className="text-gold font-bold flex items-center gap-2 group/btn">
                    See Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Write Review Section */}
      <WriteReviewSection onReviewAdded={fetchReviews} />

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
          
          <SectionHeading 
            title="What People Say" 
            subtitle="Real experiences from our customers. We're proud to maintain a 5-star rating on Google Maps."
            centered
          />
          
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 relative z-10">
            {reviews.length > 0 ? reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-950/50 backdrop-blur-lg border border-gold/10 p-8 rounded-3xl"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-5 h-5", i < review.rating ? "text-gold fill-gold" : "text-white/10")} />
                  ))}
                </div>
                <p className="text-lg text-zinc-300 italic mb-8 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-gold" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold">{review.name}</h5>
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider">Google</span>
                    </div>
                    <p className="text-sm text-zinc-500">Verified Customer</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-zinc-500 italic">Real customer reviews are being added. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <motion.a
              href="https://www.google.com/maps/search/?api=1&query=Creative+Windows+Belagavi"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-950 border border-gold/20 rounded-full text-gold font-bold hover:bg-gold hover:text-zinc-950 transition-all shadow-lg"
            >
              <Star className="w-5 h-5 fill-current" />
              View All Google Reviews
            </motion.a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading 
            title="Common Questions" 
            subtitle="We want you to feel comfortable with your choice. Here are answers to things people often ask us."
            centered
          />
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.id} className="border border-gold/10 rounded-2xl overflow-hidden bg-zinc-900/50">
                <button 
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-900 transition-colors"
                >
                  <span className="font-bold text-white">{faq.question}</span>
                  <ChevronDown className={cn("w-5 h-5 text-gold transition-transform", activeFaq === faq.id && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {activeFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-gold/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Support / Contact Section */}
      <section id="contact" className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-950 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-black flex flex-col lg:flex-row gap-16 border border-gold/10">
            <div className="lg:w-1/2">
              <SectionHeading 
                title="Talk to Us" 
                subtitle="Have a question or want to start your project? We are ready to help you."
              />
              <div className="space-y-8 mt-12">
                <div className="flex items-start gap-6">
                  <div className="bg-gold/10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gold/20">
                    <MapPin className="text-gold w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Our Factory</h5>
                    <p className="text-zinc-400">Creative Windows, Shed NO. C\80 B, C\O. Micron Engineers, Angol Industrial Estate, Udyambag, Belagavi, Karnataka 590008</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-gold/10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gold/20">
                    <Phone className="text-gold w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Call Us</h5>
                    <p className="text-zinc-400">08050431007</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="bg-gold/10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gold/20">
                    <Mail className="text-gold w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-1">Email Us</h5>
                    <p className="text-zinc-400">info@creativewindows.com<br />support@creativewindows.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 bg-zinc-900 rounded-[2rem] p-8 md:p-12 border border-gold/5">
              <h4 className="text-2xl font-bold text-white mb-8">Send a Message</h4>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Location Button */}
      <motion.a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Creative Windows, Shed NO. C\\80 B, C\\O. Micron Engineers, Angol Industrial Estate, Udyambag, Belagavi, Karnataka 590008")}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 bg-gold text-zinc-950 p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all group"
        title="View on Google Maps"
      >
        <MapPin className="w-6 h-6" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gold/20 pointer-events-none">
          Find Us on Maps
        </span>
      </motion.a>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white pt-24 pb-12 border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-gold p-2 rounded-lg">
                  <WindowIcon className="text-zinc-950 w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">The Windows Factory</span>
              </div>
              <p className="text-zinc-500 leading-relaxed">
                The best windows for your home. We mix old-school care with new-school tools.
              </p>
              <div className="flex gap-4">
                {['fb', 'tw', 'ig', 'li'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-gold hover:text-zinc-950 transition-colors">
                    <span className="uppercase text-xs font-bold">{social}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-6">Links</h5>
              <ul className="space-y-4 text-zinc-500">
                <li><a href="#about" className="hover:text-gold transition-colors">Our Story</a></li>
                <li><a href="#services" className="hover:text-gold transition-colors">What We Do</a></li>
                <li><a href="#windows" className="hover:text-gold transition-colors">Our Windows</a></li>
                <li><a href="#reviews" className="hover:text-gold transition-colors">Stories</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Jobs</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-6">Help</h5>
              <ul className="space-y-4 text-zinc-500">
                <li><a href="#faq" className="hover:text-gold transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-gold transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Guarantee</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-6">Stay Updated</h5>
              <p className="text-zinc-500 mb-6">Get tips and special deals in your inbox.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold flex-grow" />
                <button className="bg-gold text-zinc-950 px-4 py-2 rounded-lg hover:bg-gold-light transition-colors font-bold">
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-900 text-center text-zinc-600 text-sm">
            <p>© {new Date().getFullYear()} The Windows Factory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
