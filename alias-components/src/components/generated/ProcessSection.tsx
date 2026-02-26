import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, Compass, Pen, Code2, Rocket, HeartHandshake, TrendingUp, ChevronRight, Mic, Zap, CheckCircle2, Clock, FileText, Layers, GitBranch, Monitor, ShieldCheck, BarChart2, RefreshCw, ArrowRight, AlertCircle, Palette, Terminal, Globe, Bell, Activity } from 'lucide-react';

// ─── Design tokens ─────────────────────────────────────────────────────────
const T = {
  bg: '#080808',
  card: '#111111',
  cardBorder: 'rgba(255,255,255,0.06)',
  cardBorderHover: 'rgba(255,255,255,0.12)',
  text: '#ffffff',
  textMuted: '#777777',
  textDim: '#444444',
  glowSm: 'rgba(255,255,255,0.04)',
  glowMd: 'rgba(255,255,255,0.08)'
};

// ─── Global styles ──────────────────────────────────────────────────────────
const ProcessGlobalStyles = () => <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Abel&display=swap');
    .ps-abel { font-family: 'Abel', sans-serif; }
    .ps-glass {
      background: rgba(13,13,13,0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    @keyframes ps-pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.75); }
    }
    @keyframes ps-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .ps-blink { animation: ps-blink 1s step-end infinite; }
    @keyframes ps-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .ps-shimmer-text {
      background: linear-gradient(90deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.55) 40%,rgba(255,255,255,0.12) 80%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: ps-shimmer 3.5s linear infinite;
    }
    @keyframes ps-progress {
      from { width: 0%; }
      to   { width: 100%; }
    }
    .ps-progress-animate { animation: ps-progress 2.4s ease-out forwards; }
    .ps-tag {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
    }
    .ps-inner-card {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }
    .ps-inner-card-dark {
      background: rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
    }
    .ps-step-card {
      transition: border-color 0.3s, background 0.3s;
    }
    .ps-step-card:hover {
      border-color: rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.025);
    }
  `}</style>;
const GridOverlay = () => <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.018]" style={{
  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
  backgroundSize: '32px 32px'
}} />;

// ─── Shared sub-components ──────────────────────────────────────────────────

const Stat = ({
  value,
  label
}: {
  value: string;
  label: string;
}) => <div className="flex flex-col gap-0.5">
    <span className="ps-abel text-white text-[18px] leading-none">{value}</span>
    <span className="ps-abel text-[10px] tracking-[0.15em] uppercase" style={{
    color: T.textDim
  }}>{label}</span>
  </div>;
const Tag = ({
  children
}: {
  children: React.ReactNode;
}) => <span className="ps-tag ps-abel">{children}</span>;
const InnerCard = ({
  children,
  className = '',
  dark = false
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) => <div className={`${dark ? 'ps-inner-card-dark' : 'ps-inner-card'} p-4 ${className}`}>{children}</div>;

// ─── Step 01: Discovery ──────────────────────────────────────────────────────
const DiscoveryCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="discovery" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats row */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="52m" label="avg session" /></InnerCard>
          <InnerCard><Stat value="&lt;24h" label="brief delivery" /></InnerCard>
          <InnerCard><Stat value="98%" label="clarity rate" /></InnerCard>
        </div>

        {/* Live capture */}
        <InnerCard dark>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" style={{
            animation: 'ps-pulse-dot 1.4s ease-in-out infinite'
          }} />
              <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
            color: T.textMuted
          }}>Live Capture</span>
            </div>
            <span className="ps-abel text-[10px]" style={{
          color: T.textDim
        }}>1:42</span>
          </div>
          <div className="flex flex-col gap-2">
            {[{
          name: 'Jamie (Client)',
          tag: 'Scope',
          time: '0:48',
          text: 'Leads from website, LinkedIn, cold outreach — one centralised view with priority scoring.'
        }, {
          name: 'Jamie (Client)',
          tag: 'Pain Point',
          time: '0:48',
          text: 'We track leads in spreadsheets. We need automated follow-ups.'
        }, {
          name: 'Alex (Discovery)',
          tag: 'Requirement',
          time: '1:14',
          text: 'Walk me through a lead\'s journey — first contact to close.'
        }].map((item, i) => <div key={i} className="flex gap-2.5 items-start">
                <Mic size={11} className="mt-0.5 shrink-0" style={{
            color: T.textDim
          }} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="ps-abel text-[10px] text-white">{item.name}</span>
                    <Tag>{item.tag}</Tag>
                    <span className="ps-abel text-[9px]" style={{
                color: T.textDim
              }}>{item.time}</span>
                  </div>
                  <p className="ps-abel text-[11px] leading-relaxed" style={{
              color: T.textMuted
            }}>{item.text}</p>
                </div>
              </div>)}
          </div>
        </InnerCard>

        {/* Auto brief */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>AI Structured Brief</span>
          </div>
          <div className="ps-inner-card p-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="ps-abel text-[11px] text-white">Discovery Brief</span>
              <Tag>Auto-generated</Tag>
            </div>
            <p className="ps-abel text-[10px] leading-relaxed" style={{
          color: T.textDim
        }}>Client: Jamie T. — Sales Automation · 52 min · 3 pain points · 8 features · 92% confidence</p>
          </div>
          {[{
        label: 'Core Objectives',
        text: 'Centralised CRM with multi-channel lead ingestion and priority scoring.'
      }, {
        label: 'Key Features',
        text: 'Automated follow-ups, pipeline dashboard, team collaboration.'
      }, {
        label: 'Constraints',
        text: 'HubSpot integration, 20+ users, GDPR compliant.'
      }, {
        label: 'Success Criteria',
        text: '60% less manual effort. Full lead-to-close visibility.'
      }].map((row, i) => <div key={i} className="flex gap-2 mb-2">
              <span className="ps-abel text-[10px] shrink-0 pt-px" style={{
          color: T.textDim
        }}>{row.label}</span>
              <p className="ps-abel text-[11px] leading-relaxed" style={{
          color: T.textMuted
        }}>{row.text}</p>
            </div>)}
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step 02: Strategy ───────────────────────────────────────────────────────
const StrategyCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="strategy" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="1wk" label="turnaround" /></InnerCard>
          <InnerCard><Stat value="3–5" label="options scoped" /></InnerCard>
          <InnerCard><Stat value="100%" label="aligned before build" /></InnerCard>
        </div>

        {/* Positioning map */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <Layers size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Positioning Framework</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {[{
          label: 'Target Audience',
          value: 'SMB sales teams, 10–50 users',
          status: 'confirmed'
        }, {
          label: 'Differentiator',
          value: 'AI-first pipeline with zero config',
          status: 'confirmed'
        }, {
          label: 'Channel Strategy',
          value: 'Product-led growth + outbound',
          status: 'in review'
        }, {
          label: 'Competitive Edge',
          value: 'Faster onboarding than HubSpot',
          status: 'confirmed'
        }].map((row, i) => <div key={i} className="flex items-start justify-between gap-3">
                <div>
                  <p className="ps-abel text-[10px] mb-0.5" style={{
              color: T.textDim
            }}>{row.label}</p>
                  <p className="ps-abel text-[11px]" style={{
              color: T.textMuted
            }}>{row.value}</p>
                </div>
                <Tag>{row.status}</Tag>
              </div>)}
          </div>
        </InnerCard>

        {/* Roadmap */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Phased Roadmap</span>
          </div>
          <div className="flex flex-col gap-3">
            {[{
          phase: 'Phase 1',
          label: 'Core CRM & Lead Ingestion',
          weeks: '0–4 wks',
          done: true
        }, {
          phase: 'Phase 2',
          label: 'Automation & Follow-ups',
          weeks: '4–8 wks',
          done: false
        }, {
          phase: 'Phase 3',
          label: 'Analytics Dashboard',
          weeks: '8–12 wks',
          done: false
        }].map((p, i) => <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
            background: p.done ? 'rgba(255,255,255,0.08)' : T.glowSm,
            border: `1px solid ${T.cardBorder}`
          }}>
                  {p.done ? <CheckCircle2 size={10} style={{
              color: 'rgba(255,255,255,0.5)'
            }} /> : <span className="ps-abel text-[8px]" style={{
              color: T.textDim
            }}>{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="ps-abel text-[11px] text-white">{p.label}</span>
                    <span className="ps-abel text-[9px]" style={{
                color: T.textDim
              }}>{p.weeks}</span>
                  </div>
                  <span className="ps-abel text-[10px]" style={{
              color: T.textDim
            }}>{p.phase}</span>
                </div>
              </div>)}
          </div>
          <div className="mt-3 pt-3" style={{
        borderTop: `1px solid ${T.cardBorder}`
      }}>
            <div className="flex items-center justify-between mb-1">
              <span className="ps-abel text-[10px]" style={{
            color: T.textDim
          }}>Tech Stack Confirmed</span>
              <span className="ps-abel text-[10px]" style={{
            color: T.textDim
          }}>React · Node · Postgres</span>
            </div>
          </div>
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step 03: Design ─────────────────────────────────────────────────────────
const DesignCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="design" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="2–4" label="week sprint" /></InnerCard>
          <InnerCard><Stat value="3×" label="review rounds" /></InnerCard>
          <InnerCard><Stat value="100%" label="component coverage" /></InnerCard>
        </div>

        {/* Design system tokens */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Design System</span>
          </div>
          <div className="flex flex-col gap-3">
            {/* Colour swatches */}
            <div>
              <p className="ps-abel text-[10px] mb-1.5" style={{
            color: T.textDim
          }}>Colour Tokens</p>
              <div className="flex gap-2">
                {['#0F0F0F', '#1A1A2E', '#4F46E5', '#818CF8', '#F8FAFC', '#64748B'].map((c, i) => <div key={i} className="w-7 h-7 rounded-md" style={{
              background: c,
              border: '1px solid rgba(255,255,255,0.08)'
            }} />)}
              </div>
            </div>
            {/* Type scale */}
            <div>
              <p className="ps-abel text-[10px] mb-1.5" style={{
            color: T.textDim
          }}>Type Scale</p>
              <div className="flex flex-col gap-1">
                {[{
              size: '48px',
              role: 'Display'
            }, {
              size: '32px',
              role: 'Heading'
            }, {
              size: '14px',
              role: 'Body'
            }].map((t, i) => <div key={i} className="flex items-baseline gap-2">
                    <span className="ps-abel text-white" style={{
                fontSize: t.size === '48px' ? 18 : t.size === '32px' ? 14 : 11
              }}>Aa</span>
                    <span className="ps-abel text-[10px]" style={{
                color: T.textDim
              }}>{t.role} · {t.size}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </InnerCard>

        {/* Prototype status */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <Monitor size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Prototype Progress</span>
          </div>
          <div className="flex flex-col gap-3">
            {[{
          screen: 'Dashboard',
          progress: 100,
          status: 'approved'
        }, {
          screen: 'Lead Pipeline',
          progress: 85,
          status: 'in review'
        }, {
          screen: 'Contact Detail',
          progress: 60,
          status: 'in progress'
        }, {
          screen: 'Automation Rules',
          progress: 20,
          status: 'wireframe'
        }].map((item, i) => <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="ps-abel text-[11px] text-white">{item.screen}</span>
                  <Tag>{item.status}</Tag>
                </div>
                <div className="h-px w-full rounded-full overflow-hidden" style={{
            background: 'rgba(255,255,255,0.06)'
          }}>
                  <div className="h-full rounded-full" style={{
              width: `${item.progress}%`,
              background: 'rgba(255,255,255,0.2)',
              transition: 'width 0.8s ease'
            }} />
                </div>
              </div>)}
          </div>
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step 04: Development ────────────────────────────────────────────────────
const DevelopmentCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="development" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="4–8" label="week build" /></InnerCard>
          <InnerCard><Stat value="CI/CD" label="every commit" /></InnerCard>
          <InnerCard><Stat value="100%" label="test coverage req." /></InnerCard>
        </div>

        {/* Code activity */}
        <InnerCard dark>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal size={11} style={{
            color: T.textDim
          }} />
              <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
            color: T.textMuted
          }}>Sprint Activity</span>
            </div>
            <Tag>Sprint 3 / 6</Tag>
          </div>
          <div className="flex flex-col gap-2">
            {[{
          file: 'LeadIngestion.service.ts',
          status: 'merged',
          lines: '+284'
        }, {
          file: 'PipelineView.tsx',
          status: 'in review',
          lines: '+112'
        }, {
          file: 'AutomationEngine.ts',
          status: 'in progress',
          lines: '+67'
        }, {
          file: 'api/leads/[id].ts',
          status: 'staged',
          lines: '+34'
        }].map((item, i) => <div key={i} className="flex items-center justify-between gap-2 ps-inner-card px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={10} style={{
              color: T.textDim
            }} className="shrink-0" />
                  <span className="ps-abel text-[10px] truncate" style={{
              color: T.textMuted
            }}>{item.file}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="ps-abel text-[10px] text-green-400/60">{item.lines}</span>
                  <Tag>{item.status}</Tag>
                </div>
              </div>)}
          </div>
        </InnerCard>

        {/* Build pipeline */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Build Pipeline</span>
          </div>
          <div className="flex flex-col gap-2">
            {[{
          step: 'Lint + Type Check',
          passed: true
        }, {
          step: 'Unit Tests (142)',
          passed: true
        }, {
          step: 'Integration Tests',
          passed: true
        }, {
          step: 'Staging Deploy',
          passed: true
        }, {
          step: 'E2E (Playwright)',
          passed: false
        }].map((item, i) => <div key={i} className="flex items-center justify-between">
                <span className="ps-abel text-[11px]" style={{
            color: T.textMuted
          }}>{item.step}</span>
                {item.passed ? <CheckCircle2 size={12} style={{
            color: 'rgba(255,255,255,0.3)'
          }} /> : <AlertCircle size={12} style={{
            color: 'rgba(255,100,100,0.5)'
          }} />}
              </div>)}
          </div>
          <div className="mt-3 pt-3" style={{
        borderTop: `1px solid ${T.cardBorder}`
      }}>
            <div className="flex items-center justify-between">
              <span className="ps-abel text-[10px]" style={{
            color: T.textDim
          }}>Velocity</span>
              <span className="ps-abel text-[10px]" style={{
            color: T.textMuted
          }}>34 story pts / sprint</span>
            </div>
          </div>
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step 05: Delivery ───────────────────────────────────────────────────────
const DeliveryCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="delivery" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="0" label="surprise delays" /></InnerCard>
          <InnerCard><Stat value="99.9%" label="uptime SLA" /></InnerCard>
          <InnerCard><Stat value="&lt;2s" label="p95 load time" /></InnerCard>
        </div>

        {/* QA checklist */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>QA Checklist</span>
          </div>
          <div className="flex flex-col gap-2">
            {['Cross-browser (Chrome, Safari, FF, Edge)', 'Mobile responsive — 320px to 1440px', 'Accessibility audit (WCAG AA)', 'Performance audit (Lighthouse 90+)', 'Security headers & CORS policy', 'GDPR data handling verified'].map((item, i) => <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={11} className="mt-0.5 shrink-0" style={{
            color: 'rgba(255,255,255,0.25)'
          }} />
                <span className="ps-abel text-[11px]" style={{
            color: T.textMuted
          }}>{item}</span>
              </div>)}
          </div>
        </InnerCard>

        {/* Launch sequence */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <Rocket size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Launch Sequence</span>
          </div>
          <div className="flex flex-col gap-2">
            {[{
          step: 'DNS cutover & SSL',
          status: 'complete',
          time: '09:00'
        }, {
          step: 'Smoke test suite',
          status: 'complete',
          time: '09:12'
        }, {
          step: 'Monitoring active',
          status: 'complete',
          time: '09:15'
        }, {
          step: 'Client sign-off',
          status: 'complete',
          time: '09:22'
        }, {
          step: 'Announcement go-live',
          status: 'live',
          time: '09:30'
        }].map((item, i) => <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="ps-abel text-[9px] w-8 shrink-0" style={{
              color: T.textDim
            }}>{item.time}</span>
                  <span className="ps-abel text-[11px]" style={{
              color: T.textMuted
            }}>{item.step}</span>
                </div>
                <Tag>{item.status}</Tag>
              </div>)}
          </div>
          <div className="mt-3 pt-3 flex items-center gap-2" style={{
        borderTop: `1px solid ${T.cardBorder}`
      }}>
            <Globe size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[10px]" style={{
          color: T.textDim
        }}>app.sorn.co — live</span>
          </div>
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step 06: Care ───────────────────────────────────────────────────────────
const CareCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="care" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="&lt;4h" label="response SLA" /></InnerCard>
          <InnerCard><Stat value="24/7" label="monitoring" /></InnerCard>
          <InnerCard><Stat value="Monthly" label="review calls" /></InnerCard>
        </div>

        {/* Monitoring feed */}
        <InnerCard dark>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={11} style={{
            color: T.textDim
          }} />
              <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
            color: T.textMuted
          }}>Monitoring Feed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" style={{
            animation: 'ps-pulse-dot 2s ease-in-out infinite'
          }} />
              <span className="ps-abel text-[10px]" style={{
            color: T.textDim
          }}>All systems nominal</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[{
          service: 'API Response Time',
          value: '142ms',
          ok: true
        }, {
          service: 'Error Rate',
          value: '0.02%',
          ok: true
        }, {
          service: 'DB Query Avg',
          value: '18ms',
          ok: true
        }, {
          service: 'Memory Usage',
          value: '61%',
          ok: true
        }, {
          service: 'Uptime (30d)',
          value: '99.97%',
          ok: true
        }].map((row, i) => <div key={i} className="flex items-center justify-between">
                <span className="ps-abel text-[11px]" style={{
            color: T.textMuted
          }}>{row.service}</span>
                <div className="flex items-center gap-2">
                  <span className="ps-abel text-[11px] text-white">{row.value}</span>
                  {row.ok && <CheckCircle2 size={10} style={{
              color: 'rgba(255,255,255,0.2)'
            }} />}
                </div>
              </div>)}
          </div>
        </InnerCard>

        {/* Support tickets + retainer */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Retainer Activity</span>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {[{
          title: 'HubSpot webhook fix',
          priority: 'urgent',
          time: '2h ago',
          resolved: true
        }, {
          title: 'New user role permissions',
          priority: 'normal',
          time: '1d ago',
          resolved: true
        }, {
          title: 'Export to CSV feature',
          priority: 'low',
          time: '3d ago',
          resolved: false
        }].map((t, i) => <div key={i} className="ps-inner-card px-3 py-2 flex items-start justify-between gap-2">
                <div>
                  <p className="ps-abel text-[11px] text-white">{t.title}</p>
                  <p className="ps-abel text-[10px]" style={{
              color: T.textDim
            }}>{t.time}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Tag>{t.priority}</Tag>
                  {t.resolved && <CheckCircle2 size={10} style={{
              color: 'rgba(255,255,255,0.25)'
            }} />}
                </div>
              </div>)}
          </div>
          <div className="flex items-center justify-between pt-2" style={{
        borderTop: `1px solid ${T.cardBorder}`
      }}>
            <span className="ps-abel text-[10px]" style={{
          color: T.textDim
        }}>Hours used this month</span>
            <span className="ps-abel text-[10px] text-white">14 / 20 hrs</span>
          </div>
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step 07: Optimise ───────────────────────────────────────────────────────
const OptimiseCard = ({
  active
}: {
  active: boolean;
}) => <AnimatePresence>
    {active && <motion.div key="optimise" initial={{
    opacity: 0,
    y: 16
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: 8
  }} transition={{
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1]
  }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Stats */}
        <div className="md:col-span-2 grid grid-cols-3 gap-3">
          <InnerCard><Stat value="+34%" label="conversion lift" /></InnerCard>
          <InnerCard><Stat value="A/B" label="tests running" /></InnerCard>
          <InnerCard><Stat value="Monthly" label="growth report" /></InnerCard>
        </div>

        {/* Analytics snapshot */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Analytics Snapshot</span>
          </div>
          <div className="flex flex-col gap-3">
            {[{
          metric: 'Lead-to-close rate',
          before: '12%',
          after: '19%',
          up: true
        }, {
          metric: 'Avg. follow-up time',
          before: '48h',
          after: '3h',
          up: true
        }, {
          metric: 'Manual data entry',
          before: '4h/wk',
          after: '22m/wk',
          up: true
        }, {
          metric: 'Pipeline visibility',
          before: 'Low',
          after: 'Full',
          up: true
        }].map((row, i) => <div key={i} className="flex items-center justify-between gap-2">
                <span className="ps-abel text-[11px]" style={{
            color: T.textMuted
          }}>{row.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="ps-abel text-[10px] line-through" style={{
              color: T.textDim
            }}>{row.before}</span>
                  <ArrowRight size={9} style={{
              color: T.textDim
            }} />
                  <span className="ps-abel text-[11px] text-white">{row.after}</span>
                  {row.up && <TrendingUp size={10} style={{
              color: 'rgba(255,255,255,0.3)'
            }} />}
                </div>
              </div>)}
          </div>
        </InnerCard>

        {/* A/B tests + growth report */}
        <InnerCard dark>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={11} style={{
          color: T.textDim
        }} />
            <span className="ps-abel text-[11px] tracking-widest uppercase" style={{
          color: T.textMuted
        }}>Active Experiments</span>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {[{
          test: 'CTA copy variant — pipeline page',
          lift: '+8.2%',
          status: 'running'
        }, {
          test: 'Onboarding flow reorder',
          lift: '+14.1%',
          status: 'winner'
        }, {
          test: 'Email subject line A/B',
          lift: '+3.4%',
          status: 'running'
        }].map((t, i) => <div key={i} className="ps-inner-card px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="ps-abel text-[11px] text-white">{t.test}</span>
                  <Tag>{t.status}</Tag>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <TrendingUp size={9} style={{
              color: 'rgba(255,255,255,0.3)'
            }} />
                  <span className="ps-abel text-[10px]" style={{
              color: T.textMuted
            }}>{t.lift} conversion lift</span>
                </div>
              </div>)}
          </div>
          <div className="flex items-center justify-between pt-2" style={{
        borderTop: `1px solid ${T.cardBorder}`
      }}>
            <div className="flex items-center gap-1.5">
              <RefreshCw size={10} style={{
            color: T.textDim
          }} />
              <span className="ps-abel text-[10px]" style={{
            color: T.textDim
          }}>Next report</span>
            </div>
            <span className="ps-abel text-[10px] text-white">In 12 days</span>
          </div>
        </InnerCard>
      </motion.div>}
  </AnimatePresence>;

// ─── Step data ───────────────────────────────────────────────────────────────
interface ProcessStep {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  Icon: React.ElementType;
  duration: string;
  deliverable: string;
  Card: React.FC<{
    active: boolean;
  }>;
}
const STEPS: ProcessStep[] = [{
  num: '001',
  title: 'DISCOVERY',
  subtitle: 'Requirements Gathered. Nothing Lost.',
  description: 'Deep-dive sessions to map your landscape — goals, constraints, audiences, and the real problem behind the brief.',
  Icon: Search,
  duration: '1–2 weeks',
  deliverable: 'Discovery Brief',
  Card: DiscoveryCard
}, {
  num: '002',
  title: 'STRATEGY',
  subtitle: 'Direction Set. Alignment Locked.',
  description: 'We synthesise insights into a clear direction — positioning, architecture, tech stack, and a phased roadmap.',
  Icon: Compass,
  duration: '1 week',
  deliverable: 'Strategy Deck',
  Card: StrategyCard
}, {
  num: '003',
  title: 'DESIGN',
  subtitle: 'Pixel-Perfect. Brand-True.',
  description: 'From wireframes to high-fidelity interfaces — building a cohesive system that speaks your brand language.',
  Icon: Pen,
  duration: '2–4 weeks',
  deliverable: 'Design System & Prototypes',
  Card: DesignCard
}, {
  num: '004',
  title: 'DEVELOPMENT',
  subtitle: 'Production-Grade. Zero Shortcuts.',
  description: 'Clean code, performance-first, accessibility baked in — engineered to scale from day one.',
  Icon: Code2,
  duration: '4–8 weeks',
  deliverable: 'Staged Builds',
  Card: DevelopmentCard
}, {
  num: '005',
  title: 'DELIVERY',
  subtitle: 'Managed Launch. Zero Surprises.',
  description: 'Rigorous QA, cross-device testing, and a managed launch — on time, on spec, on budget.',
  Icon: Rocket,
  duration: '1 week',
  deliverable: 'Live Product',
  Card: DeliveryCard
}, {
  num: '006',
  title: 'CARE',
  subtitle: 'We Stay In The Picture.',
  description: 'Ongoing support, proactive monitoring, and iterative improvements — long after go-live.',
  Icon: HeartHandshake,
  duration: 'Ongoing',
  deliverable: 'Support Retainer',
  Card: CareCard
}, {
  num: '007',
  title: 'OPTIMISE',
  subtitle: 'Data-Led. Compounding Results.',
  description: 'Analytics, A/B testing, and performance tuning — so value compounds every month.',
  Icon: TrendingUp,
  duration: 'Monthly',
  deliverable: 'Growth Reports',
  Card: OptimiseCard
}];

// ─── Step row ────────────────────────────────────────────────────────────────
const StepRow = ({
  step,
  index,
  isLast,
  inView
}: {
  step: ProcessStep;
  index: number;
  isLast: boolean;
  inView: boolean;
}) => {
  const [open, setOpen] = useState(index === 0);
  const {
    Icon,
    Card
  } = step;
  return <motion.div initial={{
    opacity: 0,
    y: 22
  }} animate={inView ? {
    opacity: 1,
    y: 0
  } : {
    opacity: 0,
    y: 22
  }} transition={{
    duration: 0.52,
    delay: index * 0.07,
    ease: [0.22, 1, 0.36, 1]
  }} className="relative">
      {/* Connector line */}
      {!isLast && <div className="absolute left-[35px] sm:left-[43px] top-[54px] sm:top-[62px] w-px z-0 pointer-events-none" style={{
      height: 'calc(100% - 4px)',
      overflow: 'hidden'
    }}>
          <motion.div className="w-full h-full" style={{
        background: T.cardBorder,
        transformOrigin: 'top center'
      }} initial={{
        scaleY: 0
      }} animate={inView ? {
        scaleY: 1
      } : {
        scaleY: 0
      }} transition={{
        duration: 0.45,
        delay: index * 0.07 + 0.25,
        ease: 'easeOut'
      }} />
        </div>}

      <div className="relative z-10 flex gap-4 sm:gap-6">
        {/* Icon column */}
        <div className="flex flex-col items-center shrink-0">
          <button onClick={() => setOpen(v => !v)} className="w-[52px] h-[52px] sm:w-[62px] sm:h-[62px] rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden cursor-pointer" style={{
          background: open ? T.glowMd : T.glowSm,
          border: `1px solid ${open ? T.cardBorderHover : T.cardBorder}`,
          boxShadow: open ? '0 0 28px rgba(255,255,255,0.04)' : 'none'
        }}>
            <Icon size={18} style={{
            color: open ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'
          }} strokeWidth={1.5} className="transition-all duration-300 relative z-10" />
          </button>
        </div>

        {/* Text + expandable card */}
        <div className="flex-1 pb-8 sm:pb-10 ps-step-card rounded-xl px-4 py-3 cursor-pointer" style={{
        borderBottom: isLast ? 'none' : `1px solid ${T.cardBorder}`
      }} onClick={() => setOpen(v => !v)}>
          {/* Header row */}
          <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
            <div className="flex items-baseline gap-3 sm:gap-4">
              <span className="ps-abel font-mono text-[11px] tracking-[0.2em] transition-colors duration-300" style={{
              color: T.textDim
            }}>
                {step.num}
              </span>
              <div>
                <h3 className="ps-abel text-[18px] sm:text-[22px] md:text-[26px] leading-none tracking-[0.05em] text-white uppercase">
                  {step.title}
                </h3>
                <p className="ps-abel text-[11px] tracking-[0.08em] mt-0.5" style={{
                color: T.textDim
              }}>
                  {step.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag>{step.duration}</Tag>
              <ChevronRight size={13} style={{
              color: T.textDim,
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }} />
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-[12px] sm:text-[13px] leading-relaxed max-w-xl" style={{
          color: T.textMuted
        }}>
            {step.description}
          </p>

          {/* Expandable card content */}
          <Card active={open} />
        </div>
      </div>
    </motion.div>;
};

// ─── Main export ─────────────────────────────────────────────────────────────
export const ProcessSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.06
  });
  return <section className="relative w-full" style={{
    background: T.bg
  }} id="pg-process">
      <ProcessGlobalStyles />
      <GridOverlay />

      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
      background: 'radial-gradient(circle, rgba(255,255,255,0.012) 0%, transparent 70%)'
    }} />

      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 py-16 sm:py-20 md:py-24">

        {/* Section header */}
        <motion.div ref={ref} initial={{
        opacity: 0,
        y: 18
      }} animate={inView ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 18
      }} transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }} className="flex flex-col gap-4 mb-14 sm:mb-18">
          <div className="flex items-center gap-3">
            <div className="w-5 h-px" style={{
            background: T.textDim
          }} />
            <span className="ps-abel text-[10px] sm:text-[11px] tracking-[0.3em] uppercase" style={{
            color: T.textDim
          }}>
              How We Work
            </span>
          </div>
          <div>
            <h2 className="ps-abel text-[clamp(32px,6vw,72px)] leading-none tracking-tight uppercase" style={{
            color: T.textDim
          }}>
              OUR
            </h2>
            <h2 className="ps-abel text-[clamp(32px,6vw,72px)] leading-none tracking-tight text-white uppercase">
              PROCESS.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-1">
            <p className="ps-abel text-[13px] sm:text-[14px] leading-relaxed max-w-md" style={{
            color: T.textMuted
          }}>
              Seven deliberate phases — from first conversation to compounding growth. No shortcuts, no guesswork.
            </p>
            <motion.a href="#pg-contact" whileHover={{
            scale: 1.03
          }} whileTap={{
            scale: 0.97
          }} className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full ps-abel text-[11px] sm:text-[12px] uppercase tracking-[0.1em] text-white shrink-0" style={{
            background: T.glowSm,
            border: `1px solid ${T.cardBorder}`
          }}>
              Start a project <ChevronRight size={11} />
            </motion.a>
          </div>
        </motion.div>

        {/* Step list */}
        <div className="flex flex-col gap-0">
          {STEPS.map((step, i) => <StepRow key={step.num} step={step} index={i} isLast={i === STEPS.length - 1} inView={inView} />)}
        </div>

        {/* Bottom note */}
        <motion.div initial={{
        opacity: 0
      }} animate={inView ? {
        opacity: 1
      } : {
        opacity: 0
      }} transition={{
        duration: 0.5,
        delay: STEPS.length * 0.07 + 0.2
      }} className="mt-14 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{
        borderTop: `1px solid ${T.cardBorder}`
      }}>
          <span className="ps-abel text-[10px] tracking-[0.2em] uppercase" style={{
          color: T.textDim
        }}>
            Each engagement is bespoke — timelines adapt to scope.
          </span>
          <div className="flex items-center gap-2">
            {STEPS.map(s => <span key={s.num} className="ps-abel text-[9px] tracking-widest" style={{
            color: T.textDim
          }}>{s.num}</span>)}
          </div>
        </motion.div>
      </div>
    </section>;
};
export default ProcessSection;