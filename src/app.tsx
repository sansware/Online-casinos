import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Calculator, 
  Clock, 
  Lock, 
  Info,
  Menu,
  X,
  Moon,
  Sun,
  Star,
  ExternalLink,
  Percent,
  HelpCircle,
  FileText,
  UserX,
  Search,
  Award,
  LucideIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ==========================================
// TYPES
// ==========================================

type Theme = 'dark' | 'light';
type Variant = 'default' | 'verified' | 'exclusive' | 'warning' | 'rg';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Casino {
  id: number;
  name: string;
  logo: string;
  rating: number;
  licensed: boolean;
  licenseAuthority: string | null;
  bonus: string;
  wagering: number;
  minDeposit: number;
  rtp: number;
  withdrawalTime: string;
  paymentMethods: string[];
  exclusive: boolean;
  ev: number;
  pros: string[];
  cons: string[];
  rgTools: string[];
  featured: boolean;
  warning?: boolean;
  slug: string;
  url: string;
}

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  theme?: Theme;
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: Size;
  theme?: Theme;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  href?: string;
}

// ==========================================
// MOCK DATA
// ==========================================

const CASINOS: Casino[] = [
  {
    id: 1,
    name: "BetMGM UK",
    logo: "BM",
    rating: 4.8,
    licensed: true,
    licenseAuthority: "UKGC",
    bonus: "100% up to £200 + 100 Free Spins",
    wagering: 35,
    minDeposit: 10,
    rtp: 96.4,
    withdrawalTime: "24-48 hours",
    paymentMethods: ["Visa", "Mastercard", "PayPal", "Bank Transfer"],
    exclusive: true,
    ev: 45.20,
    pros: ["Fast withdrawals", "High RTP slots", "Live dealer 24/7"],
    cons: ["High wagering on bonuses", "Limited table games"],
    rgTools: ["Deposit limits", "Time-outs", "Self-exclusion"],
    featured: true,
    slug: "betmgm-uk",
    url: "https://www.betmgm.com"
  },
  {
    id: 2,
    name: "888 Casino",
    logo: "888",
    rating: 4.6,
    licensed: true,
    licenseAuthority: "UKGC",
    bonus: "£88 No Deposit + 100% up to £100",
    wagering: 30,
    minDeposit: 20,
    rtp: 95.8,
    withdrawalTime: "2-5 days",
    paymentMethods: ["Visa", "Mastercard", "Apple Pay", "Neteller"],
    exclusive: false,
    ev: 38.50,
    pros: ["No deposit bonus", "Established brand", "Mobile app"],
    cons: ["Slow withdrawals", "Complex bonus terms"],
    rgTools: ["Reality checks", "Account cool-off", "GamStop integrated"],
    featured: false,
    slug: "888-casino",
    url: "https://www.888casino.com"
  },
  {
    id: 3,
    name: "LeoVegas",
    logo: "LV",
    rating: 4.7,
    licensed: true,
    licenseAuthority: "UKGC",
    bonus: "Up to £400 + 100 Spins across 4 deposits",
    wagering: 25,
    minDeposit: 10,
    rtp: 96.1,
    withdrawalTime: "Instant-24h",
    paymentMethods: ["Visa", "PayPal", "Trustly", "Paysafecard"],
    exclusive: true,
    ev: 52.80,
    pros: ["Mobile-first", "Fast payouts", "Award-winning app"],
    cons: ["High minimum for some bonuses", "Geographic restrictions"],
    rgTools: ["Session limits", "Loss limits", "Self-assessment test"],
    featured: true,
    slug: "leovegas",
    url: "https://www.leovegas.com"
  },
  {
    id: 4,
    name: "Unregulated Operator",
    logo: "UO",
    rating: 2.1,
    licensed: false,
    licenseAuthority: null,
    bonus: "500% up to £5000",
    wagering: 80,
    minDeposit: 50,
    rtp: 92.3,
    withdrawalTime: "Unknown",
    paymentMethods: ["Crypto only"],
    exclusive: false,
    ev: -125.00,
    pros: ["High bonus amount"],
    cons: ["NO UK LICENSE", "Extremely high wagering", "No player protection"],
    rgTools: [],
    featured: false,
    warning: true,
    slug: "unregulated",
    url: "#"
  }
];

