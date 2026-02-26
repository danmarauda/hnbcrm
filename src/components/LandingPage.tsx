import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router";
import { useConvexAuth } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Kanban,
  Contact2,
  MessageSquare,
  ArrowRightLeft,
  Users,
  ScrollText,
  Globe,
  SlidersHorizontal,
  Bookmark,
  Building2,
  BarChart3,
  Webhook,
  Server,
  Zap,
  CalendarDays,
  Bot,
  Radio,
  Paperclip,
  Search,
  Target,
  Layers,
  Check,
  Sparkles,
  Zap as Lightning,
  TrendingUp,
  Code2,
  Play,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { OrganizationStructuredData } from "@/components/StructuredData";
import {
  fadeInUp,
  staggerContainer,
} from "@/lib/animations";

// Animation variants
const heroTextVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const orbVariants = {
  animate: {
    y: [-20, 20, -20],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const floatVariants = {
  animate: {
    y: [-10, 10, -10],
    x: [-5, 5, -5],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Simple useInView hook for scroll animations
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isInView };
}

export function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // IntersectionObserver for floating CTA
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingCta(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Redirect authenticated users to the app
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="HNBCRM — CRM with Human-AI Collaboration"
        description="Multi-tenant CRM with AI automation. Manage leads, pipeline, contacts, and integrate AI agents via REST API and MCP."
        keywords="crm, ai, automation, leads, pipeline, multi-tenant, webhook, mcp, api rest"
      />
      <OrganizationStructuredData />
      <div className="min-h-screen bg-surface-base text-text-primary overflow-x-hidden">
        {/* Hero Section with Glassmorphism */}
        <section
          ref={heroRef}
          className="relative min-h-[90vh] md:min-h-screen flex flex-col"
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.03),transparent)]" />
          <div className="absolute inset-0 grid-overlay opacity-50" />
          <div className="absolute inset-0 paper-texture pointer-events-none" />

          {/* Floating gradient orbs */}
          <motion.div
            variants={orbVariants}
            animate="animate"
            className="orb orb-white w-[500px] h-[500px] -top-40 -right-40"
          />
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="orb orb-white w-[400px] h-[400px] bottom-20 -left-20"
          />
          <motion.div
            variants={orbVariants}
            animate="animate"
            style={{ animationDelay: "2s" }}
            className="orb orb-white w-[300px] h-[300px] bottom-40 right-1/4 opacity-30"
          />

          {/* Header */}
          <header className="relative z-10 pt-6 px-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <img
                  src="/orange_icon_logo_transparent-bg-528x488.png"
                  alt="HNBCRM Logo"
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold text-text-primary font-display tracking-wider">
                  HNBCRM
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <Link to="/developers">
                  <Button variant="ghost" size="sm">
                    Developers
                  </Button>
                </Link>
                <Link to="/entrar">
                  <Button variant="glass" size="sm">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>
          </header>

          {/* Hero Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center py-16">
            <div className="max-w-4xl mx-auto">
              {/* Glassmorphism hero card */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="glass glass-lg rounded-2xl p-8 md:p-12 lg:p-16 border border-glass-border"
              >
                {/* Badge */}
                <motion.div
                  variants={fadeInUp}
                  className="flex justify-center mb-6"
                >
                  <Badge variant="glow">Open Beta — 100% Free</Badge>
                </motion.div>

                {/* Headline with Abel font */}
                <motion.h1
                  custom={0}
                  variants={heroTextVariants}
                  className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-wide uppercase mb-6"
                >
                  The CRM Where{" "}
                  <span className="text-white">Humans & AI</span>
                  <br className="hidden md:block" />
                  <span className="text-text-muted">Work Together</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  custom={1}
                  variants={heroTextVariants}
                  className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8"
                >
                  Visual pipeline, unified inbox, intelligent handoffs, and complete audit. All in real-time.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                  custom={2}
                  variants={heroTextVariants}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link to="/entrar">
                    <Button
                      variant="primary"
                      size="lg"
                      asMotion
                      className="min-h-[44px]"
                    >
                      Get Started Free
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Button
                    variant="glass"
                    size="lg"
                    onClick={() => scrollToSection("features")}
                    className="min-h-[44px]"
                  >
                    View Features
                  </Button>
                </motion.div>

                {/* Trust text */}
                <motion.p
                  custom={3}
                  variants={heroTextVariants}
                  className="text-sm text-text-muted mt-6"
                >
                  No credit card. No time limit.
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="relative z-10 flex justify-center pb-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-glass-border flex items-start justify-center p-1"
            >
              <motion.div className="w-1 h-2 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Floating CTA Pill */}
        <AnimatePresence>
          {showFloatingCta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
            >
              <Link to="/entrar">
                <button
                  className={cn(
                    "glass rounded-full px-6 py-3",
                    "text-white font-semibold transition-all duration-300 min-h-[44px]",
                    "hover:bg-white hover:text-black"
                  )}
                  aria-label="Get Started Free"
                >
                  Get Started Free
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          {/* Social Proof Bar */}
          <SocialProofBar />

          {/* Features Section */}
          <FeaturesSection />

          {/* Developer Section */}
          <DeveloperSection />

          {/* Coming Soon Section */}
          <ComingSoonSection />

          {/* How It Works Section */}
          <HowItWorksSection />

          {/* Pricing Section */}
          <PricingSection />

          {/* CTA Section */}
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

function SocialProofBar() {
  return (
    <div className="py-8 border-y border-border bg-surface-sunken/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <Sparkles className="text-white" size={24} />
            <div>
              <div className="text-2xl font-bold text-text-primary">12+</div>
              <div className="text-sm text-text-secondary">Features</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Lightning className="text-white" size={24} />
            <div>
              <div className="text-2xl font-bold text-text-primary">Real-time</div>
              <div className="text-sm text-text-secondary">with Convex</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <TrendingUp className="text-white" size={24} />
            <div>
              <div className="text-2xl font-bold text-text-primary">Native AI</div>
              <div className="text-sm text-text-secondary">Built-in</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const features = [
    { icon: Kanban, title: "Kanban Pipeline", description: "Drag and drop leads between stages. Visual, fast, intuitive." },
    { icon: Contact2, title: "Contact Management", description: "Centralize all your contacts with custom fields." },
    { icon: MessageSquare, title: "Unified Inbox", description: "All conversations in one place, in real-time." },
    { icon: ArrowRightLeft, title: "AI ↔ Human Handoffs", description: "Intelligent transfers between AI agents and sales reps." },
    { icon: Users, title: "Human + AI Team", description: "Manage sales reps and AI agents side by side." },
    { icon: ScrollText, title: "Complete Audit", description: "Track all changes with detailed, filterable logs." },
    { icon: Globe, title: "Full REST API", description: "Integrate with your systems via authenticated API." },
    { icon: SlidersHorizontal, title: "Custom Fields", description: "Adapt the CRM to your needs with custom fields." },
    { icon: Bookmark, title: "Saved Views", description: "Create custom filters and views for your team." },
    { icon: Building2, title: "Multi-tenancy", description: "Complete data isolation per organization. Secure and scalable." },
    { icon: BarChart3, title: "Real-time Dashboard", description: "Metrics and KPIs updated instantly." },
    { icon: CalendarDays, title: "Calendar", description: "View events and tasks by day, week, or month with drag-and-drop." },
    { icon: Webhook, title: "HMAC-SHA256 Webhooks", description: "Receive real-time events with secure authentication." },
    { icon: Server, title: "MCP Server", description: "Integrate AI agents via Model Context Protocol." },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="py-16 md:py-24 relative"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 grid-overlay-fine opacity-30" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-wide uppercase"
          >
            Everything You Need to Sell More
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-text-secondary"
          >
            Ready-to-use features, no complex setup.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card variant="bento" asMotion className="p-6 h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center shrink-0">
                    <feature.icon className="text-white/80" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeveloperSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const cards = [
    { icon: Globe, title: "Full REST API", description: "44 endpoints to manage leads, contacts, conversations, handoffs, and more. API Key authentication.", link: "/developers#rest-api", linkText: "View Docs" },
    { icon: Server, title: "MCP Server", description: "44 tools for AI agents via Model Context Protocol. Compatible with Claude, Cursor, VS Code, and more.", link: "/developers#mcp", linkText: "Configure MCP" },
    { icon: Play, title: "API Playground", description: "Test endpoints directly in your browser. Fill forms, send requests, see responses in real-time.", link: "/developers#playground", linkText: "Open Playground", primary: true },
    { icon: BookOpen, title: "Agent Skills", description: "Portable skill that teaches any AI agent to operate as a team member. Compatible with Claude Code, Cursor, Gemini, and more.", link: "/developers#agent-skills", linkText: "View Skill" },
  ];

  return (
    <section
      id="developers"
      ref={ref}
      className="py-16 md:py-24 bg-surface-sunken/30 relative"
      aria-labelledby="developer-heading"
    >
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}>
            <Badge variant="glow">Developer Experience</Badge>
          </motion.div>
          <motion.h2
            id="developer-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 mt-4 tracking-wide uppercase"
          >
            Built for Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary"
          >
            Integrate AI agents, automate workflows, extend your CRM.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                variant={card.primary ? "bentoBrand" : "bento"}
                asMotion
                className={`p-8 flex flex-col h-full ${card.primary ? "border-white/10" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-4">
                  <card.icon className="text-white/80" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{card.title}</h3>
                <p className="text-sm text-text-secondary mb-6 flex-1">{card.description}</p>
                <Link to={card.link}>
                  <Button variant={card.primary ? "primary" : "secondary"} size="sm" className="w-full min-h-[44px]">
                    <Code2 size={16} />
                    {card.linkText}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComingSoonSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const comingSoon = [
    { icon: Zap, title: "Automation Engine", description: "Automate workflows without writing code." },
    { icon: Bot, title: "AI Co-pilot", description: "Intelligent assistant that suggests next steps." },
    { icon: Radio, title: "Channel Integrations", description: "WhatsApp, email, SMS, and more coming soon." },
    { icon: Paperclip, title: "File Storage", description: "Attach documents and images to your leads." },
    { icon: Search, title: "Command Palette", description: "Navigate the CRM with keyboard shortcuts." },
    { icon: Target, title: "AI Lead Scoring", description: "Automatically prioritize the best leads." },
    { icon: Layers, title: "Multi-Agent Flows", description: "Orchestrate multiple AI agents in parallel." },
  ];

  return (
    <section
      id="coming-soon"
      ref={ref}
      className="py-16 md:py-24 relative"
      aria-labelledby="coming-soon-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(255,255,255,0.02),transparent)]" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            id="coming-soon-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-wide uppercase"
          >
            Just Getting Started
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary"
          >
            New features every week.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comingSoon.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card variant="glass" className="p-6 opacity-70 relative h-full">
                <div className="absolute top-4 right-4">
                  <Badge variant="warning">Coming Soon</Badge>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <feature.icon className="text-text-muted" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
                    <p className="text-sm text-text-secondary">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const steps = [
    { number: 1, title: "Create your organization", description: "Sign up in seconds and set up your workspace." },
    { number: 2, title: "Configure your pipeline", description: "Customize stages, fields, and invite your team." },
    { number: 3, title: "Sell with superpowers", description: "Leads, conversations, handoffs, and audit — all real-time." },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-surface-sunken/30" aria-labelledby="how-it-works-heading">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            id="how-it-works-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-wide uppercase"
          >
            Simple to Start
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Card variant="bento" className="p-8 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center border border-white/10">
                  <span className="text-2xl font-bold text-white font-display">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="pricing" ref={ref} className="py-16 md:py-24 relative" aria-labelledby="pricing-heading">
      <div className="absolute inset-0 grid-overlay opacity-20" />

      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            id="pricing-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-wide uppercase"
          >
            Simple, Transparent Pricing
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0 }}>
            <Card variant="bento" className="p-8 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">Starter</h3>
                <span className="text-3xl font-bold text-text-primary">Free</span>
                <p className="text-sm text-text-secondary">forever</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Up to 3 users</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">1 pipeline</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">100 leads</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Unified inbox</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Contacts</span></li>
              </ul>
              <Link to="/entrar" className="block">
                <Button variant="secondary" className="w-full min-h-[44px]">Get Started Free</Button>
              </Link>
            </Card>
          </motion.div>

          {/* Pro */}
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: 0.1 }} className="md:-mt-4 md:mb-4">
            <Card variant="bentoBrand" className="p-8 h-full flex flex-col border-white/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="glow">Recommended</Badge>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">Pro</h3>
                <div className="text-text-muted line-through text-sm mb-1">$97/month</div>
                <span className="text-3xl font-bold text-white">Free in Beta</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Unlimited users</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Unlimited pipelines</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Unlimited leads</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">AI ↔ Human handoffs</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">REST API + Webhooks</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Complete audit</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Custom fields</span></li>
              </ul>
              <Link to="/entrar" className="block">
                <Button variant="primary" className="w-full min-h-[44px]">Get Started Free</Button>
              </Link>
            </Card>
          </motion.div>

          {/* Enterprise */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
            <Card variant="bento" className="p-8 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">Enterprise</h3>
                <div className="text-text-muted line-through text-sm mb-1">$297/month</div>
                <span className="text-3xl font-bold text-white">Free in Beta</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Everything in Pro</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">MCP Server</span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary flex items-center gap-2">Automations <Badge variant="warning">Soon</Badge></span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary flex items-center gap-2">AI Co-pilot <Badge variant="warning">Soon</Badge></span></li>
                <li className="flex items-start gap-2"><Check className="text-white/80 shrink-0 mt-0.5" size={18} /><span className="text-text-secondary">Priority support</span></li>
              </ul>
              <Link to="/entrar" className="block">
                <Button variant="secondary" className="w-full min-h-[44px]">Get Started Free</Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 md:py-24 text-center relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(255,255,255,0.02),transparent)]" />
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <motion.div variants={orbVariants} animate="animate" className="orb orb-white w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-4xl mx-auto px-4 relative">
        <motion.h2 id="cta-heading" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-wide uppercase">
          Ready to Transform Your Sales?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="text-lg text-text-secondary mb-8">
          Join companies already using HNBCRM to sell more.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}>
          <Link to="/entrar">
            <Button variant="primary" size="lg" asMotion className="min-h-[44px]">
              Create Free Account
              <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-border relative">
      <div className="absolute inset-0 paper-texture pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 text-center relative">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/orange_icon_logo_transparent-bg-528x488.png" alt="HNBCRM Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold text-text-primary font-display tracking-wider">HNBCRM</span>
        </div>
        <div className="flex items-center justify-center gap-6 mb-4">
          <Link to="/developers" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Developers</Link>
        </div>
        <p className="text-text-secondary mb-4">The CRM where humans and AI work together.</p>
        <p className="text-sm text-text-muted">© 2025 HNBCRM. All rights reserved.</p>
      </div>
    </footer>
  );
}
