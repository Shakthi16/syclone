import { useState, useMemo, useEffect } from "react";
import {
  Sparkles, Copy, Check,
  Award, CheckCircle, AlertTriangle,
  GitCompare, Star
} from "lucide-react";

import type { ScanResult } from "@/lib/scan.functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Swatch({ value }: { value: string }) {
  return (
    <span
      className="inline-block size-4 shrink-0 rounded-full border border-slate-200 shadow-sm"
      style={{ background: value }}
    />
  );
}

export function ScanResults({ results }: { results: ScanResult[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const result = results[activeIdx] || results[0];

  const jsonSpec = useMemo(() => JSON.stringify(result, null, 2), [result]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.03)] overflow-hidden relative font-sans">
      {results.length > 1 && (
        <div className="bg-slate-50/50 border-b border-slate-200 p-3 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Scanned Sites:</span>
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs font-bold border transition-all cursor-pointer",
                activeIdx === i
                  ? "bg-primary/10 border-primary/20 text-primary shadow-[0_2px_8px_rgba(79,70,229,0.06)] font-semibold"
                  : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900"
              )}
            >
              {r.siteName}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-b border-slate-200/60 p-5 sm:flex-row sm:items-center sm:justify-between bg-transparent">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 font-header uppercase tracking-wider">{result.siteName}</h2>
            <Badge variant="secondary" className="font-mono text-[10px] capitalize bg-slate-100 text-slate-800 border border-slate-200">
              {result.siteType.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary font-bold text-[10px]">
              Complexity {result.complexityScore}/10
            </Badge>
          </div>
          <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-650 font-medium">
            {result.styleDNA}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-5">
        <TabsList className="flex flex-wrap w-full gap-0.5 border-b border-slate-200/60 bg-transparent p-0 mb-6 h-auto rounded-none justify-start overflow-x-auto">
          <TabsTrigger value="dashboard" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent cursor-pointer text-slate-500">Dashboard</TabsTrigger>
          <TabsTrigger value="prompt" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent cursor-pointer text-slate-500">Mega-prompts</TabsTrigger>

          <TabsTrigger value="diff" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent cursor-pointer text-slate-500">Design Diff</TabsTrigger>
          <TabsTrigger value="visual" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent cursor-pointer text-slate-500">Visual Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(15,23,42,0.01)] relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Award className="size-4 text-primary" />
                Prompt Quality Index
              </span>
              <div className="relative size-28 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(15,23,42,0.03)" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#4f46e5" strokeWidth="8" fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * result.promptScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-slate-900">{result.promptScore}</span>
                  <span className="text-[10px] text-slate-500 block font-bold">/100</span>
                </div>
              </div>
              <p className="mt-3.5 text-[10px] text-slate-500 leading-relaxed font-semibold">
                This profile scores <span className="text-primary font-bold">{result.promptScore}/100</span> for layout replication fidelity.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 md:col-span-2 flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
                  Design Token Completeness Audit
                </span>
                <div className="space-y-2">
                  {result.missingElements.length === 0 ? (
                    <div className="flex gap-2.5 items-center text-xs text-emerald-650 font-bold bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                      <CheckCircle className="size-4 shrink-0" /> All core design tokens and specs extracted successfully!
                    </div>
                  ) : (
                    result.missingElements.map((el, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-amber-600 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg font-semibold leading-relaxed">
                        <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                        <span>{el}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3 mt-4 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                <span>Confidence Scales:</span>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1">Colors: <span className="font-bold text-emerald-600">{result.confidencePercentages?.colors ?? 95}%</span></span>
                  <span className="flex items-center gap-1">Font: <span className="font-bold text-amber-600">{result.confidencePercentages?.typography ?? 90}%</span></span>
                  <span className="flex items-center gap-1">Layout: <span className="font-bold text-emerald-600">{result.confidencePercentages?.layout ?? 92}%</span></span>
                  <span className="flex items-center gap-1">Motion: <span className="font-bold text-emerald-600">{result.confidencePercentages?.animations ?? 85}%</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2">
                Primary Colors & Typography
              </span>
              <div className="grid gap-2 grid-cols-2">
                {result.designTokens.colors.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/60 p-2 text-xs">
                    <Swatch value={c.value} />
                    <span className="truncate font-mono font-bold text-slate-800">{c.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.designTokens.fonts.map((f, i) => (
                  <Badge key={i} variant="secondary" className="text-[9px] font-mono border border-slate-200 bg-slate-50 text-slate-700">{f.family}</Badge>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2">
                Interactive Components & Animations
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {result.interactiveEffects.parallax.slice(0, 1).map((p, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-2 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary" /> Parallax transforms
                  </div>
                ))}
                {result.interactiveEffects.scrollZoom.slice(0, 1).map((p, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-2 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary" /> Zoom animations
                  </div>
                ))}
                {result.interactiveEffects.stickyLayouts.slice(0, 1).map((p, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-2 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary" /> Sticky configurations
                  </div>
                ))}
                {result.interactiveEffects.glassmorphism.slice(0, 1).map((p, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-2 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary" /> Glass structures
                  </div>
                ))}
                {result.animations.slice(0, 2).map((a, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-2 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Keyframes: {a.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">Sections</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {result.sections.map((s, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-1.5 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">UI Primitives</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {result.componentIntelligence.map((c, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-1.5 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">Accessibility</span>
              <div className="space-y-2 mt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Contrast Ratio</span>
                  <span className="font-mono font-bold text-slate-800">{result.accessibilityAutopsy.contrastRatio.toFixed(1)}:1</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">WCAG Level</span>
                  <span className="font-mono font-bold text-primary">{result.accessibilityAutopsy.contrastWCAG}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">ARIA Attributes</span>
                  <span className="font-mono font-bold text-slate-800">{result.accessibilityAutopsy.ariaCompleteness}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">Narrative Flow</span>
                <span className="text-xs font-bold text-slate-900 block mb-1 font-header uppercase tracking-wider">{result.storyFlow.flowType}</span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {result.storyFlow.narrative}
                </p>
              </div>
              <div className="text-[9px] text-primary/80 font-bold uppercase tracking-widest mt-4">Structural Layout Audit</div>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">Layout Grid Architecture</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {result.layoutIntelligence.map((layout, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-1.5 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    <span>{layout}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">Motion Blueprint</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {result.animationClassifications.map((motion, i) => (
                  <div key={i} className="text-xs text-slate-700 flex items-center gap-1.5 font-semibold">
                    <span className="size-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{motion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prompt" className="mt-4 space-y-4">
          <Tabs defaultValue="megaprompt" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3 mb-4 gap-2">
              <TabsList className="bg-slate-100 border border-slate-200 h-9 p-0.5 rounded-lg">
                <TabsTrigger value="megaprompt" className="text-xs py-1 px-3 cursor-pointer">Mega-prompt</TabsTrigger>
                <TabsTrigger value="markdown" className="text-xs py-1 px-3 cursor-pointer">Markdown Report</TabsTrigger>
                <TabsTrigger value="json" className="text-xs py-1 px-3 cursor-pointer">JSON Spec</TabsTrigger>
                <TabsTrigger value="figma" className="text-xs py-1 px-3 cursor-pointer">Figma Spec</TabsTrigger>
                <TabsTrigger value="cursor" className="text-xs py-1 px-3 cursor-pointer">.cursorrules</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="megaprompt">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">Raw specification prompt optimized for visual agents (Claude/v0/ChatGPT).</p>
                <CopyButton text={result.megaPrompt} label="Copy Mega-prompt" />
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none">
                {result.megaPrompt}
              </pre>
            </TabsContent>

            <TabsContent value="markdown">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">Structured deconstruction report ready for sharing.</p>
                <CopyButton text={result.markdownReport} label="Copy Report" />
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none">
                {result.markdownReport}
              </pre>
            </TabsContent>

            <TabsContent value="json">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">Raw machine-readable JSON specification schemas.</p>
                <CopyButton text={jsonSpec} label="Copy JSON Data" />
              </div>
              <pre className="max-h-96 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none">
                {jsonSpec}
              </pre>
            </TabsContent>

            <TabsContent value="figma">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">JSON Design Tokens for Figma plugin mapping.</p>
                <CopyButton text={result.figmaSpec} label="Copy Figma Tokens" />
              </div>
              <pre className="max-h-96 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none">
                {result.figmaSpec}
              </pre>
            </TabsContent>

            <TabsContent value="cursor">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">Instruction rules to inject into LLM system guidelines (.cursorrules).</p>
                <CopyButton text={result.cursorRules} label="Copy .cursorrules" />
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none">
                {result.cursorRules}
              </pre>
            </TabsContent>
          </Tabs>
        </TabsContent>



        <TabsContent value="diff" className="mt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-header">
                <GitCompare className="size-4 text-primary" />
                Design Archetype Diff
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2 font-sans">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Color Psychology</span>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 p-3.5 rounded-lg font-medium">
                  {result.designDNA.colorPsychology}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Spacing Scale & Rhythm</span>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 p-3.5 rounded-lg font-medium">
                  {result.designDNA.spacingPhilosophy}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3 font-sans">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Responsive Archeology</span>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {result.responsiveArchaeology.breakpoints.map((bp, i) => (
                    <Badge key={i} variant="outline" className="font-mono text-[9px] border-primary/20 bg-primary/5 text-primary">{bp}px</Badge>
                  ))}
                </div>
                <div className="mt-3 space-y-1 text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${result.responsiveArchaeology.touchOptimization ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    {result.responsiveArchaeology.touchOptimization ? 'Touch optimized layouts' : 'Standard viewport layout'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`size-1.5 rounded-full ${result.responsiveArchaeology.containerQueries ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    {result.responsiveArchaeology.containerQueries ? 'Transpiled CSS query modules' : 'Traditional media parameters'}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Performance Forensics</span>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Lazy Images Coverage</span>
                    <span className="font-mono text-primary">{result.performanceForensics.lazyImagesPercent}%</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Font Display Swap</span>
                    <span className="font-mono text-primary">{result.performanceForensics.fontDisplaySwap ? 'Supported' : 'Standard load'}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Async Scripts Parsing</span>
                    <span className="font-mono text-primary">{result.performanceForensics.asyncScripts ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Dark Mode Archaeologist</span>
                <div className="space-y-2.5 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className={`size-1.5 rounded-full ${result.darkModeArchaeologist.hasDarkTheme ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    {result.darkModeArchaeologist.hasDarkTheme ? 'Theme variations mapped' : 'No dynamic dark states'}
                  </div>
                  {result.darkModeArchaeologist.autoDarkColors.slice(0, 2).map((c, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[9px] font-mono text-slate-500 font-bold">
                      <Swatch value={c.light} />
                      <span className="text-slate-400">&rarr;</span>
                      <Swatch value={c.dark} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Detected Stack Blueprint</span>
              <div className="flex flex-wrap gap-1.5">
                {result.codeArchaeology.detectedFrameworks.map((fw, i) => (
                  <Badge key={i} variant="secondary" className="font-mono text-[9px] border border-slate-200 bg-slate-100 text-slate-700">{fw}</Badge>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2.5">
                Architecture Class: <span className="text-slate-900">{result.codeArchaeology.replicationArchitecture}</span>
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visual" className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest font-header">Multi-Device Render Snapshots</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Headless Viewport Audit</span>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 font-sans">
                {/* Desktop */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold uppercase">
                    <span>Desktop (1440 × 900)</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-video relative group">
                    {result.screenshots?.desktop ? (
                      <img src={result.screenshots.desktop} alt="Desktop Preview" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No Desktop Screenshot</div>
                    )}
                  </div>
                </div>

                {/* Laptop */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold uppercase">
                    <span>Laptop (1200 × 750)</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-video relative group">
                    {result.screenshots?.laptop ? (
                      <img src={result.screenshots.laptop} alt="Laptop Preview" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No Laptop Screenshot</div>
                    )}
                  </div>
                </div>

                {/* Tablet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold uppercase">
                    <span>Tablet (768 × 1024)</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-[3/4] relative group max-h-64 mx-auto w-44">
                    {result.screenshots?.tablet ? (
                      <img src={result.screenshots.tablet} alt="Tablet Preview" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No Tablet Screenshot</div>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold uppercase">
                    <span>Mobile (375 × 812)</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-[9/16] relative group max-h-64 mx-auto w-36">
                    {result.screenshots?.mobile ? (
                      <img src={result.screenshots.mobile} alt="Mobile Preview" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">No Mobile Screenshot</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200 pb-2">
                Computed Space & Ratio Metrics
              </span>

              <div className="space-y-4 font-sans">
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500">Whitespace Area</span>
                    <span className="font-mono font-bold text-primary">{result.visualMetrics?.whitespacePercent ?? 40}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${result.visualMetrics?.whitespacePercent ?? 40}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">
                    Balance Classification: {result.visualMetrics?.negativeSpaceScore ?? 'Balanced'}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Grid Complexity Density</div>
                  <p className="text-xs text-slate-900 font-mono font-bold">{result.visualMetrics?.gridDensity ?? 'Simple flow layout'}</p>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Calculated Aspect Ratios</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(result.visualMetrics?.imageRatios || ["16:9 Landscape"]).map((r, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] font-mono border-primary/20 bg-primary/5 text-primary">{r}</Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Layout Alignment Balance</div>
                  <p className="text-xs text-slate-900 font-mono font-bold">{result.visualMetrics?.visualBalance ?? 'Symmetric Grid layout'}</p>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-1">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Typographic Rhythm Scale</div>
                  <p className="text-xs text-slate-900 font-mono font-bold">{result.visualMetrics?.typographyRhythm ?? 'Golden Ratio hierarchy'}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
