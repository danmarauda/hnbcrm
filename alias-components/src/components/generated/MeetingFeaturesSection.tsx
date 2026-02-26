import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mic, FileText, Target, Layers, ClipboardList, CheckCircle2, Sparkles, ArrowRight, ChevronDown, MessageSquare, Compass, BarChart2, TrendingUp, Users, Globe, Pen, LayoutGrid, Palette, Eye, Sliders, Code2, GitBranch, Zap, ShieldCheck, Rocket, Bug, MonitorCheck, BadgeCheck, HeartHandshake, Bell, RefreshCw, LineChart, FlaskConical, Activity, ChevronRight } from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#030303',
  card: '#0B0B0B',
  cardBorder: 'rgba(255,255,255,0.07)',
  inner: '#0F0F0F',
  innerBorder: 'rgba(255,255,255,0.04)',
  surface: '#1a1a1a',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.4)',
  textDim: 'rgba(255,255,255,0.25)'
};

// ─── Shared types ─────────────────────────────────────────────────────────────
interface PanelItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  detail: string;
  delay: number;
}
interface TranscriptItem {
  id: string;
  speaker: string;
  time: string;
  text: string;
  tag?: string;
  tagColor?: string;
}
interface Stat {
  value: string;
  label: string;
}
interface StepDef {
  num: string; // '01'
  stepLabel: string; // 'Discovery Meeting'
  breadcrumb: string; // 'Discovery'
  headline: string;
  headlineDim: string;
  accentClass: string; // tailwind colour for active step pill
  accentBgClass: string;
  accentBorderClass: string;
  dotClass: string;
  steps: string[];
  stats: Stat[];
  leftTag: string;
  leftTagIcon: React.ReactNode;
  leftTagClass: string;
  leftBgClass?: string;
  leftTitle: string;
  leftSub: string;
  transcripts: TranscriptItem[];
  rightTag: string;
  rightTagIcon: React.ReactNode;
  rightTagClass: string;
  rightTitle: string;
  rightSub: string;
  briefTitle: string;
  briefMeta: React.ReactNode;
  requirements: PanelItem[];
  ctaLeft: string;
  ctaRight: string;
}

// ─── Animated Waveform ────────────────────────────────────────────────────────
const HEIGHTS = [14, 22, 18, 28, 16, 24, 30, 20, 26, 14, 22, 32, 18, 24, 16, 28, 22, 30, 18, 14, 26, 20, 32, 16, 24, 28, 18, 22, 14, 30, 20, 26, 16, 32, 22, 18, 28, 14, 24, 20, 30, 16, 22, 28, 18, 32, 14, 24, 20, 26];
const AnimatedWaveform = ({
  isPlaying
}: {
  isPlaying: boolean;
}) => <div className="flex items-center justify-center gap-[3px] h-[34px] overflow-hidden">
    {HEIGHTS.map((h, i) => <motion.div key={i} className="w-[2.5px] rounded-full bg-white" style={{
    originY: 0.5
  }} animate={isPlaying ? {
    height: [`${h * 0.5}px`, `${h}px`, `${h * 0.65}px`, `${h * 0.9}px`, `${h * 0.5}px`],
    opacity: [0.5, 1, 0.7, 0.9, 0.5]
  } : {
    height: `${h * 0.45}px`,
    opacity: 0.3
  }} transition={isPlaying ? {
    duration: 1.2 + i % 7 * 0.18,
    repeat: Infinity,
    ease: 'easeInOut',
    delay: i % 11 * 0.07
  } : {
    duration: 0.4
  }} />)}
  </div>;