const RTP_DATA = [
  { game: "Starburst", provider: "NetEnt", rtp: 96.1, volatility: "Low" },
  { game: "Book of Dead", provider: "Play'n GO", rtp: 96.21, volatility: "High" },
  { game: "Big Bass Bonanza", provider: "Pragmatic", rtp: 96.71, volatility: "Medium" },
  { game: "Gonzo's Quest", provider: "NetEnt", rtp: 96.0, volatility: "Medium" },
  { game: "Wolf Gold", provider: "Pragmatic", rtp: 96.01, volatility: "Medium" },
  { game: "Rainbow Riches", provider: "Barcrest", rtp: 95.0, volatility: "Low" },
];

const REVENUE_DATA = [
  { month: 'M1', traffic: 5000, ftDs: 10, revenue: 800 },
  { month: 'M3', traffic: 15000, ftDs: 30, revenue: 2400 },
  { month: 'M6', traffic: 35000, ftDs: 70, revenue: 5600 },
  { month: 'M9', traffic: 75000, ftDs: 150, revenue: 12000 },
  { month: 'M12', traffic: 150000, ftDs: 300, revenue: 24000 },
  { month: 'M18', traffic: 300000, ftDs: 600, revenue: 48000 },
];

// ==========================================
// UTILITY COMPONENTS
// ==========================================

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', theme = 'dark', className = '' }) => {
  const variants: Record<Variant, string> = {
    default: theme === 'dark' 
      ? 'bg-[#1E1E24] text-[#A0A0B0] border-[#2A2A32]' 
      : 'bg-[#F1F3F4] text-[#475569] border-[#E8EAED]',
    verified: theme === 'dark'
      ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/30'
      : 'bg-[#008F73]/10 text-[#008F73] border-[#008F73]/30',
    exclusive: theme === 'dark'
      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]'
      : 'bg-[#B8941F]/20 text-[#B8941F] border-[#B8941F]',
    warning: theme === 'dark'
      ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30'
      : 'bg-[#D64545]/10 text-[#D64545] border-[#D64545]/30',
    rg: theme === 'dark'
      ? 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/30'
      : 'bg-[#E68600]/10 text-[#E68600] border-[#E68600]/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  theme = 'dark',
  onClick, 
  className = '',
  disabled = false,
  icon: Icon,
  href
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: theme === 'dark'
      ? "bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A0A0F] hover:shadow-lg hover:shadow-[#D4AF37]/20 focus:ring-[#D4AF37]/50"
      : "bg-gradient-to-r from-[#B8941F] to-[#A6831A] text-white hover:shadow-lg hover:shadow-[#B8941F]/20 focus:ring-[#B8941F]/50",
    secondary: theme === 'dark'
      ? "bg-transparent border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2]/10 focus:ring-[#4A90E2]/50"
      : "bg-transparent border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 focus:ring-[#2563EB]/50",
    ghost: theme === 'dark'
      ? "bg-transparent text-[#A0A0B0] hover:text-white hover:bg-[#1E1E24] focus:ring-[#A0A0B0]/50"
      : "bg-transparent text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F3F4] focus:ring-[#475569]/50",
    danger: theme === 'dark'
      ? "bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF6B6B] hover:bg-[#FF6B6B]/20"
      : "bg-[#D64545]/10 border border-[#D64545]/30 text-[#D64545] hover:bg-[#D64545]/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  if (href) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {children}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

// ==========================================
// MAIN COMPONENTS
// ==========================================

interface EVCalculatorProps {
  theme: Theme;
}

