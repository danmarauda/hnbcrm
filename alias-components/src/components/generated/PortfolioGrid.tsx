import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Clock, Sparkles, Zap, Layers, Monitor, Palette, Type, FileText, Send, ExternalLink, Check, Github, Twitter, Linkedin, Instagram, Globe as GlobeIcon, ChevronRight, Star, TrendingUp, Coffee, Download, Moon, Megaphone, Smartphone, Code2, Film, Watch, Activity, BarChart3, Shield, Triangle, Circle, Hexagon, Pencil, Save, X, Plus, Trash2 } from 'lucide-react';

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Abel&display=swap');
    .pg-abel { font-family: 'Abel', sans-serif; }

    @keyframes pg-marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .pg-animate-marquee { animation: pg-marquee 20s linear infinite; }

    @keyframes pg-glow-pulse {
      0%, 100% { opacity: 0.4; }
      50%       { opacity: 0.8; }
    }
    .pg-glow-pulse { animation: pg-glow-pulse 3s ease-in-out infinite; }

    @keyframes pg-orbit-spin {
      from { transform: rotate(0deg) translateX(38px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
    }
    @keyframes pg-orbit-spin-rev {
      from { transform: rotate(0deg) translateX(26px) rotate(0deg); }
      to   { transform: rotate(-360deg) translateX(26px) rotate(360deg); }
    }
    .pg-orbit-node     { animation: pg-orbit-spin 7s linear infinite; }
    .pg-orbit-node-rev { animation: pg-orbit-spin-rev 5s linear infinite; }

    @keyframes pg-float-y {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    .pg-float-icon { animation: pg-float-y 4s ease-in-out infinite; }

    .pg-glass-surface {
      background: rgba(13,13,13,0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .pg-hover-glow:hover         { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.05); }
    .pg-hover-glow-accent:hover  { box-shadow: 0 0 0 1px rgba(6,182,212,0.15), 0 0 60px rgba(6,182,212,0.06), inset 0 1px 0 rgba(6,182,212,0.08); }
    .pg-hover-glow-teal:hover    { box-shadow: 0 0 0 1px rgba(20,184,166,0.15), 0 0 60px rgba(20,184,166,0.06), inset 0 1px 0 rgba(20,184,166,0.08); }
    .pg-hover-glow-amber:hover   { box-shadow: 0 0 0 1px rgba(245,158,11,0.15), 0 0 60px rgba(245,158,11,0.06), inset 0 1px 0 rgba(245,158,11,0.08); }
    .pg-hover-glow-emerald:hover { box-shadow: 0 0 0 1px rgba(16,185,129,0.08), 0 0 40px rgba(16,185,129,0.04); }

    /* Editable field styles */
    .pg-editable-field {
      background: rgba(255,255,255,0.04);
      border: 1px dashed rgba(255,255,255,0.15);
      border-radius: 6px;
      outline: none;
      cursor: text;
      transition: border-color 0.2s, background 0.2s;
      resize: none;
    }
    .pg-editable-field:focus {
      background: rgba(255,255,255,0.07);
      border-color: rgba(6,182,212,0.5);
    }
    .pg-edit-mode-ring {
      box-shadow: 0 0 0 2px rgba(6,182,212,0.25), inset 0 0 0 1px rgba(6,182,212,0.1);
    }
    .pg-section-edit-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border: 2px dashed rgba(6,182,212,0.18);
      border-radius: inherit;
      z-index: 50;
    }

    /* Smooth scroll */
    html { scroll-behavior: smooth; }

    /* Scrollbar hide */
    .pg-no-scroll::-webkit-scrollbar { display: none; }
    .pg-no-scroll { scrollbar-width: none; }
  `}</style>;

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  bg: '#080808',
  card: '#111111',
  cardBorder: 'rgba(255,255,255,0.06)',
  cardBorderHover: 'rgba(255,255,255,0.12)',
  text: '#ffffff',
  textMuted: '#777777',
  textDim: '#444444',
  accent: '#e2e2e2',
  glowSm: 'rgba(255,255,255,0.05)',
  glowMd: 'rgba(255,255,255,0.08)',
  green: '#22c55e',
  greenGlow: 'rgba(34,197,94,0.12)',
  editAccent: 'rgba(6,182,212,0.8)'
};

// ─────────────────────────────────────────────
// IMAGES
// ─────────────────────────────────────────────
const IMG = {
  avatar: 'https://framerusercontent.com/images/Nc48TdDYMIQVusSr88vgRo2zYSI.jpg?width=200',
  avatarStack1: 'https://framerusercontent.com/images/MJJPMF8GEHgVb8W680ixxmELqZk.png',
  avatarStack2: 'https://framerusercontent.com/images/pmNPHpX6lPeGIPGLO8rMA8AkoE.png',
  avatarStack3: 'https://framerusercontent.com/images/OduWXZ9u3Pqy9Hz6RCBv6HA.png',
  journalThumb: 'https://framerusercontent.com/images/lbGqTln87BGRDYGS78MxEGd02to.png?width=80',
  uxThumb: 'https://framerusercontent.com/images/khBcEdR3CTeOWejRcCa6Ir3fJk.png',
  mockuThumb: 'https://framerusercontent.com/images/15PYZKUAyTuKJUcz8F7wQtjYw.png?width=56',
  mockuCover: 'https://framerusercontent.com/images/1U2KZfB4ZFCqLccNXGp9awZCww.png?width=672',
  wallpaperThumb: 'https://framerusercontent.com/images/RYbHM4kAEYyx66YDSMYMyesSjw.png?width=56',
  wallpaperCover: 'https://framerusercontent.com/images/TPsivWTtU5M8T40tEwq1Dhgp5pw.png?width=672',
  artBookThumb: 'https://framerusercontent.com/images/qS3tMzwMF25aw9TmvLzGK9pkAYk.png',
  fontThumb: 'https://framerusercontent.com/images/sSwKSpnVAMPabgt4eFMzB6a9cM.png',
  resumeThumb: 'https://framerusercontent.com/images/Nuxc9kO2WGyTZrwgOgPUHyc9LU.png',
  showcase: 'https://framerusercontent.com/images/riM01ttJcKbp8ikXGBy94HOAxoo.jpg',
  projectA: 'https://framerusercontent.com/images/tcJg7QAnj9FKGjtJ9ReYPt6wevg.jpg?scale-down-to=128',
  projectB: 'https://framerusercontent.com/images/sfAYBhrwbvrs16XmNt7E0P4MkBk.jpg?scale-down-to=128',
  projectC: 'https://framerusercontent.com/images/MHoTdxtwqigAb7QZAnBz3xEDQ.jpg?scale-down-to=128',
  quoteAvatar: 'https://framerusercontent.com/modules/V6xwKQbiHQzEli4HvzVM/9218OtH0lpLJYp8o6xgJ/assets/512/auINcMWyDYRNqJgkmTH3UfC7240.jpg',
  cashless: 'https://framerusercontent.com/images/rXqxOzM3UNIAMYLygf1ipImD6Y.webp',
  jobPortal: 'https://framerusercontent.com/images/Nk3iUU1HWdPTnkYNlNeELJCRGB8.webp',
  boostPro: 'https://framerusercontent.com/images/1vMXcA72OPzVx8atzweJwyFDLTM.webp'
};

// ─────────────────────────────────────────────
// TOOL STACK
// ─────────────────────────────────────────────
const TOOLS = [{
  name: 'Figma',
  src: 'https://framerusercontent.com/images/YSG9Il0233T2Woq4Fpetvt6FxGA.webp?width=334&height=500'
}, {
  name: 'Framer',
  src: 'https://framerusercontent.com/images/0j5gYeoRsZG8PJ9hniVzHMcaYo.webp?width=340&height=500'
}, {
  name: 'Notion',
  src: 'https://framerusercontent.com/images/DqvuS90E062F5mQTYxRztACjEWs.webp?width=480&height=500'
}, {
  name: 'Todoist',
  src: 'https://framerusercontent.com/images/U3ylarrpMUFRxnC3Nt8EXST36U0.webp?width=500&height=499'
}, {
  name: 'Arc',
  src: 'https://framerusercontent.com/images/Jo45NE9cozyWEGOc3q5r66Sl98.webp?width=500&height=427'
}, {
  name: 'Slack',
  src: 'https://framerusercontent.com/images/i1gTadwK9NZWMnCrXF46beqYL6I.webp?width=460&height=460'
}, {
  name: 'ChatGPT',
  src: 'https://framerusercontent.com/images/6PRcEBsg8rNdd6haOmtgHwMDuFo.webp?width=512&height=512'
}, {
  name: 'Cleanshot',
  src: 'https://framerusercontent.com/images/QTKgXhnox8vWW0STsITqITFKF0.webp?width=494&height=500'
}] as {
  name: string;
  src: string;
}[];

// ─────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────
const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.94
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.055,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// ─────────────────────────────────────────────
// ACCENT MAP
// ─────────────────────────────────────────────
const accentMap = {
  cyan: {
    text: 'text-cyan-400',
    border: 'hover:border-cyan-500/30',
    dot: 'bg-cyan-500/50',
    iconBg: 'bg-cyan-900/20',
    iconBorder: 'border-cyan-500/20',
    glow: 'pg-hover-glow-accent'
  },
  teal: {
    text: 'text-teal-400',
    border: 'hover:border-teal-500/30',
    dot: 'bg-teal-500/50',
    iconBg: 'bg-teal-900/20',
    iconBorder: 'border-teal-500/20',
    glow: 'pg-hover-glow-teal'
  },
  amber: {
    text: 'text-amber-400',
    border: 'hover:border-amber-500/30',
    dot: 'bg-amber-500/50',
    iconBg: 'bg-amber-900/20',
    iconBorder: 'border-amber-500/20',
    glow: 'pg-hover-glow-amber'
  }
} as const;
type Accent = keyof typeof accentMap;

// ─────────────────────────────────────────────
// EDIT CONTEXT
// ─────────────────────────────────────────────
interface EditContextType {
  editing: boolean;
}
const EditCtx = React.createContext<EditContextType>({
  editing: false
});
const useEdit = () => React.useContext(EditCtx);

// ─────────────────────────────────────────────
// EDITABLE TEXT
// ─────────────────────────────────────────────
interface EditableProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
  multiline?: boolean;
  placeholder?: string;
}
const Editable = ({
  value,
  onChange,
  className = '',
  style,
  tag = 'span',
  multiline = false,
  placeholder
}: EditableProps) => {
  const {
    editing
  } = useEdit();
  const Tag = tag as any;
  if (!editing) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }
  if (multiline) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`pg-editable-field w-full px-2 py-1 ${className}`} style={{
      ...style,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      letterSpacing: 'inherit',
      lineHeight: 'inherit',
      color: 'inherit'
    }} />;
  }
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`pg-editable-field px-2 py-0.5 min-w-0 w-full ${className}`} style={{
    ...style,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit'
  }} />;
};

// ─────────────────────────────────────────────
// SECTION WRAPPER  (edit toggle + save button)
// ─────────────────────────────────────────────
interface SectionWrapperProps {
  id: string;
  label: string;
  children: (editing: boolean) => React.ReactNode;
  className?: string;
  minHeight?: string;
}
const SectionWrapper = ({
  id,
  label,
  children,
  className = '',
  minHeight = 'min-h-screen'
}: SectionWrapperProps) => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleCancel = () => setEditing(false);
  return <EditCtx.Provider value={{
    editing
  }}>
      <section id={id} className={`relative w-full ${minHeight} flex flex-col ${className}`} style={{
      background: T.bg
    }}>
        {/* Edit-mode dashed border */}
        <AnimatePresence>
          {editing && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="absolute inset-0 pointer-events-none z-40" style={{
          border: '2px dashed rgba(6,182,212,0.2)',
          borderRadius: 0
        }} />}
        </AnimatePresence>

        {/* Section badge + edit controls */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-10 border-b" style={{
        background: editing ? 'rgba(6,182,212,0.06)' : 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(12px)',
        borderColor: editing ? 'rgba(6,182,212,0.25)' : T.cardBorder,
        transition: 'background 0.3s, border-color 0.3s'
      }}>
          {/* Left: label */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{
            background: editing ? T.editAccent : T.textDim
          }} />
            <span className="pg-abel text-[10px] tracking-[0.25em] uppercase" style={{
            color: editing ? T.editAccent : T.textDim
          }}>
              {label}
            </span>
            {editing && <motion.span initial={{
            opacity: 0,
            x: -6
          }} animate={{
            opacity: 1,
            x: 0
          }} className="pg-abel text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-full" style={{
            background: 'rgba(6,182,212,0.12)',
            color: T.editAccent,
            border: '1px solid rgba(6,182,212,0.2)'
          }}>
                Editing
              </motion.span>}
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {saved ? <motion.span key="saved" initial={{
              opacity: 0,
              scale: 0.85
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.85
            }} className="flex items-center gap-1.5 pg-abel text-[10px] uppercase tracking-widest px-3 py-1 rounded-full" style={{
              background: T.greenGlow,
              color: T.green,
              border: '1px solid rgba(34,197,94,0.2)'
            }}>
                  <Check size={10} /> Saved
                </motion.span> : editing ? <motion.div key="editing-btns" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="flex items-center gap-2">
                  <button onClick={handleCancel} className="flex items-center gap-1.5 pg-abel text-[10px] uppercase tracking-widest px-3 py-1 rounded-full transition-all hover:opacity-80" style={{
                background: T.glowSm,
                color: T.textMuted,
                border: `1px solid ${T.cardBorder}`
              }}>
                    <X size={9} /> Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 pg-abel text-[10px] uppercase tracking-widest px-3 py-1 rounded-full transition-all hover:opacity-90" style={{
                background: 'rgba(6,182,212,0.15)',
                color: T.editAccent,
                border: '1px solid rgba(6,182,212,0.3)'
              }}>
                    <Save size={9} /> Save
                  </button>
                </motion.div> : <motion.button key="edit-btn" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} onClick={() => setEditing(true)} className="flex items-center gap-1.5 pg-abel text-[10px] uppercase tracking-widest px-3 py-1 rounded-full transition-all hover:opacity-80" style={{
              background: T.glowSm,
              color: T.textDim,
              border: `1px solid ${T.cardBorder}`
            }}>
                  <Pencil size={9} /> Edit
                </motion.button>}
            </AnimatePresence>
          </div>
        </div>

        {/* Section content */}
        <div className={`flex-1 flex flex-col ${editing ? 'pg-edit-mode-ring' : ''}`} style={{
        transition: 'box-shadow 0.3s'
      }}>
          {children(editing)}
        </div>
      </section>
    </EditCtx.Provider>;
};

// ─────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────
const GridOverlay = () => <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]" style={{
  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
  backgroundSize: '32px 32px'
}} />;
const Dots = () => <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[28%] left-[12%] w-[3px] h-[3px] rounded-full bg-white/20" />
    <div className="absolute top-[60%] right-[18%] w-[2px] h-[2px] rounded-full bg-white/15" />
    <div className="absolute bottom-[22%] left-[40%] w-[2px] h-[2px] rounded-full bg-white/10" />
  </div>;
interface CardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  onClick?: () => void;
  href?: string;
  glow?: boolean;
  style?: React.CSSProperties;
  accentGlow?: Accent | 'emerald' | null;
}
const Card = ({
  children,
  className = '',
  index = 0,
  onClick,
  href,
  glow = false,
  style,
  accentGlow
}: CardProps) => {
  const Tag = href ? 'a' : onClick ? 'button' : 'div';
  const interactive = !!(href || onClick);
  const glowClass = accentGlow ? accentGlow === 'emerald' ? 'pg-hover-glow-emerald' : `pg-hover-glow-${accentGlow === 'cyan' ? 'accent' : accentGlow}` : 'pg-hover-glow';
  return <motion.div custom={index} variants={scaleIn} initial="hidden" animate="visible" className={`relative rounded-2xl overflow-hidden w-full text-left h-full pg-glass-surface ${glowClass} transition-all duration-300 ${className}`} style={{
    border: `1px solid ${T.cardBorder}`,
    boxShadow: glow ? `0 0 40px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)` : 'inset 0 1px 0 rgba(255,255,255,0.04)',
    ...style
  }}>
      <GridOverlay /><Dots />
      {interactive && <motion.div className="absolute inset-0 rounded-2xl pointer-events-none z-10" initial={{
      opacity: 0
    }} whileHover={{
      opacity: 1
    }} style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%, rgba(0,0,0,0.3) 100%)',
      border: `1px solid ${T.cardBorderHover}`
    }} />}
      <Tag {...href ? {
      href,
      target: '_blank',
      rel: 'noopener noreferrer'
    } : {}} {...onClick ? {
      onClick
    } : {}} className={`block w-full h-full relative z-[1] ${interactive ? 'cursor-pointer' : 'cursor-default'}`}>
        {children}
      </Tag>
    </motion.div>;
};
const Divider = () => <div className="w-full h-px my-2 flex-shrink-0" style={{
  background: T.cardBorder
}} />;
const CardLabel = ({
  title,
  subtitle,
  icon
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) => <div className="flex items-start justify-between w-full">
    <span className="pg-abel text-[11px] tracking-[0.14em] uppercase" style={{
    color: T.textDim
  }}>{title.toUpperCase()}</span>
    <div className="flex items-center gap-1.5">
      {subtitle && <span className="text-[11px]" style={{
      color: T.textDim
    }}>{subtitle}</span>}
      {icon}
    </div>
  </div>;
const StatusDot = ({
  active = true
}: {
  active?: boolean;
}) => <span className="relative flex h-2 w-2 flex-shrink-0">
    {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{
    background: T.green
  }} />}
    <span className="relative inline-flex rounded-full h-2 w-2" style={{
    background: active ? T.green : T.textDim
  }} />
  </span>;
const PillTag = ({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'new' | 'soon';
}) => {
  const s: Record<string, string> = {
    default: 'bg-white/5 text-white/50 border-white/[0.08]',
    new: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    soon: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] pg-abel tracking-wider uppercase border ${s[variant]}`}>{children}</span>;
};
const LiveClock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums" style={{
    color: T.textMuted
  }}>{t.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}</span>;
};
const AccentBadge = ({
  Icon,
  accent
}: {
  Icon: React.ElementType;
  accent: Accent;
}) => {
  const ac = accentMap[accent];
  return <div className={`w-8 h-8 rounded-xl ${ac.iconBg} border ${ac.iconBorder} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
      <Icon size={15} className={ac.text} strokeWidth={1.5} />
    </div>;
};

// ─────────────────────────────────────────────
// SECTION NAV DOTS
// ─────────────────────────────────────────────
const SECTIONS = [{
  id: 'pg-hero',
  label: 'Hero'
}, {
  id: 'pg-portfolio',
  label: 'Portfolio'
}, {
  id: 'pg-services',
  label: 'Services'
}, {
  id: 'pg-breakdown',
  label: 'Breakdown'
}, {
  id: 'pg-contact',
  label: 'Contact'
}];
const SectionNavDots = ({
  active
}: {
  active: string;
}) => <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 hidden sm:flex">
    {SECTIONS.map(s => <a key={s.id} href={`#${s.id}`} title={s.label} className="group flex items-center gap-2 justify-end">
        <span className="pg-abel text-[9px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{
      color: T.textDim
    }}>
          {s.label}
        </span>
        <span className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{
      background: active === s.id ? T.editAccent : T.textDim,
      transform: active === s.id ? 'scale(1.4)' : 'scale(1)'
    }} />
      </a>)}
  </div>;

