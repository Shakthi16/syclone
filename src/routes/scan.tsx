import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { ScanLine, Sparkles, AlertTriangle, Globe } from "lucide-react";

import { scanWebsite, type Tier, type Customization } from "@/lib/scan.functions";
import { ScannerSidebarControls, ScannerMainInputs } from "@/components/ScannerForm";
import { ScanResults } from "@/components/ScanResults";
import { ScanningLoader } from "@/components/ScanningLoader";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/scan")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      url: (search.url as string) || "",
    };
  },
  head: () => ({
    meta: [
      { title: "Syclone Console — Design Deconstruction Studio" },
      {
        name: "description",
        content:
          "Analyze colors, typography, margins, grids, and layout scales of any website in real-time.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { url: searchUrl } = Route.useSearch();
  const [mode, setMode] = useState<"single" | "batch" | "compare">("single");
  const [url, setUrl] = useState(searchUrl || "");
  const [urls, setUrls] = useState<string[]>(["", ""]);
  const [tier, setTier] = useState<Tier>("functional");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [customization, setCustomization] = useState<Customization>({
    tone: "technical",
    framework: "React",
    styling: "Tailwind",
    animation: "CSS-only",
    complexity: "mid",
  });
  const [styleDomainUrl, setStyleDomainUrl] = useState("");

  const scan = useServerFn(scanWebsite);

  const mutation = useMutation({
    mutationFn: (vars: {
      mode: "single" | "batch" | "compare";
      url?: string;
      urls?: string[];
      tier: Tier;
      viewport: "desktop" | "tablet" | "mobile";
      customization: Customization;
      styleDomainUrl?: string;
    }) => scan({ data: vars }),
  });

  useEffect(() => {
    if (searchUrl) {
      setUrl(searchUrl);
      const normalized = /^https?:\/\//i.test(searchUrl) ? searchUrl : `https://${searchUrl}`;
      mutation.mutate({
        mode: "single",
        url: normalized,
        tier,
        viewport,
        customization,
        styleDomainUrl: styleDomainUrl.trim() || undefined,
      });
    }
  }, [searchUrl]);

  const handleScan = () => {
    if (mode === "single") {
      const trimmed = url.trim();
      if (!trimmed) return;
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      setUrl(normalized);
      mutation.mutate({ mode, url: normalized, tier, viewport, customization, styleDomainUrl: styleDomainUrl.trim() || undefined });
    } else {
      const activeUrls = urls.map(u => u.trim()).filter(Boolean);
      if (activeUrls.length === 0) return;
      mutation.mutate({ mode, urls: activeUrls, tier, viewport, customization });
    }
  };

  const results = mutation.data?.results ?? [];
  const apiError = mutation.data?.error ?? null;
  const error = mutation.isError
    ? "Something went wrong. Please try again."
    : apiError;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground overflow-hidden noise-overlay">
      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-slate-200/50 bg-slate-50/50 backdrop-blur-md flex flex-col h-auto md:h-screen overflow-y-auto relative z-20">
        {/* Brand Header */}
        <Link to="/" className="p-5 border-b border-slate-200/50 flex items-center gap-2.5 hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/5 border border-primary/10 group-hover:scale-105 transition-transform duration-200">
            <ScanLine className="size-4 text-primary" />
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-900 uppercase font-header group-hover:text-primary transition-colors">Syclone Console</span>
        </Link>
        
        {/* Sidebar Config Panels */}
        <div className="p-4 flex-1">
          <ScannerSidebarControls
            mode={mode}
            setMode={setMode}
            tier={tier}
            setTier={setTier}
            viewport={viewport}
            setViewport={setViewport}
            customization={customization}
            setCustomization={setCustomization}
            loading={mutation.isPending}
          />
        </div>
      </aside>

      {/* RIGHT MAIN CANVAS AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-slate-50/30">
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 size-[400px] orb-indigo opacity-30 animate-pulse-glow pointer-events-none" />
        
        {/* Top bar */}
        <header className="h-14 border-b border-slate-200/50 px-6 flex items-center justify-between bg-white/60 backdrop-blur-md shrink-0 relative z-10">
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-widest font-bold text-slate-500 font-sans">
            <span className="text-slate-900">{mode}</span>
            <span className="text-slate-200">/</span>
            <span className="text-accent">{viewport}</span>
            <span className="text-slate-200">/</span>
            <span className="text-primary">{tier}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 font-bold font-sans">
              ← Back to Home
            </Link>
            <Badge variant="outline" className="border-accent/20 bg-accent/5 text-accent font-semibold text-[9px] uppercase tracking-widest px-2 py-0.5 rounded">
              Active Environment
            </Badge>
          </div>
        </header>

        {/* Dashboard Work Area */}
        <div className="flex-1 p-6 space-y-6 relative z-10 max-w-5xl w-full mx-auto">
          {/* Main Scanners inputs container */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
            <ScannerMainInputs
              mode={mode}
              url={url}
              setUrl={setUrl}
              urls={urls}
              setUrls={setUrls}
              onScan={handleScan}
              loading={mutation.isPending}
              styleDomainUrl={styleDomainUrl}
              setStyleDomainUrl={setStyleDomainUrl}
              customization={customization}
              setCustomization={setCustomization}
            />
          </div>

          {/* Loaders, Results, and Messages */}
          <div className="space-y-4">
            {mutation.isPending && <ScanningLoader />}

            {!mutation.isPending && error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
                <p className="font-semibold font-sans text-destructive">{error}</p>
              </div>
            )}

            {!mutation.isPending && results.length > 0 && <ScanResults results={results} />}

            {!mutation.isPending && results.length === 0 && !error && (
              <div className="text-center p-12 border border-dashed border-slate-200 rounded-2xl bg-white shadow-[0_4px_20px_rgba(15,23,42,0.01)] max-w-lg mx-auto mt-8">
                <Globe className="size-8 text-primary/60 mx-auto mb-4 animate-pulse" />
                <h3 className="font-bold text-sm tracking-tight text-slate-900 font-header uppercase">No Active Scan Profile</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed font-sans font-medium">
                  Configure your framework presets on the sidebar and enter target URLs above to reverse-engineer design specs.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