// ─── Transcript Bubble ────────────────────────────────────────────────────────
const TranscriptBubble = ({
  item,
  isActive
}: {
  item: TranscriptItem;
  isActive: boolean;
}) => <div className={`flex flex-col gap-2 p-3 rounded-xl transition-all duration-500 ${isActive ? 'bg-[#171717] opacity-100' : 'bg-[#171717]/40 opacity-40 scale-[0.98]'}`}>
    <div className="flex items-center gap-2 flex-wrap">
      <div className="bg-[#262626] px-2 py-0.5 rounded text-[10px] font-medium text-white/60">{item.time}</div>
      <span className="text-[11px] text-white/50">{item.speaker}</span>
      {item.tag && <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium ${item.tagColor ?? 'bg-indigo-500/20 text-indigo-300'}`}>{item.tag}</span>}
    </div>
    <p className={`text-xs leading-relaxed ${isActive ? 'text-white/85' : 'text-white/20'}`}>{item.text}</p>
  </div>;

// ─── Requirement Row ──────────────────────────────────────────────────────────
const RequirementRow = ({
  item,
  index,
  inView,
  total
}: {
  item: PanelItem;
  index: number;
  inView: boolean;
  total: number;
}) => <motion.div className="flex gap-3" initial={{
  opacity: 0,
  x: 18
}} animate={inView ? {
  opacity: 1,
  x: 0
} : {
  opacity: 0,
  x: 18
}} transition={{
  duration: 0.4,
  delay: item.delay,
  ease: 'easeOut'
}}>
    <div className="flex flex-col items-center shrink-0 w-5 pt-1">
      <motion.div className="w-4 h-4 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center z-10" initial={{
      scale: 0
    }} animate={inView ? {
      scale: 1
    } : {
      scale: 0
    }} transition={{
      duration: 0.3,
      delay: item.delay + 0.1
    }}>
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </motion.div>
      {index < total - 1 && <motion.div className="w-px flex-1 bg-white/5 mt-1" initial={{
      scaleY: 0
    }} animate={inView ? {
      scaleY: 1
    } : {
      scaleY: 0
    }} style={{
      originY: 0
    }} transition={{
      duration: 0.3,
      delay: item.delay + 0.2
    }} />}
    </div>
    <div className="flex-1 bg-[#0F0F0F] rounded-xl p-2.5 mb-2.5 border border-white/[0.04] flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <div className="p-1 bg-[#1a1a1a] rounded text-white/40">{item.icon}</div>
        <span className="text-[11px] font-medium text-white/60">{item.label}</span>
      </div>
      <p className="text-[10px] text-white/30 leading-relaxed">{item.detail}</p>
    </div>
  </motion.div>;

// ─── Left Panel ───────────────────────────────────────────────────────────────
const LeftPanel = ({
  step
}: {
  step: StepDef;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setActiveIndex(p => (p + 1) % step.transcripts.length), 3200);
    return () => clearInterval(id);
  }, [isPlaying, step.transcripts.length]);
  return <div className="flex flex-col flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex flex-col gap-1.5">
        <span className={`flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase w-fit px-2.5 py-1 rounded-full ${step.leftTagClass}`}>
          {step.leftTagIcon} {step.leftTag}
        </span>
        <h3 className="text-sm font-semibold text-white">{step.leftTitle}</h3>
        <p className="text-[11px] text-white/40 leading-relaxed">{step.leftSub}</p>
      </div>

      {/* Player */}
      <div className="px-5 pb-3">
        <div className="bg-[#0F0F0F] rounded-xl p-2.5 flex items-center gap-2.5 border border-white/5">
          <button onClick={() => setIsPlaying(p => !p)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center shrink-0 border border-white/[0.08]" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <div className="flex gap-[3px]"><div className="w-[3px] h-3 bg-white/60 rounded-sm" /><div className="w-[3px] h-3 bg-white/60 rounded-sm" /></div> : <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-transparent border-l-white/60 ml-0.5" />}
          </button>
          <div className="flex-1 overflow-hidden"><AnimatedWaveform isPlaying={isPlaying} /></div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isPlaying && <motion.div className="w-1.5 h-1.5 rounded-full bg-red-500" animate={{
            opacity: [1, 0.2, 1]
          }} transition={{
            duration: 1.1,
            repeat: Infinity
          }} />}
            <span className="text-[10px] text-white/30 font-mono">{isPlaying ? 'REC' : step.stats[0].value}</span>
          </div>
        </div>
      </div>

      {/* Scrolling transcript */}
      <div className="flex-1 min-h-0 px-5 pb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0B0B0B] to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0B0B] to-transparent z-10 pointer-events-none" />
        <AnimatePresence mode="popLayout">
          <motion.div key={activeIndex} className="flex flex-col gap-2" initial={{
          y: 10,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.45,
          ease: 'easeOut'
        }}>
            <TranscriptBubble item={step.transcripts[(activeIndex + step.transcripts.length - 1) % step.transcripts.length]} isActive={false} />
            <TranscriptBubble item={step.transcripts[activeIndex]} isActive={true} />
            <TranscriptBubble item={step.transcripts[(activeIndex + 1) % step.transcripts.length]} isActive={false} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>;
};

// ─── Right Panel ──────────────────────────────────────────────────────────────
const RightPanel = ({
  step
}: {
  step: StepDef;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: false,
    amount: 0.2
  });
  return <div ref={ref} className="flex flex-col flex-1 min-w-0 overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex flex-col gap-1.5">
        <span className={`flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase w-fit px-2.5 py-1 rounded-full ${step.rightTagClass}`}>
          {step.rightTagIcon} {step.rightTag}
        </span>
        <h3 className="text-sm font-semibold text-white">{step.rightTitle}</h3>
        <p className="text-[11px] text-white/40 leading-relaxed">{step.rightSub}</p>
      </div>

      {/* Brief card */}
      <div className="px-5 pb-3">
        <motion.div className="bg-[#0F0F0F] rounded-xl p-3 border border-white/5" initial={{
        opacity: 0,
        y: 12
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 12
      }} transition={{
        duration: 0.45,
        ease: 'easeOut'
      }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#1a1a1a] rounded"><FileText className="w-3 h-3 text-white/60" /></div>
              <span className="text-[11px] font-medium text-white/70">{step.briefTitle}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-500" animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }} />
              <span className="text-[10px] text-white/25">Auto-generated</span>
              <ChevronDown className="w-3 h-3 text-white/20" />
            </div>
          </div>
          <p className="text-[10px] text-white/30 leading-relaxed">{step.briefMeta}</p>
        </motion.div>
      </div>

      {/* Requirements timeline */}
      <div className="flex-1 min-h-0 px-5 pb-3 overflow-hidden">
        <div className="pl-1">
          {step.requirements.map((item, i) => <RequirementRow key={item.id} item={item} index={i} inView={inView} total={step.requirements.length} />)}
        </div>
      </div>

      {/* CTA */}
      <motion.div className="px-5 pb-5 flex items-center gap-2" initial={{
      opacity: 0
    }} animate={inView ? {
      opacity: 1
    } : {
      opacity: 0
    }} transition={{
      delay: 0.7,
      duration: 0.35
    }}>
        <button className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg bg-[#111] border border-white/5 hover:border-white/10">
          <MessageSquare className="w-3 h-3" /> {step.ctaLeft}
        </button>
        <button className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg bg-[#111] border border-white/5 hover:border-white/10">
          <ArrowRight className="w-3 h-3" /> {step.ctaRight}
        </button>
      </motion.div>
    </div>;
};

// ─── Step Card ────────────────────────────────────────────────────────────────
const StepCard = ({
  step
}: {
  step: StepDef;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, {
    once: false,
    amount: 0.15
  });
  return <div className="w-full min-h-dvh bg-[#030303] flex items-center justify-center p-3 sm:p-5 lg:p-8 font-sans">
      <motion.div ref={cardRef} className="w-full max-w-5xl h-full max-h-[900px] min-h-0 flex flex-col rounded-2xl border border-white/[0.07] bg-[#0B0B0B] overflow-hidden shadow-2xl shadow-black/60" initial={{
      opacity: 0,
      y: 24,
      scale: 0.98
    }} animate={cardInView ? {
      opacity: 1,
      y: 0,
      scale: 1
    } : {
      opacity: 0,
      y: 24,
      scale: 0.98
    }} transition={{
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }}>
        {/* ── Card Header ── */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-white/30">
            <span>Our Process</span>
            <span className="text-white/15">/</span>
            <span className="text-white/60 font-medium">{step.breadcrumb}</span>
          </div>
          <div className="flex items-center gap-2">
            {step.steps.map((s, i) => <div key={s} className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full font-medium transition-colors ${i === 0 ? `${step.accentBgClass} ${step.accentClass} ${step.accentBorderClass} border` : 'text-white/20'}`}>
                  {i === 0 && <motion.div className={`w-1 h-1 rounded-full ${step.dotClass}`} animate={{
                opacity: [1, 0.3, 1]
              }} transition={{
                duration: 1.6,
                repeat: Infinity
              }} />}
                  <span className="hidden sm:inline">{s}</span>
                  <span className="sm:hidden">0{i + 1}</span>
                </div>
                {i < step.steps.length - 1 && <div className="w-3 h-px bg-white/[0.08] hidden sm:block" />}
              </div>)}
          </div>
        </div>

        {/* ── Card Title ── */}
        <div className="px-5 sm:px-7 py-5 border-b border-white/5 shrink-0">
          <motion.div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3" initial={{
          opacity: 0,
          y: 10
        }} animate={cardInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 10
        }} transition={{
          duration: 0.5,
          delay: 0.15
        }}>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium tracking-widest uppercase text-white/25">Step {step.num}</span>
                <span className="w-px h-3 bg-white/10" />
                <span className={`text-[10px] font-medium tracking-widest uppercase ${step.accentClass}`}>{step.stepLabel}</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-tight">
                {step.headline}{' '}<span className="text-white/35">{step.headlineDim}</span>
              </h2>
            </div>
            <div className="flex items-center gap-5 sm:gap-6 shrink-0">
              {step.stats.map(s => <div key={s.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-base sm:text-lg font-semibold text-white tracking-tight">{s.value}</span>
                  <span className="text-[9px] sm:text-[10px] text-white/25 uppercase tracking-widest whitespace-nowrap">{s.label}</span>
                </div>)}
            </div>
          </motion.div>
        </div>

        {/* ── Panels ── */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row" style={{
        minHeight: '380px'
      }}>
          <LeftPanel step={step} />
          <RightPanel step={step} />
        </div>
      </motion.div>
    </div>;
};