// ─────────────────────────────────────────────
// ══ SECTION 1 — HERO ══
// ─────────────────────────────────────────────
interface HeroData {
  name: string;
  location: string;
  role: string;
  tagline: string;
  statusText: string;
  stats: {
    v: string;
    l: string;
  }[];
}
const defaultHeroData: HeroData = {
  name: 'ALIAS CREATIVE',
  location: 'Melbourne',
  role: 'Creative Director & Full-Stack Studio',
  tagline: 'End-to-end digital experiences built with precision. Design, development, and strategy — all under one roof.',
  statusText: 'Available for new projects — hit us up for a collab. 🦾',
  stats: [{
    v: '12+',
    l: 'Years'
  }, {
    v: '80+',
    l: 'Projects'
  }, {
    v: '4.9',
    l: 'Rating'
  }]
};
const HeroSection = () => {
  const [data, setData] = useState<HeroData>(defaultHeroData);
  const upd = useCallback(<K extends keyof HeroData,>(k: K, v: HeroData[K]) => setData(p => ({
    ...p,
    [k]: v
  })), []);
  return <SectionWrapper id="pg-hero" label="Hero" minHeight="min-h-screen">
      {editing => <EditCtx.Provider value={{
      editing
    }}>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-16 sm:py-20">

            {/* Left: Identity card */}
            <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1]
        }} className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0">
              <div className="relative rounded-3xl p-6 sm:p-8 flex flex-col gap-6 pg-glass-surface" style={{
            border: `1px solid ${T.cardBorder}`,
            boxShadow: '0 0 80px rgba(6,182,212,0.04), inset 0 1px 0 rgba(255,255,255,0.04)'
          }}>
                <GridOverlay />
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none" style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)'
            }} />

                {/* Avatar + name row */}
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden ring-2 ring-white/10">
                        <img src={IMG.avatar} alt="ALIAS Creative" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center" style={{
                    background: T.green,
                    borderColor: T.card
                  }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Editable tag="span" value={data.name} onChange={v => upd('name', v)} className="pg-abel text-[14px] sm:text-[16px] text-white tracking-[0.06em] uppercase" />
                        <StatusDot />
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={9} style={{
                      color: T.textDim
                    }} />
                        <Editable tag="span" value={data.location} onChange={v => upd('location', v)} className="text-[11px]" style={{
                      color: T.textDim
                    }} />
                        <span className="mx-1 text-[11px]" style={{
                      color: T.textDim
                    }}>·</span>
                        <Clock size={9} style={{
                      color: T.textDim
                    }} />
                        <LiveClock />
                      </div>
                    </div>
                  </div>
                  <motion.a href="#" whileHover={{
                scale: 1.04
              }} whileTap={{
                scale: 0.97
              }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] pg-abel flex-shrink-0" style={{
                background: T.glowSm,
                color: 'white',
                border: `1px solid ${T.cardBorder}`
              }}>
                    <Mail size={10} /> Contact
                  </motion.a>
                </div>

                {/* Role + tagline */}
                <div className="relative z-10">
                  <Editable tag="h1" value={data.role} onChange={v => upd('role', v)} className="pg-abel text-[22px] sm:text-[28px] md:text-[32px] leading-tight text-white tracking-[0.04em] uppercase" />
                  <Editable tag="p" value={data.tagline} onChange={v => upd('tagline', v)} multiline className="mt-3 text-[12px] sm:text-[13px] leading-relaxed w-full" style={{
                color: T.textMuted
              }} />
                </div>

                {/* Stats row */}
                <div className="relative z-10 grid grid-cols-3 gap-0 rounded-xl overflow-hidden" style={{
              background: T.glowSm,
              border: `1px solid ${T.cardBorder}`
            }}>
                  {data.stats.map(({
                v,
                l
              }, i) => <div key={i} className={`flex flex-col items-center py-3 ${i < 2 ? 'border-r' : ''}`} style={{
                borderColor: T.cardBorder
              }}>
                      <Editable tag="span" value={v} onChange={nv => {
                  const s = [...data.stats];
                  s[i] = {
                    ...s[i],
                    v: nv
                  };
                  upd('stats', s);
                }} className="pg-abel text-[18px] sm:text-[20px] text-white tracking-tight" />
                      <Editable tag="span" value={l} onChange={nl => {
                  const s = [...data.stats];
                  s[i] = {
                    ...s[i],
                    l: nl
                  };
                  upd('stats', s);
                }} className="pg-abel text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-wider" style={{
                  color: T.textDim
                }} />
                    </div>)}
                </div>

                {/* Status */}
                <div className="relative z-10 p-3 rounded-xl flex items-start gap-3" style={{
              background: T.glowSm,
              border: `1px solid ${T.cardBorder}`
            }}>
                  <div className="flex-shrink-0 mt-0.5"><StatusDot /></div>
                  <Editable tag="p" value={data.statusText} onChange={v => upd('statusText', v)} multiline className="text-[12px] leading-relaxed flex-1" style={{
                color: T.textMuted
              }} />
                </div>
              </div>
            </motion.div>

            {/* Right: headline */}
            <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1]
        }} className="flex-1 flex flex-col gap-6 sm:gap-8">
              <div>
                <p className="pg-abel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase mb-4 flex items-center gap-3" style={{
              color: T.textDim
            }}>
                  <span className="w-5 h-px" style={{
                background: T.textDim
              }} /> Full-Service Studio
                </p>
                <h2 className="pg-abel text-[clamp(36px,6vw,80px)] leading-none tracking-tight uppercase" style={{
              color: T.textDim
            }}>
                  FROM
                </h2>
                <h2 className="pg-abel text-[clamp(36px,6vw,80px)] leading-none tracking-tight text-white uppercase">
                  CONCEPT
                </h2>
                <h2 className="pg-abel text-[clamp(36px,6vw,80px)] leading-none tracking-tight uppercase" style={{
              color: T.textDim
            }}>
                  TO LAUNCH
                </h2>
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.a href="#pg-portfolio" whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.97
            }} className="flex items-center gap-2 px-5 py-2.5 rounded-full pg-abel text-[11px] sm:text-[12px] uppercase tracking-[0.1em] text-white" style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
                  View Portfolio <ArrowUpRight size={11} />
                </motion.a>
                <motion.a href="#pg-services" whileHover={{
              scale: 1.03
            }} whileTap={{
              scale: 0.97
            }} className="flex items-center gap-2 px-5 py-2.5 rounded-full pg-abel text-[11px] sm:text-[12px] uppercase tracking-[0.1em]" style={{
              background: T.glowSm,
              color: T.textMuted,
              border: `1px solid ${T.cardBorder}`
            }}>
                  Our Services
                </motion.a>
              </div>

              {/* Tool stack marquee */}
              <div className="relative overflow-hidden rounded-2xl p-4" style={{
            background: T.glowSm,
            border: `1px solid ${T.cardBorder}`
          }}>
                <p className="pg-abel text-[9px] tracking-[0.25em] uppercase mb-3" style={{
              color: T.textDim
            }}>Stack We Use</p>
                <div className="relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none" style={{
                background: `linear-gradient(to right, rgba(13,13,13,0.9), transparent)`
              }} />
                  <div className="absolute inset-y-0 right-0 w-8 z-10 pointer-events-none" style={{
                background: `linear-gradient(to left, rgba(13,13,13,0.9), transparent)`
              }} />
                  <div className="flex gap-3 pg-animate-marquee w-max">
                    {[...TOOLS, ...TOOLS].map((tool, i) => <div key={`${tool.name}-${i}`} className="w-10 h-10 flex items-center justify-center shrink-0 p-1.5 rounded-xl" style={{
                  background: T.glowSm,
                  border: `1px solid ${T.cardBorder}`
                }}>
                        <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
                      </div>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </EditCtx.Provider>}
    </SectionWrapper>;
};