const EVCalculator: React.FC<EVCalculatorProps> = ({ theme }) => {
  const [bonus, setBonus] = useState<number>(100);
  const [wagering, setWagering] = useState<number>(35);
  const [rtp, setRtp] = useState<number>(96);
  const [houseEdge, setHouseEdge] = useState<number>(4);

  useEffect(() => {
    setHouseEdge(100 - rtp);
  }, [rtp]);

  const ev = useMemo(() => {
    const wageringRequirement = bonus * wagering;
    const expectedLoss = wageringRequirement * (houseEdge / 100);
    return bonus - expectedLoss;
  }, [bonus, wagering, houseEdge]);

  const isPositive = ev > 0;

  return (
    <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
      <div className="flex items-center mb-6">
        <Calculator className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-[#D4AF37]' : 'text-[#B8941F]'}`} />
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
          Bonus EV Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
            Bonus Amount (£)
          </label>
          <input
            type="number"
            value={bonus}
            onChange={(e) => setBonus(Number(e.target.value))}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
              theme === 'dark' 
                ? 'bg-[#0A0A0F] border-[#2A2A32] text-white focus:border-[#4A90E2] focus:ring-[#4A90E2]/20' 
                : 'bg-white border-[#E8EAED] text-[#0F172A] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
            Wagering Requirement (x)
          </label>
          <input
            type="number"
            value={wagering}
            onChange={(e) => setWagering(Number(e.target.value))}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
              theme === 'dark' 
                ? 'bg-[#0A0A0F] border-[#2A2A32] text-white focus:border-[#4A90E2] focus:ring-[#4A90E2]/20' 
                : 'bg-white border-[#E8EAED] text-[#0F172A] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
            Game RTP (%)
          </label>
          <input
            type="number"
            value={rtp}
            onChange={(e) => setRtp(Number(e.target.value))}
            max={99}
            min={85}
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
              theme === 'dark' 
                ? 'bg-[#0A0A0F] border-[#2A2A32] text-white focus:border-[#4A90E2] focus:ring-[#4A90E2]/20' 
                : 'bg-white border-[#E8EAED] text-[#0F172A] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
            }`}
          />
        </div>
      </div>

      <div className={`p-4 rounded-lg border-2 ${isPositive 
        ? (theme === 'dark' ? 'border-[#00D4AA]/30 bg-[#00D4AA]/5' : 'border-[#008F73]/30 bg-[#008F73]/5')
        : (theme === 'dark' ? 'border-[#FF6B6B]/30 bg-[#FF6B6B]/5' : 'border-[#D64545]/30 bg-[#D64545]/5')
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              Expected Value (EV)
            </p>
            <p className={`text-3xl font-bold ${isPositive 
              ? (theme === 'dark' ? 'text-[#00D4AA]' : 'text-[#008F73]')
              : (theme === 'dark' ? 'text-[#FF6B6B]' : 'text-[#D64545]')
            }`}>
              £{ev.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-sm ${theme === 'dark' ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>
              House Edge: {houseEdge}%
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>
              Total Wager: £{(bonus * wagering).toLocaleString()}
            </p>
          </div>
        </div>
        <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
          {isPositive 
            ? "✓ Positive EV: This bonus offers mathematical advantage if played optimally on high-RTP games."
            : "⚠ Negative EV: You are expected to lose money on average. Consider lower wagering or higher RTP games."}
        </p>
      </div>
    </div>
  );
};

interface CasinoCardProps {
  casino: Casino;
  theme: Theme;
  onSelect: (casino: Casino) => void;
}

const CasinoCard: React.FC<CasinoCardProps> = ({ casino, theme, onSelect }) => {
  const isDark = theme === 'dark';
  
  return (
    <article className={`relative group rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
      isDark 
        ? 'bg-[#141419] border-[#2A2A32] hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10' 
        : 'bg-white border-[#E8EAED] hover:border-[#B8941F] hover:shadow-lg hover:shadow-[#B8941F]/10'
    } ${casino.warning ? 'border-2 border-[#FF6B6B]' : ''}`}>
      
      {casino.warning && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-[#FF6B6B] text-white text-xs font-bold rounded-full flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          UNLICENSED - AVOID
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg mr-4 ${
              isDark ? 'bg-[#1E1E24] text-[#D4AF37]' : 'bg-[#F1F3F4] text-[#B8941F]'
            }`}>
              {casino.logo}
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                {casino.name}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className={`ml-1 text-sm font-medium ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
                    {casino.rating}
                  </span>
                </div>
                {casino.licensed ? (
                  <Badge variant="verified" theme={theme}>UKGC Licensed</Badge>
                ) : (
                  <Badge variant="warning" theme={theme}>No License</Badge>
                )}
                {casino.exclusive && <Badge variant="exclusive" theme={theme}>Exclusive</Badge>}
              </div>
            </div>
          </div>
          <div className={`text-right ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`}>
            <p className="text-2xl font-bold">£{casino.ev.toFixed(0)}</p>
            <p className="text-xs">Est. Value</p>
          </div>
        </div>

        <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F8F9FA]'}`}>
          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8941F]'}`}>
            {casino.bonus}
          </p>
          <div className="flex items-center text-xs space-x-4">
            <span className={isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}>
              Wagering: {casino.wagering}x
            </span>
            <span className={isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}>
              Min Deposit: £{casino.minDeposit}
            </span>
            <span className={isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}>
              RTP: {casino.rtp}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`text-xs ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
            <span className="block font-medium mb-1">Pros:</span>
            {casino.pros.slice(0, 2).join(", ")}
          </div>
          <div className={`text-xs ${isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>
            <span className="block font-medium mb-1">Cons:</span>
            {casino.cons.slice(0, 2).join(", ")}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`} />
            <span className={`text-xs ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              {casino.withdrawalTime}
            </span>
          </div>
          <div className="flex space-x-1">
            {casino.paymentMethods.slice(0, 3).map((method, i) => (
              <span key={i} className={`text-[10px] px-2 py-1 rounded ${
                isDark ? 'bg-[#1E1E24] text-[#A0A0B0]' : 'bg-[#F1F3F4] text-[#475569]'
              }`}>
                {method}
              </span>
            ))}
          </div>
        </div>

        {casino.rgTools.length > 0 && (
          <div className={`flex items-center mb-4 p-2 rounded ${
            isDark ? 'bg-[#FF9500]/5 border border-[#FF9500]/20' : 'bg-[#E68600]/5 border border-[#E68600]/20'
          }`}>
            <Shield className={`w-4 h-4 mr-2 ${isDark ? 'text-[#FF9500]' : 'text-[#E68600]'}`} />
            <span className={`text-xs ${isDark ? 'text-[#FF9500]' : 'text-[#E68600]'}`}>
              RG Tools: {casino.rgTools.join(", ")}
            </span>
          </div>
        )}

        <Button 
          variant={casino.warning ? 'danger' : 'primary'} 
          size="lg" 
          theme={theme}
          className="w-full"
          onClick={() => !casino.warning && onSelect(casino)}
          icon={casino.warning ? AlertTriangle : ExternalLink}
          href={casino.warning ? undefined : casino.url}
        >
          {casino.warning ? 'Avoid - Not Licensed' : 'Claim Bonus'}
        </Button>

        <p className={`mt-3 text-[10px] text-center ${isDark ? 'text-[#4A4A5A]' : 'text-[#94A3B8]'}`}>
          18+ | New players only | Min deposit £{casino.minDeposit} | T&Cs apply | BeGambleAware.org
        </p>
      </div>
    </article>
  );
};

interface RGModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

const RGModal: React.FC<RGModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`max-w-md w-full rounded-2xl border-2 p-6 ${
        isDark 
          ? 'bg-[#141419] border-[#FF9500] shadow-2xl shadow-[#FF9500]/20' 
          : 'bg-white border-[#E68600] shadow-2xl shadow-[#E68600]/20'
      }`}>
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full mr-4 ${isDark ? 'bg-[#FF9500]/20' : 'bg-[#E68600]/20'}`}>
            <UserX className={`w-8 h-8 ${isDark ? 'text-[#FF9500]' : 'text-[#E68600]'}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Responsible Gambling Check
            </h3>
            <p className={`text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              Before you continue...
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#F8F9FA]'}`}>
          <ul className={`space-y-3 text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
            <li className="flex items-start">
              <CheckCircle className={`w-5 h-5 mr-2 mt-0.5 ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`} />
              Have you set a deposit limit for today?
            </li>
            <li className="flex items-start">
              <CheckCircle className={`w-5 h-5 mr-2 mt-0.5 ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`} />
              Are you gambling with money you can afford to lose?
            </li>
            <li className="flex items-start">
              <CheckCircle className={`w-5 h-5 mr-2 mt-0.5 ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`} />
              Have you taken a break in the last hour?
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" theme={theme} className="w-full" onClick={onClose}>
            I Understand - Continue to Casino
          </Button>
          <Button variant="ghost" size="md" theme={theme} className="w-full" href="https://www.begambleaware.org">
            <HelpCircle className="w-4 h-4 mr-2" />
            Get Help - Visit BeGambleAware
          </Button>
        </div>

        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#2A2A32]' : 'border-[#E8EAED]'}`}>
          <p className={`text-xs text-center ${isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>
            If you feel you have a gambling problem, contact GamStop: 0800 802 0133
          </p>
        </div>
      </div>
    </div>
  );
};

interface NavigationProps {
  theme: Theme;
  toggleTheme: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ theme, toggleTheme, activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'casinos', label: 'Top Casinos', icon: Star },
    { id: 'calculator', label: 'EV Calculator', icon: Calculator },
    { id: 'rtp', label: 'RTP Database', icon: Percent },
    { id: 'compliance', label: 'Compliance', icon: Shield },
  ];

  return (
    <nav className={`sticky top-0 z-40 border-b backdrop-blur-md ${
      isDark 
        ? 'bg-[#0A0A0F]/90 border-[#2A2A32]' 
        : 'bg-white/90 border-[#E8EAED]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl mr-3 ${
              isDark ? 'bg-[#D4AF37] text-[#0A0A0F]' : 'bg-[#B8941F] text-white'
            }`}>
              OBC
            </div>
            <div>
              <h1 className={`font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                OnlineBestCasinos
              </h1>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-[#6B6B7B]' : 'text-[#94A3B8]'}`}>
                .co.uk • UKGC Verified
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  activeSection === item.id
                    ? (isDark ? 'bg-[#1E1E24] text-[#D4AF37]' : 'bg-[#F1F3F4] text-[#B8941F]')
                    : (isDark ? 'text-[#A0A0B0] hover:text-white hover:bg-[#1E1E24]' : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F3F4]')
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-[#1E1E24] text-[#A0A0B0]' : 'hover:bg-[#F1F3F4] text-[#475569]'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden border-t ${isDark ? 'border-[#2A2A32] bg-[#0A0A0F]' : 'border-[#E8EAED] bg-white'}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-left text-sm font-medium flex items-center ${
                  activeSection === item.id
                    ? (isDark ? 'bg-[#1E1E24] text-[#D4AF37]' : 'bg-[#F1F3F4] text-[#B8941F]')
                    : (isDark ? 'text-[#A0A0B0]' : 'text-[#475569]')
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

interface HeroProps {
  theme: Theme;
  setActiveSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ theme, setActiveSection }) => {
  const isDark = theme === 'dark';
  
  return (
    <section className={`relative overflow-hidden ${isDark ? 'bg-[#0A0A0F]' : 'bg-white'}`}>
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isDark 
            ? 'from-[#D4AF37]/20 via-transparent to-[#4A90E2]/10' 
            : 'from-[#B8941F]/10 via-transparent to-[#2563EB]/5'
        }`} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="exclusive" theme={theme} className="mb-6">
            <Award className="w-3 h-3 mr-1" />
            UKGC Verified Reviews
          </Badge>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${
            isDark ? 'text-white' : 'text-[#0F172A]'
          }`}>
            The <span className={isDark ? 'text-[#D4AF37]' : 'text-[#B8941F]'}>Bloomberg</span> of<br />
            iGaming Intelligence
          </h1>
          
          <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
            isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'
          }`}>
            Every recommendation verified. Every bonus quantified. Every operator regulated.
            Real-time RTP tracking + EV calculations for informed decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="xl" 
              theme={theme}
              onClick={() => setActiveSection('casinos')}
              icon={Search}
            >
              Find Best Casinos
            </Button>
            <Button 
              variant="secondary" 
              size="xl" 
              theme={theme}
              onClick={() => setActiveSection('calculator')}
              icon={Calculator}
            >
              Calculate Bonus EV
            </Button>
          </div>

          <div className={`mt-8 flex items-center justify-center space-x-6 text-sm ${
            isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'
          }`}>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-[#00D4AA]" />
              UKGC Licensed Only
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-[#00D4AA]" />
              256-bit SSL
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-[#00D4AA]" />
              Independent Audits
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface CasinosSectionProps {
  theme: Theme;
  onSelectCasino: (casino: Casino) => void;
}

const CasinosSection: React.FC<CasinosSectionProps> = ({ theme, onSelectCasino }) => {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('all');
  
  const filteredCasinos = CASINOS.filter(c => {
    if (filter === 'licensed') return c.licensed;
    if (filter === 'exclusive') return c.exclusive;
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            Top Verified Casinos
          </h2>
          <p className={isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}>
            All operators verified for UKGC licensing and fair RTP
          </p>
        </div>
        
        <div className="flex space-x-2">
          {['all', 'licensed', 'exclusive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? (isDark ? 'bg-[#D4AF37] text-[#0A0A0F]' : 'bg-[#B8941F] text-white')
                  : (isDark ? 'bg-[#1E1E24] text-[#A0A0B0] hover:bg-[#2A2A32]' : 'bg-[#F1F3F4] text-[#475569] hover:bg-[#E8EAED]')
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCasinos.map((casino) => (
          <CasinoCard 
            key={casino.id} 
            casino={casino} 
            theme={theme} 
            onSelect={onSelectCasino}
          />
        ))}
      </div>

      <div className={`mt-12 p-6 rounded-xl border ${isDark ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
        <div className="flex items-start">
          <Info className={`w-6 h-6 mr-4 mt-1 ${isDark ? 'text-[#4A90E2]' : 'text-[#2563EB]'}`} />
          <div>
            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              How We Calculate Expected Value (EV)
            </h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              Our EV calculations assume optimal play on high-RTP slots (96%+) with full bonus utilization. 
              Actual results may vary based on game selection and volatility. We deduct house edge from 
              total wagering requirement to determine mathematical edge. Negative EV bonuses are flagged 
              to protect players from unfavorable terms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

interface RTPSectionProps {
  theme: Theme;
}

const RTPSection: React.FC<RTPSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [sortBy, setSortBy] = useState('rtp');

  const sortedData = [...RTP_DATA].sort((a, b) => {
    if (sortBy === 'rtp') return b.rtp - a.rtp;
    if (sortBy === 'volatility') return a.volatility.localeCompare(b.volatility);
    return a.game.localeCompare(b.game);
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Live RTP Database
        </h2>
        <p className={isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}>
          Verified Return-to-Player percentages from independent testing agencies
        </p>
      </div>

      <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-[#2A2A32]' : 'border-[#E8EAED]'}`}>
        <div className={`grid grid-cols-12 gap-4 p-4 text-xs font-semibold uppercase tracking-wider ${
          isDark ? 'bg-[#1E1E24] text-[#A0A0B0]' : 'bg-[#F1F3F4] text-[#475569]'
        }`}>
          <div className="col-span-4 cursor-pointer hover:text-[#D4AF37]" onClick={() => setSortBy('game')}>Game</div>
          <div className="col-span-3 cursor-pointer hover:text-[#D4AF37]" onClick={() => setSortBy('provider')}>Provider</div>
          <div className="col-span-2 cursor-pointer hover:text-[#D4AF37]" onClick={() => setSortBy('rtp')}>RTP %</div>
          <div className="col-span-2 cursor-pointer hover:text-[#D4AF37]" onClick={() => setSortBy('volatility')}>Volatility</div>
          <div className="col-span-1"></div>
        </div>

        {sortedData.map((game, idx) => (
          <div 
            key={game.game}
            className={`grid grid-cols-12 gap-4 p-4 items-center border-t transition-colors ${
              isDark 
                ? 'border-[#2A2A32] hover:bg-[#1E1E24]' 
                : 'border-[#E8EAED] hover:bg-[#F8F9FA]'
            } ${idx % 2 === 0 ? (isDark ? 'bg-[#141419]' : 'bg-white') : (isDark ? 'bg-[#0A0A0F]' : 'bg-[#F8F9FA]')}`}
          >
            <div className="col-span-4 font-medium text-base">
              <span className={isDark ? 'text-white' : 'text-[#0F172A]'}>{game.game}</span>
            </div>
            <div className={`col-span-3 text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              {game.provider}
            </div>
            <div className="col-span-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold ${
                game.rtp >= 96 
                  ? (isDark ? 'bg-[#00D4AA]/10 text-[#00D4AA]' : 'bg-[#008F73]/10 text-[#008F73]')
                  : (isDark ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' : 'bg-[#D64545]/10 text-[#D64545]')
              }`}>
                {game.rtp}%
              </span>
            </div>
            <div className={`col-span-2 text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              {game.volatility}
            </div>
            <div className="col-span-1 text-right">
              <button className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-[#2A2A32] text-[#6B6B7B]' : 'hover:bg-[#E8EAED] text-[#64748B]'
              }`}>
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-6 p-4 rounded-lg border-l-4 ${isDark ? 'bg-[#141419] border-[#D4AF37]' : 'bg-[#F8F9FA] border-[#B8941F]'}`}>
        <p className={`text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
          <strong className={isDark ? 'text-[#D4AF37]' : 'text-[#B8941F]'}>Pro Tip:</strong> High RTP doesn&apos;t guarantee short-term wins. 
          Volatility determines win frequency. Low volatility = frequent small wins. High volatility = rare large wins.
          Match volatility to your bankroll and session length.
        </p>
      </div>
    </section>
  );
};

interface ComplianceSectionProps {
  theme: Theme;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            Regulatory Compliance
          </h2>
          
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
              <div className="flex items-center mb-4">
                <Shield className={`w-6 h-6 mr-3 ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`} />
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  UKGC License Verification
                </h3>
              </div>
              <p className={`text-sm mb-4 ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
                Every operator listed undergoes real-time UK Gambling Commission license verification. 
                We check license status, compliance history, and disciplinary records daily.
              </p>
              <div className="flex items-center text-sm">
                <CheckCircle className={`w-4 h-4 mr-2 ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`} />
                <span className={isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}>All current listings verified active</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
              <div className="flex items-center mb-4">
                <UserX className={`w-6 h-6 mr-3 ${isDark ? 'text-[#FF9500]' : 'text-[#E68600]'}`} />
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Responsible Gambling Integration
                </h3>
              </div>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Mandatory GamStop links on all pages
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Deposit limit tools embedded in reviews
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Reality check reminders for session time
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  Self-exclusion pathway integration
                </li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
              <div className="flex items-center mb-4">
                <FileText className={`w-6 h-6 mr-3 ${isDark ? 'text-[#4A90E2]' : 'text-[#2563EB]'}`} />
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Affiliate Disclosure
                </h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
                OnlineBestCasinos.co.uk receives commission from operators for referred players. 
                This does not influence our ratings or reviews. EV calculations are independent 
                of commercial relationships. All advertising is clearly labeled per UKGC and 
                CAP Code requirements.
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
          <h3 className={`font-bold text-xl mb-6 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            Revenue Projection Model
          </h3>
          <div className="h-80 mb-6 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2A2A32' : '#E8EAED'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#6B6B7B' : '#64748B'} 
                  tick={{ fill: isDark ? '#6B6B7B' : '#64748B' }}
                />
                <YAxis 
                  stroke={isDark ? '#6B6B7B' : '#64748B'} 
                  tick={{ fill: isDark ? '#6B6B7B' : '#64748B' }}
                  tickFormatter={(value) => `£${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1E1E24' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#2A2A32' : '#E8EAED'}`,
                    borderRadius: '8px',
                    color: isDark ? '#FFFFFF' : '#0F172A'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={isDark ? '#D4AF37' : '#B8941F'} 
                  strokeWidth={3}
                  dot={{ fill: isDark ? '#D4AF37' : '#B8941F', strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: isDark ? '#0A0A0F' : '#FFFFFF', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-[#0A0A0F]' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-[#D4AF37]' : 'text-[#B8941F]'}`}>£108k</p>
              <p className={`text-xs ${isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>Month 24 Revenue</p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-[#0A0A0F]' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-[#00D4AA]' : 'text-[#008F73]'}`}>300k</p>
              <p className={`text-xs ${isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>Monthly Sessions</p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-[#0A0A0F]' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-[#4A90E2]' : 'text-[#2563EB]'}`}>2.5%</p>
              <p className={`text-xs ${isDark ? 'text-[#6B6B7B]' : 'text-[#64748B]'}`}>Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FooterProps {
  theme: Theme;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t mt-20 ${isDark ? 'bg-[#0A0A0F] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-2 ${
                isDark ? 'bg-[#D4AF37] text-[#0A0A0F]' : 'bg-[#B8941F] text-white'
              }`}>
                OBC
              </div>
              <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                OnlineBestCasinos.co.uk
              </span>
            </div>
            <p className={`text-sm mb-4 max-w-md ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              Independent casino intelligence platform. We verify, calculate, and regulate 
              so you can play informed. All operators are UKGC licensed and independently audited.
            </p>
            <div className="flex space-x-4">
              <span className={`text-xs px-3 py-1 rounded-full border ${
                isDark ? 'border-[#2A2A32] text-[#6B6B7B]' : 'border-[#E8EAED] text-[#64748B]'
              }`}>
                18+ Only
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border ${
                isDark ? 'border-[#2A2A32] text-[#6B6B7B]' : 'border-[#E8EAED] text-[#64748B]'
              }`}>
                BeGambleAware.org
              </span>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Tools</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              <li><a href="#calculator" className="hover:underline">EV Calculator</a></li>
              <li><a href="#rtp" className="hover:underline">RTP Database</a></li>
              <li>Bonus Comparison</li>
              <li>Regulatory Status</li>
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Compliance</h4>
            <ul className={`space-y-2 text-sm ${isDark ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              <li>UKGC Verification</li>
              <li>Responsible Gambling</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t text-center text-xs ${isDark ? 'border-[#2A2A32] text-[#4A4A5A]' : 'border-[#E8EAED] text-[#94A3B8]'}`}>
          <p className="mb-2">
            18+ | GambleAware | GamStop | Gambling Therapy | Please gamble responsibly.
          </p>
          <p>
            © 2025 OnlineBestCasinos.co.uk. All rights reserved. Operated by [Company Name] Ltd, 
            registered in England & Wales. Affiliate of UKGC licensed operators only.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeSection, setActiveSection] = useState<string>('casinos');
  const [selectedCasino, setSelectedCasino] = useState<Casino | null>(null);
  const [showRGModal, setShowRGModal] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleCasinoSelect = (casino: Casino) => {
    if (casino.warning) return;
    setSelectedCasino(casino);
    setShowRGModal(true);
  };

  if (!mounted) return null;

  const bgColor = theme === 'dark' ? '#0A0A0F' : '#FFFFFF';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navigation 
        theme={theme} 
        toggleTheme={toggleTheme}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main>
        {activeSection === 'casinos' && (
          <>
            <Hero theme={theme} setActiveSection={setActiveSection} />
            <CasinosSection theme={theme} onSelectCasino={handleCasinoSelect} />
          </>
        )}

        {activeSection === 'calculator' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <EVCalculator theme={theme} />
            <div className={`mt-8 p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#141419] border-[#2A2A32]' : 'bg-[#F8F9FA] border-[#E8EAED]'}`}>
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                How to Use This Calculator
              </h3>
              <ol className={`list-decimal list-inside space-y-2 text-sm ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
                <li>Enter the bonus amount offered by the casino</li>
                <li>Input the wagering requirement multiplier (e.g., 35x)</li>
                <li>Set the RTP of the game you plan to play (default 96%)</li>
                <li>Review the EV - positive means mathematical edge, negative means expected loss</li>
                <li>Consider volatility and session length in your decision</li>
              </ol>
            </div>
          </div>
        )}

        {activeSection === 'rtp' && <RTPSection theme={theme} />}
        {activeSection === 'compliance' && <ComplianceSection theme={theme} />}
      </main>

      <Footer theme={theme} />

      <RGModal 
        isOpen={showRGModal} 
        onClose={() => setShowRGModal(false)} 
        theme={theme} 
      />

      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t z-30 ${
        theme === 'dark' 
          ? 'bg-[#141419] border-[#2A2A32]' 
          : 'bg-white border-[#E8EAED]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <span className={`text-2xl mr-3 ${theme === 'dark' ? 'text-[#FF9500]' : 'text-[#E68600]'}`}>18+</span>
            <p className={`text-sm ${theme === 'dark' ? 'text-[#A0A0B0]' : 'text-[#475569]'}`}>
              This website contains gambling content. You must be 18+ to continue.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className={`hover:underline ${theme === 'dark' ? 'text-[#4A90E2]' : 'text-[#2563EB]'}`}>
              BeGambleAware
            </a>
            <a href="https://www.gamstop.co.uk" target="_blank" rel="noopener noreferrer" className={`hover:underline ${theme === 'dark' ? 'text-[#4A90E2]' : 'text-[#2563EB]'}`}>
              GamStop
            </a>
            <span className={theme === 'dark' ? 'text-[#6B6B7B]' : 'text-[#64748B]'}>
              0800 802 0133
            </span>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}

export default App;
