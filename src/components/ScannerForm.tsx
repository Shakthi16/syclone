import { useState, useRef, useEffect } from "react";
import { Search, Layers, Cpu, Boxes, Sliders, Laptop, Tablet, Smartphone, Trash, Plus, Sparkles, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Tier, Customization } from "@/lib/scan.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TierOption = {
  id: Tier;
  name: string;
  tagline: string;
  icon: LucideIcon;
};

export const TIER_OPTIONS: TierOption[] = [
  {
    id: "quick",
    name: "Quick Visual Scan",
    tagline: "~2 min",
    icon: Layers,
  },
  {
    id: "functional",
    name: "Deep System Scan",
    tagline: "~5 min",
    icon: Cpu,
  },
  {
    id: "stack",
    name: "Full Architect Scan",
    tagline: "~10 min",
    icon: Boxes,
  },
];

type SidebarProps = {
  mode: "single" | "batch" | "compare";
  setMode: (m: "single" | "batch" | "compare") => void;
  tier: Tier;
  setTier: (t: Tier) => void;
  viewport: "desktop" | "tablet" | "mobile";
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
  customization: Customization;
  setCustomization: (c: Customization) => void;
  loading: boolean;
};

export function ScannerSidebarControls({
  mode,
  setMode,
  tier,
  setTier,
  viewport,
  setViewport,
  customization,
  setCustomization,
  loading,
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* 1. Mode Selectors */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-sans">
          Scan Mode
        </label>
        <div className="flex flex-col gap-1 rounded-lg bg-slate-100/60 p-1 border border-slate-200/50">
          {(["single", "batch", "compare"] as const).map((m) => (
            <button
              key={m}
              type="button"
              disabled={loading}
              onClick={() => setMode(m)}
              className={cn(
                "w-full text-left rounded-md px-3 py-2 text-xs font-bold transition-all flex items-center justify-between font-sans cursor-pointer",
                mode === m
                  ? "bg-white text-primary shadow-[0_2px_8px_rgba(79,70,229,0.08)] border border-primary/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40",
              )}
            >
              <span className="capitalize">{m === "compare" ? "Competitive IQ" : `${m} Scan`}</span>
              {mode === m && <span className="size-1.5 rounded-full bg-primary animate-pulse" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Scanning Depth */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-sans">
          Scan Depth
        </label>
        <div className="space-y-2">
          {TIER_OPTIONS.map((opt) => {
            const active = tier === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={loading}
                onClick={() => setTier(opt.id)}
                className={cn(
                  "w-full flex items-center justify-between rounded-lg border p-3 text-left transition-all font-sans cursor-pointer",
                  active
                    ? "border-primary bg-primary/5 text-primary shadow-[0_2px_10px_rgba(79,70,229,0.05)] font-bold"
                    : "border-slate-200/60 bg-white hover:border-slate-300 text-slate-500 hover:text-slate-900 shadow-[0_2px_4px_rgba(0,0,0,0.01)]",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0" />
                  <span className="text-xs font-bold text-slate-850">{opt.name}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-semibold">{opt.tagline}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Screen Viewport */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-sans">
          Viewport Simulation
        </label>
        <div className="flex gap-1.5 bg-slate-100/60 p-1 rounded-lg border border-slate-200/50">
          {[
            { id: "desktop", name: "Desktop", icon: Laptop },
            { id: "tablet", name: "Tablet", icon: Tablet },
            { id: "mobile", name: "Mobile", icon: Smartphone },
          ].map((v) => {
            const active = viewport === v.id;
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                type="button"
                disabled={loading}
                onClick={() => setViewport(v.id as any)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-2 rounded-md text-[10px] font-bold border transition-all cursor-pointer font-sans",
                  active
                    ? "border-primary/10 bg-primary/5 text-primary shadow-[0_2px_8px_rgba(79,70,229,0.06)]"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/40",
                )}
              >
                <Icon className="size-3.5 mb-1" />
                {v.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Customizer Panel */}
      <div className="space-y-4 pt-4 border-t border-slate-200/65">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
          <Sliders className="size-3.5 text-primary" />
          Prompt Configurer
        </span>

        {/* Tone */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-sans">
            <span className="font-medium text-slate-500">Aesthetic Tone</span>
            <span className="font-mono text-accent font-bold capitalize">{customization.tone}</span>
          </div>
          <div className="flex gap-1 bg-slate-100/60 p-0.5 rounded-md border border-slate-200/50">
            {(["technical", "creative", "minimalist"] as const).map((t) => (
              <button
                key={t}
                type="button"
                disabled={loading}
                onClick={() => setCustomization({ ...customization, tone: t })}
                className={cn(
                  "flex-1 py-1 text-[10px] font-bold rounded capitalize transition-all cursor-pointer font-sans",
                  customization.tone === t ? "bg-white text-primary shadow-[0_2px_6px_rgba(79,70,229,0.06)]" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {t === "technical" ? "Tech" : t === "minimalist" ? "Min" : "Creat"}
              </button>
            ))}
          </div>
        </div>

        {/* Complexity */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-sans">
            <span className="font-medium text-slate-500">Complexity Cap</span>
            <span className="font-mono text-accent font-bold capitalize">{customization.complexity}</span>
          </div>
          <div className="flex gap-1 bg-slate-100/60 p-0.5 rounded-md border border-slate-200/50">
            {(["junior", "mid", "senior"] as const).map((c) => (
              <button
                key={c}
                type="button"
                disabled={loading}
                onClick={() => setCustomization({ ...customization, complexity: c })}
                className={cn(
                  "flex-1 py-1 text-[10px] font-bold rounded capitalize transition-all cursor-pointer font-sans",
                  customization.complexity === c ? "bg-white text-primary shadow-[0_2px_6px_rgba(79,70,229,0.06)]" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {c === "junior" ? "Jun" : c === "mid" ? "Mid" : "Sen"}
              </button>
            ))}
          </div>
        </div>

        {/* Framework dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-500 font-sans">Framework Template</label>
          <select
            value={customization.framework}
            disabled={loading}
            onChange={(e) => setCustomization({ ...customization, framework: e.target.value as any })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer"
          >
            {["React", "Vue", "Svelte", "Next.js", "WordPress", "Laravel"].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Styling dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-500 font-sans">Styling Stack</label>
          <select
            value={customization.styling}
            disabled={loading}
            onChange={(e) => setCustomization({ ...customization, styling: e.target.value as any })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer"
          >
            {["Tailwind", "CSS-in-JS", "SCSS", "Vanilla"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Animation dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-slate-500 font-sans">Motion Engine</label>
          <select
            value={customization.animation}
            disabled={loading}
            onChange={(e) => setCustomization({ ...customization, animation: e.target.value as any })}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary font-sans cursor-pointer"
          >
            {["CSS-only", "GSAP", "Framer Motion", "Lottie"].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

type MainInputsProps = {
  mode: "single" | "batch" | "compare";
  url: string;
  setUrl: (v: string) => void;
  urls: string[];
  setUrls: (v: string[]) => void;
  onScan: () => void;
  loading: boolean;
  styleDomainUrl: string;
  setStyleDomainUrl: (v: string) => void;
  customization?: Customization;
  setCustomization?: (c: Customization) => void;
};

export function ScannerMainInputs({
  mode,
  url,
  setUrl,
  urls,
  setUrls,
  onScan,
  loading,
  styleDomainUrl,
  setStyleDomainUrl,
  customization,
  setCustomization,
}: MainInputsProps) {
  const handleAddUrl = () => {
    if (urls.length < 10) {
      setUrls([...urls, ""]);
    }
  };

  const handleRemoveUrl = (idx: number) => {
    const next = [...urls];
    next.splice(idx, 1);
    setUrls(next);
  };

  const handleUrlChange = (idx: number, val: string) => {
    const next = [...urls];
    next[idx] = val;
    setUrls(next);
  };

  return (
    <div className="w-full space-y-4">
      {mode === "single" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 rounded-lg bg-slate-50 border border-slate-200 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/10 focus-within:bg-white transition-all">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
              <Input
                type="url"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && url) onScan();
                }}
                placeholder="Paste destination URL to scan (e.g. https://awwwards.com)"
                className="h-11 border-0 bg-transparent pl-11 pr-4 text-sm shadow-none focus-visible:ring-0 w-full text-slate-900"
              />
            </div>
            <Button
              onClick={onScan}
              disabled={loading || !url}
              className="shrink-0 font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground shadow-[0_4px_15px_rgba(79,70,229,0.2)] active:scale-95 transition-transform h-11 px-6 cursor-pointer"
            >
              {loading ? "Analyzing..." : "Deconstruct URL"}
            </Button>
          </div>

          {/* Neural Design Transfer Section */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
                <Sparkles className="size-3.5 text-accent animate-pulse" /> Neural Design Transfer (Style Injector)
              </span>
              {styleDomainUrl && (
                <button
                  type="button"
                  onClick={() => setStyleDomainUrl("")}
                  className="text-[9px] font-bold text-accent hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 rounded-md bg-white border border-slate-200 focus-within:border-accent/40 transition-colors">
                <Input
                  type="url"
                  value={styleDomainUrl}
                  onChange={(e) => setStyleDomainUrl(e.target.value)}
                  placeholder="Inject design soul (e.g. https://stripe.com or https://linear.app)"
                  className="h-8 border-0 bg-transparent px-3 text-xs shadow-none focus-visible:ring-0 w-full text-slate-900"
                />
              </div>
              <div className="flex gap-1 items-center overflow-x-auto py-0.5">
                {["stripe.com", "airbnb.com", "apple.com", "linear.app"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setStyleDomainUrl(`https://${preset}`)}
                    className={cn(
                      "rounded px-2.5 py-1 text-[9px] font-mono border transition-all cursor-pointer",
                      styleDomainUrl.includes(preset)
                        ? "bg-accent/15 border-accent/30 text-accent font-bold"
                        : "bg-white border-slate-200 hover:bg-slate-55 text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {preset.split('.')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "batch" && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-widest font-header">
            <Globe className="size-4 text-primary" />
            Queue Parallel Scans
          </label>
          <textarea
            rows={3}
            value={urls.join("\n")}
            onChange={(e) => setUrls(e.target.value.split("\n"))}
            placeholder="https://example1.com&#10;https://example2.com"
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary text-slate-900"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-sans">Enter one URL per line. Maximum 10 sites.</span>
            <Button
              onClick={onScan}
              disabled={loading || urls.filter(Boolean).length === 0}
              className="font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground shadow-[0_4px_15px_rgba(79,70,229,0.15)] cursor-pointer h-10 px-5 active:scale-95 transition-transform"
            >
              {loading ? "Replicating..." : "Run Batch Scan"}
            </Button>
          </div>
        </div>
      )}

      {mode === "compare" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-widest font-header">
              <Sparkles className="size-4 text-primary" />
              Compare Competitors (Enter 3-5 URLs)
            </label>
            {urls.length < 5 && (
              <button
                type="button"
                onClick={handleAddUrl}
                className="text-[10px] text-accent font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <Plus className="size-3" /> Add Domain
              </button>
            )}
          </div>
          
          <div className="grid gap-2 sm:grid-cols-2">
            {urls.map((u, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="font-mono text-[10px] text-slate-400 w-4">#{i+1}</span>
                <Input
                  type="url"
                  value={u}
                  onChange={(e) => handleUrlChange(i, e.target.value)}
                  placeholder="https://competitor.com"
                  className="flex-1 bg-white border-slate-200 text-xs h-9 focus-visible:ring-primary focus-visible:border-primary/60 text-slate-900"
                />
                {urls.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(i)}
                    className="text-slate-400 hover:text-destructive p-1 cursor-pointer"
                  >
                    <Trash className="size-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={onScan}
              disabled={loading || urls.filter(Boolean).length < 2}
              className="font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/95 text-primary-foreground shadow-[0_4px_15px_rgba(79,70,229,0.15)] cursor-pointer h-10 px-5 active:scale-95 transition-transform"
            >
              {loading ? "Extracting Gaps..." : "Compare Competitors"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