// ─────────────────────────────────────────────
// ══ SECTION 2 — PORTFOLIO BENTO ══
// ─────────────────────────────────────────────

// Individual cards that use Editable internally
const HeroCard = ({
  index
}: {
  index: number;
}) => {
  const [txt, setTxt] = useState('Creative Director & Full-Stack Studio');
  const [sub, setSub] = useState('End-to-end digital experiences built with precision. Design, development, and strategy — all under one roof.');
  return <Card index={index} className="p-5 sm:p-6 flex flex-col justify-between" glow accentGlow="cyan">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none" style={{
      background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)'
    }} />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden ring-2 ring-white/10">
              <img src={IMG.avatar} alt="ALIAS Creative" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2" style={{
            background: T.green,
            borderColor: T.card
          }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="pg-abel text-[13px] sm:text-[15px] text-white tracking-[0.06em] uppercase">ALIAS CREATIVE</span>
              <StatusDot />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={9} style={{
              color: T.textDim
            }} />
              <span className="text-[11px]" style={{
              color: T.textDim
            }}>Melbourne</span>
            </div>
          </div>
        </div>
        <motion.a href="#" whileHover={{
        scale: 1.04
      }} whileTap={{
        scale: 0.97
      }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] pg-abel flex-shrink-0" style={{
        background: T.glowSm,
        color: 'white',
        border: `1px solid ${T.cardBorder}`
      }}>
          <Mail size={10} /> Contact
        </motion.a>
      </div>
      <div className="mt-4 relative z-10">
        <Editable tag="h1" value={txt} onChange={setTxt} className="pg-abel text-[20px] sm:text-[26px] leading-tight text-white tracking-[0.04em] uppercase" />
        <Editable tag="p" value={sub} onChange={setSub} multiline className="mt-2 text-[12px] leading-relaxed w-full" style={{
        color: T.textMuted
      }} />
      </div>
    </Card>;
};
const ModeCard = ({
  index
}: {
  index: number;
}) => {
  const [txt, setTxt] = useState('Available for new projects — hit us up for a collab. 🦾');
  return <Card index={index} className="p-4 sm:p-5 flex flex-col" accentGlow="teal">
      <CardLabel title="Status" icon={<div className="relative flex items-center justify-center w-3 h-3">
          <span className="animate-ping absolute w-2 h-2 rounded-full opacity-60" style={{
        background: T.green
      }} />
          <span className="relative w-2 h-2 rounded-full" style={{
        background: T.green
      }} />
        </div>} />
      <Divider />
      <div className="flex-1 flex flex-col justify-between">
        <Editable tag="p" value={txt} onChange={setTxt} multiline className="text-[12px] leading-[1.6] w-full" style={{
        color: T.textMuted
      }} />
        <motion.a href="#" whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.97
      }} className="mt-3 flex items-center justify-between px-3 h-8 rounded-xl text-[11px] pg-abel text-white uppercase tracking-[0.08em]" style={{
        background: T.glowSm,
        border: `1px solid ${T.cardBorder}`
      }}>
          Start A Project <ArrowUpRight size={10} />
        </motion.a>
      </div>
    </Card>;
};
const ClockCard = ({
  index
}: {
  index: number;
}) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = now.getSeconds(),
    m = now.getMinutes(),
    h = now.getHours();
  return <Card index={index} className="p-4 sm:p-5 flex flex-col">
      <CardLabel title="Time" subtitle="Melbourne" />
      <Divider />
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px]">
          <circle cx="50" cy="50" r="46" fill="none" stroke={T.cardBorder} strokeWidth="1" />
          {[...Array(12)].map((_, i) => <line key={i} x1="50" y1="8" x2="50" y2="14" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" transform={`rotate(${i * 30} 50 50)`} />)}
          <line x1="50" y1="50" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" transform={`rotate(${(h + m / 60) / 12 * 360} 50 50)`} />
          <line x1="50" y1="50" y2="18" stroke="white" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${(m + s / 60) / 60 * 360} 50 50)`} />
          <line x1="50" y1="54" y2="16" stroke={T.accent} strokeWidth="0.7" strokeLinecap="round" transform={`rotate(${s / 60 * 360} 50 50)`} />
          <circle cx="50" cy="50" r="2" fill="white" />
        </svg>
      </div>
    </Card>;
};
const AboutCard = ({
  index
}: {
  index: number;
}) => {
  const [bio, setBio] = useState("We're a creative studio based in Melbourne — combining strategic thinking, considered design, and disciplined engineering to deliver digital experiences that work in the real world.");
  return <Card index={index} className="p-4 sm:p-5 flex flex-col">
      <CardLabel title="About" subtitle="ALIAS Creative" />
      <Divider />
      <Editable tag="p" value={bio} onChange={setBio} multiline className="text-[12px] leading-[1.65] flex-1 w-full" style={{
      color: T.textMuted
    }} />
      <div className="grid grid-cols-3 rounded-xl overflow-hidden mt-3" style={{
      background: T.glowSm,
      border: `1px solid ${T.cardBorder}`
    }}>
        {[{
        v: '12+',
        l: 'Years'
      }, {
        v: '80+',
        l: 'Projects'
      }, {
        v: '4.9',
        l: 'Rating'
      }].map(({
        v,
        l
      }, i) => <div key={l} className={`flex flex-col items-center py-3 ${i < 2 ? 'border-r' : ''}`} style={{
        borderColor: T.cardBorder
      }}>
            <span className="pg-abel text-[17px] text-white tracking-tight">{v}</span>
            <span className="pg-abel text-[10px] mt-0.5 uppercase tracking-wider" style={{
          color: T.textDim
        }}>{l}</span>
          </div>)}
      </div>
    </Card>;
};
const ExperienceCard = ({
  index
}: {
  index: number;
}) => {
  const [items, setItems] = useState([{
    from: '2022',
    to: 'Now',
    title: 'ALIAS Creative Studio',
    role: 'Full-service digital studio'
  }, {
    from: '2020',
    to: '2022',
    title: 'Enterprise Clients',
    role: 'Design & Creative Direction'
  }, {
    from: '2018',
    to: '2020',
    title: 'Product & UX Design',
    role: 'Art Direction & Systems'
  }, {
    from: '2016',
    to: '2018',
    title: 'Brand Identity',
    role: 'Visual Communication'
  }, {
    from: '2014',
    to: '2016',
    title: 'Web Development',
    role: 'Frontend & Full Stack'
  }]);
  const {
    editing
  } = useEdit();
  const upd = (i: number, k: string, v: string) => setItems(p => p.map((x, xi) => xi === i ? {
    ...x,
    [k]: v
  } : x));
  return <Card index={index} className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <CardLabel title="Experience" />
        {editing && <button onClick={() => setItems(p => [...p, {
        from: '20XX',
        to: 'Now',
        title: 'New Role',
        role: 'Description'
      }])} className="flex items-center gap-1 text-[10px] pg-abel uppercase tracking-wider px-2 py-0.5 rounded-lg transition-colors" style={{
        color: T.editAccent,
        background: 'rgba(6,182,212,0.08)',
        border: '1px solid rgba(6,182,212,0.2)'
      }}>
            <Plus size={8} /> Add
          </button>}
      </div>
      <Divider />
      <div className="relative flex-1 overflow-hidden min-h-0">
        <div className="absolute inset-0 overflow-y-auto flex flex-col gap-3 pt-1 pb-8 pr-1 pg-no-scroll">
          {items.map((item, i) => <div key={i} className="flex flex-col gap-1.5 pb-3 border-b last:border-0 last:pb-0" style={{
          borderColor: T.cardBorder
        }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px]" style={{
              color: T.textDim
            }}>
                  <Editable tag="span" value={item.from} onChange={v => upd(i, 'from', v)} className="text-[10px]" style={{
                color: T.textDim
              }} />
                  <div className="w-3 h-px border-t border-dashed" style={{
                borderColor: T.textDim
              }} />
                  <Editable tag="span" value={item.to} onChange={v => upd(i, 'to', v)} className="text-[10px]" style={{
                color: T.textDim
              }} />
                </div>
                {editing && <button onClick={() => setItems(p => p.filter((_, xi) => xi !== i))} className="w-5 h-5 flex items-center justify-center rounded-full transition-colors hover:bg-red-900/20">
                    <Trash2 size={9} className="text-red-500/60" />
                  </button>}
              </div>
              <Editable tag="p" value={item.title} onChange={v => upd(i, 'title', v)} className="pg-abel text-[12px] text-white uppercase tracking-[0.04em]" />
              <Editable tag="p" value={item.role} onChange={v => upd(i, 'role', v)} className="text-[11px]" style={{
            color: T.textMuted
          }} />
            </div>)}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10 pointer-events-none" style={{
        background: `linear-gradient(to top, ${T.card}, transparent)`
      }} />
      </div>
    </Card>;
};
const ProjectsCard = ({
  index
}: {
  index: number;
}) => {
  const [projects, setProjects] = useState([{
    title: 'Fusion Pro Presentation',
    desc: 'Something truly unique for keynotes.',
    img: IMG.projectA
  }, {
    title: 'New Publication',
    desc: 'Article on the impact of AI in design.',
    img: IMG.projectB
  }, {
    title: 'Swoosh Playground',
    desc: 'Experimental Nike Shoe Launch project.',
    img: IMG.projectC
  }]);
  const {
    editing
  } = useEdit();
  const upd = (i: number, k: string, v: string) => setProjects(p => p.map((x, xi) => xi === i ? {
    ...x,
    [k]: v
  } : x));
  return <Card index={index} className="p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <CardLabel title="Projects" />
        {editing && <button onClick={() => setProjects(p => [...p, {
        title: 'New Project',
        desc: 'Description',
        img: IMG.projectA
      }])} className="flex items-center gap-1 text-[10px] pg-abel uppercase tracking-wider px-2 py-0.5 rounded-lg" style={{
        color: T.editAccent,
        background: 'rgba(6,182,212,0.08)',
        border: '1px solid rgba(6,182,212,0.2)'
      }}>
            <Plus size={8} /> Add
          </button>}
      </div>
      <Divider />
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pt-1 pb-1 pg-no-scroll">
        {projects.map((p, i) => <motion.div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{
        background: T.glowSm,
        border: '1px solid transparent'
      }} whileHover={{
        backgroundColor: T.glowMd,
        borderColor: T.cardBorderHover
      }}>
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/[0.08]">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <Editable tag="p" value={p.title} onChange={v => upd(i, 'title', v)} className="pg-abel text-[12px] text-white uppercase tracking-[0.04em]" />
              <Editable tag="p" value={p.desc} onChange={v => upd(i, 'desc', v)} className="text-[11px] mt-0.5" style={{
            color: T.textMuted
          }} />
            </div>
            {editing ? <button onClick={() => setProjects(prev => prev.filter((_, xi) => xi !== i))}>
                <Trash2 size={10} className="text-red-500/60" />
              </button> : <ArrowUpRight size={11} style={{
          color: T.textDim
        }} className="flex-shrink-0" />}
          </motion.div>)}
      </div>
    </Card>;
};
const ShowcaseCard = ({
  index
}: {
  index: number;
}) => <Card index={index} className="p-0 relative overflow-hidden group">
    <img src={IMG.showcase} alt="Latest Work" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    <div className="absolute inset-0" style={{
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)'
  }} />
    <div className="absolute inset-x-0 top-0 p-4 z-10">
      <div className="flex items-center justify-between">
        <span className="pg-abel text-[11px] tracking-[0.14em] uppercase text-white/60">Latest Work</span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-white/60">View All</span>
          <ArrowUpRight size={10} className="text-white/60" />
        </div>
      </div>
      <div className="w-full h-px mt-2" style={{
      background: 'rgba(255,255,255,0.12)'
    }} />
    </div>
  </Card>;
const ProjectImageCard = ({
  title,
  image,
  index,
  className = ''
}: {
  title: string;
  image: string;
  index: number;
  className?: string;
}) => <motion.a href="#" onClick={e => e.preventDefault()} custom={index} variants={scaleIn} initial="hidden" animate="visible" className={`relative block w-full overflow-hidden group cursor-pointer rounded-2xl ${className}`} style={{
  border: `1px solid ${T.cardBorder}`
}}>
    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
    background: `linear-gradient(to top, ${T.card}, transparent)`
  }}>
      <div className="flex items-center justify-between w-full">
        <h4 className="pg-abel font-normal text-white text-sm uppercase tracking-[0.08em]">{title}</h4>
        <ArrowUpRight strokeWidth={2.5} size={14} className="text-white" />
      </div>
    </div>
  </motion.a>;
const ProductsCard = ({
  index
}: {
  index: number;
}) => {
  const [items, setItems] = useState([{
    title: 'The AI Art Book',
    desc: 'Explore AI masterpieces.',
    img: IMG.artBookThumb,
    rating: 4.9
  }, {
    title: 'Necosmic Font',
    desc: 'Upgrade your typography.',
    img: IMG.fontThumb,
    rating: 4.8
  }, {
    title: 'Resume Template',
    desc: 'Craft your standout résumé.',
    img: IMG.resumeThumb,
    rating: 4.7
  }]);
  const upd = (i: number, k: string, v: any) => setItems(p => p.map((x, xi) => xi === i ? {
    ...x,
    [k]: v
  } : x));
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between">
        <div>
          <CardLabel title="Products" />
          <p className="text-[12px] mt-1" style={{
          color: T.textMuted
        }}>Latest digital goods</p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
        background: T.glowSm,
        border: `1px solid ${T.cardBorder}`
      }}>
          <Sparkles size={12} style={{
          color: T.accent
        }} />
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {items.map((item, i) => <motion.a key={i} href="#" className="flex items-center gap-3 p-2.5 rounded-xl" style={{
        background: T.glowSm,
        border: '1px solid transparent'
      }} whileHover={{
        backgroundColor: T.glowMd,
        borderColor: T.cardBorderHover
      }}>
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/[0.08]">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <Editable tag="p" value={item.title} onChange={v => upd(i, 'title', v)} className="pg-abel text-[12px] text-white uppercase tracking-[0.04em]" />
              <Editable tag="p" value={item.desc} onChange={v => upd(i, 'desc', v)} className="text-[11px] mt-0.5" style={{
            color: T.textMuted
          }} />
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star size={9} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-medium">{item.rating}</span>
            </div>
          </motion.a>)}
      </div>
    </Card>;
};
const SkillsCard = ({
  index
}: {
  index: number;
}) => {
  const [skills, setSkills] = useState([{
    label: 'UI / UX Design',
    pct: 96
  }, {
    label: 'Framer / Webflow',
    pct: 91
  }, {
    label: 'React & TypeScript',
    pct: 84
  }, {
    label: 'Brand Identity',
    pct: 78
  }]);
  const {
    editing
  } = useEdit();
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={12} style={{
        color: T.textMuted
      }} />
        <CardLabel title="Expertise" />
      </div>
      <div className="flex flex-col gap-3">
        {skills.map(({
        label,
        pct
      }, i) => <div key={i} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center gap-2">
              <Editable tag="span" value={label} onChange={v => setSkills(p => p.map((x, xi) => xi === i ? {
            ...x,
            label: v
          } : x))} className="pg-abel text-[11px] uppercase tracking-[0.06em] flex-1" style={{
            color: T.textMuted
          }} />
              {editing ? <input type="number" min="0" max="100" value={pct} onChange={e => setSkills(p => p.map((x, xi) => xi === i ? {
            ...x,
            pct: Math.max(0, Math.min(100, Number(e.target.value)))
          } : x))} className="pg-editable-field w-14 text-[10px] text-center px-1 py-0.5" style={{
            color: T.textDim
          }} /> : <span className="text-[10px] font-medium" style={{
            color: T.textDim
          }}>{pct}%</span>}
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{
          background: T.glowSm
        }}>
              <motion.div className="h-full rounded-full" style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.18))'
          }} initial={{
            width: 0
          }} animate={{
            width: `${pct}%`
          }} transition={{
            duration: 1.1,
            delay: 0.3 + i * 0.08,
            ease: [0.22, 1, 0.36, 1]
          }} />
            </div>
          </div>)}
      </div>
    </Card>;
};
const QuoteCard = ({
  index
}: {
  index: number;
}) => {
  const [quote, setQuote] = useState('"We were captivated by an extraordinary vision, reshaping our brand with unparalleled creativity and precision."');
  const [name, setName] = useState('Ava Montgomery');
  const [role, setRole] = useState('CMO, Apple');
  return <Card index={index} className="p-4 sm:p-5 flex flex-col justify-between">
      <CardLabel title="Testimonial" />
      <Divider />
      <Editable tag="p" value={quote} onChange={setQuote} multiline className="text-[12px] leading-[1.65] flex-1 py-2 w-full" style={{
      color: T.textMuted
    }} />
      <div className="flex items-center gap-2.5 mt-2">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10">
          <img src={IMG.quoteAvatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <Editable tag="p" value={name} onChange={setName} className="pg-abel text-[12px] text-white uppercase leading-tight tracking-[0.05em]" />
          <Editable tag="p" value={role} onChange={setRole} className="pg-abel text-[10px] mt-0.5 uppercase tracking-[0.06em]" style={{
          color: T.textDim
        }} />
        </div>
      </div>
    </Card>;
};
const NewsletterCard = ({
  index
}: {
  index: number;
}) => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 3000);
    }
  };
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="pg-abel text-[13px] text-white uppercase tracking-[0.06em]">Stay in the loop</p>
          <p className="text-[11px] mt-0.5" style={{
          color: T.textDim
        }}>Design notes & updates.</p>
        </div>
        <div className="flex -space-x-2 flex-shrink-0">
          {[IMG.avatarStack1, IMG.avatarStack2, IMG.avatarStack3].map((img, i) => <div key={i} className="w-6 h-6 rounded-full border-2 overflow-hidden" style={{
          borderColor: T.card,
          zIndex: 3 - i
        }}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>)}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-3 py-2 rounded-xl text-[12px] text-white placeholder-white/25 outline-none transition-all" style={{
        background: T.glowSm,
        border: `1px solid ${T.cardBorder}`
      }} />
        <motion.button type="submit" whileTap={{
        scale: 0.97
      }} className="w-full py-2 rounded-xl pg-abel text-[12px] transition-all uppercase tracking-[0.08em]" style={{
        background: done ? T.greenGlow : T.glowSm,
        color: done ? T.green : 'white',
        border: `1px solid ${done ? 'rgba(34,197,94,0.25)' : T.cardBorder}`
      }}>
          {done ? '✓ Subscribed!' : 'Subscribe · 9.6k readers'}
        </motion.button>
      </form>
    </Card>;
};
const ConsultancyCard = ({
  index
}: {
  index: number;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const options = [{
    time: '30m',
    price: '$99'
  }, {
    time: '60m',
    price: '$149'
  }, {
    time: '90m',
    price: '$199'
  }];
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
        background: T.glowSm,
        border: `1px solid ${T.cardBorder}`
      }}>
          <Coffee size={13} style={{
          color: T.accent
        }} />
        </div>
        <div>
          <p className="pg-abel text-[13px] text-white uppercase tracking-[0.06em]">1:1 Consultation</p>
          <p className="text-[11px]" style={{
          color: T.textDim
        }}>Strategy, design, or dev</p>
        </div>
      </div>
      <div className="flex gap-2">
        {options.map((opt, i) => <motion.button key={i} onClick={() => setSelected(selected === i ? null : i)} whileHover={{
        scale: 1.03
      }} whileTap={{
        scale: 0.97
      }} className="flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all text-center" style={{
        background: selected === i ? 'rgba(255,255,255,0.1)' : T.glowSm,
        border: `1px solid ${selected === i ? 'rgba(255,255,255,0.22)' : T.cardBorder}`,
        color: selected === i ? '#ffffff' : T.textMuted
      }}>
            <span className="pg-abel text-[13px] uppercase">{opt.time}</span>
            <span className="text-[11px] mt-0.5">{opt.price}</span>
          </motion.button>)}
      </div>
      <AnimatePresence>
        {selected !== null && <motion.a href="#" initial={{
        opacity: 0,
        y: 6
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 6
      }} className="flex items-center justify-center gap-1.5 py-2 rounded-xl pg-abel text-[12px] uppercase tracking-[0.08em]" style={{
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.18)'
      }}>
            <Check size={11} /> Book {options[selected].time} · {options[selected].price}
          </motion.a>}
      </AnimatePresence>
    </Card>;
};
const SocialLinksCard = ({
  index
}: {
  index: number;
}) => {
  const socials = [{
    icon: Twitter,
    label: 'Twitter',
    handle: '@alias',
    color: '#1d9bf0'
  }, {
    icon: Github,
    label: 'GitHub',
    handle: '@aliascreative',
    color: '#ffffff'
  }, {
    icon: Linkedin,
    label: 'LinkedIn',
    handle: '@alias-creative',
    color: '#0a66c2'
  }];
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3">
      <CardLabel title="Find Us" />
      <div className="flex flex-col gap-2">
        {socials.map(({
        icon: Icon,
        label,
        handle,
        color
      }) => <motion.a key={label} href="#" className="flex items-center gap-3 p-2.5 rounded-xl" style={{
        background: T.glowSm,
        border: '1px solid transparent'
      }} whileHover={{
        backgroundColor: T.glowMd,
        borderColor: T.cardBorderHover
      }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
          background: `${color}18`,
          border: `1px solid ${color}22`
        }}>
              <Icon size={13} style={{
            color
          }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="pg-abel text-[12px] text-white uppercase tracking-[0.06em]">{label}</p>
              <p className="text-[10px]" style={{
            color: T.textDim
          }}>{handle}</p>
            </div>
            <ExternalLink size={10} style={{
          color: T.textDim
        }} />
          </motion.a>)}
      </div>
    </Card>;
};
const GetInTouchCard = ({
  index
}: {
  index: number;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText('hello@aliascreative.com').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <Card index={index} className="p-4 sm:p-5 flex flex-col">
      <CardLabel title="Have a project in mind?" />
      <Divider />
      <div className="mt-3 flex-1 flex flex-col justify-end">
        <motion.button onClick={handleCopy} whileHover={{
        scale: 1.01
      }} whileTap={{
        scale: 0.97
      }} className="w-full h-10 flex items-center justify-between px-4 rounded-xl pg-abel text-[11px] uppercase tracking-[0.07em]" style={{
        background: T.glowSm,
        border: `1px solid ${T.cardBorder}`,
        color: 'white'
      }}>
          <span>{copied ? '✓ Copied!' : 'Copy email address'}</span>
          <svg viewBox="0 0 256 256" width="14" height="14" fill={T.textMuted}><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" /></svg>
        </motion.button>
      </div>
    </Card>;
};
const LargeProjectCard = ({
  title,
  desc,
  thumb,
  cover,
  index
}: {
  title: string;
  desc: string;
  thumb: string;
  cover: string;
  index: number;
}) => <Card index={index} onClick={() => {}} className="flex flex-col overflow-hidden group">
    <div className="relative h-[100px] sm:h-[120px] flex-shrink-0 overflow-hidden">
      <img src={cover} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
      <div className="absolute inset-0" style={{
      background: `linear-gradient(to bottom, transparent 40%, ${T.card} 100%)`
    }} />
    </div>
    <div className="flex flex-col flex-1 p-3 sm:p-4 pt-2.5 sm:pt-3 gap-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[8px] overflow-hidden flex-shrink-0 ring-1 ring-white/[0.08]">
          <img src={thumb} alt={title} className="w-full h-full object-cover" />
        </div>
        <span className="pg-abel text-[12px] sm:text-[13px] text-white uppercase tracking-[0.05em]">{title}</span>
      </div>
      <p className="text-[11px] leading-relaxed flex-1" style={{
      color: T.textMuted
    }}>{desc}</p>
      <div className="flex items-center gap-1 pg-abel uppercase tracking-[0.06em]" style={{
      color: T.textMuted,
      fontSize: '10px'
    }}>
        <span>Learn more</span><ChevronRight size={11} />
      </div>
    </div>
  </Card>;
const SmallProjectCard = ({
  title,
  desc,
  thumb,
  tag,
  tagVariant = 'default',
  index
}: {
  title: string;
  desc: string;
  thumb: string;
  tag?: string;
  tagVariant?: 'default' | 'new' | 'soon';
  index: number;
}) => <Card index={index} onClick={() => {}} className="p-4 sm:p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/[0.08]">
          <img src={thumb} alt={title} className="w-full h-full object-cover" />
        </div>
        <span className="pg-abel text-[12px] sm:text-[13px] text-white leading-tight uppercase tracking-[0.05em]">{title}</span>
      </div>
      {tag && <PillTag variant={tagVariant}>{tag}</PillTag>}
    </div>
    <p className="text-[11px] leading-relaxed flex-1" style={{
    color: T.textMuted
  }}>{desc}</p>
    <div className="mt-auto flex items-center gap-1 pg-abel uppercase tracking-[0.06em]" style={{
    color: T.textDim,
    fontSize: '10px'
  }}>
      <span>View project</span><ArrowUpRight size={10} />
    </div>
  </Card>;
const StackCard = ({
  index
}: {
  index: number;
}) => <Card index={index} className="p-4 sm:p-5 flex flex-col">
    <CardLabel title="Stack We Use" />
    <Divider />
    <div className="relative overflow-hidden mt-3 flex-1 flex items-center">
      <div className="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none" style={{
      background: `linear-gradient(to right, ${T.card}, transparent)`
    }} />
      <div className="absolute inset-y-0 right-0 w-8 z-10 pointer-events-none" style={{
      background: `linear-gradient(to left, ${T.card}, transparent)`
    }} />
      <div className="overflow-hidden w-full">
        <div className="flex gap-3 pg-animate-marquee w-max">
          {[...TOOLS, ...TOOLS].map((tool, i) => <div key={`${tool.name}-${i}`} className="w-11 h-11 flex items-center justify-center shrink-0 p-2 rounded-xl" style={{
          background: T.glowSm,
          border: `1px solid ${T.cardBorder}`
        }}>
              <img src={tool.src} alt={tool.name} className="w-full h-full object-contain" />
            </div>)}
        </div>
      </div>
    </div>
  </Card>;
const ContactCard = ({
  index
}: {
  index: number;
}) => {
  const socials = [{
    icon: Twitter,
    href: '#',
    label: 'Twitter'
  }, {
    icon: Linkedin,
    href: '#',
    label: 'LinkedIn'
  }, {
    icon: Instagram,
    href: '#',
    label: 'Instagram'
  }, {
    icon: Mail,
    href: '#',
    label: 'Email'
  }, {
    icon: Github,
    href: '#',
    label: 'GitHub'
  }, {
    icon: GlobeIcon,
    href: '#',
    label: 'Website'
  }];
  return <Card index={index} className="p-4 sm:p-5 flex flex-col">
      <CardLabel title="Get in Touch" />
      <Divider />
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex flex-wrap gap-2">
          {socials.map(({
          icon: Icon,
          href,
          label
        }) => <motion.a key={label} href={href} whileHover={{
          scale: 1.1,
          backgroundColor: T.glowMd
        }} whileTap={{
          scale: 0.95
        }} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{
          background: T.glowSm,
          border: `1px solid ${T.cardBorder}`
        }} title={label}>
              <Icon size={14} style={{
            color: T.textMuted
          }} />
            </motion.a>)}
        </div>
      </div>
    </Card>;
};
const Cell = ({
  children,
  col = 'col-span-1',
  row = 'row-span-1'
}: {
  children: React.ReactNode;
  col?: string;
  row?: string;
}) => <div className={`${col} ${row} min-h-0`}>{children}</div>;
const PortfolioSection = () => <SectionWrapper id="pg-portfolio" label="Portfolio">
    {() => <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-8 sm:py-12">
        {/* Section heading */}
        <motion.div initial={{
      opacity: 0,
      y: 16
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.5
    }} className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px" style={{
          background: T.textDim
        }} />
            <span className="pg-abel text-[10px] sm:text-[11px] tracking-[0.25em] uppercase" style={{
          color: T.textDim
        }}>Portfolio & Metrics</span>
          </div>
          <h2 className="pg-abel text-[clamp(24px,4vw,48px)] leading-none tracking-tight text-zinc-100 uppercase">
            ALIAS <span className="text-zinc-600">Studio Dashboard</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 auto-rows-[minmax(140px,auto)]">
          <Cell col="col-span-2 sm:col-span-4 lg:col-span-4"><HeroCard index={0} /></Cell>
          <Cell col="col-span-1 sm:col-span-2 lg:col-span-1"><ModeCard index={1} /></Cell>
          <Cell col="col-span-1 sm:col-span-2 lg:col-span-1"><ClockCard index={2} /></Cell>

          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><AboutCard index={3} /></Cell>
          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><ProjectsCard index={4} /></Cell>
          <Cell col="col-span-2 sm:col-span-4 lg:col-span-2" row="row-span-2"><ShowcaseCard index={5} /></Cell>

          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2" row="row-span-2"><ExperienceCard index={6} /></Cell>
          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><NewsletterCard index={7} /></Cell>

          <Cell col="col-span-1 sm:col-span-2 lg:col-span-1" row="row-span-2">
            <LargeProjectCard index={8} title="Mocku · Design" desc="Your design partner for cost-effective solutions." thumb={IMG.mockuThumb} cover={IMG.mockuCover} />
          </Cell>
          <Cell col="col-span-1 sm:col-span-2 lg:col-span-1" row="row-span-2">
            <LargeProjectCard index={9} title="Wallpaper Pack" desc="Watercolor Bliss — wallpapers up to 6K." thumb={IMG.wallpaperThumb} cover={IMG.wallpaperCover} />
          </Cell>

          <Cell col="col-span-1 lg:col-span-1"><ProjectImageCard title="Cashless" image={IMG.cashless} index={10} className="h-full min-h-[140px]" /></Cell>
          <Cell col="col-span-1 lg:col-span-1"><ProjectImageCard title="Job Portal" image={IMG.jobPortal} index={11} className="h-full min-h-[140px]" /></Cell>

          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><ProductsCard index={12} /></Cell>
          <Cell col="col-span-1 sm:col-span-2 lg:col-span-1"><SmallProjectCard index={13} title="Design Journal" desc="Videos about Framer, interfaces, and building in public." thumb={IMG.journalThumb} tag="NEW" tagVariant="new" /></Cell>
          <Cell col="col-span-1 sm:col-span-2 lg:col-span-1"><SmallProjectCard index={14} title="Intro to UX" desc="Figma course — Learn to create digital experiences." thumb={IMG.uxThumb} tag="SOON" tagVariant="soon" /></Cell>

          <Cell col="col-span-2 sm:col-span-1 lg:col-span-1"><ProjectImageCard title="BoostPro" image={IMG.boostPro} index={15} className="h-full min-h-[140px]" /></Cell>
          <Cell col="col-span-2 sm:col-span-3 lg:col-span-3"><StackCard index={16} /></Cell>

          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><ConsultancyCard index={17} /></Cell>
          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><SkillsCard index={18} /></Cell>
          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2" row="row-span-2"><QuoteCard index={19} /></Cell>

          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><SocialLinksCard index={20} /></Cell>
          <Cell col="col-span-2 sm:col-span-2 lg:col-span-2"><ContactCard index={21} /></Cell>

          <Cell col="col-span-2 sm:col-span-4 lg:col-span-4"><GetInTouchCard index={22} /></Cell>
        </div>
      </div>}
  </SectionWrapper>;

// ─────────────────────────────────────────────
// ══ SECTION 3 — SERVICES ══
// ─────────────────────────────────────────────
interface ServiceItem {
  num: string;
  title: string;
  description: string;
  subFeatures: string[];
  Icon: React.ElementType;
  accent: Accent;
}
const defaultServices: ServiceItem[] = [{
  num: '01',
  title: 'Website Design & Development',
  description: 'End-to-end bespoke web experiences crafted with pixel-level precision and performance-first engineering.',
  subFeatures: ['Custom responsive builds', 'CMS integration & headless', 'Performance & SEO optimisation'],
  Icon: GlobeIcon,
  accent: 'cyan'
}, {
  num: '02',
  title: 'Landing Pages & Marketing',
  description: 'High-conversion landing pages that distil brand narrative into compelling, measurable campaigns.',
  subFeatures: ['Conversion-optimised layouts', 'A/B testing & analytics', 'Email & ad creative systems'],
  Icon: Megaphone,
  accent: 'teal'
}, {
  num: '03',
  title: 'Product UX/UI & Systems',
  description: 'Holistic product design from research through to production-ready component libraries and design tokens.',
  subFeatures: ['User research & wireframing', 'Design systems & tokens', 'Prototyping & usability testing'],
  Icon: Layers,
  accent: 'amber'
}, {
  num: '04',
  title: 'Motion Design & 3D',
  description: 'Kinetic brand storytelling through fluid animation, immersive 3D environments and interactive micro-interactions.',
  subFeatures: ['Framer Motion & GSAP', 'Three.js & WebGL', 'Brand motion identities'],
  Icon: Zap,
  accent: 'cyan'
}, {
  num: '05',
  title: 'Full Stack Cross-Platform',
  description: 'Native-quality applications across every platform with a dedicated Apple Ecosystem focus.',
  subFeatures: ['Swift / SwiftUI • Apple', 'React Native & Expo', 'Node.js, Supabase & edge'],
  Icon: Smartphone,
  accent: 'teal'
}, {
  num: '06',
  title: 'Content Strategy',
  description: 'Brand voice architecture and structured content programs that build authority and drive sustained growth.',
  subFeatures: ['Editorial & copy direction', 'SEO content planning', 'Social & multimedia assets'],
  Icon: FileText,
  accent: 'amber'
}];
const ServiceDetailCard = ({
  service,
  index
}: {
  service: ServiceItem;
  index: number;
}) => {
  const [data, setData] = useState(service);
  const {
    editing
  } = useEdit();
  const ac = accentMap[data.accent];
  const updFeat = (i: number, v: string) => setData(p => {
    const f = [...p.subFeatures];
    f[i] = v;
    return {
      ...p,
      subFeatures: f
    };
  });
  return <Card index={index} className={`p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 group ${ac.border} ${ac.glow}`} accentGlow={data.accent}>
      <div className="relative z-10 flex items-start justify-between">
        <span className="pg-abel text-[40px] sm:text-[48px] leading-none select-none" style={{
        color: 'rgba(255,255,255,0.05)'
      }}>{data.num}</span>
        <AccentBadge Icon={data.Icon} accent={data.accent} />
      </div>
      <Editable tag="h3" value={data.title} onChange={v => setData(p => ({
      ...p,
      title: v
    }))} className={`pg-abel relative z-10 text-[12px] sm:text-[13px] leading-snug tracking-[0.1em] text-zinc-100 uppercase`} />
      <Editable tag="p" value={data.description} onChange={v => setData(p => ({
      ...p,
      description: v
    }))} multiline className="pg-abel relative z-10 text-[11px] sm:text-[12px] text-zinc-500 leading-relaxed flex-1 w-full" />
      <ul className="relative z-10 flex flex-col gap-1.5 border-t pt-3" style={{
      borderColor: T.cardBorder
    }}>
        {data.subFeatures.map((feat, i) => <li key={i} className="flex items-start gap-2.5">
            <span className="mt-[6px] w-1 h-1 rounded-full border border-white/20 shrink-0" />
            <div className="flex-1 flex items-center gap-1.5">
              <Editable tag="span" value={feat} onChange={v => updFeat(i, v)} className="pg-abel text-[10px] sm:text-[11px] text-zinc-600 leading-relaxed" />
              {editing && <button onClick={() => setData(p => ({
            ...p,
            subFeatures: [...p.subFeatures, 'New feature']
          }))} className="flex items-center gap-1 text-[10px] pg-abel uppercase tracking-wider mt-1" style={{
            color: T.editAccent
          }}>
              <Plus size={8} /> Add feature
            </button>}
            </div>
          </li>)}
        {editing && <li>
            <button onClick={() => setData(p => ({
          ...p,
          subFeatures: [...p.subFeatures, 'New feature']
        }))} className="flex items-center gap-1 text-[10px] pg-abel uppercase tracking-wider mt-1" style={{
          color: T.editAccent
        }}>
              <Plus size={8} /> Add feature
            </button>
          </li>}
      </ul>
    </Card>;
};
const ProjectSpotlightCard = ({
  index
}: {
  index: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, {
    stiffness: 60,
    damping: 20
  });
  const springY = useSpring(mouseY, {
    stiffness: 60,
    damping: 20
  });
  const rotateX = useTransform(springY, [-100, 100], [6, -6]);
  const rotateY = useTransform(springX, [-100, 100], [-6, 6]);
  const ref = useRef<HTMLDivElement>(null);
  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  return <motion.div ref={ref} custom={index} variants={scaleIn} initial="hidden" animate="visible" onMouseMove={handleMouse} onMouseLeave={() => {
    mouseX.set(0);
    mouseY.set(0);
  }} className="relative overflow-hidden rounded-2xl flex flex-col h-full p-5 sm:p-6 group pg-hover-glow-accent hover:border-cyan-500/25 transition-all duration-300 pg-glass-surface" style={{
    border: `1px solid ${T.cardBorder}`
  }}>
      <GridOverlay /><Dots />
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none pg-glow-pulse" />
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-900/30 border border-cyan-500/25 flex items-center justify-center">
            <Sparkles size={14} className="text-cyan-400" strokeWidth={1.5} />
          </div>
          <span className="pg-abel text-[10px] tracking-[0.22em] text-zinc-500 uppercase">Project Spotlight</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pg-glow-pulse" />
          <span className="pg-abel text-[10px] text-zinc-600 tracking-wider">LIVE</span>
        </div>
      </div>
      <motion.div style={{
      rotateX,
      rotateY,
      transformPerspective: 600
    }} className="relative z-10 flex-1 flex items-center justify-center my-2">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/[0.07] animate-spin" style={{
          animationDuration: '20s'
        }} />
          <div className="absolute inset-4 rounded-full border border-cyan-500/15 animate-spin" style={{
          animationDuration: '14s',
          animationDirection: 'reverse'
        }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pg-orbit-node absolute">
              <div className="w-4 h-4 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center">
                <Triangle size={6} className="text-cyan-400" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="absolute inset-6 flex items-center justify-center">
            <div className="pg-orbit-node-rev absolute">
              <div className="w-3 h-3 rounded-full bg-teal-900/60 border border-teal-500/40 flex items-center justify-center">
                <Circle size={5} className="text-teal-400" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="pg-float-icon relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0e0e12] border border-cyan-500/25 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Hexagon size={26} className="text-cyan-400" strokeWidth={1} />
          </div>
        </div>
      </motion.div>
      <div className="relative z-10 mt-auto pt-4 border-t" style={{
      borderColor: 'rgba(255,255,255,0.05)'
    }}>
        <h3 className="pg-abel text-[18px] sm:text-[20px] leading-tight tracking-tight text-zinc-100 mb-1.5 uppercase">
          Unified <span className="text-cyan-400">Dashboard</span>
        </h3>
        <p className="pg-abel text-[11px] sm:text-[12px] text-zinc-600 leading-relaxed">All your services, metrics, and creative workflows in one intelligent command centre.</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['React', 'Three.js', 'Framer'].map(tag => <span key={tag} className="pg-abel text-[10px] tracking-widest text-cyan-400/80 px-2 py-0.5 rounded-md bg-cyan-900/20 border border-cyan-500/15">{tag}</span>)}
        </div>
      </div>
    </motion.div>;
};
const MetricCard = ({
  value,
  label,
  sublabel,
  Icon,
  accent,
  trend,
  index
}: {
  value: string;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  accent: Accent;
  trend?: string;
  index: number;
}) => {
  const [vals, setVals] = useState({
    value,
    label,
    sublabel,
    trend: trend ?? ''
  });
  const ac = accentMap[accent];
  return <Card index={index} className={`p-4 sm:p-5 flex flex-col gap-3 group ${ac.border} ${ac.glow}`} accentGlow={accent}>
      <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none ${accent === 'teal' ? 'bg-teal-500/[0.07]' : 'bg-amber-500/[0.07]'}`} />
      <AccentBadge Icon={Icon} accent={accent} />
      <div className="relative z-10 mt-auto">
        <Editable tag="p" value={vals.value} onChange={v => setVals(p => ({
        ...p,
        value: v
      }))} className={`pg-abel text-[30px] sm:text-[36px] leading-none tracking-tight ${ac.text} mb-0.5`} />
        <Editable tag="p" value={vals.label} onChange={v => setVals(p => ({
        ...p,
        label: v
      }))} className="pg-abel text-[12px] sm:text-[13px] text-zinc-300 tracking-wide uppercase leading-snug" />
        <Editable tag="p" value={vals.sublabel} onChange={v => setVals(p => ({
        ...p,
        sublabel: v
      }))} className="pg-abel text-[10px] sm:text-[11px] text-zinc-600 mt-1 leading-relaxed" />
        {vals.trend && <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={10} className={ac.text} />
            <Editable tag="span" value={vals.trend} onChange={v => setVals(p => ({
          ...p,
          trend: v
        }))} className={`pg-abel text-[10px] ${ac.text} tracking-wider`} />
          </div>}
      </div>
    </Card>;
};
const StatsBarCard = ({
  index
}: {
  index: number;
}) => {
  const [bars, setBars] = useState([72, 88, 55, 94, 67, 80, 91]);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const {
    editing
  } = useEdit();
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-4 group hover:border-white/[0.12]">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
          background: T.glowSm,
          border: `1px solid ${T.cardBorder}`
        }}>
            <BarChart3 size={13} style={{
            color: T.textMuted
          }} strokeWidth={1.5} />
          </div>
          <span className="pg-abel text-[10px] tracking-[0.2em] uppercase" style={{
          color: T.textMuted
        }}>Weekly Activity</span>
        </div>
        <span className="pg-abel text-[10px] tracking-wider" style={{
        color: T.textDim
      }}>7d avg</span>
      </div>
      <div className="relative z-10 flex items-end gap-1 sm:gap-1.5 h-14 sm:h-16 mt-auto">
        {bars.map((h, i) => <div key={i} className="flex-1 flex flex-col items-center gap-1">
            {editing ? <input type="range" min="10" max="100" value={h} onChange={e => setBars(p => p.map((b, bi) => bi === i ? Number(e.target.value) : b))} className="w-full" style={{
          height: `60px`,
          writingMode: 'vertical-lr',
          direction: 'rtl'
        }} /> : <motion.div className="w-full rounded-sm bg-gradient-to-t from-cyan-600/60 to-cyan-400/30" initial={{
          scaleY: 0
        }} animate={{
          scaleY: 1
        }} transition={{
          delay: 0.4 + i * 0.05,
          duration: 0.4,
          ease: 'easeOut'
        }} style={{
          height: `${h}%`,
          transformOrigin: 'bottom'
        }} />}
            <span className="pg-abel text-[8px]" style={{
          color: T.textDim
        }}>{days[i]}</span>
          </div>)}
      </div>
    </Card>;
};
const LiveStatusCard = ({
  index
}: {
  index: number;
}) => {
  const statuses = [{
    label: 'API Gateway',
    ok: true
  }, {
    label: 'CDN Edge',
    ok: true
  }, {
    label: 'DB Cluster',
    ok: true
  }, {
    label: 'Auth Service',
    ok: true
  }];
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 group hover:border-emerald-500/20 pg-hover-glow-emerald" accentGlow="emerald">
      <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-emerald-500/[0.05] blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center">
            <Activity size={13} className="text-emerald-400" strokeWidth={1.5} />
          </div>
          <span className="pg-abel text-[10px] tracking-[0.2em] uppercase" style={{
          color: T.textMuted
        }}>System Status</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pg-glow-pulse" />
          <span className="pg-abel text-[10px] text-emerald-500">ALL SYSTEMS</span>
        </div>
      </div>
      <ul className="relative z-10 flex flex-col gap-2 mt-auto">
        {statuses.map(s => <li key={s.label} className="flex items-center justify-between">
            <span className="pg-abel text-[11px] sm:text-[11.5px]" style={{
          color: T.textMuted
        }}>{s.label}</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-10 sm:w-12 rounded-full bg-emerald-900/40 overflow-hidden">
                <div className="h-full w-full rounded-full bg-emerald-500/60" />
              </div>
              <span className="pg-abel text-[10px] text-emerald-600">OK</span>
            </div>
          </li>)}
      </ul>
    </Card>;
};
const TechStackTickerCard = ({
  index
}: {
  index: number;
}) => {
  const [techs, setTechs] = useState(['React', 'TypeScript', 'SwiftUI', 'Three.js', 'Framer Motion', 'Supabase', 'Node.js', 'Tailwind']);
  const {
    editing
  } = useEdit();
  return <Card index={index} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 group hover:border-white/[0.12]">
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
          background: T.glowSm,
          border: `1px solid ${T.cardBorder}`
        }}>
            <Code2 size={13} style={{
            color: T.textMuted
          }} strokeWidth={1.5} />
          </div>
          <span className="pg-abel text-[10px] tracking-[0.2em] uppercase" style={{
          color: T.textMuted
        }}>Tech Stack</span>
        </div>
        {editing && <button onClick={() => setTechs(p => [...p, 'New Tech'])} className="flex items-center gap-1 text-[10px] pg-abel uppercase tracking-wider px-2 py-0.5 rounded-lg" style={{
        color: T.editAccent,
        background: 'rgba(6,182,212,0.08)',
        border: '1px solid rgba(6,182,212,0.2)'
      }}>
            <Plus size={8} /> Add
          </button>}
      </div>
      <div className="relative z-10 flex flex-wrap gap-2">
        {techs.map((t, i) => <div key={i} className="flex items-center gap-1">
            {editing ? <>
                <input value={t} onChange={e => setTechs(p => p.map((x, xi) => xi === i ? e.target.value : x))} className="pg-editable-field text-[11px] px-2 py-0.5 w-24" style={{
            color: T.textMuted
          }} />
                <button onClick={() => setTechs(p => p.filter((_, xi) => xi !== i))}><Trash2 size={9} className="text-red-500/60" /></button>
              </> : <motion.span initial={{
          opacity: 0,
          scale: 0.85
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.5 + i * 0.05
        }} className="pg-abel text-[11px] tracking-widest px-2.5 py-1 rounded-lg cursor-default transition-all duration-200 hover:text-zinc-200" style={{
          color: T.textMuted,
          background: T.glowSm,
          border: `1px solid ${T.cardBorder}`
        }}>
                {t}
              </motion.span>}
          </div>)}
      </div>
    </Card>;
};
const ServicesSection = () => {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [sectionTitle, setSectionTitle] = useState('From Concept');
  const [sectionSub, setSectionSub] = useState('to Launch.');
  const [sectionDesc, setSectionDesc] = useState('A full-spectrum creative & engineering studio. Every discipline, one cohesive command centre.');
  return <SectionWrapper id="pg-services" label="Services">
      {editing => <EditCtx.Provider value={{
      editing
    }}>
          <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-8 sm:py-12 md:py-16 flex flex-col gap-8 sm:gap-10">
            {/* Header */}
            <motion.div initial={{
          opacity: 0,
          y: 18
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-px bg-zinc-600" />
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 pg-glow-pulse" />
                  <span className="pg-abel text-[10px] sm:text-[11px] tracking-widest uppercase" style={{
                color: T.textDim
              }}>Services & Capabilities</span>
                </div>
              </div>
              <div>
                <Editable tag="h2" value={sectionTitle} onChange={setSectionTitle} className="pg-abel text-[clamp(28px,5vw,60px)] leading-none tracking-tight text-zinc-100 uppercase" />
                <Editable tag="h2" value={sectionSub} onChange={setSectionSub} className="pg-abel text-[clamp(28px,5vw,60px)] leading-none tracking-tight uppercase" style={{
              color: T.textDim
            }} />
              </div>
              <Editable tag="p" value={sectionDesc} onChange={setSectionDesc} multiline className="pg-abel text-[13px] sm:text-[14px] leading-relaxed mt-1 max-w-lg w-full" style={{
            color: T.textMuted
          }} />
            </motion.div>

            {/* Services bento 4-col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 auto-rows-[minmax(260px,auto)] lg:auto-rows-[280px]">
              <ServiceDetailCard service={services[0]} index={0} />
              <ServiceDetailCard service={services[1]} index={1} />
              <div className="col-span-1 sm:col-span-2 row-span-1 lg:row-span-2"><ProjectSpotlightCard index={2} /></div>
              <MetricCard value="99%" label="Uptime" sublabel="Guaranteed SLA across all hosted projects" Icon={Shield} accent="teal" trend="+0.2% this quarter" index={3} />
              <MetricCard value="24h" label="Support" sublabel="Round-the-clock response for every engagement" Icon={Clock} accent="amber" trend="avg 1.4h response" index={4} />
              <ServiceDetailCard service={services[2]} index={5} />
              <ServiceDetailCard service={services[3]} index={6} />
              <StatsBarCard index={7} />
              <LiveStatusCard index={8} />
              <ServiceDetailCard service={services[4]} index={9} />
              <ServiceDetailCard service={services[5]} index={10} />
              <div className="col-span-1 sm:col-span-2"><TechStackTickerCard index={11} /></div>
            </div>
          </div>
        </EditCtx.Provider>}
    </SectionWrapper>;
};

// ─────────────────────────────────────────────
// ══ SECTION 4 — BREAKDOWN ══
// ─────────────────────────────────────────────
const defaultBreakdown = [{
  heading: 'Design & UX',
  Icon: Palette,
  items: ['Visual identity & branding', 'Wireframes & user flows', 'Component library architecture', 'Accessibility (WCAG AA)', 'Design tokens & theming', 'Figma → production handoff']
}, {
  heading: 'Motion & Content',
  Icon: Film,
  items: ['Lottie & SVG animation', 'Three.js 3D scenes', 'Video editing & post', 'Copywriting & tone of voice', 'Content calendars', 'Podcast & media production']
}, {
  heading: 'Apple & Cross-Platform',
  Icon: Watch,
  items: ['SwiftUI — iOS & macOS', 'watchOS & tvOS apps', 'App Store optimisation', 'React Native (iOS/Android)', 'Electron desktop apps', 'PWA & offline-first builds']
}];
const BreakdownSection = () => {
  const [cols, setCols] = useState(defaultBreakdown.map(c => ({
    ...c,
    items: [...c.items]
  })));
  const updItem = (ci: number, ii: number, v: string) => setCols(p => p.map((c, ci2) => ci2 === ci ? {
    ...c,
    items: c.items.map((x, xi) => xi === ii ? v : x)
  } : c));
  const addItem = (ci: number) => setCols(p => p.map((c, ci2) => ci2 === ci ? {
    ...c,
    items: [...c.items, 'New item']
  } : c));
  const removeItem = (ci: number, ii: number) => setCols(p => p.map((c, ci2) => ci2 === ci ? {
    ...c,
    items: c.items.filter((_, xi) => xi !== ii)
  } : c));
  return <SectionWrapper id="pg-breakdown" label="Breakdown" minHeight="min-h-screen">
      {editing => <EditCtx.Provider value={{
      editing
    }}>
          <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-8 sm:py-12 md:py-16 flex flex-col gap-10 sm:gap-14">
            {/* Header */}
            <motion.div initial={{
          opacity: 0,
          y: 16
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-px" style={{
              background: T.textDim
            }} />
                <span className="pg-abel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase" style={{
              color: T.textDim
            }}>Detailed Breakdown</span>
              </div>
              <h2 className="pg-abel text-[clamp(28px,5vw,56px)] leading-none tracking-tight text-zinc-100 uppercase">
                WHAT'S
              </h2>
              <h2 className="pg-abel text-[clamp(28px,5vw,56px)] leading-none tracking-tight text-white uppercase">INCLUDED.</h2>
            </motion.div>

            {/* Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {cols.map((col, ci) => <motion.div key={ci} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: '-60px'
          }} transition={{
            delay: ci * 0.1,
            duration: 0.55,
            ease: 'easeOut'
          }} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 pb-3 border-b" style={{
              borderColor: T.cardBorder
            }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
                background: T.glowSm,
                border: `1px solid ${T.cardBorder}`
              }}>
                      <col.Icon size={13} style={{
                  color: T.textMuted
                }} strokeWidth={1.5} />
                    </div>
                    <Editable tag="span" value={col.heading} onChange={v => setCols(p => p.map((c, ci2) => ci2 === ci ? {
                ...c,
                heading: v
              } : c))} className="pg-abel text-[11px] tracking-[0.18em] uppercase" style={{
                color: T.textMuted
              }} />
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {col.items.map((item, ii) => <li key={ii} className="flex items-start gap-2.5">
                        <span className="mt-[6px] w-[5px] h-[5px] rounded-full border border-white/20 shrink-0" />
                        <div className="flex-1 flex items-center gap-1.5">
                          <Editable tag="span" value={item} onChange={v => updItem(ci, ii, v)} className="pg-abel text-[12px] sm:text-[13px] leading-relaxed flex-1" style={{
                    color: T.textMuted
                  }} />
                          {editing && <button onClick={() => removeItem(ci, ii)}><Trash2 size={9} className="text-red-500/50" /></button>}
                        </div>
                      </li>)}
                    {editing && <li>
                        <button onClick={() => addItem(ci)} className="flex items-center gap-1 text-[10px] pg-abel uppercase tracking-wider mt-1" style={{
                  color: T.editAccent
                }}>
                          <Plus size={8} /> Add item
                        </button>
                      </li>}
                  </ul>
                </motion.div>)}
            </div>
          </div>
        </EditCtx.Provider>}
    </SectionWrapper>;
};

// ─────────────────────────────────────────────
// ══ SECTION 5 — CONTACT ══
// ─────────────────────────────────────────────
const ContactSection = () => {
  const [heading, setHeading] = useState("Let's work\ntogether.");
  const [sub, setSub] = useState('We take on a limited number of engagements per quarter. Fill out the brief so we can understand your scope.');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      setSent(true);
      setEmail('');
      setMessage('');
      setTimeout(() => setSent(false), 4000);
    }
  };
  return <SectionWrapper id="pg-contact" label="Contact" minHeight="min-h-screen">
      {editing => <EditCtx.Provider value={{
      editing
    }}>
          <div className="flex-1 flex flex-col lg:flex-row items-stretch px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-8 sm:py-12 md:py-16 gap-8 lg:gap-16">

            {/* Left */}
            <div className="flex-1 flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div>
                  {heading.split('\n').map((line, i) => <h2 key={i} className="pg-abel text-[clamp(32px,6vw,72px)] leading-none tracking-tight text-white uppercase">{line}</h2>)}
                  {editing && <div className="mt-2">
                      <textarea value={heading} onChange={e => setHeading(e.target.value)} rows={2} className="pg-editable-field w-full px-2 py-1 text-[14px] text-white" placeholder="Heading (use \n for line breaks)" />
                    </div>}
                </div>
                <Editable tag="p" value={sub} onChange={setSub} multiline className="pg-abel text-[13px] sm:text-[14px] leading-relaxed max-w-md w-full" style={{
              color: T.textMuted
            }} />
              </div>

              {/* Social row */}
              <div className="flex flex-wrap gap-2">
                {[{
              icon: Twitter,
              label: 'Twitter'
            }, {
              icon: Linkedin,
              label: 'LinkedIn'
            }, {
              icon: Instagram,
              label: 'Instagram'
            }, {
              icon: Github,
              label: 'GitHub'
            }, {
              icon: Mail,
              label: 'Email'
            }].map(({
              icon: Icon,
              label
            }) => <motion.a key={label} href="#" whileHover={{
              scale: 1.08,
              backgroundColor: T.glowMd
            }} whileTap={{
              scale: 0.95
            }} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors" style={{
              background: T.glowSm,
              border: `1px solid ${T.cardBorder}`
            }} title={label}>
                    <Icon size={14} style={{
                color: T.textMuted
              }} />
                  </motion.a>)}
              </div>
            </div>

            {/* Right: form */}
            <div className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0">
              <AnimatePresence mode="wait">
                {sent ? <motion.div key="success" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} className="h-full flex flex-col items-center justify-center gap-4 rounded-2xl p-8 sm:p-10" style={{
              border: `1px solid ${T.cardBorder}`,
              background: T.glowSm
            }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: T.greenGlow,
                border: '1px solid rgba(34,197,94,0.2)'
              }}>
                      <Check size={20} style={{
                  color: T.green
                }} />
                    </div>
                    <p className="pg-abel text-[16px] text-white uppercase tracking-[0.08em]">Message Sent!</p>
                    <p className="pg-abel text-[12px] text-center" style={{
                color: T.textMuted
              }}>We'll get back to you within 24 hours.</p>
                  </motion.div> : <motion.form key="form" onSubmit={handleSubmit} initial={{
              opacity: 0,
              y: 16
            }} animate={{
              opacity: 1,
              y: 0
            }} className="flex flex-col gap-4 rounded-2xl p-6 sm:p-8 pg-glass-surface" style={{
              border: `1px solid ${T.cardBorder}`
            }}>
                    <GridOverlay />
                    <div className="relative z-10">
                      <p className="pg-abel text-[10px] tracking-[0.25em] uppercase mb-5" style={{
                  color: T.textDim
                }}>Start a project</p>
                      <div className="flex flex-col gap-3">
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder-white/20 outline-none transition-all" style={{
                    background: T.glowSm,
                    border: `1px solid ${T.cardBorder}`
                  }} onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'} onBlur={e => e.target.style.borderColor = T.cardBorder} />
                        <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about your project..." rows={5} className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder-white/20 outline-none resize-none transition-all" style={{
                    background: T.glowSm,
                    border: `1px solid ${T.cardBorder}`
                  }} onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'} onBlur={e => e.target.style.borderColor = T.cardBorder} />
                        <motion.button type="submit" whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.97
                  }} className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl pg-abel text-[12px] uppercase tracking-[0.1em] text-white transition-all" style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}>
                          Send message <Send size={13} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.form>}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer bar */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-5 border-t" style={{
        borderColor: T.cardBorder
      }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="pg-abel text-[12px] text-white uppercase tracking-[0.08em]">ALIAS Creative</p>
                <p className="text-[11px] mt-0.5" style={{
              color: T.textDim
            }}>© {new Date().getFullYear()} · All rights reserved.</p>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {['Work', 'About', 'Services', 'Contact'].map(label => <a key={label} href="#" className="px-2.5 py-1.5 rounded-lg pg-abel text-[11px] transition-all hover:text-white uppercase tracking-[0.08em]" style={{
              color: T.textDim
            }} onMouseEnter={e => e.currentTarget.style.background = T.glowSm} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {label}
                  </a>)}
              </div>
            </div>
          </div>
        </EditCtx.Provider>}
    </SectionWrapper>;
};

// ─────────────────────────────────────────────
// ══ MAIN EXPORT ══
// ─────────────────────────────────────────────
export const PortfolioGrid = () => {
  const [activeSection, setActiveSection] = useState('pg-hero');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveSection(e.target.id);
      });
    }, {
      threshold: 0.3
    });
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return <div className="w-full" style={{
    background: T.bg
  }}>
      <GlobalStyles />

      {/* Side nav dots */}
      <SectionNavDots active={activeSection} />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.012) 0%, transparent 65%)'
      }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.008) 0%, transparent 65%)'
      }} />
      </div>

      {/* Sections */}
      <HeroSection />
      <PortfolioSection />
      <ServicesSection />
      <BreakdownSection />
      <ContactSection />
    </div>;
};
export default PortfolioGrid;