// ─── Step Definitions ─────────────────────────────────────────────────────────
const STEPS: StepDef[] = [
// ── 001 DISCOVERY ──────────────────────────────────────────────────────────
{
  num: '01',
  stepLabel: 'Discovery Meeting',
  breadcrumb: 'Discovery',
  headline: 'Requirements Gathered.',
  headlineDim: 'Nothing Lost.',
  accentClass: 'text-indigo-400',
  accentBgClass: 'bg-indigo-500/15',
  accentBorderClass: 'border-indigo-500/20',
  dotClass: 'bg-indigo-500',
  steps: ['Discover', 'Design', 'Build', 'Launch'],
  stats: [{
    value: '52m',
    label: 'avg session'
  }, {
    value: '<24h',
    label: 'brief delivery'
  }, {
    value: '98%',
    label: 'clarity rate'
  }],
  leftTag: 'Live Capture',
  leftTagIcon: <Mic className="w-2.5 h-2.5" />,
  leftTagClass: 'text-indigo-400 bg-indigo-500/10',
  leftTitle: 'We Listen. Deeply.',
  leftSub: 'Sessions are recorded & AI-tagged in real time — nothing slips through.',
  transcripts: [{
    id: '1',
    speaker: 'Jamie (Client)',
    time: '0:48',
    text: "We track leads in spreadsheets. We need something centralised with automated follow-ups.",
    tag: 'Pain Point',
    tagColor: 'bg-rose-500/20 text-rose-300'
  }, {
    id: '2',
    speaker: 'Alex (Discovery)',
    time: '1:14',
    text: "Walk me through a lead's journey — first contact to close.",
    tag: 'Requirement',
    tagColor: 'bg-indigo-500/20 text-indigo-300'
  }, {
    id: '3',
    speaker: 'Jamie (Client)',
    time: '1:42',
    text: "Leads from website, LinkedIn, cold outreach — one view with priority scoring.",
    tag: 'Scope',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }],
  rightTag: 'AI Structured',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-emerald-400 bg-emerald-500/10',
  rightTitle: 'Instant Requirements Brief',
  rightSub: 'Every session generates a structured doc — ready to share and build from.',
  briefTitle: 'Discovery Brief',
  briefMeta: <>Client: Jamie T. — Sales Automation. 52 min · 3 pain points · 8 features · <span className="text-emerald-400/60">92% confidence</span></>,
  requirements: [{
    id: '1',
    label: 'Core Objectives',
    icon: <Target className="w-3 h-3" />,
    detail: 'Centralised CRM with multi-channel lead ingestion and priority scoring.',
    delay: 0.1
  }, {
    id: '2',
    label: 'Key Features',
    icon: <Layers className="w-3 h-3" />,
    detail: 'Automated follow-ups, pipeline dashboard, team collaboration.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Constraints',
    icon: <ClipboardList className="w-3 h-3" />,
    detail: 'HubSpot integration, 20+ users, GDPR compliant.',
    delay: 0.34
  }, {
    id: '4',
    label: 'Success Criteria',
    icon: <CheckCircle2 className="w-3 h-3" />,
    detail: '60% less manual effort. Full lead-to-close visibility.',
    delay: 0.46
  }],
  ctaLeft: 'Review',
  ctaRight: 'Start scoping'
},
// ── 002 STRATEGY ───────────────────────────────────────────────────────────
{
  num: '02',
  stepLabel: 'Strategy Workshop',
  breadcrumb: 'Strategy',
  headline: 'Direction Set.',
  headlineDim: 'Roadmap Locked.',
  accentClass: 'text-violet-400',
  accentBgClass: 'bg-violet-500/15',
  accentBorderClass: 'border-violet-500/20',
  dotClass: 'bg-violet-500',
  steps: ['Align', 'Prioritise', 'Map', 'Ship'],
  stats: [{
    value: '1wk',
    label: 'avg duration'
  }, {
    value: '100%',
    label: 'stakeholder buy-in'
  }, {
    value: '3-yr',
    label: 'roadmap horizon'
  }],
  leftTag: 'Live Workshop',
  leftTagIcon: <Compass className="w-2.5 h-2.5" />,
  leftTagClass: 'text-violet-400 bg-violet-500/10',
  leftTitle: 'We Align. Precisely.',
  leftSub: 'Workshops run live with all key stakeholders — no silos, no surprises.',
  transcripts: [{
    id: '1',
    speaker: 'Sarah (Strategist)',
    time: '0:32',
    text: "What does success look like in 12 months — not in feature terms, but in business outcomes?",
    tag: 'Framing',
    tagColor: 'bg-violet-500/20 text-violet-300'
  }, {
    id: '2',
    speaker: 'Tom (CEO)',
    time: '1:05',
    text: "We need to double our qualified pipeline and cut the sales cycle from 90 days to 45.",
    tag: 'Goal',
    tagColor: 'bg-amber-500/20 text-amber-300'
  }, {
    id: '3',
    speaker: 'Sarah (Strategist)',
    time: '2:11',
    text: "Let's map the tech stack — what do you already own versus what we need to build or integrate?",
    tag: 'Architecture',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }],
  rightTag: 'AI Synthesised',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-violet-400 bg-violet-500/10',
  rightTitle: 'Strategy Deck — Auto-drafted',
  rightSub: 'Workshop outputs become a polished deck your whole team can act on.',
  briefTitle: 'Strategy Deck',
  briefMeta: <>Client: Tom R. — Pipeline Acceleration. 1 workshop · 2 goals · 5 initiatives · <span className="text-violet-400/60">Roadmap ready</span></>,
  requirements: [{
    id: '1',
    label: 'Positioning',
    icon: <Target className="w-3 h-3" />,
    detail: 'B2B mid-market SaaS. Differentiate on speed-to-close and data transparency.',
    delay: 0.1
  }, {
    id: '2',
    label: 'Tech Stack',
    icon: <Layers className="w-3 h-3" />,
    detail: 'Retain HubSpot. Add custom pipeline layer + analytics service.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Phased Roadmap',
    icon: <BarChart2 className="w-3 h-3" />,
    detail: 'Phase 1: CRM. Phase 2: Automation. Phase 3: Predictive scoring.',
    delay: 0.34
  }, {
    id: '4',
    label: 'KPIs',
    icon: <TrendingUp className="w-3 h-3" />,
    detail: 'Pipeline velocity +100%. Sales cycle –50%. NPS ≥70 by Q4.',
    delay: 0.46
  }],
  ctaLeft: 'Review deck',
  ctaRight: 'Approve roadmap'
},
// ── 003 DESIGN ─────────────────────────────────────────────────────────────
{
  num: '03',
  stepLabel: 'Design Sprint',
  breadcrumb: 'Design',
  headline: 'Pixel Perfect.',
  headlineDim: 'Brand Consistent.',
  accentClass: 'text-pink-400',
  accentBgClass: 'bg-pink-500/15',
  accentBorderClass: 'border-pink-500/20',
  dotClass: 'bg-pink-500',
  steps: ['Wireframe', 'System', 'Prototype', 'Approve'],
  stats: [{
    value: '2–4w',
    label: 'design sprint'
  }, {
    value: '∞',
    label: 'revisions'
  }, {
    value: '100%',
    label: 'handoff-ready'
  }],
  leftTag: 'Live Design',
  leftTagIcon: <Pen className="w-2.5 h-2.5" />,
  leftTagClass: 'text-pink-400 bg-pink-500/10',
  leftTitle: 'We Design. Together.',
  leftSub: 'Figma sessions run live — you see every decision as it happens.',
  transcripts: [{
    id: '1',
    speaker: 'Mia (Designer)',
    time: '0:28',
    text: "I've structured the nav around your three user types — admin, rep, and manager. Each gets a different default view.",
    tag: 'Structure',
    tagColor: 'bg-pink-500/20 text-pink-300'
  }, {
    id: '2',
    speaker: 'James (Client)',
    time: '1:03',
    text: "Love the pipeline board — can the cards show the last touchpoint inline so reps don't have to click through?",
    tag: 'Feedback',
    tagColor: 'bg-amber-500/20 text-amber-300'
  }, {
    id: '3',
    speaker: 'Mia (Designer)',
    time: '1:47',
    text: "Done — also adding a micro-animation on status change so updates feel immediate. Checking accessibility contrast now.",
    tag: 'Refinement',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }],
  rightTag: 'Auto Packaged',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-pink-400 bg-pink-500/10',
  rightTitle: 'Design System — Exported',
  rightSub: 'Every component is documented, tokenised, and dev-ready from day one.',
  briefTitle: 'Design Handoff',
  briefMeta: <>Client: James K. — CRM UI. 4 sprints · 3 user roles · 42 components · <span className="text-pink-400/60">WCAG AA</span></>,
  requirements: [{
    id: '1',
    label: 'Component Library',
    icon: <LayoutGrid className="w-3 h-3" />,
    detail: '42 components across 6 categories. Tokens exported for dev.',
    delay: 0.1
  }, {
    id: '2',
    label: 'Brand Tokens',
    icon: <Palette className="w-3 h-3" />,
    detail: 'Typography scale, colour system, spacing grid — all locked.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Prototypes',
    icon: <Eye className="w-3 h-3" />,
    detail: '3 interactive flows: onboarding, pipeline view, reporting dash.',
    delay: 0.34
  }, {
    id: '4',
    label: 'Accessibility',
    icon: <CheckCircle2 className="w-3 h-3" />,
    detail: 'WCAG AA across all states. Keyboard nav + screen reader tested.',
    delay: 0.46
  }],
  ctaLeft: 'Add comments',
  ctaRight: 'Approve design'
},
// ── 004 DEVELOPMENT ────────────────────────────────────────────────────────
{
  num: '04',
  stepLabel: 'Development Build',
  breadcrumb: 'Development',
  headline: 'Clean Code.',
  headlineDim: 'Zero Compromises.',
  accentClass: 'text-cyan-400',
  accentBgClass: 'bg-cyan-500/15',
  accentBorderClass: 'border-cyan-500/20',
  dotClass: 'bg-cyan-500',
  steps: ['Scaffold', 'Build', 'Review', 'Merge'],
  stats: [{
    value: '4–8w',
    label: 'build cycle'
  }, {
    value: '<2s',
    label: 'load target'
  }, {
    value: 'A+',
    label: 'lighthouse score'
  }],
  leftTag: 'Live Builds',
  leftTagIcon: <Code2 className="w-2.5 h-2.5" />,
  leftTagClass: 'text-cyan-400 bg-cyan-500/10',
  leftTitle: 'We Build. Transparently.',
  leftSub: 'Every PR is visible, every staging deploy linked. You always know where we are.',
  transcripts: [{
    id: '1',
    speaker: 'Dev (Backend)',
    time: '0:41',
    text: "Lead ingestion webhook is live. Multi-channel events are normalising correctly — HubSpot sync is next.",
    tag: 'Progress',
    tagColor: 'bg-cyan-500/20 text-cyan-300'
  }, {
    id: '2',
    speaker: 'Dev (Frontend)',
    time: '1:18',
    text: "Pipeline board is rendering 500+ leads at 60fps using virtual scroll. Animations feel instant.",
    tag: 'Performance',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }, {
    id: '3',
    speaker: 'Dev (Backend)',
    time: '2:05',
    text: "Automated follow-up engine is queued. GDPR consent flags are propagating correctly through the pipeline.",
    tag: 'Compliance',
    tagColor: 'bg-amber-500/20 text-amber-300'
  }],
  rightTag: 'Auto Logged',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-cyan-400 bg-cyan-500/10',
  rightTitle: 'Build Log — Live',
  rightSub: 'Every commit, test result, and staging URL is captured and shared in real time.',
  briefTitle: 'Dev Progress',
  briefMeta: <>Sprint 3/5 — CRM Build. 68% complete · 4 PRs merged · <span className="text-cyan-400/60">Staging live</span></>,
  requirements: [{
    id: '1',
    label: 'Architecture',
    icon: <GitBranch className="w-3 h-3" />,
    detail: 'React + TypeScript frontend. Node API layer. PostgreSQL + Redis.',
    delay: 0.1
  }, {
    id: '2',
    label: 'Performance',
    icon: <Zap className="w-3 h-3" />,
    detail: 'Sub-2s TTI. Virtual scroll for 1k+ records. Edge caching.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Integrations',
    icon: <Sliders className="w-3 h-3" />,
    detail: 'HubSpot, LinkedIn, SMTP, Webhooks — all connected and tested.',
    delay: 0.34
  }, {
    id: '4',
    label: 'Security',
    icon: <ShieldCheck className="w-3 h-3" />,
    detail: 'OAuth2, role-based access, GDPR compliant data handling.',
    delay: 0.46
  }],
  ctaLeft: 'View staging',
  ctaRight: 'Approve sprint'
},
// ── 005 DELIVERY ───────────────────────────────────────────────────────────
{
  num: '05',
  stepLabel: 'Launch Sequence',
  breadcrumb: 'Delivery',
  headline: 'On Time.',
  headlineDim: 'Zero Surprises.',
  accentClass: 'text-amber-400',
  accentBgClass: 'bg-amber-500/15',
  accentBorderClass: 'border-amber-500/20',
  dotClass: 'bg-amber-500',
  steps: ['QA', 'Deploy', 'Monitor', 'Sign-off'],
  stats: [{
    value: '100%',
    label: 'QA pass rate'
  }, {
    value: '<1h',
    label: 'deploy window'
  }, {
    value: '99.9%',
    label: 'uptime SLA'
  }],
  leftTag: 'Live QA',
  leftTagIcon: <Bug className="w-2.5 h-2.5" />,
  leftTagClass: 'text-amber-400 bg-amber-500/10',
  leftTitle: 'We Test. Relentlessly.',
  leftSub: 'Every screen, flow, and edge case — tested across devices before a single byte goes live.',
  transcripts: [{
    id: '1',
    speaker: 'QA (Lead)',
    time: '0:22',
    text: "All 6 critical flows pass on Chrome, Safari, Firefox, and iOS. Zero regressions from last sprint.",
    tag: 'Pass',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }, {
    id: '2',
    speaker: 'QA (Lead)',
    time: '0:55',
    text: "Found a timezone offset bug in the follow-up scheduler for non-UK clients. Dev patched in 12 minutes.",
    tag: 'Fixed',
    tagColor: 'bg-amber-500/20 text-amber-300'
  }, {
    id: '3',
    speaker: 'Dev (Infra)',
    time: '1:40',
    text: "Blue-green deploy is staged. DNS TTL lowered. Rollback tested and confirmed — we're clear to launch.",
    tag: 'Ready',
    tagColor: 'bg-cyan-500/20 text-cyan-300'
  }],
  rightTag: 'Auto Verified',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-amber-400 bg-amber-500/10',
  rightTitle: 'Launch Checklist — Complete',
  rightSub: 'Every item signed off before go-live. Nothing ships without passing the full gate.',
  briefTitle: 'Delivery Report',
  briefMeta: <>Launch: 14 Mar 2025. 47 tests passed · 0 blockers · <span className="text-amber-400/60">Go for launch</span></>,
  requirements: [{
    id: '1',
    label: 'Cross-device QA',
    icon: <MonitorCheck className="w-3 h-3" />,
    detail: 'Desktop, tablet, mobile — 12 device/browser combos tested.',
    delay: 0.1
  }, {
    id: '2',
    label: 'Performance Gate',
    icon: <Zap className="w-3 h-3" />,
    detail: 'Lighthouse 97. Core Web Vitals all green. Load: 1.4s.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Deploy Pipeline',
    icon: <Rocket className="w-3 h-3" />,
    detail: 'Blue-green deploy. Instant rollback. Zero-downtime migration.',
    delay: 0.34
  }, {
    id: '4',
    label: 'Sign-off',
    icon: <BadgeCheck className="w-3 h-3" />,
    detail: 'Client reviewed. Legal cleared. Domain & SSL verified.',
    delay: 0.46
  }],
  ctaLeft: 'Final review',
  ctaRight: 'Go live'
},
// ── 006 CARE ───────────────────────────────────────────────────────────────
{
  num: '06',
  stepLabel: 'Care Retainer',
  breadcrumb: 'Care',
  headline: 'Always On.',
  headlineDim: 'Always Yours.',
  accentClass: 'text-rose-400',
  accentBgClass: 'bg-rose-500/15',
  accentBorderClass: 'border-rose-500/20',
  dotClass: 'bg-rose-500',
  steps: ['Monitor', 'Support', 'Iterate', 'Evolve'],
  stats: [{
    value: '<2h',
    label: 'response SLA'
  }, {
    value: '24/7',
    label: 'uptime watch'
  }, {
    value: '4.9★',
    label: 'support rating'
  }],
  leftTag: 'Live Monitoring',
  leftTagIcon: <Bell className="w-2.5 h-2.5" />,
  leftTagClass: 'text-rose-400 bg-rose-500/10',
  leftTitle: 'We Stay. Always.',
  leftSub: 'Real-time alerts, monthly check-ins, and a team that knows your product inside-out.',
  transcripts: [{
    id: '1',
    speaker: 'Ops (Alert)',
    time: '0:03',
    text: "Memory spike detected on the follow-up worker. Auto-scaled from 2 to 4 instances. Resolved before impact.",
    tag: 'Auto-healed',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }, {
    id: '2',
    speaker: 'Jamie (Client)',
    time: '0:41',
    text: "Can we add a bulk re-assign feature for leads? Sales manager asked this morning.",
    tag: 'Request',
    tagColor: 'bg-rose-500/20 text-rose-300'
  }, {
    id: '3',
    speaker: 'Care (Sorn)',
    time: '1:09',
    text: "Scoped it — 3 hours. Adding to next sprint. You'll have it by Thursday.",
    tag: 'Actioned',
    tagColor: 'bg-amber-500/20 text-amber-300'
  }],
  rightTag: 'Auto Reported',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-rose-400 bg-rose-500/10',
  rightTitle: 'Monthly Care Report',
  rightSub: 'A full picture of health, usage, and changes — delivered every month without asking.',
  briefTitle: 'Care Summary',
  briefMeta: <>March 2025. 99.98% uptime · 3 improvements shipped · <span className="text-rose-400/60">Retainer active</span></>,
  requirements: [{
    id: '1',
    label: 'Uptime Monitoring',
    icon: <Activity className="w-3 h-3" />,
    detail: '99.98% uptime. 3 incidents auto-resolved before user impact.',
    delay: 0.1
  }, {
    id: '2',
    label: 'Proactive Updates',
    icon: <RefreshCw className="w-3 h-3" />,
    detail: 'Dependencies patched. Security advisories actioned within 24h.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Feature Requests',
    icon: <Users className="w-3 h-3" />,
    detail: '3 client requests scoped, built, and shipped this month.',
    delay: 0.34
  }, {
    id: '4',
    label: 'Health Score',
    icon: <HeartHandshake className="w-3 h-3" />,
    detail: 'Platform health 98/100. No critical technical debt.',
    delay: 0.46
  }],
  ctaLeft: 'View report',
  ctaRight: 'Renew retainer'
},
// ── 007 OPTIMISE ───────────────────────────────────────────────────────────
{
  num: '07',
  stepLabel: 'Optimisation Cycle',
  breadcrumb: 'Optimise',
  headline: 'Data-led.',
  headlineDim: 'Always Improving.',
  accentClass: 'text-emerald-400',
  accentBgClass: 'bg-emerald-500/15',
  accentBorderClass: 'border-emerald-500/20',
  dotClass: 'bg-emerald-500',
  steps: ['Measure', 'Hypothesise', 'Test', 'Scale'],
  stats: [{
    value: '+34%',
    label: 'avg. conversion lift'
  }, {
    value: 'Monthly',
    label: 'growth reports'
  }, {
    value: '∞',
    label: 'iterations'
  }],
  leftTag: 'Live Analytics',
  leftTagIcon: <LineChart className="w-2.5 h-2.5" />,
  leftTagClass: 'text-emerald-400 bg-emerald-500/10',
  leftTitle: 'We Measure. Everything.',
  leftSub: 'Every interaction is tracked, segmented, and surfaced — so decisions are never gut feelings.',
  transcripts: [{
    id: '1',
    speaker: 'Growth (Sorn)',
    time: '0:18',
    text: "Funnel drop-off is highest at the lead qualification step — 42% abandon before scoring. That's our primary lever.",
    tag: 'Insight',
    tagColor: 'bg-emerald-500/20 text-emerald-300'
  }, {
    id: '2',
    speaker: 'Tom (CEO)',
    time: '0:52',
    text: "Could we surface the priority score before they hit that step — so reps self-qualify first?",
    tag: 'Hypothesis',
    tagColor: 'bg-violet-500/20 text-violet-300'
  }, {
    id: '3',
    speaker: 'Growth (Sorn)',
    time: '1:31',
    text: "A/B test is live — variant shows score inline on the list view. Early data: 28% fewer drop-offs. Scaling.",
    tag: 'Result',
    tagColor: 'bg-amber-500/20 text-amber-300'
  }],
  rightTag: 'Auto Tracked',
  rightTagIcon: <Sparkles className="w-2.5 h-2.5" />,
  rightTagClass: 'text-emerald-400 bg-emerald-500/10',
  rightTitle: 'Growth Report — Monthly',
  rightSub: 'Wins, experiments, and next bets — all in one doc you can share with the board.',
  briefTitle: 'Growth Report',
  briefMeta: <>April 2025. 4 tests run · 2 scaled · <span className="text-emerald-400/60">+34% conversion</span></>,
  requirements: [{
    id: '1',
    label: 'Analytics Stack',
    icon: <BarChart2 className="w-3 h-3" />,
    detail: 'PostHog + custom events. Funnel visibility end-to-end.',
    delay: 0.1
  }, {
    id: '2',
    label: 'A/B Testing',
    icon: <FlaskConical className="w-3 h-3" />,
    detail: '4 experiments this month. 2 won and scaled to 100%.',
    delay: 0.22
  }, {
    id: '3',
    label: 'Performance Tuning',
    icon: <Zap className="w-3 h-3" />,
    detail: 'API p95 down from 380ms to 140ms after query optimisation.',
    delay: 0.34
  }, {
    id: '4',
    label: 'Next Bets',
    icon: <Globe className="w-3 h-3" />,
    detail: 'Mobile app, AI-suggested follow-up copy, and partner portal scoped.',
    delay: 0.46
  }],
  ctaLeft: 'View report',
  ctaRight: 'Plan next sprint'
}];

// ─── Main Export ──────────────────────────────────────────────────────────────
export const MeetingFeaturesSection = () => <div className="w-full">
    {STEPS.map(step => <StepCard key={step.num} step={step} />)}
  </div>;
export default MeetingFeaturesSection;