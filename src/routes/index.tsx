import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ScanLine, ArrowUpRight, Mail, Phone, MapPin, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => setVisible(true), 2000);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          clearTimeout(timer);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}) {
  const { ref, visible } = useScrollReveal(threshold);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Curated real dashboard & UI deconstruction screenshots from Unsplash
const arcedPortraits = [
  { url: "/images/screenshot_scan.png", transform: "perspective(1000px) rotateY(28deg) translateZ(-70px) translateY(8px) scale(0.88)" },
  { url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=280&h=380&q=80", transform: "perspective(1000px) rotateY(18deg) translateZ(-40px) translateY(4px) scale(0.94)" },
  { url: "/images/screenshot_github_scan.png", transform: "perspective(1000px) rotateY(10deg) translateZ(-15px) scale(0.98)" },
  { url: "/images/screenshot_home.png", transform: "perspective(1000px) rotateY(0deg) translateZ(20px) translateY(-10px) scale(1.06)", isCenter: true },
  { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=280&h=380&q=80", transform: "perspective(1000px) rotateY(-10deg) translateZ(-15px) scale(0.98)" },
  { url: "/images/screenshot_stripe_scan.png", transform: "perspective(1000px) rotateY(-18deg) translateZ(-40px) translateY(4px) scale(0.94)" },
  { url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=280&h=380&q=80", transform: "perspective(1000px) rotateY(-28deg) translateZ(-70px) translateY(8px) scale(0.88)" },
];

const heroFeatures = [
  {
    title: "Real-Time Deconstruction",
    desc: "Communicate layout details seamlessly and keep visual specs in sync with computed dimensions, font clustering, and live audits.",
  },
  {
    title: "Design System Extraction",
    desc: "Extract brand styles, border radius parameters, shadow assets, and fonts to match standard Tailwind or CSS templates.",
  },
  {
    title: "Fidelity Spec Exporter",
    desc: "Export structured LLM megaprompts, Figma design tokens, and clean React component code to rebuild web sections instantly.",
  },
];

const impactCards = [
  { url: "/images/screenshot_github_scan.png", label: "Spec Workspace" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased relative overflow-hidden noise-overlay">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-0 left-1/4 size-[500px] orb-indigo animate-pulse-glow pointer-events-none" />
      <div className="absolute top-10 right-1/4 size-[500px] orb-cyan animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          {/* Logo brand with calligraphic Chopin font */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-chopin text-[2.25rem] font-normal text-slate-900 tracking-wide capitalize select-none pt-1">Syclone</span>
          </Link>

          {/* Clean menu actions (100% active functional links) */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xs uppercase tracking-wider font-bold text-slate-500 hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link to="/scan" search={{ url: "" }}>
              <button className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer select-none">
                Go to Console <ArrowUpRight className="size-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─── Hero Title Section ─── */}
        <section className="px-6 pt-24 pb-12 relative text-center">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="absolute inset-0 surface-glow pointer-events-none" />
          
          <div className="mx-auto max-w-4xl relative z-10">
            <Reveal>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.08] mb-6 font-header">
                Streamline Your <span className="font-chopin text-[3.75rem] font-normal lowercase text-slate-900 ml-1">Design,</span>
                <br />
                Supercharge Your Workflow
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-8 font-sans font-semibold leading-relaxed">
                All-in-one platform to plan, collaborate, and deconstruct web designs — faster and smarter.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <Link to="/scan" search={{ url: "" }}>
                <button className="rounded-full bg-slate-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 mx-auto cursor-pointer shadow-md select-none">
                  Get started for Free <ArrowUpRight className="size-4" />
                </button>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ─── Arced Perspective Slider ─── */}
        <section className="relative w-full overflow-hidden pb-16 [perspective:1200px]">
          <div className="flex justify-center items-center -space-x-4 sm:-space-x-8 select-none py-10 relative z-10 max-w-full overflow-x-auto no-scrollbar px-6">
            {arcedPortraits.map((item, idx) => (
              <div
                key={idx}
                style={{ transform: item.transform }}
                className={cn(
                  "w-28 h-40 sm:w-44 sm:h-64 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/20 backdrop-blur-xs overflow-hidden shadow-sm shrink-0 transition-all duration-500 hover:scale-105 cursor-pointer",
                  item.isCenter ? "shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-20" : "opacity-85 z-10"
                )}
              >
                <img src={item.url} alt={`Layout Preview ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Three Feature Columns */}
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-slate-200/50 pt-14 mt-6 px-6">
            {heroFeatures.map((f) => (
              <div key={f.title} className="text-center md:text-left">
                <h3 className="text-sm font-bold text-slate-900 font-header mb-3 tracking-wider">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans font-semibold">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Bento Grid Section ─── */}
        <section id="features" className="border-t border-slate-200/60 px-6 py-28 relative">
          <div className="mx-auto max-w-5xl relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-[2.25rem] font-bold tracking-tight text-slate-900 font-header mb-4 leading-tight">
                  Everything Your Team Needs to <br /> Work Smarter
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-sans font-semibold leading-relaxed">
                  From css variables to layout grids, our features are built to keep your design aligned, structured, and moving forward—together.
                </p>
              </div>
            </Reveal>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1, Col 1: Live DOM & CSS Inspector (2/3 width) */}
              <Reveal className="md:col-span-2" delay={50}>
                <div className="group rounded-3xl border border-slate-200/60 bg-white shadow-xs overflow-hidden relative aspect-video md:h-80 flex flex-col justify-end p-8">
                  {/* Background photo of HTML code editor */}
                  <img
                    src="/images/screenshot_github_scan.png"
                    alt="Live CSS & DOM Inspector"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 text-white max-w-sm">
                    <h3 className="text-base font-bold font-header uppercase tracking-wider mb-2">Live DOM & CSS Inspector</h3>
                    <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">
                      Deconstruct and preview layout dimensions, font assets, and styling attributes in real-time.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Row 1, Col 2: Design System Exporter (1/3 width, solid color) */}
              <Reveal delay={100}>
                <div className="rounded-3xl border border-slate-200/60 bg-[#F4F1EA] shadow-xs overflow-hidden p-8 h-full min-h-[220px] flex flex-col justify-end">
                  <div className="text-slate-900">
                    <h3 className="text-base font-bold font-header uppercase tracking-wider mb-2">Design System Exporter</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans font-semibold">
                      Generate Figma-compatible design token sheets, responsive Tailwind templates, and raw JSON specifications.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Row 2, Col 1: Neural Style Injector (1/3 width, solid color) */}
              <Reveal delay={150}>
                <div className="rounded-3xl border border-slate-200/60 bg-[#EAE6DC] shadow-xs overflow-hidden p-8 h-full min-h-[220px] flex flex-col justify-end">
                  <div className="text-slate-900">
                    <h3 className="text-base font-bold font-header uppercase tracking-wider mb-2">Neural Style Injector</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans font-semibold">
                      Audit competitor styles and automatically inject theme and aesthetic overrides into local templates.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Row 2, Col 2: Layout & Alignment Audits (2/3 width, dark green background with design specs overlay) */}
              <Reveal className="md:col-span-2" delay={200}>
                <div className="group rounded-3xl border border-[#485340] bg-[#53624D] shadow-xs overflow-hidden relative aspect-video md:h-80 flex flex-col justify-end p-8">
                  {/* Design specifications sketch overlay */}
                  <img
                    src="/images/screenshot_stripe_scan.png"
                    alt="Layout & Alignment Audits"
                    className="absolute right-0 bottom-0 h-full w-[45%] object-cover object-center hidden sm:block z-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 text-white max-w-xs">
                    <h3 className="text-base font-bold font-header uppercase tracking-wider mb-2">Layout & Alignment Audits</h3>
                    <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">
                      Track page whitespace percentages, negative space ratios, grid density scales, and typographic rhythm.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ─── Proven Results Section ─── */}
        <section id="how-it-works" className="border-t border-slate-200/60 px-6 py-28 relative">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-[2.25rem] font-bold tracking-tight text-slate-900 font-header mb-4">
                  Proven Results, Real Impact
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-sans font-semibold leading-relaxed">
                  See how development teams around the world are working faster, communicating better, and getting more done with our deconstruction specifications.
                </p>
              </div>
            </Reveal>

            <div className="w-full max-w-4xl mx-auto">
              {impactCards.map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-50/30 aspect-video relative group shadow-md">
                    <img src={item.url} alt={item.label} className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ─── Premium Footer ─── */}
      <footer className="border-t border-slate-200/60 bg-white">
        {/* Top CTA Band */}
        <div className="bg-slate-900 py-14 px-6">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight font-sans mb-2">
                Ready to deconstruct the web?
              </h2>
              <p className="text-slate-400 text-sm font-medium max-w-md">
                Start extracting design tokens, layout specs, and component blueprints in seconds.
              </p>
            </div>
            <Link to="/scan" search={{ url: "" }}>
              <button className="rounded-full bg-white text-slate-900 px-7 py-3.5 text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer shadow-lg select-none group">
                Launch Console
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
            {/* Brand column — wider */}
            <div className="col-span-2 md:col-span-4 space-y-5">
              <Link to="/" className="flex items-center gap-1">
                <span className="font-chopin text-[2rem] font-normal text-slate-900 tracking-wide capitalize pt-0.5">Syclone</span>
              </Link>
              <p className="text-[13px] text-slate-500 leading-relaxed font-normal">
                Extract design system tokens, components, accessibility markers, and visual blueprints from any live website.
              </p>
              {/* Contact info right in the brand column */}
              <div className="space-y-3 pt-2">
                <a href="mailto:srishakthi799@gmail.com" className="flex items-center gap-2.5 text-[13px] text-slate-600 hover:text-slate-900 transition-colors group">
                  <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Mail className="size-3.5 text-slate-500" />
                  </div>
                  srishakthi799@gmail.com
                </a>
                <div className="flex items-center gap-2.5 text-[13px] text-slate-500">
                  <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <MapPin className="size-3.5 text-slate-500" />
                  </div>
                  India
                </div>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="col-span-1 md:col-span-2 md:col-start-6">
              <h4 className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-5">Navigation</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Home</Link>
                </li>
                <li>
                  <Link to="/scan" search={{ url: "" }} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Console</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Capabilities */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-5">Capabilities</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/scan" search={{ url: "" }} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Single URL Scan</Link>
                </li>
                <li>
                  <Link to="/scan" search={{ url: "" }} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Parallel Scans</Link>
                </li>
                <li>
                  <Link to="/scan" search={{ url: "" }} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors font-medium">Competitive IQ</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Exports */}
            <div className="col-span-1 md:col-span-3">
              <h4 className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-5">Export Formats</h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-[13px] text-slate-500 font-medium">LLM Mega-prompts</span>
                </li>
                <li>
                  <span className="text-[13px] text-slate-500 font-medium">Figma JSON Tokens</span>
                </li>
                <li>
                  <span className="text-[13px] text-slate-500 font-medium">React Components</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-14 pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Syclone. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-[12px] text-slate-400">
              <span className="font-medium">Built with TanStack Start</span>
              <span className="text-slate-300">·</span>
              <a href="mailto:srishakthi799@gmail.com" className="hover:text-slate-900 transition-colors font-medium">srishakthi799@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
