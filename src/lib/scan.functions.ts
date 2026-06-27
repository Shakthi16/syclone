import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";


export const TIERS = ["quick", "functional", "stack"] as const;
export type Tier = (typeof TIERS)[number];

export const CustomizationSchema = z.object({
  tone: z.enum(["technical", "creative", "minimalist"]),
  framework: z.enum(["React", "Vue", "Svelte", "Next.js", "WordPress", "Laravel"]),
  styling: z.enum(["Tailwind", "CSS-in-JS", "SCSS", "Vanilla"]),
  animation: z.enum(["CSS-only", "GSAP", "Framer Motion", "Lottie"]),
  complexity: z.enum(["junior", "mid", "senior"]),
});

export type Customization = z.infer<typeof CustomizationSchema>;

const InputSchema = z.object({
  mode: z.enum(["single", "batch", "compare"]),
  url: z.string().trim().optional(),
  urls: z.array(z.string().trim()).optional(),
  tier: z.enum(TIERS),
  viewport: z.enum(["desktop", "tablet", "mobile"]).default("desktop"),
  customization: CustomizationSchema,
  styleDomainUrl: z.string().trim().optional(),
});



const InteractiveEffectsSchema = z.object({
  parallax: z.array(z.string()),
  scrollZoom: z.array(z.string()),
  horizontalScroll: z.array(z.string()),
  stickyLayouts: z.array(z.string()),
  glassmorphism: z.array(z.string()),
  microInteractions: z.array(z.string()),
});

const DesignDNASchema = z.object({
  colorPsychology: z.string(),
  spacingPhilosophy: z.string(),
  fontAccessibility: z.string(),
});

const ResponsiveArchaeologySchema = z.object({
  breakpoints: z.array(z.string()),
  containerQueries: z.boolean(),
  touchOptimization: z.boolean(),
});

const AccessibilityAutopsySchema = z.object({
  contrastRatio: z.number(),
  contrastWCAG: z.string(),
  ariaCompleteness: z.number(),
  reducedMotion: z.boolean(),
});

const PerformanceForensicsSchema = z.object({
  lazyImagesPercent: z.number(),
  fontDisplaySwap: z.boolean(),
  asyncScripts: z.boolean(),
});

const CodeArchaeologySchema = z.object({
  detectedFrameworks: z.array(z.string()),
  stateManagementHint: z.string(),
  replicationArchitecture: z.string(),
  stackRecommendation: z.string().optional(),
});

const DarkModeArchaeologistSchema = z.object({
  hasDarkTheme: z.boolean(),
  autoDarkColors: z.array(z.object({ light: z.string(), dark: z.string() })),
});

export type InteractiveEffects = z.infer<typeof InteractiveEffectsSchema>;
export type DesignDNA = z.infer<typeof DesignDNASchema>;
export type ResponsiveArchaeology = z.infer<typeof ResponsiveArchaeologySchema>;
export type AccessibilityAutopsy = z.infer<typeof AccessibilityAutopsySchema>;
export type PerformanceForensics = z.infer<typeof PerformanceForensicsSchema>;
export type CodeArchaeology = z.infer<typeof CodeArchaeologySchema>;
export type DarkModeArchaeologist = z.infer<typeof DarkModeArchaeologistSchema>;

const ResultSchema = z.object({
  siteName: z.string(),
  siteType: z.string(),
  complexityScore: z.number(),
  styleDNA: z.string(),
  megaPrompt: z.string(),
  designTokens: z.object({
    colors: z.array(z.object({ name: z.string(), value: z.string(), usage: z.string() })),
    fonts: z.array(z.object({ family: z.string(), usage: z.string() })),
    spacing: z.array(z.string()),
    radii: z.array(z.string()),
    shadows: z.array(z.string()),
  }),
  sections: z.array(z.object({ name: z.string(), description: z.string() })),
  components: z.array(z.object({ name: z.string(), details: z.string() })),
  animations: z.array(z.object({ name: z.string(), details: z.string() })),
  assets: z.array(z.object({ name: z.string(), prompt: z.string() })),
  interactiveEffects: InteractiveEffectsSchema,
  designDNA: DesignDNASchema,
  responsiveArchaeology: ResponsiveArchaeologySchema,
  accessibilityAutopsy: AccessibilityAutopsySchema,
  performanceForensics: PerformanceForensicsSchema,
  codeArchaeology: CodeArchaeologySchema,
  darkModeArchaeologist: DarkModeArchaeologistSchema,
  promptScore: z.number(),
  missingElements: z.array(z.string()),
  confidenceIndicators: z.object({
    colors: z.enum(["high", "medium", "low"]),
    typography: z.enum(["high", "medium", "low"]),
    layout: z.enum(["high", "medium", "low"]),
    animations: z.enum(["high", "medium", "low"]),
  }),
  confidencePercentages: z.object({
    colors: z.number(),
    typography: z.number(),
    layout: z.number(),
    components: z.number(),
    animations: z.number(),
  }),
  screenshots: z.object({
    desktop: z.string().optional(),
    laptop: z.string().optional(),
    tablet: z.string().optional(),
    mobile: z.string().optional(),
  }),
  visualMetrics: z.object({
    whitespacePercent: z.number(),
    negativeSpaceScore: z.string(),
    gridDensity: z.string(),
    imageRatios: z.array(z.string()),
    visualBalance: z.string(),
    typographyRhythm: z.string(),
  }),
  abVariants: z.object({
    trust: z.string(),
    urgency: z.string(),
    clarity: z.string(),
  }),
  storybookComponents: z.array(z.object({
    name: z.string(),
    code: z.string(),
    props: z.array(z.string()),
    usage: z.string(),
  })),
  cursorRules: z.string(),
  figmaSpec: z.string(),
  markdownReport: z.string(),
  replicatedCode: z.string(),
  layoutIntelligence: z.array(z.string()),
  componentIntelligence: z.array(z.string()),
  storyFlow: z.object({ flowType: z.string(), narrative: z.string() }),
  animationClassifications: z.array(z.string()),
  sceneGraph: z.array(z.string()).optional(),
  spatialHints: z.array(z.string()).optional(),
  designLang: z.object({ primary: z.string(), tags: z.array(z.string()), reasoning: z.string() }).optional(),
  importanceScores: z.array(z.object({ section: z.string(), score: z.number(), label: z.string(), effort: z.string() })).optional(),
  semanticImages: z.array(z.object({ name: z.string(), semantic: z.string(), style: z.string() })).optional(),
  layerHierarchy: z.array(z.string()).optional(),
  richFonts: z.array(z.object({
    family: z.string(),
    fallbackStack: z.array(z.string()),
    source: z.enum(["@font-face", "google-fonts", "system", "external"]),
    fontWeight: z.string(),
    fontStyle: z.string(),
    fontDisplay: z.string(),
    isVariable: z.boolean(),
    letterSpacing: z.string(),
    lineHeight: z.string(),
    textTransform: z.string(),
    usage: z.string(),
    unicodeRange: z.string(),
  })).optional(),
  scrollTimelineEntries: z.array(z.object({
    scrollPercent: z.number(),
    action: z.enum(["enter", "exit", "animate", "pin", "unpin", "reveal", "parallax"]),
    elementTag: z.string(),
    elementText: z.string(),
    className: z.string(),
    detail: z.string(),
  })).optional(),
  scrollBehaviorProfile: z.object({
    hasPinnedElements: z.boolean(),
    hasParallax: z.boolean(),
    hasFadeReveals: z.boolean(),
    hasSlideReveals: z.boolean(),
    hasScaleReveals: z.boolean(),
    hasHorizontalScroll: z.boolean(),
    hasImageSequence: z.boolean(),
    hasStickyNavigation: z.boolean(),
    hasClipPathTransitions: z.boolean(),
    hasCrossfadeTransitions: z.boolean(),
    estimatedScrollDuration: z.string(),
    animationTriggerType: z.enum(["viewport-enter", "scroll-progress", "hover", "none"]),
    scrollNarrativeFlow: z.string(),
    pinnedRegionDescription: z.string(),
    totalDistinctAnimations: z.number(),
  }).optional(),
  experienceFlow: z.object({
    pacing: z.enum(["rapid", "moderate", "slow-cinematic"]),
    emotionalArc: z.string(),
    transitionStyles: z.array(z.string()),
    sectionPurpose: z.array(z.string()),
    peakEngagementPoints: z.array(z.string()),
  }).optional(),
});

export type ScanResult = z.infer<typeof ResultSchema>;

export type StyleDNATransfer = {
  cssVars: Record<string, string>;
  googleFontsUrl: string | null;
  loadedFonts: { family: string; weight: string; style: string }[];
  keyframes: { name: string; css: string }[];
  videos: { src: string; poster?: string }[];
  buttons: {
    text: string; padding: string; borderRadius: string; background: string;
    fontSize: string; fontWeight: string; backdropFilter: string; border: string; boxShadow: string;
  }[];
  colorPalette: { hsl: string; hex: string; count: number }[];
  aestheticLabels: string[];
  spacingScale: number[];
  dominantRadius: string;
  hoverTransforms: string[];
  backdropBlurCount: number;
  gradientCount: number;
  sectionSequence: string[];
};

/* ─────────────────────────────────────────────────────────────
   CSS Parsing
   ───────────────────────────────────────────────────────────── */

type Props = Record<string, string>;
type Rule = { selector: string; properties: Props };

function extractCSSText(html: string): string {
  const blocks: string[] = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) blocks.push(m[1]);
  return blocks.join("\n");
}

function parseCSSRules(cssText: string): Rule[] {
  const out: Rule[] = [];
  const clean = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const blockRe = /([^{}]+)\{([^}]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(clean)) !== null) {
    const selector = m[1].trim();
    const props: Props = {};
    const propRe = /([\w-]+)\s*:\s*([^;]+);?/g;
    let pm: RegExpExecArray | null;
    while ((pm = propRe.exec(m[2])) !== null) {
      props[pm[1].trim()] = pm[2].trim();
    }
    if (Object.keys(props).length > 0) out.push({ selector, properties: props });
  }
  return out;
}

function extractInlineStyles($: CheerioAPI): Rule[] {
  const out: Rule[] = [];
  $("[style]").each((_, el) => {
    const raw = $(el).attr("style");
    if (!raw) return;
    const tag = el.tagName || "unknown";
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    let sel = tag;
    if (id) sel += `#${id}`;
    if (cls) { const c = cls.trim().split(/\s+/).slice(0, 2).join("."); if (c) sel += `.${c}`; }
    const props: Props = {};
    const propRe = /([\w-]+)\s*:\s*([^;]+);?/g;
    let pm: RegExpExecArray | null;
    while ((pm = propRe.exec(raw)) !== null) props[pm[1].trim()] = pm[2].trim();
    if (Object.keys(props).length > 0) out.push({ selector: sel, properties: props });
  });
  return out;
}

/* ─────────────────────────────────────────────────────────────
   WCAG Color Compliance & Dark Mode Inversion Helpers
   ───────────────────────────────────────────────────────────── */

function parseColorToRgb(colorStr: string): [number, number, number] | null {
  const clean = colorStr.trim().toLowerCase();
  if (clean.startsWith("#")) {
    const hex = clean.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return [r, g, b];
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b];
    }
  }
  if (clean.startsWith("rgb")) {
    const match = clean.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }
  const names: Record<string, [number, number, number]> = {
    white: [255, 255, 255],
    black: [0, 0, 0],
    red: [255, 0, 0],
    green: [0, 255, 0],
    blue: [0, 0, 255],
    gray: [128, 128, 128],
    transparent: [255, 255, 255]
  };
  return names[clean] || null;
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseColorToRgb(color1);
  const rgb2 = parseColorToRgb(color2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getRelativeLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getRelativeLuminance(rgb2[0], rgb2[1], rgb2[2]);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, "0");
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, "0");
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
}

function invertColorForDarkMode(colorStr: string, role: string): string {
  const rgb = parseColorToRgb(colorStr);
  if (!rgb) return colorStr;

  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  if (role === "background" || role === "surface") {
    if (l < 20) return colorStr;
    return hslToHex(h, Math.min(s, 15), 10);
  }

  if (role === "text" || role === "muted-text") {
    if (l > 80) return colorStr;
    return hslToHex(h, Math.min(s, 10), 90);
  }

  if (role === "border") {
    return l < 40 ? hslToHex(h, Math.min(s, 10), 75) : hslToHex(h, Math.min(s, 10), 20);
  }

  if (l < 40) {
    return hslToHex(h, Math.max(s, 60), 65);
  }
  if (l > 80) {
    return hslToHex(h, Math.max(s, 60), 45);
  }

  return colorStr;
}

/* ─────────────────────────────────────────────────────────────
   Animations & Transitions
   ───────────────────────────────────────────────────────────── */

type AnimDetail = {
  name: string;
  duration: string;
  timing: string;
  delay: string;
  iteration: string;
  direction: string;
  keyframesBody: string;
  selector: string;
};

function extractKeyframes(cssText: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(cssText)) !== null) {
    map.set(m[1], m[2].trim());
  }
  return map;
}

function stripFrameworkHash(name: string): string {
  return name.replace(/-[a-f0-9]{6,8}$/, "");
}

function parseTiming(value: string): string {
  if (/cubic-bezier\(/.test(value)) {
    const match = value.match(/cubic-bezier\(([^)]+)\)/);
    return match ? `cubic-bezier(${match[1]})` : value;
  }
  if (/steps\(/.test(value)) return value;
  return value; // ease, ease-in, ease-out, ease-in-out, linear
}

function parseAnimationShorthand(value: string): Partial<AnimDetail> {
  const parts = value.trim().split(/\s+/);
  const r: Partial<AnimDetail> = {};
  for (const p of parts) {
    if (/^(\d+\.?\d*)(s|ms)$/.test(p)) {
      if (!r.duration) r.duration = p;
      else r.delay = p;
    } else if (/^(ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier|steps)/.test(p)) {
      r.timing = p.includes("cubic-bezier") ? value.match(/cubic-bezier\([^)]+\)/)?.[0] ?? p : p;
    } else if (/^\d+(\.\d+)?$/.test(p)) {
      r.iteration = p;
    } else if (/^(infinite|finite)$/.test(p)) {
      r.iteration = p;
    } else if (/^(normal|reverse|alternate|alternate-reverse)$/.test(p)) {
      r.direction = p;
    } else {
      r.name = p;
    }
  }
  return r;
}

function extractAnimations(rules: Rule[], cssText: string): AnimDetail[] {
  const keyframes = extractKeyframes(cssText);
  // Build a hash-stripped keyframes lookup
  const keyframesLookup = new Map<string, string>();
  for (const [rawName, body] of keyframes) {
    const clean = stripFrameworkHash(rawName);
    if (!keyframesLookup.has(clean)) {
      keyframesLookup.set(clean, body);
    }
  }

  const animations: AnimDetail[] = [];
  const seen = new Set<string>();

  for (const r of rules) {
    const animVal = r.properties["animation"];
    const animName = r.properties["animation-name"];
    const animDur = r.properties["animation-duration"];
    const animTiming = r.properties["animation-timing-function"];
    const animDelay = r.properties["animation-delay"];
    const animIter = r.properties["animation-iteration-count"];
    const animDir = r.properties["animation-direction"];

    if (animVal) {
      const parsed = parseAnimationShorthand(animVal);
      const rawName = parsed.name || "unknown";
      const name = stripFrameworkHash(rawName);
      const key = name + r.selector;
      if (!seen.has(key)) {
        seen.add(key);
        animations.push({
          name,
          duration: parsed.duration || animDur || "",
          timing: parsed.timing || animTiming || "",
          delay: parsed.delay || animDelay || "",
          iteration: parsed.iteration || animIter || "",
          direction: parsed.direction || animDir || "",
          keyframesBody: keyframesLookup.get(name) || keyframes.get(rawName) || "",
          selector: r.selector,
        });
      }
    } else if (animName) {
      const name = stripFrameworkHash(animName);
      if (!seen.has(name + r.selector)) {
        seen.add(name + r.selector);
        animations.push({
          name,
          duration: animDur || "",
          timing: animTiming || "",
          delay: animDelay || "",
          iteration: animIter || "",
          direction: animDir || "",
          keyframesBody: keyframesLookup.get(name) || keyframes.get(animName) || "",
          selector: r.selector,
        });
      }
    }
  }

  // Also add unmatched keyframes as standalone
  for (const [rawName, body] of keyframes) {
    const name = stripFrameworkHash(rawName);
    if (!animations.some((a) => a.name === name)) {
      animations.push({
        name,
        duration: "",
        timing: "",
        delay: "",
        iteration: "",
        direction: "",
        keyframesBody: body,
        selector: "",
      });
    }
  }

  return animations;
}

type TransitionDetail = {
  property: string;
  duration: string;
  timing: string;
  delay: string;
  selector: string;
};

function extractTransitions(rules: Rule[]): TransitionDetail[] {
  const out: TransitionDetail[] = [];
  for (const r of rules) {
    const t = r.properties["transition"];
    const td = r.properties["transition-duration"];
    const tt = r.properties["transition-timing-function"];
    const tp = r.properties["transition-property"];
    const tDelay = r.properties["transition-delay"];

    if (t) {
      // Parse shorthand: property duration timing-function delay
      const parts = t.trim().split(/\s+/);
      const entry: TransitionDetail = {
        property: parts[0] || "all",
        duration: "",
        timing: "",
        delay: "",
        selector: r.selector,
      };
      for (let i = 1; i < parts.length; i++) {
        if (/^(\d+\.?\d*)(s|ms)$/.test(parts[i])) {
          if (!entry.duration) entry.duration = parts[i];
          else entry.delay = parts[i];
        } else if (/^(ease|linear|ease-in|ease-out|ease-in-out|cubic-bezier|steps)/.test(parts[i])) {
          entry.timing = parts[i];
        }
      }
      out.push(entry);
    } else if (td) {
      out.push({
        property: tp || "all",
        duration: td,
        timing: tt || "",
        delay: tDelay || "",
        selector: r.selector,
      });
    }
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────
   Design Token Extraction
   ───────────────────────────────────────────────────────────── */

const COLOR_RE = /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^)]+\)/g;

type ColorDef = { name: string; value: string; usage: string; role: string };

function extractColors(rules: Rule[], $: CheerioAPI): ColorDef[] {
  const colorProps = new Set([
    "color", "background-color", "background", "border-color",
    "outline-color", "accent-color", "caret-color",
    "text-decoration-color", "fill", "stroke",
    "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  ]);
  const raw: { value: string; prop: string; selector: string }[] = [];

  for (const r of rules) {
    for (const [prop, val] of Object.entries(r.properties)) {
      if (colorProps.has(prop)) {
        const matches = val.match(COLOR_RE);
        if (matches) for (const v of matches) raw.push({ value: v, prop, selector: r.selector });
      }
      if (prop === "box-shadow" || prop === "text-shadow") {
        const match = val.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
        if (match) raw.push({ value: match[1], prop, selector: r.selector });
      }
    }
  }

  const seen = new Set<string>();
  const out: ColorDef[] = [];

  for (const c of raw) {
    const key = c.value + c.selector + c.prop;
    if (seen.has(key)) continue;
    if (/^transparent|inherit|currentcolor|initial|unset$/i.test(c.value)) continue;
    seen.add(key);

    const { usage, role } = inferColorUsage(c.selector, c.prop, c.value);
    const name = colorToName(c.value, usage);
    out.push({ name, value: c.value.toLowerCase(), usage, role });
  }

  // Deduplicate by value keeping best role
  const byValue = new Map<string, ColorDef>();
  for (const c of out) {
    const existing = byValue.get(c.value);
    if (!existing || rankRole(c.role) > rankRole(existing.role)) {
      byValue.set(c.value, c);
    }
  }

  return sortByRole([...byValue.values()]).slice(0, 18);
}

function rankRole(role: string): number {
  const ranks: Record<string, number> = {
    "primary": 1, "secondary": 2, "accent": 3,
    "background": 4, "surface": 5, "text": 6,
    "muted-text": 7, "link": 8, "border": 9,
    "state": 10, "decorative": 11, "general": 12,
  };
  return ranks[role] || 99;
}

function sortByRole(colors: ColorDef[]): ColorDef[] {
  return colors.sort((a, b) => rankRole(a.role) - rankRole(b.role));
}

function hexToName(hex: string): string {
  const lower = hex.toLowerCase();
  const named: Record<string, string> = {
    "#000000": "Black", "#ffffff": "White",
    "#ff0000": "Red", "#00ff00": "Green", "#0000ff": "Blue",
    "#f8f9fa": "Light Gray", "#f0f0f0": "Gray 100",
    "#e9ecef": "Gray 200", "#dee2e6": "Gray 300",
    "#ced4da": "Gray 400", "#adb5bd": "Gray 500",
    "#6c757d": "Gray 600", "#495057": "Gray 700",
    "#343a40": "Gray 800", "#212529": "Gray 900",
    "#1a1a2e": "Deep Navy", "#16213e": "Dark Blue",
    "#0f172a": "Slate 900", "#1e293b": "Slate 800",
    "#334155": "Slate 700", "#475569": "Slate 600",
    "#64748b": "Slate 500", "#94a3b8": "Slate 400",
    "#cbd5e1": "Slate 300", "#e2e8f0": "Slate 200",
    "#f1f5f9": "Slate 100", "#f8fafc": "Slate 50",
    "#3b82f6": "Blue 500", "#2563eb": "Blue 600",
    "#1d4ed8": "Blue 700", "#60a5fa": "Blue 400",
    "#93c5fd": "Blue 300", "#bfdbfe": "Blue 200",
    "#10b981": "Emerald 500", "#059669": "Emerald 600",
    "#34d399": "Emerald 400", "#f59e0b": "Amber 500",
    "#d97706": "Amber 600", "#fbbf24": "Amber 400",
    "#ef4444": "Red 500", "#dc2626": "Red 600",
    "#f97316": "Orange 500", "#ea580c": "Orange 600",
    "#8b5cf6": "Violet 500", "#7c3aed": "Violet 600",
    "#ec4899": "Pink 500", "#db2777": "Pink 600",
    "#14b8a6": "Teal 500", "#0d9488": "Teal 600",
    "#06b6d4": "Cyan 500", "#0891b2": "Cyan 600",
    "#fafafa": "Near White", "#f5f5f5": "Off White",
    "#e5e5e5": "Light Border", "#d4d4d4": "Medium Border",
    "#a3a3a3": "Gray Mid", "#737373": "Gray",
    "#525252": "Dark Gray", "#404040": "Charcoal",
    "#262626": "Near Black", "#171717": "Almost Black",
    "#0a0a0a": "Pitch Black",
  };
  return named[lower] || "";
}

function colorToName(value: string, usage: string): string {
  const known = hexToName(value);
  if (known) return known;
  if (value.startsWith("rgb")) return value;
  return value.toUpperCase();
}

function inferColorUsage(
  selector: string, prop: string, value: string,
): { usage: string; role: string } {
  const s = selector.toLowerCase();

  // Root variables
  if (/^:root/.test(s)) {
    if (/color/.test(prop)) return { usage: "Default text color", role: "text" };
    if (/background/.test(prop)) return { usage: "Page background", role: "background" };
    if (/border/.test(prop)) return { usage: "Border color", role: "border" };
    return { usage: "Root variable", role: "decorative" };
  }
  if (/^html\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Page background", role: "background" };
    if (prop === "color") return { usage: "Base text", role: "text" };
    return { usage: "HTML element", role: "general" };
  }
  if (/^body\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Page background", role: "background" };
    if (prop === "color") return { usage: "Body text", role: "text" };
    return { usage: "Body element", role: "general" };
  }

  // Component-based
  if (/\bheader\b|\bnav\b|\bnavbar\b|\.nav\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Navigation background", role: "secondary" };
    if (prop === "color") return { usage: "Navigation text", role: "muted-text" };
    return { usage: "Navigation element", role: "secondary" };
  }
  if (/\bfooter\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Footer background", role: "secondary" };
    if (prop === "color") return { usage: "Footer text", role: "muted-text" };
    return { usage: "Footer", role: "secondary" };
  }
  if (/\bhero\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Hero background", role: "primary" };
    if (prop === "color") return { usage: "Hero text", role: "text" };
    return { usage: "Hero section", role: "primary" };
  }
  if (/\bcard\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Card background", role: "surface" };
    if (/border/.test(prop)) return { usage: "Card border", role: "border" };
    return { usage: "Card element", role: "surface" };
  }
  if (/\bbutton\b|\.btn|\.cta/.test(s)) {
    if (/background/.test(prop)) return { usage: "Button background", role: "primary" };
    if (prop === "color") return { usage: "Button text", role: "text" };
    if (/border/.test(prop)) return { usage: "Button border", role: "border" };
    return { usage: "Button", role: "primary" };
  }
  if (/\bh[1-6]\b|\.title\b|\.heading\b|\.headline\b/.test(s)) {
    if (prop === "color") return { usage: "Heading text", role: "text" };
    return { usage: "Heading", role: "text" };
  }
  if (/\ba\b|\.link\b/.test(s)) {
    if (prop === "color") return { usage: "Link text", role: "link" };
    return { usage: "Link", role: "link" };
  }
  if (/\binput\b|\.input\b|\.form\b|textarea|select/.test(s)) {
    if (/border/.test(prop)) return { usage: "Input border", role: "border" };
    if (/background/.test(prop)) return { usage: "Input background", role: "surface" };
    if (prop === "color") return { usage: "Input text", role: "text" };
    return { usage: "Form element", role: "surface" };
  }
  if (/\bmodal\b|\.dialog\b|\.overlay\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Modal overlay", role: "decorative" };
    return { usage: "Modal", role: "surface" };
  }
  if (/\bsidebar\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Sidebar background", role: "secondary" };
    return { usage: "Sidebar", role: "secondary" };
  }
  if (/\bbadge\b|\.tag\b|\.pill\b/.test(s)) {
    if (/background/.test(prop)) return { usage: "Badge background", role: "accent" };
    return { usage: "Badge", role: "accent" };
  }
  if (/\bprice\b|\.cost\b|\.amount\b/.test(s)) return { usage: "Pricing text", role: "accent" };
  if (/:hover|:focus|:active|:visited/.test(s)) return { usage: "Interactive state", role: "state" };

  // Property-based fallback
  if (prop.includes("background")) return { usage: "Background color", role: "background" };
  if (prop === "color") return { usage: "Text color", role: "text" };
  if (prop.includes("border")) return { usage: "Border color", role: "border" };
  if (prop === "fill") return { usage: "SVG fill", role: "decorative" };
  if (prop === "stroke") return { usage: "SVG stroke", role: "decorative" };

  return { usage: "General element", role: "general" };
}

/* ── Fonts ──────────────────────────────────────────────────── */

function extractFonts(rules: Rule[], $: CheerioAPI): { family: string; usage: string; weight: string; size: string }[] {
  const seen = new Set<string>();
  const out: { family: string; usage: string; weight: string; size: string }[] = [];

  for (const r of rules) {
    const ff = r.properties["font-family"];
    if (!ff) continue;
    const families = ff.split(",").map((f) => f.trim().replace(/['"]/g, ""));
    const weight = r.properties["font-weight"] || "";
    const size = r.properties["font-size"] || "";
    for (const f of families) {
      if (seen.has(f)) continue;
      seen.add(f);
      let usage = "Body text";
      if (/h[1-6]|title|heading|headline/.test(r.selector)) usage = "Headings";
      else if (/nav|header|menu|link/.test(r.selector)) usage = "Navigation";
      else if (/button|btn|cta/.test(r.selector)) usage = "Buttons";
      else if (/footer|small|caption|meta/.test(r.selector)) usage = "Small/Caption";
      else if (/body|p|article|content|text/.test(r.selector)) usage = "Body text";
      else if (/code|pre|mono|terminal/.test(r.selector)) usage = "Code/Monospace";

      const detail = `${usage}${weight ? ` · ${weight}` : ""}${size ? ` · ${size}` : ""}`;
      out.push({ family: f, usage: detail, weight, size });
    }
  }

  // Google Fonts detection
  $('link[rel="stylesheet"][href*="fonts.googleapis"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const familyMatch = href.match(/family=([^&]+)/);
    if (familyMatch) {
      const name = decodeURIComponent(familyMatch[1])
        .replace(/:.*$/, "")
        .replace(/\+/g, " ");
      if (!seen.has(name)) {
        seen.add(name);
        const wMatch = href.match(/wght@(\d+(;\d+)*)/);
        const weights = wMatch ? wMatch[1].replace(/;/g, ", ") : "";
        out.push({ family: name, usage: `Google Font${weights ? ` · weights: ${weights}` : ""}`, weight: weights, size: "" });
      }
    }
  });

  return out.slice(0, 8);
}

/* ── Numeric values (spacing, radii, shadows) ──────────────── */

function extractNumericValues(rules: Rule[], propPrefix: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const re = /(\d+\.?\d*px|\d+\.?\d*rem|\d+\.?\d*em)/g;
  for (const r of rules) {
    for (const [prop, val] of Object.entries(r.properties)) {
      if (!prop.startsWith(propPrefix)) continue;
      const matches = val.match(re);
      if (matches) for (const m of matches) { if (!seen.has(m)) { seen.add(m); out.push(m); } }
    }
  }
  return out;
}

function extractGradients(rules: Rule[]): string[] {
  const out: string[] = [];
  const re = /(?:linear|radial|conic)-gradient\([^)]+(?:\)\s*\))?/g;
  for (const r of rules) {
    for (const val of Object.values(r.properties)) {
      const matches = val.match(re);
      if (matches) {
        for (const m of matches) {
          const sel = r.selector;
          if (!out.includes(`${sel}: ${m}`)) out.push(`${sel}: ${m}`);
        }
      }
    }
  }
  return out.slice(0, 6);
}

/* ─────────────────────────────────────────────────────────────
   HTML Structure Analysis
   ───────────────────────────────────────────────────────────── */

function analyzeSections($: CheerioAPI): { name: string; description: string }[] {
  const sections: { name: string; description: string }[] = [];

  // Hero detection first
  if ($("[class*=hero], [id*=hero], [class*=banner], [id*=banner]").length > 0) {
    const el = $("[class*=hero], [id*=hero], [class*=banner], [id*=banner]").first();
    const text = cleanText(el.text());
    const classes = el.attr("class") || "";
    sections.push({
      name: "Hero / Banner",
      description: `Hero section${classes ? ` (.${classes.split(/\s+/).slice(0, 3).join(".")})` : ""}.${text ? ` Content hint: "${text}"` : ""}`,
    });
  }

  // Header
  $("header").first().each((_, el) => {
    const text = cleanText($(el).text());
    const classes = $(el).attr("class") || "";
    const hasSticky = hasCSSProperty(el, "position", "sticky") || hasCSSProperty(el, "position", "fixed");
    sections.push({
      name: "Header / Navigation",
      description: `Site header${classes ? ` (.${classes.split(/\s+/).slice(0, 2).join(".")})` : ""}.${hasSticky ? " Sticky/fixed position." : ""}${text ? ` Contains: "${text}"` : ""}`,
    });
  });

  // Features section
  if ($("[class*=feature], [id*=feature], [class*=benefit], [class*=grid]").length > 0) {
    const el = $("[class*=feature], [id*=feature], [class*=benefit]").first();
    const text = cleanText(el.text());
    const count = el.find("> div, > li, > article, > [class*=item], > [class*=card]").length || 3;
    sections.push({
      name: "Features / Grid",
      description: `Features section with ~${count} feature items.${text ? ` "${text}"` : ""}`,
    });
  }

  // Regular sections
  $("section").each((i, el) => {
    if (i > 6) return false;
    const id = $(el).attr("id") || "";
    const cls = $(el).attr("class") || "";
    const heading = cleanText($(el).find("h1, h2, h3").first().text());

    let name = `Section ${i + 1}`;
    const semanticId = id.replace(/[-_]/g, " ");
    const semanticClasses = cls.split(/\s+/).filter((c) => /^(hero|feature|content|about|service|product|pricing|testimonial|contact|cta|faq|gallery|team|blog|stats|banner)/i.test(c));
    if (semanticId) name = semanticId.charAt(0).toUpperCase() + semanticId.slice(1);
    else if (semanticClasses.length > 0) name = semanticClasses[0].charAt(0).toUpperCase() + semanticClasses[0].slice(1);
    else if (heading) name = heading;

    if (sections.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      name = `Content section ${i + 1}`;
    }

    sections.push({
      name,
      description: `Section${id ? ` (#${id})` : ""}${cls ? ` (.${cls.split(/\s+/).slice(0, 2).join(".")})` : ""}${heading ? ` Heading: "${heading}"` : ""}`,
    });
  });

  // Testimonials
  if ($("[class*=testimonial], [id*=testimonial], [class*=review], [class*=quote]").length > 0) {
    const el = $("[class*=testimonial], [id*=testimonial]").first();
    const text = cleanText(el.text());
    sections.push({
      name: "Testimonials",
      description: `Customer testimonials / reviews.${text ? ` "${text}"` : ""}`,
    });
  }

  // Pricing
  if ($("[class*=pricing], [id*=pricing], [class*=price], [class*=plan]").length > 0) {
    const plans = $("[class*=pricing] [class*=plan], [class*=pricing] > div, [class*=pricing] > article").length || 3;
    sections.push({
      name: "Pricing",
      description: `Pricing section with ~${plans} plan tiers.`,
    });
  }

  // CTA
  if ($("[class*=cta], [id*=cta], [class*=call-to-action]").length > 0) {
    const el = $("[class*=cta], [id*=cta]").first();
    const text = cleanText(el.text());
    sections.push({
      name: "Call to Action",
      description: `CTA section.${text ? ` "${text}"` : ""}`,
    });
  }

  // Statistics / counters
  if ($("[class*=stat], [class*=counter], [class*=number]").length > 0) {
    sections.push({
      name: "Statistics",
      description: "Stats / counter section with data points.",
    });
  }

  // FAQ
  if ($("[class*=faq], [id*=faq], [class*=question], [class*=accordion]").length > 0) {
    sections.push({
      name: "FAQ",
      description: "Frequently asked questions / accordion section.",
    });
  }

  // Footer
  $("footer").each((_, el) => {
    const text = cleanText($(el).text());
    const classes = $(el).attr("class") || "";
    sections.push({
      name: "Footer",
      description: `Site footer${classes ? ` (.${classes.split(/\s+/).slice(0, 2).join(".")})` : ""}.${text ? ` Contains: "${text}"` : ""}`,
    });
  });

  // Main if no sections captured
  if (sections.length === 0) {
    $("main, [role=main]").each((_, el) => {
      const text = cleanText($(el).text());
      sections.push({
        name: "Main Content",
        description: `Primary content area.${text ? ` "${text}"` : ""}`,
      });
    });
  }

  return sections.slice(0, 12);
}

function hasCSSProperty(el: Element, prop: string, value: string): boolean {
  const style = (el as Element).attribs?.style || "";
  return new RegExp(`${prop}\\s*:\\s*${value}`).test(style);
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function analyzeComponents($: CheerioAPI, rules: Rule[]): { name: string; details: string }[] {
  const comps: { name: string; details: string }[] = [];

  // Buttons with styles
  const buttons = $("button, a[class*=btn], a[class*=button], input[type=submit], [role=button]");
  if (buttons.length > 0) {
    const btnRules = rules.filter((r) => /button|\.btn|\.cta|input/.test(r.selector));
    let btnDetails = `${buttons.length} button(s) found`;
    const bgColors = btnRules
      .filter((r) => r.properties["background-color"] || r.properties["background"])
      .map((r) => `${r.properties["background-color"] || r.properties["background"]}`)
      .filter((v, i, a) => a.indexOf(v) === i);
    const radii = btnRules
      .map((r) => r.properties["border-radius"])
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i);
    if (bgColors.length > 0) btnDetails += ` · bg: ${bgColors[0]}`;
    if (radii.length > 0) btnDetails += ` · radius: ${radii[0]}`;

    // Hover states
    const hoverRules = btnRules.filter((r) => /:hover/.test(r.selector));
    if (hoverRules.length > 0) {
      const hoverProps = hoverRules.map((r) => {
        const parts: string[] = [];
        if (r.properties["background-color"]) parts.push(`bg ${r.properties["background-color"]}`);
        if (r.properties["transform"]) parts.push(`transform ${r.properties["transform"]}`);
        if (r.properties["box-shadow"]) parts.push(`shadow ${r.properties["box-shadow"]}`);
        return parts.join(", ");
      }).filter(Boolean);
      if (hoverProps.length > 0) btnDetails += ` · hover: ${hoverProps[0]}`;
    }
    comps.push({ name: "Buttons", details: btnDetails });
  }

  // Links
  const links = $("a[href]");
  if (links.length > 0) {
    const linkRules = rules.filter((r) => /^a$|^a\.|\.link/.test(r.selector));
    let details = `${links.length} link(s)`;
    const linkColors = linkRules.filter((r) => r.properties["color"]).map((r) => r.properties["color"]).filter((v, i, a) => a.indexOf(v) === i);
    if (linkColors.length > 0) details += ` · color: ${linkColors[0]}`;
    const hoverLinks = linkRules.filter((r) => /:hover/.test(r.selector));
    if (hoverLinks.length > 0 && hoverLinks[0].properties["color"]) details += ` · hover: ${hoverLinks[0].properties["color"]}`;
    comps.push({ name: "Links", details });
  }

  // Images
  const imgs = $("img");
  if (imgs.length > 0) {
    const hasBgCover = rules.some((r) => r.properties["object-fit"] === "cover");
    const hasRounded = rules.some((r) => r.properties["border-radius"] && /img/.test(r.selector));
    let details = `${imgs.length} image(s)`;
    if (hasBgCover) details += " · object-fit: cover";
    if (hasRounded) details += " · rounded";
    comps.push({ name: "Images", details });
  }

  // Navigation
  const navLinks = $("nav a, nav button, .nav a, .navbar a");
  if (navLinks.length > 0) {
    let details = `${navLinks.length} nav link(s)`;
    const hasSticky = $("header").length > 0 && (hasCSSProperty($("header").get(0) as Element, "position", "sticky") || hasCSSProperty($("header").get(0) as Element, "position", "fixed"));
    const hasMobileMenu = $("[class*=hamburger], [class*=menu-toggle], [class*=mobile-menu], [class*=nav-toggle]").length > 0;
    if (hasSticky) details += " · sticky header";
    if (hasMobileMenu) details += " · mobile hamburger menu";
    comps.push({ name: "Navigation", details });
  }

  // Cards
  const cards = $("[class*=card], article, [class*=tile]");
  if (cards.length > 0) {
    let details = `${cards.length} card(s)`;
    const cardRules = rules.filter((r) => /card|article/.test(r.selector));
    const shadow = cardRules.filter((r) => r.properties["box-shadow"]).map((r) => r.properties["box-shadow"])[0];
    const radius = cardRules.filter((r) => r.properties["border-radius"]).map((r) => r.properties["border-radius"])[0];
    const hoverCards = cardRules.filter((r) => /:hover/.test(r.selector));
    if (shadow) details += ` · shadow: ${shadow}`;
    if (radius) details += ` · radius: ${radius}`;
    if (hoverCards.length > 0) {
      const t = hoverCards[0].properties["transform"] || "";
      const s = hoverCards[0].properties["box-shadow"] || "";
      if (t) details += ` · hover lift: ${t}`;
      if (s) details += ` · hover shadow: ${s}`;
    }
    comps.push({ name: "Cards", details });
  }

  // Forms
  const forms = $("form");
  if (forms.length > 0) {
    const inputs = $("form input, form select, form textarea").length;
    let details = `${forms.length} form(s) · ${inputs} input(s)`;
    const inputRules = rules.filter((r) => /input|select|textarea/.test(r.selector));
    const focusRules = inputRules.filter((r) => /:focus/.test(r.selector));
    if (focusRules.length > 0 && (focusRules[0].properties["outline"] || focusRules[0].properties["box-shadow"])) {
      details += ` · focus: ${focusRules[0].properties["outline"] || focusRules[0].properties["box-shadow"] || "styled"}`;
    }
    comps.push({ name: "Forms / Inputs", details });
  }

  // Lists
  const lists = $("ul, ol");
  if (lists.length > 0) {
    const items = lists.find("li").length;
    comps.push({ name: "Lists", details: `${lists.length} list(s) with ${items} items` });
  }

  // Icons
  const icons = $("svg, i[class*=icon], [class*=icon]");
  if (icons.length > 0) comps.push({ name: "Icons", details: `${icons.length} icon(s) (SVG or icon font)` });

  // Avatars
  const avatars = $("[class*=avatar], [class*=profile], img[class*=round], img[class*=circle]");
  if (avatars.length > 0) comps.push({ name: "Avatars", details: `${avatars.length} avatar/round image(s)` });

  // Tables
  const tables = $("table");
  if (tables.length > 0) comps.push({ name: "Tables", details: `${tables.length} table(s)` });

  // Modals / Dialogs
  const modals = $("[class*=modal], [class*=dialog], [class*=overlay], [class*=popup]");
  if (modals.length > 0) comps.push({ name: "Modals / Dialogs", details: `${modals.length} overlay/dialog element(s)` });

  // Video / Embeds
  const embeds = $("video, iframe[src*=youtube], iframe[src*=vimeo], iframe[src*=embed]");
  if (embeds.length > 0) comps.push({ name: "Media Embeds", details: `${embeds.length} video/embed(s)` });

  return comps.slice(0, 12);
}

function analyzeAssets($: CheerioAPI): { name: string; prompt: string }[] {
  const assets: { name: string; prompt: string }[] = [];
  $("img[src]").each((i, el) => {
    if (i >= 8) return false;
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    const width = $(el).attr("width") || "";
    const height = $(el).attr("height") || "";
    const cls = $(el).attr("class") || "";
    
    const filename = src.split("/").pop() || "unnamed";
    const name = `Image ${i + 1}: ${filename}`;
    
    const altText = alt || "decorative/contextual image";
    let prompt = `Website image: ${altText}.`;
    if (width && height) {
      prompt += ` Dimensions: ${width}×${height}px.`;
    }
    if (cls) {
      prompt += ` Class: ${cls.split(/\s+/).slice(0, 3).join(".")}.`;
    }
    assets.push({ name: name.slice(0, 100), prompt });
  });
  return assets;
}

function determineSiteType($: CheerioAPI): string {
  const html = $.html().toLowerCase();
  const checks: [RegExp, string][] = [
    [/ecommerce|cart|checkout|add.to.cart|shop.?product|buy|product|price|\.shopify/i, "ecommerce"],
    [/dashboard|analytics|inbox|settings.*account|my.account|user.profile/i, "dashboard"],
    [/blog|article|post|entry|comment|category|tag|published|author|read.more/i, "blog"],
    [/portfolio|project|work|gallery|showcase|case.study/i, "portfolio"],
    [/login|register|signup|sign.in|sign.up|auth|password|forgot/i, "web_app"],
    [/docs|documentation|api|reference|guide|tutorial/i, "documentation"],
    [/pricing|plan|subscription|premium|enterprise|feature/i, "landing_page"],
  ];
  for (const [re, type] of checks) {
    if (re.test(html)) return type;
  }
  // Check page structure
  if ($("section").length >= 3 && $("h1").length > 0 && $("p").length > 5) return "landing_page";
  if ($("article").length >= 2) return "blog";
  return "landing_page";
}

function calculateComplexity($: CheerioAPI, rules: Rule[], sections: number, components: number, animationsCount: number): number {
  let score = 3;
  const html = $.html();
  if (html.length > 30000) score += 1;
  if (html.length > 80000) score += 1;
  if (rules.length > 30) score += 1;
  if (rules.length > 80) score += 1;
  if (sections >= 5) score += 1;
  if (sections >= 8) score += 1;
  if (components >= 6) score += 1;
  if (components >= 10) score += 1;
  if (animationsCount > 0) score += 1;
  if (animationsCount > 3) score += 1;
  if ($("script").length > 5) score += 1;
  if ($("script").length > 15) score += 1;
  if ($("form").length > 0) score += 1;
  if ($("[class*=card], article").length > 3) score += 1;
  if ($("iframe, video, canvas").length > 0) score += 1;
  if ($("nav, .nav, .navbar, header nav").length > 0) score += 1;
  const total = $("*").length;
  if (total > 200) score += 1;
  if (total > 600) score += 1;
  return Math.min(Math.max(score, 1), 10);
}

/* ─────────────────────────────────────────────────────────────
   Scroll Animation Detection
   ───────────────────────────────────────────────────────────── */

function detectScrollLibraries($: CheerioAPI): string[] {
  const found: string[] = [];
  const html = $.html().toLowerCase();
  const libs: [RegExp, string][] = [
    [/data-aos|aos\.|aos-animate/iu, "AOS (Animate on Scroll)"],
    [/wow\.js|new\s+WOW|\.wow\b/iu, "WOW.js"],
    [/scrollreveal|sr\.reveal|data-sr/iu, "ScrollReveal"],
    [/intersectionobserver|IntersectionObserver/iu, "Intersection Observer API"],
    [/gsap|tweenmax|tweenlite|scrolltrigger/iu, "GSAP (ScrollTrigger)"],
    [/framer.motion|motion\.div|animatepresence/iu, "Framer Motion"],
    [/lottie|bodymovin/iu, "Lottie animations"],
    [/tailwindcss.*animate|animate-spin|animate-pulse|animate-bounce|animate-ping/iu, "Tailwind CSS animations"],
  ];
  for (const [re, name] of libs) {
    if (re.test(html)) found.push(name);
  }
  return found;
}

/* ─────────────────────────────────────────────────────────────
   Scroll/Interactive Effects Detection
   ───────────────────────────────────────────────────────────── */

function detectInteractiveEffects($: CheerioAPI, rules: Rule[]): InteractiveEffects {
  const parallax: string[] = [];
  const scrollZoom: string[] = [];
  const horizontalScroll: string[] = [];
  const stickyLayouts: string[] = [];
  const glassmorphism: string[] = [];
  const microInteractions: string[] = [];

  const seenParallax = new Set<string>();
  const seenZoom = new Set<string>();
  const seenHorizontal = new Set<string>();
  const seenSticky = new Set<string>();
  const seenGlass = new Set<string>();
  const seenMicro = new Set<string>();

  const addUnique = (set: Set<string>, arr: string[], val: string) => {
    if (!set.has(val)) {
      set.add(val);
      arr.push(val);
    }
  };

  // 1. Analyze CSS rules
  for (const r of rules) {
    const sel = r.selector;
    const props = r.properties;

    // Parallax
    if (props["background-attachment"] === "fixed") {
      addUnique(seenParallax, parallax, `Parallax background effect on \`${sel}\``);
    }

    // Zoom
    const transform = props["transform"] || "";
    if (sel.includes(":hover") && (transform.includes("scale") || props["scale"])) {
      const cleanSel = sel.replace(/:hover/g, "").trim();
      addUnique(seenZoom, scrollZoom, `Hover-zoom effect on \`${cleanSel}\` (\`${transform || props["scale"]}\`)`);
    }

    // Horizontal Scroll
    const overflowX = props["overflow-x"] || "";
    const overflow = props["overflow"] || "";
    if (overflowX === "auto" || overflowX === "scroll" || overflow === "auto" || overflow === "scroll") {
      if (sel.includes("scroll") || sel.includes("carousel") || sel.includes("slider") || sel.includes("list") || sel.includes("wrap")) {
        addUnique(seenHorizontal, horizontalScroll, `Horizontal scrolling container on \`${sel}\` (\`overflow-x: ${overflowX || overflow}\`)`);
      }
    }
    if (props["scroll-snap-type"]) {
      addUnique(seenHorizontal, horizontalScroll, `Scroll snapping (\`${props["scroll-snap-type"]}\`) on \`${sel}\``);
    }

    // Sticky layouts
    const pos = props["position"] || "";
    if (pos === "sticky" || pos === "fixed") {
      const elementHint = sel.includes("header") || sel.includes("nav") || sel.includes("menu") ? "Navigation" :
                          sel.includes("sidebar") || sel.includes("aside") ? "Sidebar" :
                          sel.includes("footer") ? "Footer" : "Float container";
      addUnique(seenSticky, stickyLayouts, `Sticky pinning (${elementHint}) on \`${sel}\` (\`position: ${pos}\`)`);
    }

    // Glassmorphism
    const backdrop = props["backdrop-filter"] || props["-webkit-backdrop-filter"] || "";
    if (backdrop.includes("blur")) {
      addUnique(seenGlass, glassmorphism, `Glassmorphism backdrop-blur on \`${sel}\` (\`${backdrop}\`)`);
    }

    // Micro-interactions
    if (sel.includes(":hover") || sel.includes(":active") || sel.includes(":focus")) {
      const hasInteractionProp = props["transform"] || props["box-shadow"] || props["transition"] || props["background-color"] || props["color"];
      if (hasInteractionProp && !transform.includes("scale") && !props["scale"]) {
        const cleanSel = sel.replace(/:hover|:active|:focus/g, "").trim();
        const type = sel.includes(":hover") ? "Hover" : sel.includes(":active") ? "Active" : "Focus";
        const details = props["transform"] ? `transform: ${props["transform"]}` : props["box-shadow"] ? "shadow transition" : "color/bg state changes";
        addUnique(seenMicro, microInteractions, `${type} transition (${details}) on \`${cleanSel}\``);
      }
    }
  }

  // 2. Analyze DOM structure & Attributes
  $("[class*=parallax], [id*=parallax], [data-parallax]").each((_, el) => {
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const tag = el.tagName || "div";
    const identifier = id ? `#${id}` : cls ? `.${cls.split(/\s+/)[0]}` : tag;
    addUnique(seenParallax, parallax, `Parallax scrolling wrapper: \`<${tag} ${identifier}>\``);
  });

  $("[data-scroll-speed], [data-scroll-direction]").each((_, el) => {
    const cls = $(el).attr("class") || "";
    const tag = el.tagName || "div";
    addUnique(seenParallax, parallax, `Smooth-scroll speed controller (\`data-scroll-speed\`) on \`<${tag}.${cls.split(/\s+/)[0]}>\``);
  });

  $("[class*=zoom], [class*=magnify], [data-zoom]").each((_, el) => {
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const tag = el.tagName || "div";
    const identifier = id ? `#${id}` : cls ? `.${cls.split(/\s+/)[0]}` : tag;
    addUnique(seenZoom, scrollZoom, `Zoom hover animation element: \`<${tag} ${identifier}>\``);
  });

  $("[class*=carousel], [class*=slider], [class*=swiper], [class*=horizontal-scroll]").each((_, el) => {
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const tag = el.tagName || "div";
    const identifier = id ? `#${id}` : cls ? `.${cls.split(/\s+/)[0]}` : tag;
    addUnique(seenHorizontal, horizontalScroll, `Horizontal carousel container: \`<${tag} ${identifier}>\``);
  });

  $("[class*=sticky], [class*=fixed-top], [class*=fixed-bottom]").each((_, el) => {
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const tag = el.tagName || "div";
    const identifier = id ? `#${id}` : cls ? `.${cls.split(/\s+/)[0]}` : tag;
    addUnique(seenSticky, stickyLayouts, `Sticky pinned container element: \`<${tag} ${identifier}>\``);
  });

  $("[class*=glass], [class*=backdrop-blur]").each((_, el) => {
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    const tag = el.tagName || "div";
    const identifier = id ? `#${id}` : cls ? `.${cls.split(/\s+/)[0]}` : tag;
    addUnique(seenGlass, glassmorphism, `Glassmorphism frosted visual container: \`<${tag} ${identifier}>\``);
  });

  return {
    parallax: parallax.slice(0, 8),
    scrollZoom: scrollZoom.slice(0, 8),
    horizontalScroll: horizontalScroll.slice(0, 8),
    stickyLayouts: stickyLayouts.slice(0, 8),
    glassmorphism: glassmorphism.slice(0, 8),
    microInteractions: microInteractions.slice(0, 8),
  };
}

/* ─────────────────────────────────────────────────────────────
   Advanced Archeological Analyzers
   ───────────────────────────────────────────────────────────── */

function analyzeDesignDNA(colors: ColorDef[], spacing: string[]): DesignDNA {
  let colorPsychology = "Balanced neutral design.";
  const primary = colors.find((c) => c.role === "primary");
  if (primary) {
    const rgb = parseColorToRgb(primary.value);
    if (rgb) {
      const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      if (h >= 200 && h < 260) {
        colorPsychology = "Dominant blue/navy hues conveying trust, stability, and professional security.";
      } else if (h >= 80 && h < 160) {
        colorPsychology = "Dominant green tones representing growth, nature, fresh balance, and stability.";
      } else if (h >= 10 && h < 50) {
        colorPsychology = "Dominant warm amber/orange colors evoking creativity, energy, action, and enthusiasm.";
      } else if (h >= 340 || h < 10) {
        colorPsychology = "Dominant red accents conveying passion, urgency, energetic focus, and high visibility.";
      } else if (h >= 260 && h < 310) {
        colorPsychology = "Dominant purple elements representing luxury, sophistication, innovative tech, and quality.";
      } else if (l < 15) {
        colorPsychology = "Deep dark mode palette evoking premium minimalism, authority, and modern elegance.";
      } else if (l > 85) {
        colorPsychology = "Clean high-contrast light mode prioritizing clean space, legibility, and modern structure.";
      }
    }
  }

  let spacingPhilosophy = "Fluid proportional layout.";
  const spacingValues = spacing.map(s => s.toLowerCase());
  const has4pxMult = spacingValues.some(v => v.includes("px") && parseFloat(v) > 0 && parseFloat(v) % 4 === 0);
  const has8pxMult = spacingValues.some(v => v.includes("px") && parseFloat(v) > 0 && parseFloat(v) % 8 === 0);
  const hasRem = spacingValues.some(v => v.includes("rem") || v.includes("em"));
  if (hasRem) {
    spacingPhilosophy = "Responsive em/rem scaling supporting dynamic typography sizes and flexible component scaling.";
  } else if (has8pxMult) {
    spacingPhilosophy = "Strict 8px modular spacing grid promoting predictable balance and consistent layouts.";
  } else if (has4pxMult) {
    spacingPhilosophy = "High-density 4px grid maximizing visual structure for complex dashboards or layouts.";
  }

  const fontAccessibility = "Clear sans-serif font hierarchy providing comfortable reading distance and high contrast ratios.";

  return { colorPsychology, spacingPhilosophy, fontAccessibility };
}

function analyzeResponsiveArchaeology($: CheerioAPI, rules: Rule[], responsiveMqs: string[]): ResponsiveArchaeology {
  const cssText = extractCSSText($.html()).toLowerCase();
  const containerQueries = cssText.includes("@container") || rules.some(r => r.properties["container-type"] || r.properties["container"]);
  const touchOptimization = cssText.includes("pointer: coarse") || cssText.includes("hover: none") || rules.some(r => r.properties["min-width"] === "44px" || r.properties["min-height"] === "44px");

  return {
    breakpoints: responsiveMqs.map(mq => mq.trim()),
    containerQueries,
    touchOptimization,
  };
}

function analyzeAccessibilityAutopsy($: CheerioAPI, colors: ColorDef[], responsiveMqs: string[]): AccessibilityAutopsy {
  const cssText = extractCSSText($.html()).toLowerCase();
  const bgColors = colors.filter(c => c.role === "background" || c.role === "surface");
  const textColors = colors.filter(c => c.role === "text" || c.role === "muted-text");

  let maxContrast = 4.5;
  let contrastWCAG = "AA Pass";

  if (bgColors.length > 0 && textColors.length > 0) {
    const bg = bgColors[0].value;
    const text = textColors[0].value;
    maxContrast = getContrastRatio(bg, text);
    if (maxContrast >= 7.0) {
      contrastWCAG = "AAA Pass (Highly Accessible)";
    } else if (maxContrast >= 4.5) {
      contrastWCAG = "AA Pass (Readable)";
    } else {
      contrastWCAG = "WCAG Contrast Alert (Lower than 4.5:1 ratio)";
    }
  }

  const totalImgs = $("img").length;
  const imgsWithAlt = $("img[alt]").length;
  const totalBtns = $("button, a[role=button]").length;
  const btnsWithAria = $("button[aria-label], button[aria-expanded], a[role=button][aria-label]").length;
  
  let ariaCompleteness = 100;
  const totalCheckedNodes = totalImgs + totalBtns;
  if (totalCheckedNodes > 0) {
    ariaCompleteness = Math.round(((imgsWithAlt + btnsWithAria) / totalCheckedNodes) * 100);
  }

  const reducedMotion = cssText.includes("prefers-reduced-motion");

  return {
    contrastRatio: maxContrast,
    contrastWCAG,
    ariaCompleteness,
    reducedMotion,
  };
}

function analyzePerformanceForensics($: CheerioAPI, rules: Rule[]): PerformanceForensics {
  const totalImages = $("img").length;
  const lazyImages = $("img[loading=lazy]").length;
  const lazyImagesPercent = totalImages > 0 ? Math.round((lazyImages / totalImages) * 100) : 0;

  const cssText = extractCSSText($.html()).toLowerCase();
  const fontDisplaySwap = cssText.includes("font-display: swap") || cssText.includes("font-display:swap");

  let asyncScripts = false;
  $("script[src]").each((_, el: any) => {
    if ($(el).attr("async") !== undefined || $(el).attr("defer") !== undefined) {
      asyncScripts = true;
      return false;
    }
  });

  return {
    lazyImagesPercent,
    fontDisplaySwap,
    asyncScripts,
  };
}

function analyzeCodeArchaeology($: CheerioAPI, techs: string[]): CodeArchaeology {
  const replicationArchitecture = techs.includes("React") ? "Next.js 15 App Router Architecture with Tailwind CSS styling and TypeScript." :
                                  techs.includes("Vue") ? "Nuxt 3 composition API layout with Pinia state management." :
                                  techs.includes("Angular") ? "Angular 18 modular structure with signals state tracking." :
                                  "Vite single-page layout utilizing vanilla HTML5, CSS Variables, and ESM modules.";

  const stateManagementHint = techs.includes("React") ? "Zustand or React Context API for global layout state." :
                               techs.includes("Vue") ? "Pinia modules." :
                               techs.includes("Angular") ? "Angular Signals and Injectable state services." :
                               "Reactive JS state stores with local custom events.";

  return {
    detectedFrameworks: techs,
    stateManagementHint,
    replicationArchitecture,
  };
}

function analyzeDarkMode($: CheerioAPI, colors: ColorDef[]): DarkModeArchaeologist {
  const cssText = extractCSSText($.html()).toLowerCase();
  const htmlClass = $("html").attr("class") || "";
  const hasDarkTheme = htmlClass.includes("dark") || cssText.includes("prefers-color-scheme: dark");

  const autoDarkColors: { light: string; dark: string }[] = [];
  const seenLights = new Set<string>();

  for (const c of colors.slice(0, 10)) {
    const lightVal = c.value.toLowerCase();
    if (!seenLights.has(lightVal) && lightVal.startsWith("#")) {
      seenLights.add(lightVal);
      const darkVal = invertColorForDarkMode(c.value, c.role);
      autoDarkColors.push({ light: c.value, dark: darkVal });
    }
  }

  return {
    hasDarkTheme,
    autoDarkColors,
  };
}

/* ─────────────────────────────────────────────────────────────
   Prompt Engineering & Spec Generators
   ───────────────────────────────────────────────────────────── */

function getCustomizationDirectives(customization: z.infer<typeof CustomizationSchema>): string {
  const lines: string[] = [];
  lines.push("## CUSTOMIZATION & STACK DIRECTIVES");
  lines.push(`- **Framework/Platform**: Replicate the site using **${customization.framework}**. Structure components, files, and imports according to the official guidelines for this stack.`);
  lines.push(`- **Styling Method**: Implement all styling using **${customization.styling}**. Ensure all color, spacing, and font design tokens mapped below are implemented correctly in this format.`);
  lines.push(`- **Animation Engine**: Recreate interactive motions and transitions using **${customization.animation}**. Implement smooth easing functions matching the timing guidelines.`);
  
  if (customization.tone === "technical") {
    lines.push("- **Specification Tone**: Follow a highly technical, precise, and literal implementation. Map class naming patterns, element structures, and CSS values exactly.");
  } else if (customization.tone === "creative") {
    lines.push("- **Specification Tone**: Focus on creative alignment, brand presence, fluid transitions, and polishing the artistic and UX quality of the copy and colors.");
  } else {
    lines.push("- **Specification Tone**: Focus on clean minimalism, high readability, strict padding/margin grid structure, and eliminating unnecessary elements.");
  }
  
  if (customization.complexity === "junior") {
    lines.push("- **Complexity Cap**: Code should be clean, straightforward, easy to understand, heavily commented, and avoid complex abstractions or premature optimizations.");
  } else if (customization.complexity === "mid") {
    lines.push("- **Complexity Cap**: Structure with professional patterns, reusable UI primitives, and solid file separations.");
  } else {
    lines.push("- **Complexity Cap**: Enterprise-ready architecture. Implement strict typescript typing, clean modular folder layout, advanced state management hooks, performance memoization, and lazy-loading components.");
  }
  
  return lines.join("\n");
}

function generateABVariants(siteName: string, siteType: string): { trust: string; urgency: string; clarity: string } {
  return {
    trust: `A/B Variant: Trust-Optimized ${siteName}
    
Key Strategy: Boost conversion by adding social proof, security badges, and authority symbols.
1. Hero Section: Add a trust badge bar below the main CTA showing partner logos or press mentions.
2. Under-CTA text: Add guarantee reassurance (money-back, free trial, no-commitment).
3. Testimonials: Place a responsive grid of customer reviews with avatar photos, verified badges, and ratings.
4. Footer: Include security certifications and clear links to Privacy Policy / Terms.`,
    
    urgency: `A/B Variant: Urgency-Optimized ${siteName}
    
Key Strategy: Encourage immediate action using scarcity, countdown, and active verbs.
1. Header Alert Bar: Introduce a top banner with a live countdown timer and limited-offer messaging.
2. Hero Section: Adjust CTA with a subtle pulse glow animation and action-oriented text.
3. Scarcity Tags: Next to pricing packages, render real-time counter tags showing limited availability.
4. Exit Intent Alert: Setup a micro-interaction popup that offers a one-time incentive when leaving.`,
    
    clarity: `A/B Variant: Clarity-Optimized ${siteName}
    
Key Strategy: Reduce friction and cognitive load by maximizing white space and simplifying layouts.
1. Layout Simplification: Remove secondary menus and consolidate navigation to core pages.
2. Typography: Increase line-height to 1.75, increase heading size, improve contrast.
3. Single Column Flow: Stack sections in a single-column layout with generous vertical padding.
4. Call To Action: Enlarge main buttons, add arrow icons, remove competing secondary actions.`
  };
}

function generateStorybookComponents(
  framework: string,
  styling: string,
  colors: ColorDef[],
  radii: string[]
): { name: string; code: string; props: string[]; usage: string }[] {
  const primaryColor = colors.find(c => c.role === "primary")?.value || "#3b82f6";
  const borderRadius = radii[0] || "8px";
  const isTailwind = styling === "Tailwind";

  return [
    {
      name: "Button",
      code: framework === "React" ? 
`import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: ${isTailwind ? `"bg-[${primaryColor}] text-white hover:opacity-90"` : `""`},
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };

  const sizes = {
    sm: "h-9 px-3 text-xs rounded-md",
    md: "h-10 px-4 py-2 text-sm rounded-md",
    lg: "h-11 px-8 text-base rounded-md"
  };

  return (
    <button
      className={\`\${baseStyle} \${variants[variant]} \${sizes[size]} \${className}\`}
      style={${isTailwind ? "undefined" : `{{ backgroundColor: variant === 'primary' ? '${primaryColor}' : undefined, borderRadius: '${borderRadius}' }}`}}
      {...props}
    >
      {children}
    </button>
  );
};` : 
`<template>
  <button 
    :class="[baseStyle, variantStyles[variant], sizeStyles[size], customClass]"
    :style="buttonStyle"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  customClass: { type: String, default: '' }
});

const baseStyle = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none";

const variantStyles = {
  primary: "${isTailwind ? `bg-[${primaryColor}] text-white` : ''}",
  secondary: "bg-gray-100 text-gray-900",
  outline: "border border-gray-300 bg-white"
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-lg"
};

const buttonStyle = computed(() => {
  return ${isTailwind ? "{}" : `{ backgroundColor: props.variant === 'primary' ? '${primaryColor}' : '', borderRadius: '${borderRadius}' }`};
});
</script>`,
      props: ["variant", "size", "className", "disabled"],
      usage: `<Button variant="primary" size="md">{label}</Button>\n<Button variant="outline">{label}</Button>`
    },
    {
      name: "Card",
      code: framework === "React" ?
`import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, imageUrl, footer }) => {
  return (
    <div 
      className="overflow-hidden border border-border shadow-sm bg-card text-card-foreground"
      style={{ borderRadius: '${borderRadius}' }}
    >
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        {footer && <div className="mt-4 flex items-center">{footer}</div>}
      </div>
    </div>
  );
};` :
`<template>
  <div class="overflow-hidden border border-gray-200 shadow-sm bg-white" :style="{ borderRadius: '${borderRadius}' }">
    <img v-if="imageUrl" :src="imageUrl" :alt="title" class="w-full h-48 object-cover" />
    <div class="p-5">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p class="text-sm text-gray-500 mt-2">{{ description }}</p>
      <div v-if="$slots.footer" class="mt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' }
});
</script>`,
      props: ["title", "description", "imageUrl", "footerSlot"],
      usage: `<Card title={title} description={description} imageUrl={imageUrl} />`
    },
    {
      name: "Input",
      code: framework === "React" ?
`import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, helperText, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && <label className="text-xs font-semibold text-foreground">{label}</label>}
      <input
        className={\`w-full px-3 py-2 text-xs border border-input bg-background text-foreground transition-shadow focus:outline-none focus:ring-1 focus:ring-primary \${className}\`}
        style={{ borderRadius: '${borderRadius}', borderColor: '${primaryColor}' }}
        {...props}
      />
      {helperText && <p className="text-[10px] text-muted-foreground">{helperText}</p>}
    </div>
  );
};` :
`<template>
  <div class="w-full text-left space-y-1.5">
    <label v-if="label" class="text-xs font-semibold text-gray-700">{{ label }}</label>
    <input
      class="w-full px-3 py-2 text-xs border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
      :style="{ borderRadius: '${borderRadius}', borderColor: '${primaryColor}' }"
      v-bind="$attrs"
    />
    <p v-if="helperText" class="text-[10px] text-gray-500">{{ helperText }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  helperText: { type: String, default: '' }
});
</script>`,
      props: ["label", "helperText", "placeholder", "disabled"],
      usage: `<Input label={label} placeholder={placeholder} helperText={helperText} />`
    }
  ];
}

function generateCursorRules(siteName: string, framework: string, styling: string, colors: ColorDef[]): string {
  const primaryColor = colors.find(c => c.role === "primary")?.value || "#3b82f6";
  const secColor = colors.find(c => c.role === "secondary")?.value || "#64748b";
  const bg = colors.find(c => c.role === "background")?.value || "#ffffff";
  return `# Cursor Rules for Replicating ${siteName}

## Tech Stack & Styling Guidelines
- Framework: ${framework}
- Styling: ${styling}

## Design System Tokens (Apply strictly)
- Primary Accent Color: ${primaryColor}
- Secondary Color: ${secColor}
- Canvas Background: ${bg}

## Implementation Instructions
1. Code structure must follow high-quality modular component divisions.
2. Accessibility first: always include proper alt attributes on image tags and aria-labels on buttons.
3. Responsive break-points: optimize layout using container-query structures and fluid typography where applicable.
4. Ensure dark-mode overrides conform to contrast rules (min 4.5:1 ratio).`;
}

function generateFigmaSpec(siteName: string, colors: ColorDef[], fonts: { family: string; usage: string }[], spacing: string[]): string {
  return JSON.stringify({
    editorVersion: "1.0",
    documentName: `${siteName} Spec Library`,
    colors: colors.map(c => ({
      figmaName: `Brand/${c.name.replace(/\s+/g, '')}`,
      hex: c.value,
      role: c.role,
      description: c.usage
    })),
    typography: fonts.map(f => ({
      family: f.family,
      style: "Regular",
      intendedUsage: f.usage
    })),
    layoutGrid: {
      columns: 12,
      gutter: spacing[0] || "24px",
      margin: "auto"
    }
  }, null, 2);
}

function generateMarkdownReport(
  $: CheerioAPI,
  siteName: string,
  siteType: string,
  complexityScore: number,
  accessibility: AccessibilityAutopsy,
  performance: PerformanceForensics,
  codeArch: CodeArchaeology,
  colors: ColorDef[],
  sections: { name: string; description: string }[],
  fonts: { family: string; usage: string; weight: string; size: string }[],
  spacing: string[],
  radii: string[],
  shadows: string[],
  animations: AnimDetail[],
  interactiveEffects: InteractiveEffects,
  responsiveArchaeology: ResponsiveArchaeology,
  customization: z.infer<typeof CustomizationSchema>
): string {
  const chosenStyle = chooseDesignStyle(colors, fonts, interactiveEffects, siteType);
  
  let totalImgCount = 0;
  let imgWithAltCount = 0;
  let svgCount = 0;
  let pngCount = 0;
  let jpgCount = 0;
  let webpCount = 0;

  $("img").each((_, el) => {
    totalImgCount++;
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (alt) imgWithAltCount++;
    if (src.endsWith(".svg")) svgCount++;
    else if (src.endsWith(".png")) pngCount++;
    else if (src.endsWith(".jpg") || src.endsWith(".jpeg")) jpgCount++;
    else if (src.endsWith(".webp")) webpCount++;
  });

  $("svg").each((_, el) => {
    svgCount++;
  });

  let imageTreatment = "Standard responsive images";
  const firstImgStyle = $("img").first().attr("style") || "";
  const firstImgClass = $("img").first().attr("class") || "";
  if (firstImgStyle.includes("border-radius") || firstImgClass.includes("rounded") || (radii.length > 0 && radii[0] !== "0px")) {
    imageTreatment = `Rounded (${radii[0] || "8px"}) with card container styling`;
  }
  if (firstImgStyle.includes("box-shadow") || firstImgClass.includes("shadow") || (shadows.length > 0 && shadows[0] !== "none")) {
    imageTreatment += " with depth shadow filters";
  }

  const scrollMethod = interactiveEffects.parallax.length > 0 ? "Parallax scrolling backgrounds" : "";
  const scrollMethodHorizontal = interactiveEffects.horizontalScroll.length > 0 ? " with horizontal scroll-snap" : "";

  const zoomingMethod = interactiveEffects.scrollZoom.length > 0 ? interactiveEffects.scrollZoom.slice(0, 3).join(", ") : "";
  const stickyStructure = interactiveEffects.stickyLayouts.length > 0 ? interactiveEffects.stickyLayouts.slice(0, 3).join(", ") : "";

  const geometricAccents: string[] = [];
  let marqueeDetected = false;
  let customCursor = false;
  let overlappingLayout = false;

  if ($("[class*=marquee], marquee, [class*=ticker]").length > 0) {
    marqueeDetected = true;
    geometricAccents.push("Infinite sliding typographic marquee containers");
  }
  if ($("[class*=cursor], [id*=cursor], [data-cursor]").length > 0) {
    customCursor = true;
    geometricAccents.push("Interactive custom cursor overlay");
  }
  if ($("[class*=overlap], [class*=offset], [class*=skew], [class*=asymmetric]").length > 0) {
    overlappingLayout = true;
    geometricAccents.push("Asymmetrical overlapping offsets and off-axis grid alignments");
  }
  if ($("[class*=clip], [class*=polygon], [class*=shape]").length > 0) {
    geometricAccents.push("Custom polygon clip-path design geometries");
  }
  if ($("[class*=circle], [class*=round-full]").length > 0) {
    geometricAccents.push("Circular layout vector accents");
  }

  const minuteEffects: string[] = [];
  if (interactiveEffects.glassmorphism.length > 0) {
    minuteEffects.push(`Glassmorphic frosted glass panels (${interactiveEffects.glassmorphism.slice(0, 2).join(", ")})`);
  }
  if (interactiveEffects.microInteractions.length > 0) {
    minuteEffects.push(`Micro-interaction hover/active transitions (${interactiveEffects.microInteractions.slice(0, 2).join(", ")})`);
  }
  if (shadows.length > 0 && shadows[0] !== "none") {
    minuteEffects.push(`Layered depth shadows (\`${shadows.slice(0, 2).join(", ")}\`)`);
  }
  if (radii.length > 0 && radii[0] !== "0px") {
    minuteEffects.push(`Curved border radii (\`${radii.slice(0, 2).join(", ")}\`)`);
  }
  geometricAccents.forEach(acc => minuteEffects.push(acc));

  const detectedBreakpoints = responsiveArchaeology.breakpoints.length > 0
    ? responsiveArchaeology.breakpoints.join(", ")
    : (responsiveArchaeology.containerQueries ? "Container queries" : "");

  return `# Website Reverse Engineering Report: ${siteName}

## 1. Visual Design
- **Core Aesthetic Style**: ${chosenStyle}
- **Complexity Rating**: ${complexityScore}/10
- **Image Treatment**: ${imageTreatment}
- **Geometrical Layout Shapes**: ${geometricAccents.length > 0 ? geometricAccents.join(", ") : "Standard rectangular block layout"}
- **Media Asset Density**: ${totalImgCount} images (${imgWithAltCount} with alt text), ${svgCount} vector icons (SVG: ${svgCount}, PNG: ${pngCount}, JPG: ${jpgCount}, WebP: ${webpCount})

## 2. Layout Architecture
- **Sticky / Pinned Elements**: ${stickyStructure || "None detected"}
- **Asymmetrical Overlapping Offsets**: ${overlappingLayout ? "Detected negative margin offsets and coordinate grid shifts." : "Standard symmetrical block flow"}
- **Section Sequence**: ${sections.map((s, idx) => `${idx + 1}. ${s.name}`).join(" → ")}

## 3. Component Library
${sections.map((s) => `- **${s.name}**: ${s.description}`).join("\n")}

## 4. Typography System
${fonts.length > 0 ? fonts.map(f => `- **${f.family}**: ${f.usage} (${f.size}, ${f.weight})`).join("\n") : "- No fonts extracted"}

## 5. Color System
${colors.map(c => `- **${c.name}** (\`${c.value}\`): ${c.role} — ${c.usage}`).join("\n")}

## 6. Motion System
- **Animations**: ${animations.length > 0 ? animations.map(a => `${a.name} on \`${a.selector || 'element'}\` (${a.duration || '—'}, ${a.timing || 'ease'})`).join("; ") : "No keyframe animations detected"}
- **Scrolling**: ${scrollMethod || "Standard scroll"}${scrollMethodHorizontal}
- **Zoom**: ${zoomingMethod || "None detected"}
- **Marquee**: ${marqueeDetected ? "Infinite loop marquee" : "Not detected"}
- **Custom Cursor**: ${customCursor ? "Detected" : "Not detected"}

## 7. Responsive Behavior
- **Breakpoints**: ${detectedBreakpoints || "Standard responsive scaling"}
- **Container Queries**: ${responsiveArchaeology.containerQueries ? "Yes" : "Not detected"}
- **Touch Optimization**: ${responsiveArchaeology.touchOptimization ? "Optimized" : "Not detected"}

## 8. Interaction Patterns
${minuteEffects.length > 0 ? minuteEffects.map(eff => `- ${eff}`).join("\n") : "- No interactive effects detected"}

## 9. Accessibility
- **Contrast Ratio**: ${accessibility.contrastRatio}:1 (WCAG: ${accessibility.contrastWCAG})
- **ARIA Completeness**: ${accessibility.ariaCompleteness}%
- **Reduced Motion**: ${accessibility.reducedMotion ? "Supported" : "Not detected"}

## 10. Implementation
- **Stack**: ${customization.framework}, ${customization.styling}, ${customization.framework === "React" ? "Framer Motion" : "CSS Transitions"}
- **Font Display Swap**: ${performance.fontDisplaySwap ? "Enabled" : "Not detected"}
- **Lazy Images**: ${performance.lazyImagesPercent > 0 ? `${Math.round(performance.lazyImagesPercent)}%` : "Not detected"}`;
}

function generateReplicatedCode(
  $: CheerioAPI,
  baseUrl: string,
  colors: ColorDef[],
  sections: { name: string; description: string }[],
  customization: z.infer<typeof CustomizationSchema>,
  fonts: { family: string; usage: string }[]
): string {
  const siteName = $("title").first().text().trim() || new URL(baseUrl).hostname;
  const primary = colors.find(c => c.role === "primary")?.value || "#3b82f6";
  const bg = colors.find(c => c.role === "background")?.value || "#ffffff";
  const surface = colors.find(c => c.role === "surface")?.value || "#f8f9fa";
  const text = colors.find(c => c.role === "text")?.value || "#0f172a";
  const mutedText = colors.find(c => c.role === "muted-text" || c.usage.toLowerCase().includes("muted"))?.value || "#475569";
  const accent = colors.find(c => c.role === "accent")?.value || "#ef4444";
  const border = colors.find(c => c.role === "border")?.value || "#e2e8f0";
  const radiusVal = "8px";

  const resolveUrl = (urlStr: string): string => {
    try {
      if (!urlStr) return "";
      return new URL(urlStr, baseUrl).href;
    } catch {
      return urlStr;
    }
  };

  // Extract fonts from actual site
  const displayFont = fonts.find(f => /heading|title|display/i.test(f.usage))?.family || "";
  const bodyFont = fonts.find(f => /body|text|copy/i.test(f.usage))?.family || "";
  const siteFontFamily = bodyFont || "'Inter', system-ui, -apple-system, sans-serif";
  const siteDisplayFamily = displayFont || bodyFont || "'Inter', sans-serif";
  const googleFontsParam = [...new Set(fonts.map(f => f.family).filter(Boolean))].map(f => `family=${encodeURIComponent(f)}:wght@400;500;600;700`).join("&");
  const fontLink = googleFontsParam ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?${googleFontsParam}&display=swap" rel="stylesheet">` : "";

  // Extract real nav links
  const navLinks: { text: string; href: string }[] = [];
  const seenNav = new Set<string>();
  $("header, nav, [class*=nav], [class*=header], [class*=menu]").find("a").each((_, el) => {
    const txt = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") || "#";
    if (txt && txt.length < 25 && !seenNav.has(txt.toLowerCase()) && !/login|sign|register|cart|checkout/i.test(txt)) {
      seenNav.add(txt.toLowerCase());
      navLinks.push({ text: txt, href: resolveUrl(href) });
    }
  });

  let navCta: { text: string; href: string } | null = null;
  $("header, nav, [class*=nav]").find("button, a[class*=btn], a[class*=button], a[class*=cta]").each((_, el) => {
    const txt = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") || "#";
    if (txt && txt.length < 20 && !navCta) {
      navCta = { text: txt, href: resolveUrl(href) };
    }
  });

  // Extract heading and hero content
  const h1 = $("h1").first();
  const heroHeading = h1.length > 0 ? h1.text().trim().replace(/\s+/g, " ") : "";
  const heroDesc = $('meta[name="description"]').attr("content") || "";
  const firstH1P = h1.length > 0 ? h1.nextAll("p").first() : null;
  const heroSubtitle = firstH1P && firstH1P.length > 0 ? firstH1P.text().trim().replace(/\s+/g, " ") : heroDesc;

  let heroCta: { text: string; href: string } | null = null;
  $("[class*=hero] button, [class*=hero] a, button[class*=cta], a[class*=cta]").each((_, el) => {
    const txt = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") || "#";
    if (txt && txt.length < 25) {
      heroCta = { text: txt, href: resolveUrl(href) };
      return false;
    }
  });

  const heroImgEl = $("[class*=hero] img, [class*=banner] img").first();
  const heroImg = heroImgEl.length > 0 ? resolveUrl(heroImgEl.attr("src") || "") : null;

  // Generate body section markup — only sections with real content
  let sectionsHtml = "";
  const bodySections = sections.filter(s => {
    const name = s.name.toLowerCase();
    return !name.includes("header") && !name.includes("footer") && !name.includes("navigation") && !name.includes("hero") && !name.includes("banner");
  });

  bodySections.forEach((s, idx) => {
    const sectionEl = findSectionElement($, s.name);
    let heading = s.name;
    const paragraphs: string[] = [];
    const buttons: { text: string; href: string }[] = [];
    const sectionImages: string[] = [];
    const cards: { title: string; desc: string; img?: string }[] = [];

    if (sectionEl) {
      const $sec = $(sectionEl);
      const domHeading = $sec.find("h1, h2, h3, h4").first().text().trim().replace(/\s+/g, " ");
      if (domHeading) heading = domHeading;

      $sec.find("p").each((_, p) => {
        const tp = $(p).text().trim().replace(/\s+/g, " ");
        if (tp && tp.length > 15 && paragraphs.length < 3) paragraphs.push(tp);
      });

      $sec.find("button, a[href]").each((_, b) => {
        const tb = $(b).text().trim().replace(/\s+/g, " ");
        const href = $(b).attr("href") || "#";
        if (tb && tb.length > 2 && tb.length < 30 && buttons.length < 2 && (!navCta || tb !== navCta.text)) {
          buttons.push({ text: tb, href: resolveUrl(href) });
        }
      });

      $sec.find("img").each((_, img) => {
        const src = $(img).attr("src");
        if (src && sectionImages.length < 3) sectionImages.push(resolveUrl(src));
      });

      $sec.find("[class*=card], [class*=item], article, li").each((_, item) => {
        const $item = $(item);
        const itemTitle = $item.find("h3, h4, h5, strong").first().text().trim().replace(/\s+/g, " ");
        const itemDesc = $item.find("p, span").first().text().trim().replace(/\s+/g, " ");
        const itemImg = $item.find("img").first().attr("src");
        if (itemTitle && itemTitle.length < 60 && cards.length < 6) {
          cards.push({
            title: itemTitle,
            desc: itemDesc.slice(0, 150),
            img: itemImg ? resolveUrl(itemImg) : undefined
          });
        }
      });
    }

    const isEven = idx % 2 === 0;
    const sectionBg = isEven ? "var(--bg)" : "var(--surface)";
    const lowerName = s.name.toLowerCase();
    const hasCards = cards.length > 0;
    const hasImgs = sectionImages.length > 0;
    const hasBtns = buttons.length > 0;
    const hasParas = paragraphs.length > 0;

    // Skip sections with no extractable content at all
    if (!hasParas && !hasImgs && !hasCards && !hasBtns) return;

    const sectionClass = lowerName.includes("pricing") ? " section-container pricing-section" : " section-container";
    const bgStyle = ` style="background-color: ${sectionBg};"`;

    if (hasCards) {
      sectionsHtml += `
      <section${sectionClass}${bgStyle}>
        <div class="container">
          <h2 class="section-heading">${heading}</h2>
          ${hasParas ? paragraphs.map(p => `<p class="section-subtitle">${p}</p>`).join("\n          ") : ""}
          <div class="card-grid">
            ${cards.map(c => `
              <div class="card">
                ${c.img ? `<div class="card-image-wrapper"><img src="${c.img}" alt="${c.title}" class="card-image" /></div>` : ""}
                <div class="card-body">
                  <h3 class="card-title">${c.title}</h3>
                  <p class="card-text">${c.desc}</p>
                </div>
              </div>
            `).join("")}
          </div>
          ${hasBtns ? `<div class="section-actions">${buttons.map(b => `<a href="${b.href}" class="btn">${b.text}</a>`).join("")}</div>` : ""}
        </div>
      </section>`;
    } else {
      const className = hasImgs ? "split-layout" : "split-layout no-image";
      sectionsHtml += `
      <section${sectionClass}${bgStyle}>
        <div class="container">
          <div class="${className}">
            <div class="split-content">
              <h2 class="section-heading align-left">${heading}</h2>
              ${hasParas ? paragraphs.map(p => `<p class="split-text">${p}</p>`).join("\n              ") : ""}
              ${hasBtns ? `<div class="split-actions">${buttons.map(b => `<a href="${b.href}" class="btn">${b.text}</a>`).join("")}</div>` : ""}
            </div>
            ${hasImgs ? `
              <div class="split-visual">
                <div class="visual-card">
                  <img src="${sectionImages[0]}" alt="${heading}" class="split-image" />
                </div>
              </div>` : ""}
          </div>
        </div>
      </section>`;
    }
  });

  // Build footer links from actual page content
  const footerLinks: { label: string; href: string }[] = [];
  $("footer a[href]").each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, " ");
    const href = $(el).attr("href") || "#";
    if (t && t.length < 30 && footerLinks.length < 6) {
      footerLinks.push({ label: t, href: resolveUrl(href) });
    }
  });

  const hasHero = heroHeading.length > 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteName} — Site Replica</title>
  ${fontLink}
  <style>
    :root { --primary: ${primary}; --bg: ${bg}; --surface: ${surface}; --text: ${text}; --muted-text: ${mutedText}; --accent: ${accent}; --border: ${border}; --radius: ${radiusVal}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: var(--bg); color: var(--text); font-family: ${siteFontFamily}; line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    h1, h2, h3, h4, h5, h6 { font-family: ${siteDisplayFamily}; font-weight: 700; color: var(--text); line-height: 1.2; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .site-header { background-color: rgba(255,255,255,0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2.5rem; height: 70px; }
    .logo { font-size: 1.5rem; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .logo::before { content: ""; display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: var(--primary); }
    .nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; }
    .hamburger { display: block; width: 20px; height: 2px; background-color: var(--text); position: relative; }
    .hamburger::before, .hamburger::after { content: ""; position: absolute; width: 20px; height: 2px; background-color: var(--text); }
    .hamburger::before { top: -6px; } .hamburger::after { bottom: -6px; }
    .nav-toggle.active .hamburger { background-color: transparent; }
    .nav-toggle.active .hamburger::before { transform: translateY(6px) rotate(45deg); }
    .nav-toggle.active .hamburger::after { transform: translateY(-6px) rotate(-45deg); }
    .nav-menu { display: flex; align-items: center; gap: 2rem; }
    .nav-menu a { color: var(--text); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
    .nav-menu a:hover { color: var(--primary); }
    .btn { display: inline-flex; align-items: center; justify-content: center; background-color: var(--primary); color: #fff; font-size: 0.9rem; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: var(--radius); border: none; cursor: pointer; text-decoration: none; transition: transform 0.2s, opacity 0.2s, box-shadow 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .btn:hover { transform: translateY(-1px); opacity: 0.95; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .btn-outline { background-color: transparent; border: 1.5px solid var(--border); color: var(--text); }
    .btn-outline:hover { background-color: var(--surface); border-color: var(--text); }
    .btn-lg { padding: 0.875rem 2rem; font-size: 1rem; }
    ${hasHero ? `
    .hero-section { padding: 7rem 2rem 5rem; text-align: center; position: relative; }
    .hero-container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
    .hero-section h1 { font-size: 3.5rem; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.5rem; max-width: 800px; }
    .hero-subtitle { font-size: 1.2rem; color: var(--muted-text); max-width: 650px; margin-bottom: 2.5rem; line-height: 1.6; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 4rem; }
    .hero-visual { width: 100%; max-width: 800px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); overflow: hidden; aspect-ratio: 16/9; background-color: var(--surface); }
    .hero-image { width: 100%; height: 100%; object-fit: cover; }` : ""}
    .section-container { padding: 6rem 0; border-top: 1px solid var(--border); }
    .section-heading { font-size: 2.25rem; text-align: center; margin-bottom: 1rem; }
    .section-heading.align-left { text-align: left; }
    .section-subtitle { font-size: 1.05rem; color: var(--muted-text); text-align: center; max-width: 650px; margin: 0 auto 3.5rem; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: 2rem; margin-bottom: 2rem; }
    .card { background-color: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .card-image-wrapper { width: 100%; height: 200px; overflow: hidden; background-color: var(--surface); }
    .card-image { width: 100%; height: 100%; object-fit: cover; }
    .card-body { padding: 2rem; }
    .card-title { font-size: 1.25rem; margin-bottom: 0.75rem; }
    .card-text { color: var(--muted-text); font-size: 0.95rem; }
    .split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .split-layout.no-image { grid-template-columns: 1fr; max-width: 800px; margin: 0 auto; text-align: center; }
    .split-text { font-size: 1.05rem; color: var(--muted-text); margin-bottom: 1.5rem; }
    .split-actions { display: flex; gap: 1rem; margin-top: 2rem; }
    .split-layout.no-image .split-actions { justify-content: center; }
    .split-visual { width: 100%; }
    .visual-card { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; aspect-ratio: 4/3; background-color: var(--surface); }
    .split-image { width: 100%; height: 100%; object-fit: cover; }
    .section-actions { display: flex; justify-content: center; gap: 1rem; margin-top: 3rem; }
    .site-footer { background-color: var(--surface); border-top: 1px solid var(--border); padding: 4rem 2rem 2rem; margin-top: auto; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; margin-bottom: 3rem; }
    .footer-brand h4 { font-size: 1.25rem; margin-bottom: 1rem; }
    .footer-desc { color: var(--muted-text); font-size: 0.9rem; max-width: 320px; }
    .footer-links h5 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; color: var(--text); }
    .footer-links ul { list-style: none; }
    .footer-links li { margin-bottom: 0.75rem; }
    .footer-links a { color: var(--muted-text); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
    .footer-links a:hover { color: var(--primary); }
    .footer-bottom { border-top: 1px solid var(--border); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--muted-text); }
    section, .section-container { opacity: 0; transform: translateY(25px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
    section.revealed, .section-container.revealed { opacity: 1; transform: translateY(0); }
    @media (max-width: 768px) {
      .site-header { padding: 1rem 1.5rem; } .nav-toggle { display: block; }
      .nav-menu { position: fixed; top: 70px; left: 0; right: 0; bottom: 0; background-color: var(--bg); flex-direction: column; padding: 3rem 2rem; gap: 2rem; transform: translateX(100%); transition: transform 0.3s ease-in-out; }
      .nav-menu.open { transform: translateX(0); }
      ${hasHero ? `.hero-section h1 { font-size: 2.25rem; }` : ""}
      .split-layout { grid-template-columns: 1fr; gap: 2rem; }
      .split-layout.no-image { grid-template-columns: 1fr; }
      .split-content { order: 2; } .split-visual { order: 1; }
      .footer-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    }
  </style>
</head>
<body>
  ${navLinks.length > 0 ? `<header class="site-header">
    <a href="#" class="logo">${siteName}</a>
    <button class="nav-toggle" aria-label="Toggle navigation"><span class="hamburger"></span></button>
    <nav class="nav-menu">
      ${navLinks.map(n => `<a href="${n.href}">${n.text}</a>`).join("\n      ")}
      ${navCta ? `<a href="${(navCta as {href:string;text:string}).href}" class="btn">${(navCta as {href:string;text:string}).text}</a>` : ""}
    </nav>
  </header>` : ""}

  ${hasHero ? `<section class="hero-section">
    <div class="hero-container">
      <h1>${heroHeading}</h1>
      ${heroSubtitle ? `<p class="hero-subtitle">${heroSubtitle}</p>` : ""}
      ${heroCta ? `<div class="hero-actions"><a href="${(heroCta as {href:string;text:string}).href}" class="btn btn-lg">${(heroCta as {href:string;text:string}).text}</a></div>` : ""}
      ${heroImg ? `<div class="hero-visual"><img src="${heroImg}" alt="${heroHeading}" class="hero-image" /></div>` : ""}
    </div>
  </section>` : ""}

  ${sectionsHtml}

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h4>${siteName}</h4>
          ${heroDesc ? `<p class="footer-desc">${heroDesc}</p>` : ""}
        </div>
        ${footerLinks.length > 0 ? `<div class="footer-links">
          <h5>Links</h5>
          <ul>${footerLinks.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
        </div>` : ""}
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${siteName}</p>
      </div>
    </div>
  </footer>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const toggle = document.querySelector(".nav-toggle");
      const menu = document.querySelector(".nav-menu");
      if (toggle && menu) { toggle.addEventListener("click", () => { menu.classList.toggle("open"); toggle.classList.toggle("active"); }); }
      const targetSections = document.querySelectorAll("section, .section-container");
      const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }); }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
      targetSections.forEach(s => observer.observe(s));
    });
  </script>
</body>
</html>`;
}

function chooseDesignStyle(
  colors: ColorDef[],
  fonts: { family: string }[],
  effects: InteractiveEffects,
  siteType: string
): string {
  const labels: string[] = [];

  const hasGlass = effects.glassmorphism.length > 0;
  const bgColor = colors.find(c => c.role === "background" || c.role === "surface");
  let isDark = false;
  if (bgColor) {
    const rgb = parseColorToRgb(bgColor.value);
    if (rgb) {
      const [, , l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      isDark = l < 20;
    }
  }

  const colorCount = colors.length;
  const serifFont = fonts.some(f => /serif/i.test(f.family));
  const hasMotion = effects.scrollZoom.length > 0 || effects.microInteractions.length > 0;
  const hasParallax = effects.parallax.length > 0;
  const hasSticky = effects.stickyLayouts.length > 0;
  const hasHorizontal = effects.horizontalScroll.length > 0;

  if (hasGlass) labels.push("Glassmorphism");
  if (isDark) labels.push("Dark Mode");
  if (serifFont) labels.push("Editorial");
  if (hasMotion) labels.push("Kinetic");
  if (hasParallax) labels.push("Parallax Depth");
  if (hasSticky) labels.push("Sticky Navigation");
  if (hasHorizontal) labels.push("Horizontal Scroll");
  if (colorCount <= 3) labels.push("Minimalist");
  if (colorCount >= 5) labels.push("Color-rich");
  if (colorCount >= 8) labels.push("Vibrant Palette");

  const hasRoundedColors = colors.filter(c => {
    const v = c.value.trim().toLowerCase();
    return v.startsWith("#") && v.length >= 7;
  }).length > 0;
  if (!hasGlass && !isDark && !serifFont && !hasMotion && colorCount <= 4) {
    labels.push("Clean Modern");
  }

  if (labels.length === 0) labels.push("Standard Web");

  return labels.join(", ");
}

function detectLayoutIntelligence($: CheerioAPI, rules: Rule[]): string[] {
  const layouts: string[] = [];
  const htmlText = $.html().toLowerCase();

  // Sticky Sidebar
  if (rules.some(r => r.properties["position"] === "sticky" && (r.selector.includes("sidebar") || r.selector.includes("aside") || r.selector.includes("left") || r.selector.includes("right")))) {
    layouts.push("Sticky Sidebar Layout");
  } else if ($("aside[class*=sticky], div[class*=sidebar][class*=sticky], [class*=sticky-col]").length > 0) {
    layouts.push("Sticky Sidebar Layout");
  }

  // Split / Asymmetric Hero
  const heroEl = $("[class*=hero], [id*=hero], [class*=banner], [id*=banner]").first();
  if (heroEl.length > 0) {
    const hasGridOrFlex = heroEl.find("[class*=grid], [class*=flex], [class*=row], [class*=split]").length > 0;
    const hasImg = heroEl.find("img, svg, video, [class*=media], [class*=image]").length > 0;
    const hasText = heroEl.find("h1, h2, p").length > 0;
    if (hasGridOrFlex && hasImg && hasText) {
      layouts.push("Asymmetric Split Hero");
    } else {
      layouts.push("Centered Headline Hero");
    }
  }

  // Alternating Content (Zig-zag)
  const rows = $("div[class*=row], div[class*=grid], section > div");
  let alternatingDetected = false;
  rows.each((_, el) => {
    const cls = $(el).attr("class") || "";
    if (/flex-row-reverse|grid-cols|even:flex-row-reverse|odd:flex-row-reverse|row-reverse/i.test(cls)) {
      alternatingDetected = true;
    }
  });
  if (alternatingDetected || htmlText.includes("row-reverse") || htmlText.includes("flex-row-reverse")) {
    layouts.push("Alternating Grid (Zig-Zag) Sectioning");
  }

  // Timeline Layout
  if ($("[class*=timeline], [id*=timeline], [class*=milestone], [class*=journey]").length > 0) {
    layouts.push("Vertical Chronological Timeline");
  }

  // Masonry Layout
  if ($("[class*=masonry], [class*=brick], [class*=staggered-grid], [id*=masonry]").length > 0) {
    layouts.push("Staggered Masonry Grid");
  }

  // Swiper / Horizontal Scroll snap
  if ($("[class*=swiper], [class*=carousel], [class*=scroll-snap], [class*=slider-track]").length > 0) {
    layouts.push("Horizontal Snap Card Swiper");
  }

  // Editorial Grid (Magazine layouts)
  const hugeText = rules.some(r => {
    const fontSize = r.properties["font-size"];
    if (!fontSize) return false;
    if (fontSize.includes("px")) return parseFloat(fontSize) > 60;
    if (fontSize.includes("rem")) return parseFloat(fontSize) > 4;
    if (fontSize.includes("vw")) return parseFloat(fontSize) > 5;
    return false;
  });
  if (hugeText && $("[class*=editorial], [class*=magazine], [class*=asymmetric]").length > 0) {
    layouts.push("Asymmetric Editorial Magazine Grid");
  }

  if (layouts.length === 0) {
    layouts.push("Standard Linear Grid Layout");
  }

  return layouts;
}

function detectComponentIntelligence($: CheerioAPI, rules: Rule[]): string[] {
  const components: string[] = [];
  const htmlText = $.html().toLowerCase();

  // Mega Menu
  if ($("nav [class*=mega], nav [class*=dropdown-menu], header [class*=mega-menu]").length > 0) {
    components.push("Multi-column Mega Menu");
  }

  // Accordion (FAQ, collapsible)
  if ($("[class*=accordion], [class*=collapse], [class*=faq-item], [data-collapse], details").length > 0) {
    components.push("Collapsible Accordion Panels");
  }

  // Tabs
  if ($("[class*=tabs], [class*=tab-list], [data-tabs], [role=tablist]").length > 0) {
    components.push("Responsive Tabs Panels");
  }

  // Carousel / Slider
  if ($("[class*=carousel], [class*=slider], [class*=slick-], [class*=swiper-wrapper]").length > 0) {
    components.push("Touch-Ready Swiper Carousel");
  }

  // Modal / Dialogue
  if ($("[class*=modal], [class*=dialog], [class*=popup], [id*=modal]").length > 0) {
    components.push("Interactive Modal Overlays");
  }

  // Pricing Table
  const hasPricingTerm = /price|pricing|tier|cost|subscription|billing|\/mo|\/yr/i.test(htmlText);
  const hasCurrencySymbol = /\$|€|£|¥/i.test(htmlText);
  if (hasPricingTerm && hasCurrencySymbol && $("[class*=pricing], [id*=pricing], [class*=plan], [class*=tier]").length > 0) {
    components.push("Structured Pricing Comparison Grid");
  }

  // Testimonial / Reviews
  if ($("[class*=testimonial], [class*=review], [class*=quote], [class*=recommendation]").length > 0) {
    components.push("Customer Testimonial Carousel");
  }

  // FAQ Section
  if ($("[class*=faq], [id*=faq], [class*=frequently-asked]").length > 0) {
    components.push("Frequently Asked Questions (FAQ)");
  }

  // Newsletter Card
  const emails = $("input[type=email], input[name=email], input[placeholder*=email], input[placeholder*=subscribe]");
  if (emails.length > 0 && /subscribe|newsletter|signup|join|newsletter-card/i.test(htmlText)) {
    components.push("Newsletter Subscription Card");
  }

  if (components.length === 0) {
    components.push("Standard Navigation Links", "General Content Primitives");
  }

  return components;
}

function detectStorytellingFlow(sections: { name: string; description: string }[]): { flowType: string; narrative: string } {
  const names = sections.map(s => s.name.toLowerCase()).join(" ");

  if (names.includes("pricing") || names.includes("plan") || names.includes("subscription")) {
    return {
      flowType: "SaaS Product Conversion Flow",
      narrative: "This narrative opens with an attention-grabbing value proposition, displays social validation, details detailed component features, lays out subscription options, addresses FAQs, and resolves with a final push action."
    };
  }

  if (names.includes("portfolio") || names.includes("work") || names.includes("gallery") || names.includes("project") || names.includes("details")) {
    return {
      flowType: "Editorial Showcase Narrative",
      narrative: "An aesthetic-first timeline built for agency and design works. It guides visitors through core mission values, transitions into case grids, displays client logs, and ends with a minimalist contact request."
    };
  }

  if (names.includes("about") || names.includes("mission") || names.includes("team")) {
    return {
      flowType: "Corporate Brand Story",
      narrative: "Focuses on trust-building, showing history milestones, credentials, values, executive team panels, statistics counters, and global footprint cards."
    };
  }

  return {
    flowType: "Standard Editorial Layout",
    narrative: "Guides the viewer linearly from initial brand taglines, showcasing features in grids, providing product previews, and establishing credibility using inline quotes and contacts."
  };
}

function detectAnimationClassifications(rules: Rule[], $: CheerioAPI): string[] {
  const classifications: string[] = [];
  const htmlText = $.html().toLowerCase();

  // Hover Lift
  let hoverLift = false;
  rules.forEach(r => {
    if (r.selector.includes(":hover")) {
      const transform = r.properties["transform"] || "";
      const translateY = r.properties["translate-y"] || "";
      if (transform.includes("translateY") || transform.includes("translate3d") || translateY.startsWith("-")) {
        hoverLift = true;
      }
    }
  });
  if (hoverLift) {
    classifications.push("Hover Elastic Lift (translateY)");
  }

  // Text Stagger
  if (htmlText.includes("delay-") || htmlText.includes("stagger") || rules.some(r => r.properties["animation-delay"] || r.properties["transition-delay"])) {
    classifications.push("Staggered Text Animation Delay");
  }

  // Image Zoom
  let imgZoom = false;
  rules.forEach(r => {
    if (r.selector.includes("hover") && (r.selector.includes("img") || r.selector.includes("image") || r.selector.includes("picture") || r.selector.includes("media") || r.selector.includes("bg") || r.selector.includes("card") || r.selector.includes("zoom"))) {
      const transform = r.properties["transform"] || "";
      if (transform.includes("scale(")) {
        imgZoom = true;
      }
    }
  });
  if (imgZoom) {
    classifications.push("Hover Zoom Image Parallax Scale");
  }

  // Infinite Marquee
  if ($("[class*=marquee], marquee, [class*=ticker]").length > 0 || htmlText.includes("marquee") || htmlText.includes("ticker")) {
    classifications.push("Infinite Text/Asset Marquee Rails");
  }

  // Custom Cursor
  if ($("[class*=cursor], [id*=cursor], [data-cursor]").length > 0 || rules.some(r => r.properties["cursor"] && r.properties["cursor"] !== "auto" && r.properties["cursor"] !== "pointer" && r.properties["cursor"] !== "default")) {
    classifications.push("Trailing Custom Canvas Cursor Overlay");
  }

  // 3D Depth Tilt
  if (htmlText.includes("perspective") || rules.some(r => r.properties["perspective"] || r.properties["transform-style"] === "preserve-3d")) {
    classifications.push("3D Depth Perspective Card Tilt");
  }

  // Scroll Zoom
  if (htmlText.includes("zoom") || rules.some(r => r.selector.includes("scroll") && r.properties["transform"] && r.properties["transform"].includes("scale"))) {
    classifications.push("Scroll-Bound Zoom Elements");
  }

  if (classifications.length === 0) {
    classifications.push("Intersection Observer Scroll Reveal");
  }

  return classifications;
}

function generateThreeParagraphPrompt(
  $: CheerioAPI,
  siteName: string,
  siteType: string,
  style: string,
  colors: ColorDef[],
  sections: { name: string; description: string }[]
): string {
  const styleStr = style.toLowerCase();

  // Evidence-based color list — ONLY extracted values, no defaults
  const colorVals = colors.map(c => c.value).filter(Boolean);
  const colorSentence = colorVals.length > 0
    ? `The color palette uses: ${colorVals.slice(0, 6).join(', ')}.`
    : 'Color palette could not be fully extracted from the stylesheets.';

  // Headings from DOM
  const rawH1s = $("h1, h2, h3").map((_, el) => $(el).text().trim().replace(/\s+/g, " ")).get().filter(t => t.length > 5 && t.length < 150);
  const featuredHeadings = rawH1s.slice(0, 3);
  const brandKeywords = featuredHeadings.length > 0
    ? `Key headings include: "${featuredHeadings.join('", "')}".`
    : '';

  // Section summary — ONLY detected sections
  const sectionSummary = sections.length > 0
    ? `The layout flows through: ${sections.map(s => s.name).join(" → ")}.`
    : '';

  // Detect real effects from CSS
  const cssText = extractCSSText($.html()).toLowerCase();
  const hasParallax = cssText.includes("background-attachment: fixed");
  const hasGlass = cssText.includes("backdrop-filter") || cssText.includes("backdrop-filter: blur");
  const hasSticky = cssText.includes("position: sticky");
  const hasAnimations = cssText.includes("@keyframes");
  const hasTransitions = cssText.includes("transition:");

  // Effect hints — ONLY from real CSS
  const effectNotes: string[] = [];
  if (hasParallax) effectNotes.push("Parallax background scrolling is used.");
  if (hasGlass) effectNotes.push("Backdrop-filter blur effects (glassmorphism) are present.");
  if (hasSticky) effectNotes.push("Sticky/fixed positioning is used for navigation or elements.");

  const p1 = `For this site replication, we adopt a ${style} design approach to recreate ${siteName} (${siteType.replace(/_/g, " ")}). ${colorSentence} ${brandKeywords}`.trim();

  const p2 = `${sectionSummary} ${effectNotes.join(" ")} ${hasAnimations ? "CSS @keyframes animations are present." : "No CSS animations were detected in the extracted stylesheets."} ${hasTransitions ? "CSS transitions are used for interactive elements." : "No CSS transitions were detected."}`.trim();

  const p3 = `This replica follows a ${styleStr}-inspired layout with${colorVals.length > 0 ? ` ${colorVals.length} extracted colors` : ""}${sections.length > 0 ? ` and ${sections.length} detected sections` : ""}. Responsive behavior is based on the breakpoints found in the site's CSS media queries.`;

  return [p1, p2, p3].filter(Boolean).join("\n\n");
}

/* ─────────────────────────────────────────────────────────────
   Named Effect Fingerprinter — identifies specific animation
   techniques by their canonical industry names
   ───────────────────────────────────────────────────────────── */

type NamedEffect = {
  name: string;
  description: string;
  category: "scroll" | "hover" | "load" | "cursor" | "layout" | "css-art";
};

function detectNamedEffects(
  $: CheerioAPI,
  animations: AnimDetail[],
  effects: InteractiveEffects,
  scrollLibs: string[],
  rules: Rule[],
): NamedEffect[] {
  const found: NamedEffect[] = [];
  const html = $.html();
  const htmlLower = html.toLowerCase();
  const cssText = extractCSSText(html);
  const cssLower = cssText.toLowerCase();

  /* ── Scroll Animation Libraries ── */
  if (scrollLibs.includes("AOS (Animate on Scroll)") || /data-aos/.test(htmlLower)) {
    found.push({
      name: "AOS (Animate on Scroll) — data-aos attribute system",
      description: "Elements carry `data-aos=\"fade-up\"` / `data-aos=\"zoom-in\"` attributes. On scroll, AOS adds `.aos-animate` class triggering CSS transitions. Replicate with: `import AOS from 'aos'; AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true });` and add `data-aos=\"fade-up\" data-aos-delay=\"100\"` to section elements.",
      category: "scroll",
    });
  }

  if (scrollLibs.includes("GSAP (ScrollTrigger)") || /scrolltrigger|gsap\.to/i.test(html)) {
    found.push({
      name: "GSAP ScrollTrigger — pinned section scrollytelling",
      description: "Uses `gsap.to(element, { scrollTrigger: { trigger, start: 'top center', pin: true, scrub: 1 }, y: -100, opacity: 0 })`. Sections are pinned in the viewport while content animates on scrub. Replicate with GSAP + ScrollTrigger plugin: pin hero section, use `scrub: 1.5` for smooth playback, and `markers: false` in production.",
      category: "scroll",
    });
  }

  if (scrollLibs.includes("ScrollReveal") || /scrollreveal/i.test(html)) {
    found.push({
      name: "ScrollReveal.js — programmatic reveal animations",
      description: "Uses `ScrollReveal().reveal('.element', { delay: 200, distance: '50px', duration: 800, origin: 'bottom', interval: 100 })`. Each element fades in from specified origin on scroll. Replicate with: `import ScrollReveal from 'scrollreveal'` and call `.reveal()` on container selectors with staggered interval values.",
      category: "scroll",
    });
  }

  if (scrollLibs.includes("Framer Motion") || /motion\.div|animatepresence/i.test(html)) {
    found.push({
      name: "Framer Motion — layout animations & AnimatePresence",
      description: "Uses `<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}>`. AnimatePresence wraps exit animations. Replicate using `whileInView` prop with `viewport={{ once: true, margin: '-100px' }}`.",
      category: "scroll",
    });
  }

  if (scrollLibs.includes("Lottie animations") || /lottie|bodymovin/i.test(htmlLower)) {
    found.push({
      name: "Lottie / Bodymovin — JSON vector animation playback",
      description: "Animated JSON files exported from After Effects via bodymovin plugin. Renders via `lottie-web` or `@lottiefiles/react-lottie-player`. Replicate with: `<Player src={animationJson} autoplay loop />`. Use LottieFiles.com to source similar motion designs if originals are unavailable.",
      category: "load",
    });
  }

  if (scrollLibs.includes("Intersection Observer API") || /intersectionobserver/i.test(html)) {
    found.push({
      name: "IntersectionObserver API — vanilla scroll reveal",
      description: "Native browser API: `new IntersectionObserver((entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.1 })`. Elements have base CSS `opacity: 0; transform: translateY(30px); transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1)` and `.visible` class applies `opacity: 1; transform: translateY(0)`.",
      category: "scroll",
    });
  }

  /* ── CSS Keyframe Animation Techniques ── */
  const kfText = cssText;
  const kfNames = (kfText.match(/@keyframes\s+(\w+)/g) || []).map(m => m.replace(/@keyframes\s+/, ""));

  for (const kfName of kfNames) {
    const kfLower = kfName.toLowerCase();
    if (/fadeup|fade.up|slidein|slide.in|appear/.test(kfLower)) {
      found.push({
        name: `CSS @keyframes "${kfName}" — fade-up scroll reveal`,
        description: `Keyframe animation: @keyframes ${kfName} { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }. Applied via animation: ${kfName} 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards on the animated class. Use animation-play-state: paused until IntersectionObserver fires.`,
        category: "scroll",
      });
      break;
    }
  }

  for (const kfName of kfNames) {
    const kfLower = kfName.toLowerCase();
    if (/marquee|ticker|scroll.text|infinite.scroll/.test(kfLower)) {
      found.push({
        name: `CSS @keyframes "${kfName}" — infinite typography marquee`,
        description: `Endless horizontal scroll ticker: @keyframes ${kfName} { from { transform: translateX(0); } to { transform: translateX(-50%); } }. Apply to a wrapper containing two identical copies of text side by side with animation: ${kfName} 20s linear infinite. The dual-copy trick creates seamless infinite looping.`,
        category: "layout",
      });
      break;
    }
  }

  for (const kfName of kfNames) {
    const kfLower = kfName.toLowerCase();
    if (/spin|rotate|orbit/.test(kfLower)) {
      found.push({
        name: `CSS @keyframes "${kfName}" — continuous rotation`,
        description: `Spinning animation: @keyframes ${kfName} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }. Applied as loading spinner or decorative rotating icon with animation: ${kfName} 2s linear infinite.`,
        category: "load",
      });
      break;
    }
  }

  for (const kfName of kfNames) {
    const kfLower = kfName.toLowerCase();
    if (/float|bob|levitate/.test(kfLower)) {
      found.push({
        name: `CSS @keyframes "${kfName}" — floating/bobbing element`,
        description: `Subtle up-down floating motion: @keyframes ${kfName} { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }. Applied to hero images or decorative elements with animation: ${kfName} 3s ease-in-out infinite for organic, living feel.`,
        category: "css-art",
      });
      break;
    }
  }

  for (const kfName of kfNames) {
    const kfLower = kfName.toLowerCase();
    if (/pulse|glow|breathe/.test(kfLower)) {
      found.push({
        name: `CSS @keyframes "${kfName}" — pulsing glow effect`,
        description: `Glowing pulse: @keyframes ${kfName} { 0%, 100% { box-shadow: 0 0 0 0 rgba(primary, 0.4); } 50% { box-shadow: 0 0 0 12px rgba(primary, 0); } }. Used on CTA buttons or status indicators to draw attention with animation: ${kfName} 2s ease infinite.`,
        category: "css-art",
      });
      break;
    }
  }

  /* ── CSS Layout & Visual Techniques ── */
  const hasClipPath = rules.some(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"]);
  if (hasClipPath) {
    const clipVals = rules.filter(r => r.properties["clip-path"]).map(r => r.properties["clip-path"]).slice(0, 2);
    found.push({
      name: "CSS clip-path polygon reveal",
      description: `Custom geometric shape masking: clip-path: ${clipVals[0] || "polygon(0 0, 100% 0, 100% 85%, 0 100%)"}. Used for diagonal section dividers, angled hero images, or animated mask reveals (animating clip-path from inset(0 100% 0 0) to inset(0 0% 0 0) creates a wipe-in reveal). Detected on: ${rules.filter(r => r.properties["clip-path"]).slice(0, 3).map(r => r.selector).join(", ")}.`,
      category: "css-art",
    });
  }

  const hasBackdropBlur = rules.some(r => (r.properties["backdrop-filter"] || r.properties["-webkit-backdrop-filter"] || "").includes("blur"));
  if (hasBackdropBlur || effects.glassmorphism.length > 0) {
    const blurVal = rules.find(r => r.properties["backdrop-filter"]?.includes("blur"))?.properties["backdrop-filter"] || "blur(12px)";
    found.push({
      name: "Glassmorphism — frosted glass panel (backdrop-filter: blur)",
      description: `Frosted glass effect on card/nav elements: background: rgba(255,255,255,0.08); backdrop-filter: ${blurVal}; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px. Requires a visually rich background behind the element for the blur to be visible. Detected on: ${effects.glassmorphism.slice(0, 2).join(", ")}.`,
      category: "css-art",
    });
  }

  const hasPerspective = cssLower.includes("perspective") || cssLower.includes("transform-style: preserve-3d") || cssLower.includes("rotatex") || cssLower.includes("rotatey");
  if (hasPerspective) {
    found.push({
      name: "CSS 3D perspective transform — depth card tilt",
      description: "3D perspective card effect using: `transform-style: preserve-3d; perspective: 1000px`. On hover, child elements rotate: `transform: rotateX(5deg) rotateY(-5deg) translateZ(20px)`. Use JavaScript mousemove listener to map cursor position to rotation angles for interactive tilt. Often combined with `transition: transform 0.3s ease`.",
      category: "hover",
    });
  }

  const hasScrollSnap = cssLower.includes("scroll-snap-type") || effects.horizontalScroll.length > 0;
  if (hasScrollSnap) {
    const snapType = rules.find(r => r.properties["scroll-snap-type"])?.properties["scroll-snap-type"] || "x mandatory";
    found.push({
      name: "CSS Scroll Snap — horizontal card carousel",
      description: "Native CSS scroll snapping for touch-friendly carousels: container uses overflow-x: auto; scroll-snap-type: " + snapType + "; display: flex; gap: 1rem. Each child item has scroll-snap-align: start; flex-shrink: 0; width: clamp(280px, 80vw, 400px). No JavaScript required for basic snap behavior. Add scroll buttons for desktop UX.",
      category: "scroll",
    });
  }

  /* ── Custom Cursor ── */
  const hasCustomCursor = $("[class*=cursor], [id*=cursor], [data-cursor]").length > 0 || rules.some(r => r.properties["cursor"] && !["auto", "pointer", "default", "text", "crosshair"].includes(r.properties["cursor"]));
  if (hasCustomCursor) {
    found.push({
      name: "Custom cursor overlay — spring-lag mouse follower",
      description: "A `<div class='custom-cursor'>` element (20×20px filled circle + 40×40px ring) positioned absolutely and follows mouse with spring inertia. JS: `document.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; })`. Use CSS `transition: left 0.1s ease, top 0.1s ease` for lag effect. Apply `mix-blend-mode: difference` for visual contrast.",
      category: "cursor",
    });
  }

  /* ── Parallax ── */
  if (effects.parallax.length > 0 || rules.some(r => r.properties["background-attachment"] === "fixed")) {
    found.push({
      name: "CSS background-attachment: fixed — parallax scroll depth",
      description: "Background images on sections use `background-attachment: fixed; background-size: cover; background-position: center`. This causes the background to scroll slower than the foreground content, creating a natural parallax depth illusion — zero JS required. Note: disabled on iOS Safari (`-webkit-overflow-scrolling: touch` conflicts).",
      category: "scroll",
    });
  }

  /* ── Tailwind animations ── */
  if (scrollLibs.includes("Tailwind CSS animations") || /animate-spin|animate-pulse|animate-bounce|animate-ping/.test(htmlLower)) {
    const detected = [];
    if (/animate-spin/.test(htmlLower)) detected.push("animate-spin (loading spinners)");
    if (/animate-pulse/.test(htmlLower)) detected.push("animate-pulse (skeleton loading states)");
    if (/animate-bounce/.test(htmlLower)) detected.push("animate-bounce (attention arrows)");
    if (/animate-ping/.test(htmlLower)) detected.push("animate-ping (notification badges)");
    found.push({
      name: "Tailwind CSS built-in animations",
      description: "Uses Tailwind utility animation classes: " + detected.join(", ") + ". Pre-defined @keyframes in Tailwind CSS. Use [animation-duration:2s] arbitrary value or extend theme.animation in tailwind.config.js.",
      category: "css-art",
    });
  }

  /* ── Loading / entrance animations ── */
  const hasStagger = cssLower.includes("animation-delay") || htmlLower.includes("stagger") || htmlLower.includes("animation-delay");
  if (hasStagger) {
    found.push({
      name: "Staggered animation-delay entrances",
      description: "Items appear sequentially via CSS animation-delay: `nth-child(1) { animation-delay: 0ms } nth-child(2) { animation-delay: 100ms } nth-child(3) { animation-delay: 200ms }`. Creates a cascade effect. In React, use array index × 100ms as inline style: `style={{ animationDelay: \`${index * 100}ms\` }}`.",
      category: "load",
    });
  }

  /* ── Text Effects ── */
  const hasTextGradient = cssLower.includes("background-clip: text") || cssLower.includes("-webkit-background-clip: text");
  if (hasTextGradient) {
    found.push({
      name: "CSS gradient text — webkit-background-clip: text",
      description: "Text filled with a gradient: `background: linear-gradient(135deg, #primary, #accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text`. Apply to `<h1>` or highlighted keywords. Combine with `background-size: 200%` and `background-position` animation for a shifting gradient shimmer effect.",
      category: "css-art",
    });
  }

  const hasTextShadow = rules.some(r => r.properties["text-shadow"]);
  if (hasTextShadow) {
    const firstShadow = rules.find(r => r.properties["text-shadow"])?.properties["text-shadow"];
    found.push({
      name: "CSS text-shadow — glow/depth text treatment",
      description: `Text shadow applied for depth or glow effect: text-shadow: ${firstShadow || "0 2px 4px rgba(0,0,0,0.3)"}. For a neon glow effect, stack multiple text-shadows: 0 0 10px #primary, 0 0 20px #primary, 0 0 40px #primary. For editorial depth, use dark subtle shadow with slight offset.`,
      category: "css-art",
    });
  }

  /* ── Sticky / Pinned elements ── */
  if (effects.stickyLayouts.length > 0) {
    found.push({
      name: "CSS position: sticky — pinned navigation header",
      description: `Sticky nav element: position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); background: rgba(bg, 0.8). As user scrolls, the header stays pinned and the frosted glass effect becomes visible. For scroll-direction-aware hide/show, use an IntersectionObserver sentinel div at the top: hide header when sentinel is not intersecting.`,
      category: "layout",
    });
  }

  /* ── Marquee/Ticker ── */
  if ($("[class*=marquee], marquee, [class*=ticker]").length > 0 || kfNames.some(k => /marquee|ticker/.test(k.toLowerCase()))) {
    found.push({
      name: "Infinite marquee ticker — CSS translate loop",
      description: "Dual-clone technique: render content twice inside a flex container with class 'track' containing two 'content' divs. Apply @keyframes marquee { to { transform: translateX(-50%); } } with animation: marquee 20s linear infinite on the track. Pause on hover with :hover { animation-play-state: paused }. Width of .content = 50% of .track.",
      category: "layout",
    });
  }

  /* ── Noise / grain overlay ── */
  if (cssLower.includes("noise") || cssLower.includes("grain") || htmlLower.includes("noise") || htmlLower.includes("grain-texture")) {
    found.push({
      name: "CSS noise/grain texture overlay — film grain effect",
      description: "SVG filter-based grain or PNG noise overlay using `filter: url(#noise)` or a pseudo-element: `::after { content: ''; position: fixed; inset: 0; background: url(\"noise.png\"); opacity: 0.03; pointer-events: none; mix-blend-mode: overlay; }`. For CSS-only grain, use an SVG `<feTurbulence>` filter: `<filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.65' stitchTiles='stitch'/></filter>`.",
      category: "css-art",
    });
  }
  return found.slice(0, 12);
}

function rgbToHslLine(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    switch (mx) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const c = hex.trim().toLowerCase();
  if (c.startsWith('#')) {
    let h = c.slice(1);
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    if (h.length >= 6) {
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
  }
  if (c.startsWith('rgb')) {
    const m = c.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }
  return null;
}

function toTailwindRadius(radius: string): string {
  const num = parseFloat(radius);
  if (isNaN(num)) return 'rounded-none';
  if (num <= 2) return 'rounded-sm';
  if (num <= 4) return 'rounded';
  if (num <= 6) return 'rounded-md';
  if (num <= 8) return 'rounded-lg';
  if (num <= 12) return 'rounded-xl';
  if (num <= 16) return 'rounded-2xl';
  if (num <= 24) return 'rounded-3xl';
  return 'rounded-full';
}

function toTailwindPadding(padding: string): string {
  const p = parseFloat(padding);
  if (isNaN(p)) return 'p-4';
  if (p <= 2) return 'p-0.5';
  if (p <= 4) return 'p-1';
  if (p <= 8) return 'p-2';
  if (p <= 12) return 'p-3';
  if (p <= 16) return 'p-4';
  if (p <= 20) return 'p-5';
  if (p <= 24) return 'p-6';
  if (p <= 32) return 'p-8';
  if (p <= 40) return 'p-10';
  return 'p-12';
}

function twHintForComponent(name: string, details: string): string {
  const lower = name.toLowerCase();
  const d = details.toLowerCase();
  const parts: string[] = [];

  if (lower.includes("button") || lower.includes("btn")) {
    const bgMatch = details.match(/bg:\s*(#[0-9a-fA-F]+|[a-zA-Z]+)/);
    const radiusMatch = details.match(/radius:\s*([0-9.]+px|[0-9.]+rem)/);
    const hoverTransform = details.match(/transform:\s*([^;]+)/);
    if (bgMatch) parts.push(`bg-[${bgMatch[1]}]`);
    if (radiusMatch) parts.push(toTailwindRadius(radiusMatch[1]));
    if (hoverTransform) parts.push("hover:scale-[1.03]");
    else parts.push("hover:opacity-90");
    parts.push("transition-all duration-200");
  } else if (lower.includes("card")) {
    const shadowMatch = details.match(/shadow:\s*(#[0-9a-fA-F]+|[a-zA-Z]+)/);
    const radiusMatch = details.match(/radius:\s*([0-9.]+px|[0-9.]+rem)/);
    const hoverLift = details.includes("lift");
    if (radiusMatch) parts.push(toTailwindRadius(radiusMatch[1]));
    if (shadowMatch) parts.push("shadow-md");
    else parts.push("shadow-sm");
    if (hoverLift) parts.push("hover:-translate-y-1 hover:shadow-lg transition-all");
  } else if (lower.includes("navigation") || lower.includes("nav")) {
    if (d.includes("sticky")) parts.push("sticky top-0 z-50");
    if (d.includes("hamburger") || d.includes("mobile")) parts.push("md:flex hidden");
    parts.push("flex items-center gap-6");
  } else if (lower.includes("link")) {
    parts.push("text-[color] hover:underline transition-colors");
  } else if (lower.includes("image") || lower.includes("img")) {
    if (d.includes("cover")) parts.push("object-cover");
    if (d.includes("rounded")) parts.push("rounded-lg");
  } else if (lower.includes("form") || lower.includes("input")) {
    parts.push("rounded-md border px-3 py-2 focus:ring-2 focus:ring-primary");
  } else if (lower.includes("list")) {
    parts.push("list-disc list-inside space-y-1");
  } else if (lower.includes("icon")) {
    parts.push("w-5 h-5 inline-block");
  } else if (lower.includes("avatar")) {
    parts.push("rounded-full w-10 h-10 object-cover");
  } else if (lower.includes("table")) {
    parts.push("w-full border-collapse");
  } else if (lower.includes("modal") || lower.includes("dialog") || lower.includes("overlay")) {
    parts.push("fixed inset-0 z-50 flex items-center justify-center");
  } else if (lower.includes("media") || lower.includes("embed") || lower.includes("video")) {
    parts.push("w-full aspect-video");
  }

  return parts.length > 0 ? `\`${parts.join(" ")}\`` : "";
}

/* ─────────────────────────────────────────────────────────────
   Scene Graph / Narrative Storyboard Generator
   ───────────────────────────────────────────────────────────── */
type Scene = {
  id: number;
  name: string;
  type: "hero" | "feature" | "transition" | "pinned" | "cta" | "footer";
  importance: 1 | 2 | 3 | 4 | 5;
  elements: string[];
  transition: string;
  layers: string[];
  spatialHints: string[];
};

/* ─────────────────────────────────────────────────────────────
   Rich Font Detail Extraction
   ───────────────────────────────────────────────────────────── */
type RichFontDetails = {
  family: string;
  fallbackStack: string[];
  source: "@font-face" | "google-fonts" | "system" | "external";
  fontWeight: string;
  fontStyle: string;
  fontDisplay: string;
  isVariable: boolean;
  letterSpacing: string;
  lineHeight: string;
  textTransform: string;
  usage: string;
  unicodeRange: string;
};

function extractRichFontDetails(
  fonts: { family: string; usage: string; weight: string; size: string }[],
  $: CheerioAPI,
  rules: Rule[],
  fontDetails?: any
): RichFontDetails[] {
  const results: RichFontDetails[] = [];
  const seenFamilies = new Set<string>();

  // If we have fontDetails from Playwright, use those first
  const fontFaces = fontDetails?.fontFaces || [];
  const fontSamples = fontDetails?.fontSamples || [];
  const loadedFonts = fontDetails?.loadedFonts || [];

  // Build a map of font family -> font-face details
  const fontFaceMap = new Map<string, { fontWeight: string; fontStyle: string; fontDisplay: string }>();
  for (const ff of fontFaces) {
    const family = ff.family.replace(/["']/g, "");
    if (!fontFaceMap.has(family)) {
      fontFaceMap.set(family, { fontWeight: ff.fontWeight, fontStyle: ff.fontStyle, fontDisplay: ff.fontDisplay || "auto" });
    }
  }

  // Build a map of selector -> font sample
  const sampleMap = new Map<string, { fontFamily: string; fontSize: string; fontWeight: string; fontStyle: string; letterSpacing: string; lineHeight: string; textTransform: string }>();
  for (const s of fontSamples) {
    sampleMap.set(s.selector, s);
  }

  // Detect Google Fonts from <link> tags
  const googleFontFamilies = new Set<string>();
  $('link[rel="stylesheet"][href*="fonts.googleapis"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const familyMatch = href.match(/family=([^&]+)/);
    if (familyMatch) {
      const name = decodeURIComponent(familyMatch[1]).replace(/:.*$/, "").replace(/\+/g, " ");
      googleFontFamilies.add(name);
    }
  });

  // Also detect from hrefs in the html
  const htmlText = $.html();
  const gfRegex = /fonts\.googleapis\.com\/css2?\?family=([^&"']+)/g;
  let gfMatch;
  while ((gfMatch = gfRegex.exec(htmlText)) !== null) {
    const name = decodeURIComponent(gfMatch[1]).replace(/:.*$/, "").replace(/\+/g, " ");
    googleFontFamilies.add(name);
  }

  // Process each font from the existing extraction
  for (const f of fonts) {
    const family = f.family;
    if (seenFamilies.has(family)) continue;
    seenFamilies.add(family);

    // Determine source
    let source: "@font-face" | "google-fonts" | "system" | "external" = "external";
    const isGoogleFont = googleFontFamilies.has(family);
    const hasFontFace = fontFaceMap.has(family);
    if (hasFontFace) source = "@font-face";
    else if (isGoogleFont) source = "google-fonts";
    else if (/^system-ui|sans-serif|serif|monospace|arial|helvetica|times|georgia|courier/i.test(family)) source = "system";

    const fontFaceDetails = fontFaceMap.get(family);

    // Find fallback stack from CSS rules
    const fallbackStack: string[] = [];
    for (const r of rules) {
      const ff = r.properties["font-family"];
      if (ff && ff.includes(family)) {
        const families = ff.split(",").map(s => s.trim().replace(/["']/g, ""));
        const idx = families.findIndex(f => f === family);
        if (idx >= 0 && idx < families.length - 1) {
          families.slice(idx + 1).forEach(fb => {
            if (!fallbackStack.includes(fb)) fallbackStack.push(fb);
          });
        }
      }
    }

    // Find letter-spacing, line-height, text-transform from CSS rules using this font
    let letterSpacing = "";
    let lineHeight = "";
    let textTransform = "";
    for (const r of rules) {
      const ff = r.properties["font-family"];
      if (ff && ff.includes(family)) {
        if (!letterSpacing && r.properties["letter-spacing"]) letterSpacing = r.properties["letter-spacing"];
        if (!lineHeight && r.properties["line-height"]) lineHeight = r.properties["line-height"];
        if (!textTransform && r.properties["text-transform"]) textTransform = r.properties["text-transform"];
      }
    }

    // Check if variable font from @font-face src
    const isVariable = htmlText.includes(family) && /variable|opsz|wght/i.test(htmlText);

    results.push({
      family,
      fallbackStack: fallbackStack.slice(0, 3),
      source,
      fontWeight: fontFaceDetails?.fontWeight || f.weight || "400",
      fontStyle: fontFaceDetails?.fontStyle || "normal",
      fontDisplay: fontFaceDetails?.fontDisplay || "auto",
      isVariable,
      letterSpacing: letterSpacing || "normal",
      lineHeight: lineHeight || "normal",
      textTransform: textTransform || "none",
      usage: f.usage,
      unicodeRange: "",
    });
  }

  // Also add font-face fonts not in the regular fonts list
  for (const ff of fontFaces) {
    const family = ff.family.replace(/["']/g, "");
    if (seenFamilies.has(family)) continue;
    seenFamilies.add(family);

    // Find usage from sample map
    let usage = "Custom font";
    for (const [sel, sample] of sampleMap) {
      if (sample.fontFamily.includes(family)) {
        usage = `Used in ${sel}`;
        break;
      }
    }

    // Find letter-spacing from sample
    let letterSpacing = "normal";
    let lineHeight = "normal";
    let textTransform = "none";
    let fontWeight = ff.fontWeight || "400";
    let fontStyle = ff.fontStyle || "normal";
    for (const [sel, sample] of sampleMap) {
      if (sample.fontFamily.includes(family)) {
        if (sample.letterSpacing && sample.letterSpacing !== "normal") letterSpacing = sample.letterSpacing;
        if (sample.lineHeight && sample.lineHeight !== "normal") lineHeight = sample.lineHeight;
        if (sample.textTransform && sample.textTransform !== "none") textTransform = sample.textTransform;
        if (sample.fontWeight) fontWeight = sample.fontWeight;
        if (sample.fontStyle) fontStyle = sample.fontStyle;
        break;
      }
    }

    results.push({
      family,
      fallbackStack: [],
      source: "@font-face",
      fontWeight,
      fontStyle,
      fontDisplay: ff.fontDisplay || "auto",
      isVariable: false,
      letterSpacing,
      lineHeight,
      textTransform,
      usage,
      unicodeRange: ff.unicodeRange || "",
    });
  }

  return results.slice(0, 10);
}

/* ─────────────────────────────────────────────────────────────
   Scroll Timeline Builder — reconstructs the exact scroll experience
   ───────────────────────────────────────────────────────────── */
type ScrollTimelineEntry = {
  scrollPercent: number;
  action: "enter" | "exit" | "animate" | "pin" | "unpin" | "reveal" | "parallax";
  elementTag: string;
  elementText: string;
  className: string;
  detail: string;
};

type ScrollBehaviorProfile = {
  hasPinnedElements: boolean;
  hasParallax: boolean;
  hasFadeReveals: boolean;
  hasSlideReveals: boolean;
  hasScaleReveals: boolean;
  hasHorizontalScroll: boolean;
  hasImageSequence: boolean;
  hasStickyNavigation: boolean;
  hasClipPathTransitions: boolean;
  hasCrossfadeTransitions: boolean;
  estimatedScrollDuration: string;
  animationTriggerType: "viewport-enter" | "scroll-progress" | "hover" | "none";
  scrollNarrativeFlow: string;
  pinnedRegionDescription: string;
  totalDistinctAnimations: number;
};

function buildScrollTimeline(
  scrollTimeline?: any,
  animations?: AnimDetail[],
  transitions?: TransitionDetail[],
  rules?: Rule[],
  $?: CheerioAPI
): { timeline: ScrollTimelineEntry[]; behaviorProfile: ScrollBehaviorProfile } {
  const timeline: ScrollTimelineEntry[] = [];
  const profile: ScrollBehaviorProfile = {
    hasPinnedElements: false,
    hasParallax: false,
    hasFadeReveals: false,
    hasSlideReveals: false,
    hasScaleReveals: false,
    hasHorizontalScroll: false,
    hasImageSequence: false,
    hasStickyNavigation: false,
    hasClipPathTransitions: false,
    hasCrossfadeTransitions: false,
    estimatedScrollDuration: "3-5s",
    animationTriggerType: "none",
    scrollNarrativeFlow: "Linear scroll — no scroll-triggered animations detected",
    pinnedRegionDescription: "No pinned/parallax regions detected",
    totalDistinctAnimations: 0,
  };

  const hasFadeAnim = animations?.some(a => /fade|opacity/i.test(a.name)) || false;
  const hasSlideAnim = animations?.some(a => /slide|translate|move|up|down|left|right/i.test(a.name)) || false;
  const hasScaleAnim = animations?.some(a => /scale|zoom|grow|shrink/i.test(a.name)) || false;

  if (scrollTimeline) {
    const { atEntry, pinnedElements, elementTransitions, scrollPercentages } = scrollTimeline;

    // Pinned elements
    if (pinnedElements && pinnedElements.length > 0) {
      profile.hasPinnedElements = true;
      profile.pinnedRegionDescription = pinnedElements.slice(0, 3).map((p: any) =>
        `${p.tagName} "${p.text}" pinned (topRange=${p.topRange}px${p.isPositionFixed ? ", fixed position" : p.isPositionSticky ? ", sticky" : ""})`
      ).join("; ");
      pinnedElements.slice(0, 4).forEach((p: any) => {
        timeline.push({ scrollPercent: 0, action: "pin", elementTag: p.tagName, elementText: p.text, className: p.className || "", detail: `Pinned element — stays in viewport while rest scrolls` });
      });
    }

    // Element transitions from scroll
    if (elementTransitions) {
      for (const et of elementTransitions.slice(0, 20)) {
        const opacityChanged = Math.abs((et.opacityAtEnter || 1) - (et.opacityAtExit || 1)) > 0.2;
        const transformChanged = et.transformAtEnter !== et.transformAtExit && et.transformAtEnter !== "none";
        const topChanged = Math.abs(et.topAtEnter - et.topAtExit) > 50;

        if (opacityChanged) {
          const dir = (et.opacityAtExit || 0) > (et.opacityAtEnter || 0) ? "fade in" : "fade out";
          timeline.push({
            scrollPercent: et.scrollPercentEnter || 0,
            action: "reveal",
            elementTag: et.tagName,
            elementText: et.text || "",
            className: et.className || "",
            detail: `${dir}: opacity ${parseFloat(et.opacityAtEnter || 1).toFixed(2)} → ${parseFloat(et.opacityAtExit || 1).toFixed(2)} (scroll ${et.scrollPercentEnter}% → ${et.scrollPercentExit}%)`,
          });
          profile.hasFadeReveals = true;
        }
        if (transformChanged && et.transformAtExit !== "none") {
          const transformDesc = et.transformAtExit?.slice(0, 50) || "";
          timeline.push({
            scrollPercent: et.scrollPercentEnter || 0,
            action: "animate",
            elementTag: et.tagName,
            elementText: et.text || "",
            className: et.className || "",
            detail: `transform: ${transformDesc}`,
          });
          if (transformDesc.includes("scale")) profile.hasScaleReveals = true;
          if (transformDesc.includes("translate") || transformDesc.includes("matrix")) profile.hasSlideReveals = true;
          if (transformDesc.includes("translateX") || transformDesc.includes("matrix") && /-?\d+.*0$/.test(et.transformAtExit)) {
            profile.hasHorizontalScroll = true;
          }
        }
        if (topChanged && !opacityChanged && !transformChanged) {
          profile.hasParallax = true;
        }
      }
    }

    // Scroll percentage transitions (keyframes of scroll)
    if (scrollPercentages) {
      const entryEvents = scrollPercentages.filter((sp: any) => sp.entering && sp.entering.length > 0);
      const exitEvents = scrollPercentages.filter((sp: any) => sp.exiting && sp.exiting.length > 0);
      for (const sp of scrollPercentages.slice(0, 25)) {
        if (sp.activeTransitions && sp.activeTransitions.length > 0) {
          sp.activeTransitions.slice(0, 2).forEach((at: string) => {
            timeline.push({ scrollPercent: sp.scrollPercent, action: "animate", elementTag: "", elementText: "", className: "", detail: at });
          });
        }
      }

      if (entryEvents.length >= 3) {
        profile.hasFadeReveals = true;
        profile.animationTriggerType = "viewport-enter";
      }
    }
  }

  // Fallback detection from CSS rules / animations for Cheerio-only mode
  if (!scrollTimeline || scrollTimeline.elementTransitions?.length === 0) {
    // Detect from animation names
    if (hasFadeAnim) profile.hasFadeReveals = true;
    if (hasSlideAnim) profile.hasSlideReveals = true;
    if (hasScaleAnim) profile.hasScaleReveals = true;

    // Detect horizontal scroll from CSS or overflow-x
    if (rules) {
      const hasHorizontalOverflow = rules.some(r =>
        r.properties["overflow-x"] === "auto" || r.properties["overflow-x"] === "scroll" ||
        (r.properties["white-space"] === "nowrap" && /scroll|auto/.test(r.properties["overflow-x"] || ""))
      );
      if (hasHorizontalOverflow) profile.hasHorizontalScroll = true;

      // Sticky detection
      const stickyRules = rules.filter(r => r.properties["position"] === "sticky");
      if (stickyRules.length > 0) {
        profile.hasPinnedElements = true;
        profile.hasStickyNavigation = true;
        profile.pinnedRegionDescription = stickyRules.slice(0, 2).map(r => `\`${r.selector}\` sticky (${Object.entries(r.properties).filter(([k]) => k.startsWith("top") || k.startsWith("bottom")).map(([k, v]) => `${k}:${v}`).join(", ")})`).join("; ");
        timeline.push({ scrollPercent: 0, action: "pin", elementTag: "sticky", elementText: "", className: "", detail: "Sticky position element detected — stays in viewport while scrolling" });
      }

      // Parallax detection from perspective/transform
      const hasParallaxCSS = rules.some(r => /parallax/i.test(r.selector) || /parallax/i.test(r.properties["transform"] || ""));
      if (hasParallaxCSS) profile.hasParallax = true;
    }

    // Clip-path transitions
    if (rules) {
      const clipRules = rules.filter(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"]);
      if (clipRules.length > 0) profile.hasClipPathTransitions = true;
    }
  }

  // Classify animation trigger type
  if (animations && animations.length > 0) {
    profile.hasCrossfadeTransitions = hasFadeAnim;
  }

  // Count distinct animations
  profile.totalDistinctAnimations = (animations?.length || 0) + (transitions?.length || 0) +
    (profile.hasFadeReveals ? 1 : 0) + (profile.hasSlideReveals ? 1 : 0) + (profile.hasScaleReveals ? 1 : 0) +
    (profile.hasPinnedElements ? 1 : 0) + (profile.hasParallax ? 1 : 0);

  // Estimate scroll duration based on animation complexity
  if (profile.totalDistinctAnimations > 5) profile.estimatedScrollDuration = "8-15s (rich cinematic experience)";
  else if (profile.totalDistinctAnimations > 3) profile.estimatedScrollDuration = "5-8s (moderate animations)";
  else profile.estimatedScrollDuration = "2-4s (simple scroll)";

  // Build narrative flow
  if (profile.hasPinnedElements && profile.hasFadeReveals && profile.hasSlideReveals) {
    profile.scrollNarrativeFlow = "Cinematic scroll experience: pinned hero with layered fade+slide reveals, followed by sequential section entrances";
  } else if (profile.hasPinnedElements) {
    profile.scrollNarrativeFlow = "Pinned regions detected with content overlay scroll behavior";
  } else if (profile.hasFadeReveals && profile.hasSlideReveals) {
    profile.scrollNarrativeFlow = "Sequential fade+slide reveals as each section enters viewport";
  } else if (profile.hasFadeReveals) {
    profile.scrollNarrativeFlow = "Fade-in reveals triggered by viewport entry";
  }

  // Refine animation triggers based on findings
  if (scrollTimeline && scrollTimeline.scrollPercentages?.some((sp: any) => sp.entering?.length > 0)) {
    profile.animationTriggerType = "viewport-enter";
  } else if (profile.hasPinnedElements) {
    profile.animationTriggerType = "scroll-progress";
  } else if (rules?.some(r => r.selector.includes(":hover"))) {
    profile.animationTriggerType = "hover";
  }

  // Sort timeline by scrollPercent
  timeline.sort((a, b) => a.scrollPercent - b.scrollPercent);

  return { timeline: timeline.slice(0, 30), behaviorProfile: profile };
}

/* ─────────────────────────────────────────────────────────────
   Experience / Storytelling Flow
   ───────────────────────────────────────────────────────────── */
type ExperienceFlow = {
  pacing: "rapid" | "moderate" | "slow-cinematic";
  emotionalArc: string;
  transitionStyles: string[];
  sectionPurpose: string[];
  peakEngagementPoints: string[];
};

function extractExperienceFlow(
  sections: { name: string; description: string }[],
  scrollTimeline: ScrollTimelineEntry[],
  profile: ScrollBehaviorProfile,
  anims: AnimDetail[]
): ExperienceFlow {
  const sectionCount = sections.length;
  const animCount = anims.length;

  // Pacing
  let pacing: "rapid" | "moderate" | "slow-cinematic" = "moderate";
  if (sectionCount >= 6 || profile.totalDistinctAnimations > 4) pacing = "slow-cinematic";
  else if (sectionCount <= 3 && animCount === 0) pacing = "rapid";

  // Emotional arc from section names
  const sectionNames = sections.map(s => s.name.toLowerCase());
  const hasHero = sectionNames.some(n => n.includes("hero") || n.includes("banner"));
  const hasFeatures = sectionNames.some(n => n.includes("feature"));
  const hasTestimonials = sectionNames.some(n => n.includes("testimonial") || n.includes("review"));
  const hasPricing = sectionNames.some(n => n.includes("pricing"));
  const hasCTA = sectionNames.some(n => n.includes("cta") || n.includes("call"));
  const hasFAQ = sectionNames.some(n => n.includes("faq"));
  const hasFooter = sectionNames.some(n => n.includes("footer"));
  const hasAbout = sectionNames.some(n => n.includes("about") || n.includes("mission"));

  let emotionalArc = "Informational — sections presented in logical order";
  if (hasHero && hasFeatures && hasTestimonials && hasCTA) {
    emotionalArc = "Classic marketing arc: Hero (attention) → Features (desire) → Testimonials (trust) → CTA (action)";
  } else if (hasHero && hasFeatures && hasPricing && hasCTA) {
    emotionalArc = "Sales-driven narrative: Hook → Understand → Evaluate → Convert";
  } else if (hasHero && hasAbout && hasFeatures && hasCTA) {
    emotionalArc = "Brand story arc: Introduction → Mission → Capabilities → Engagement";
  } else if (hasHero && hasCTA) {
    emotionalArc = "Direct response: Immediate value proposition → Conversion push";
  }

  // Transition styles
  const transitionStyles: string[] = [];
  if (profile.hasClipPathTransitions) transitionStyles.push("Clip-path diagonal/curve section dividers");
  if (profile.hasFadeReveals) transitionStyles.push("Opacity crossfade between sections");
  if (profile.hasSlideReveals) transitionStyles.push("Slide/fly-in section entrances");
  if (profile.hasScaleReveals) transitionStyles.push("Scale-up reveals from 0.9→1");
  if (profile.hasPinnedElements) transitionStyles.push("Overlap composition — content scrolls over pinned backdrop");
  if (profile.hasHorizontalScroll) transitionStyles.push("Horizontal rail transitions between sections");
  if (anims.some(a => /parallax|perspective|3d/i.test(a.name))) transitionStyles.push("3D perspective shifts during transition");
  if (transitionStyles.length === 0) transitionStyles.push("Standard vertical scroll with no inter-section animation");

  // Section purposes
  const sectionPurpose: string[] = [];
  sections.slice(0, 8).forEach(s => {
    const lower = s.name.toLowerCase();
    if (lower.includes("hero") || lower.includes("banner")) sectionPurpose.push("Attention capture — brand introduction");
    else if (lower.includes("feature")) sectionPurpose.push("Value proposition — product/service capabilities");
    else if (lower.includes("testimonial") || lower.includes("review")) sectionPurpose.push("Social proof — trust building");
    else if (lower.includes("pricing")) sectionPurpose.push("Conversion — pricing and plans");
    else if (lower.includes("cta") || lower.includes("call")) sectionPurpose.push("Action driver — final conversion push");
    else if (lower.includes("faq")) sectionPurpose.push("Objection handling — reducing friction");
    else if (lower.includes("about") || lower.includes("mission")) sectionPurpose.push("Brand storytelling — identity");
    else if (lower.includes("footer")) sectionPurpose.push("Navigation closure — secondary links");
    else if (lower.includes("header") || lower.includes("nav")) sectionPurpose.push("Primary navigation — wayfinding");
    else sectionPurpose.push("Supporting content");
  });

  // Peak engagement points
  const peakEngagementPoints: string[] = [];
  if (hasHero) peakEngagementPoints.push("Hero section — highest visual impact (0-15% scroll)");
  if (hasFeatures) peakEngagementPoints.push("Features section — core value messaging (20-40% scroll)");
  if (hasTestimonials) peakEngagementPoints.push("Testimonials — emotional resonance (40-55% scroll)");
  if (hasPricing) peakEngagementPoints.push("Pricing — conversion decision point (55-70% scroll)");
  if (hasCTA) peakEngagementPoints.push("CTA — action trigger (80-95% scroll)");

  return { pacing, emotionalArc, transitionStyles, sectionPurpose, peakEngagementPoints };
}

function generateSceneGraph(
  sections: { name: string; description: string }[],
  interactiveEffects: InteractiveEffects,
  animations: AnimDetail[],
  designDNA: DesignDNA,
  $: CheerioAPI,
  rules: Rule[]
): { scenes: Scene[]; narrativeSummary: string } {
  const scenes: Scene[] = [];
  const pinnedItems = interactiveEffects.stickyLayouts?.slice(0, 3) || [];
  const cssText = extractCSSText($.html()).toLowerCase();

  sections.forEach((section, i) => {
    const lower = section.name.toLowerCase();
    let type: Scene["type"] = "feature";
    let importance: Scene["importance"] = 3;
    let transition = "opacity fade, translateY(30px)";
    const elements: string[] = [];
    const layers: string[] = [];
    const spatialHints: string[] = [];

    if (lower.includes("hero") || lower.includes("banner")) {
      type = "hero";
      importance = 5;
      transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), scale 1.05→1";
      layers.push("Background image/gradient layer (z-index: 0)");
      layers.push("Overlay gradient (z-index: 1)");
      layers.push("Typography + CTA (z-index: 2)");

      const heroEl = $("[class*=hero], [id*=hero]").first();
      if (heroEl.length) {
        const hasBgImg = heroEl.css("background-image") && heroEl.css("background-image") !== "none";
        const hasOverlay = heroEl.find("[class*=overlay], [class*=gradient]").length > 0;
        const hasVideo = heroEl.find("video").length > 0;
        if (hasVideo) elements.push("Background video (autoplay, muted, loop)");
        if (hasBgImg) elements.push("Full-viewport background image cover");
        if (hasOverlay) elements.push("Color/linear-gradient overlay for text readability");
      }
      const heroHeight = heroEl.length ? (parseInt(heroEl.css("min-height") ?? "100") || 100) : 100;
      if (heroHeight >= 80) spatialHints.push(`Full-viewport hero (min-height: ${heroHeight}vh)`);
    } else if (lower.includes("feature")) {
      type = "feature";
      importance = 4;
      transition = "stagger children: each child fades up with 100ms delay increment";
      layers.push("Section background (z-index: 0)");
      layers.push("Grid/flex layout container (z-index: 1)");
      layers.push("Card elements with shadow (z-index: 2)");

      const featureEl = $("[class*=feature], [id*=feature]").first();
      if (featureEl.length) {
        const cards = featureEl.find("[class*=card], [class*=item], > div").length || 3;
        spatialHints.push(`Grid layout with ~${cards} columns/cards`);

        const isGrid = featureEl.css("display") === "grid" || featureEl.find("> div").css("display") === "grid";
        const isFlex = featureEl.css("display") === "flex";
        if (isGrid) spatialHints.push("CSS Grid layout with equal-width columns");
        if (isFlex) spatialHints.push("Flexbox row with wrapping cards");
      }
    } else if (lower.includes("cta") || lower.includes("call")) {
      type = "cta";
      importance = 4;
      transition = "scale 0.95→1, background color morph, button pulse glow";
      layers.push("Darker/contrast background section (z-index: 0)");
      layers.push("Centered content container (z-index: 1)");
      layers.push("CTA button with hover glow effect (z-index: 2)");
      spatialHints.push("Full-width section with centered single-column layout");
    } else if (lower.includes("footer") || lower.includes("foot")) {
      type = "footer";
      importance = 1;
      transition = "simple fade-in on scroll";
      layers.push("Background / surface color (z-index: 0)");
      layers.push("Multi-column grid content (z-index: 1)");
      spatialHints.push("Multi-column link grid with brand column");
    } else if (pinnedItems.length > 0 && i < sections.length - 2) {
      type = "pinned";
      importance = 4;
      transition = "sticky pin → content scrubs → release at next section";
      layers.push("Pinned background element (z-index: 0, position: sticky)");
      layers.push("Foreground content that animates (z-index: 1)");
      if (pinnedItems.length > 0) spatialHints.push(`Sticky pinned element: ${pinnedItems[0]}`);
    }

    const animForSection = animations.filter(a => a.selector && section.description.includes(a.selector));
    if (animForSection.length > 0) {
      animForSection.forEach(a => {
        elements.push(`Animation: ${a.name} (${a.duration || '0.3s'}, ${a.timing || 'ease'})`);
      });
    }

    scenes.push({
      id: i + 1,
      name: section.name,
      type,
      importance,
      elements: elements.slice(0, 4),
      transition,
      layers: layers.slice(0, 4),
      spatialHints: spatialHints.slice(0, 3),
    });
  });

  // Detect transitions between sections
  if (cssText.includes("clip-path") || cssText.includes("-webkit-clip-path")) {
    const clipRules = rules.filter(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"]);
    if (clipRules.length > 0 && scenes.length > 1) {
      scenes[Math.min(1, scenes.length - 1)].transition = "clip-path polygon wipe reveal — diagonal section divider";
    }
  }

  const narrativeSummary = scenes
    .filter(s => s.importance >= 3)
    .map(s => `${s.name} (${'★'.repeat(s.importance)}${'☆'.repeat(5 - s.importance)})`)
    .join(" → ");

  return { scenes, narrativeSummary };
}

/* ─────────────────────────────────────────────────────────────
   Spatial Relationship Analyzer
   ───────────────────────────────────────────────────────────── */
function analyzeSpatialRelationships($: CheerioAPI, rules: Rule[]): string[] {
  const hints: string[] = [];
  const cssText = extractCSSText($.html()).toLowerCase();

  // Column ratio detection from grid/flex layouts
  const heroEl = $("[class*=hero], [id*=hero], [class*=banner]").first();
  if (heroEl.length) {
    const heroChildren = heroEl.children();
    if (heroChildren.length === 2) {
      const firstChild = heroChildren.first();
      const firstWidth = firstChild.css("width") || firstChild.css("flex") || "";
      if (firstWidth.includes("%")) {
        const pct = parseFloat(firstWidth);
        if (pct > 0 && pct < 100) {
          hints.push(`Split hero layout: ${Math.round(pct)}% / ${Math.round(100 - pct)}% column ratio`);
        }
      } else {
        hints.push("Dual-column hero with text + visual split");
      }
    }
  }

  // Negative margin / overlap detection
  const negMargins = rules.filter(r => {
    const mt = r.properties["margin-top"];
    const ml = r.properties["margin-left"];
    const mr = r.properties["margin-right"];
    const mb = r.properties["margin-bottom"];
    return [mt, ml, mr, mb].some(v => v && v.startsWith("-"));
  });
  if (negMargins.length > 0) {
    negMargins.slice(0, 3).forEach(r => {
      const vals = ["margin-top", "margin-left", "margin-right", "margin-bottom"]
        .filter(p => r.properties[p] && r.properties[p]!.startsWith("-"))
        .map(p => `${p}: ${r.properties[p]}`);
      hints.push(`Element overlap: \`${r.selector}\` uses ${vals.join(", ")} — creates intentional overlap/offset`);
    });
  }

  // Clip path detection
  const clipRules = rules.filter(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"]);
  if (clipRules.length > 0) {
    clipRules.slice(0, 2).forEach(r => {
      hints.push(`Shape mask: \`${r.selector}\` uses clip-path: ${r.properties["clip-path"] || r.properties["-webkit-clip-path"]} — diagonal/slanted section divider`);
    });
  }

  // Z-index stacking
  const zIndexRules = rules.filter(r => r.properties["z-index"]);
  if (zIndexRules.length > 0) {
    const maxZ = Math.max(...zIndexRules.map(r => parseInt(r.properties["z-index"]!) || 0));
    const stacked = zIndexRules.filter(r => parseInt(r.properties["z-index"]!) >= 10);
    if (stacked.length > 0) {
      hints.push(`Layer stacking: ${stacked.length} elements at z-index ≥10 (max: ${maxZ}) — header, modals, overlays`);
    }
  }

  // Float / absolute / fixed positioning
  const absPositions = rules.filter(r => r.properties["position"] === "absolute" || r.properties["position"] === "fixed");
  if (absPositions.length > 0) {
    if (absPositions.some(r => r.properties["position"] === "fixed")) {
      hints.push("Fixed-position elements: floating navigation/chat/back-to-top");
    }
    if (absPositions.some(r => /close|overlay|modal/.test(r.selector))) {
      hints.push("Absolute positioned close buttons and modal overlays");
    }
  }

  if (hints.length === 0) {
    // If no absolute positioning, assume standard flow but mention typical layout flow
    const hasFlex = rules.some(r => r.properties["display"] === "flex");
    const hasGrid = rules.some(r => r.properties["display"] === "grid");
    if (hasFlex && hasGrid) {
      hints.push("Standard document flow layout — driven by CSS Grid for macro-layouts and Flexbox for component alignment");
    } else {
      hints.push("Standard document flow layout — basic box model composition");
    }
  }

  return hints.slice(0, 8);
}

/* ─────────────────────────────────────────────────────────────
   Design Language Classifier
   ───────────────────────────────────────────────────────────── */
function classifyDesignLanguage(
  $: CheerioAPI,
  colors: ColorDef[],
  fonts: { family: string; usage: string }[],
  interactiveEffects: InteractiveEffects,
  siteType: string,
  rules: Rule[]
): { primary: string; tags: string[]; reasoning: string } {
  const tags: string[] = [];
  const htmlText = $.html().toLowerCase();
  const cssText = extractCSSText($.html()).toLowerCase();

  const serifFont = fonts.some(f => /serif/i.test(f.family) && !/sans.?serif/i.test(f.family));
  const bgColor = colors.find(c => c.role === "background" || c.role === "surface");
  let isDark = false;
  if (bgColor) {
    const rgb = parseColorToRgb(bgColor.value);
    if (rgb) {
      const [, , l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      isDark = l < 20;
    }
  }

  const hasGlass = interactiveEffects.glassmorphism.length > 0;
  const hasClipPath = rules.some(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"]);
  const hasLargeTypography = rules.some(r => {
    const fs = r.properties["font-size"];
    if (!fs) return false;
    const px = parseFloat(fs);
    return !isNaN(px) && px > 72;
  });
  const hasMinimalColors = colors.length <= 3;
  const hasRichColors = colors.length >= 6;
  const hasGradients = cssText.includes("gradient");
  const hasCustomCursor = $("[class*=cursor], [id*=cursor], [data-cursor]").length > 0;
  const hasNoise = cssText.includes("noise") || htmlText.includes("noise");
  const hasRoundedUI = rules.some(r => {
    const br = r.properties["border-radius"];
    return br && br !== "0px" && !br.includes("0");
  });
  const hasPerspective = cssText.includes("perspective") || cssText.includes("preserve-3d");

  // Apple-like / Premium Tech
  if ((isDark || hasMinimalColors) && hasGlass && hasLargeTypography && hasRoundedUI) {
    tags.push("Apple-like / Premium Tech");
  }
  // Editorial / Magazine
  if (serifFont && hasLargeTypography && !isDark) {
    tags.push("Editorial / Magazine");
  }
  // Luxury Startup
  if (isDark && hasGlass && hasMinimalColors && !hasLargeTypography) {
    tags.push("Luxury Startup / Modern Premium");
  }
  // Brutalist
  if (!hasGlass && !hasRoundedUI && hasLargeTypography && hasMinimalColors) {
    tags.push("Brutalist / Raw Industrial");
  }
  // Neo-minimal / Swiss
  if (hasMinimalColors && !hasGlass && !hasCustomCursor && !hasGradients) {
    tags.push("Neo-minimal / Swiss Design");
  }
  // Kinetic / Motion-heavy
  if (hasCustomCursor || hasPerspective || interactiveEffects.parallax.length > 0) {
    tags.push("Kinetic / Motion-first");
  }
  // Warm / Human-centered
  if (!isDark && hasRoundedUI && colors.length >= 4 && colors.some(c => {
    const rgb = parseColorToRgb(c.value);
    if (!rgb) return false;
    const [h] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return h >= 10 && h <= 50;
  })) {
    tags.push("Warm / Human-centered");
  }
  // Tech Optimism
  if (hasGlass && hasGradients && hasCustomCursor && hasRoundedUI) {
    tags.push("Tech Optimism / AI-forward");
  }
  // Industrial
  if (!isDark && !hasGlass && hasLargeTypography && hasRichColors) {
    tags.push("Industrial / Bold Color");
  }
  // Dark / Cinematic
  if (isDark && hasGlass && hasGradients) {
    tags.push("Cinematic / Immersive");
  }
  // Noise / Grain texture
  if (hasNoise) {
    tags.push("Analog / Film Grain");
  }

  if (tags.length === 0) {
    if (isDark) tags.push("Modern Dark Mode");
    else if (hasRoundedUI) tags.push("Clean Modern / Soft UI");
    else tags.push("Standard Web");
  }

  const primary = tags[0] || "Standard Web";
  const reasoning = `Design classified as "${primary}" based on ${tags.length > 1 ? `combination of: ${tags.join(", ")}` : "dominant visual characteristics"}. ${isDark ? "Dark mode with " : "Light mode with "}${colors.length} extracted colors, ${fonts.length} font families, ${hasGlass ? "glassmorphism, " : ""}${hasCustomCursor ? "custom cursor, " : ""}${hasClipPath ? "clip-path shapes, " : ""}${hasPerspective ? "3D perspective transforms" : "standard layout composition"}.`;

  return { primary, tags, reasoning };
}

/* ─────────────────────────────────────────────────────────────
   Content Importance Scorer
   ───────────────────────────────────────────────────────────── */
type ImportanceEntry = { section: string; score: number; label: string; effort: string };

function scoreContentImportance(
  sections: { name: string; description: string }[],
  $: CheerioAPI,
  rules: Rule[]
): ImportanceEntry[] {
  return sections.map(s => {
    const lower = s.name.toLowerCase();
    let score = 2;
    let label = "Standard content";
    let effort = "Normal";

    if (lower.includes("hero") || lower.includes("banner")) {
      score = 5; label = "Primary brand statement — highest priority"; effort = "Maximum — full custom layout, typography, media";
    } else if (lower.includes("cta") || lower.includes("call")) {
      score = 4; label = "Conversion driver — critical path"; effort = "High — prominent button, contrast, whitespace";
    } else if (lower.includes("feature")) {
      score = 4; label = "Core value proposition"; effort = "High — cards, icons, grid layout";
    } else if (lower.includes("pricing")) {
      score = 4; label = "Revenue conversion point"; effort = "High — comparison table, toggle, tiers";
    } else if (lower.includes("testimonial") || lower.includes("review")) {
      score = 3; label = "Social proof / trust building"; effort = "Medium — carousel, avatar, quote styling";
    } else if (lower.includes("header") || lower.includes("navigation")) {
      score = 3; label = "Primary navigation — UX critical"; effort = "Medium — sticky, hamburger menu on mobile";
    } else if (lower.includes("about") || lower.includes("mission")) {
      score = 3; label = "Brand story / trust"; effort = "Medium — split layout, team photos";
    } else if (lower.includes("faq")) {
      score = 2; label = "Support / objection handling"; effort = "Low — accordion, collapsible panels";
    } else if (lower.includes("footer")) {
      score = 1; label = "Footer — secondary navigation"; effort = "Minimal — link lists, copyright";
    }

    return { section: s.name, score, label, effort };
  });
}

/* ─────────────────────────────────────────────────────────────
   Semantic Image Understanding
   ───────────────────────────────────────────────────────────── */
function analyzeImagesSemantically($: CheerioAPI): { name: string; semantic: string; style: string }[] {
  const results: { name: string; semantic: string; style: string }[] = [];
  const allImgTags = $("img[src]");

  allImgTags.each((i, el) => {
    if (i >= 8) return false;
    const src = $(el).attr("src") || "";
    if (src.startsWith("data:")) return;

    const alt = $(el).attr("alt") || "";
    const cls = $(el).attr("class") || "";
    const width = $(el).attr("width") || "";
    const height = $(el).attr("height") || "";
    const parent = $(el).parent();
    const parentCls = parent.attr("class") || "";
    const parentTag = parent.get(0)?.tagName || "";
    const grandparent = parent.parent();
    const gpCls = grandparent.attr("class") || "";
    const filename = src.split("/").pop() || "image";

    // Infer image type from context
    const contextText = cleanText(parent.text().slice(0, 120).toLowerCase());
    const imgContext = cleanText($(el).closest("section, div[class*=section]").text().slice(0, 80).toLowerCase());

    let semantic = "";
    let style = "";

    if (cls.includes("avatar") || cls.includes("profile") || cls.includes("portrait") || parentCls.includes("avatar")) {
      semantic = "User/brand portrait photo — headshot or profile image";
      style = "Portrait photography, centered subject, soft background";
    } else if (cls.includes("logo")) {
      semantic = "Brand logo — wordmark or icon";
      style = "Vector or SVG — clean, flat design, brand colors";
    } else if (parentCls.includes("hero") || parentCls.includes("banner") || grandparent.attr("class")?.includes("hero")) {
      semantic = "Hero hero/background visual — large format brand image";
      style = "Wide-angle, cinematic, premium editorial photography";
    } else if (cls.includes("product") || parentCls.includes("product") || contextText.includes("product") || contextText.includes("device")) {
      semantic = "Product showcase image — commercial product photography";
      style = "Studio lighting, shallow depth of field, clean background";
    } else if (cls.includes("screenshot") || cls.includes("mockup") || cls.includes("ui") || contextText.includes("app") || contextText.includes("interface") || contextText.includes("dashboard")) {
      semantic = "UI/screenshot mockup — application or interface preview";
      style = "Screen capture or device mockup, floating/angled presentation";
    } else if (cls.includes("icon") || width === height || (width && height && Math.abs(parseInt(width) - parseInt(height)) < 10)) {
      semantic = "Decorative icon or graphic element";
      style = "Minimal vector icon, consistent with brand style";
    } else if (grandparent.attr("class")?.includes("card") || parentCls.includes("card") || contextText.includes("card")) {
      semantic = "Card thumbnail/illustration — supporting visual for card content";
      style = "Rounded, contained within card frame, object-fit: cover";
    } else if (contextText.includes("team") || contextText.includes("about") || contextText.includes("person")) {
      semantic = "Team member portrait — human connection";
      style = "Natural lighting, authentic/editorial style";
    } else if (contextText.includes("testimonial") || contextText.includes("quote") || contextText.includes("customer")) {
      semantic = "Customer testimonial portrait — social proof";
      style = "Small circular thumbnail, consistent headshot style";
    } else if (contextText.includes("gallery") || contextText.includes("portfolio") || contextText.includes("work")) {
      semantic = "Portfolio/gallery piece — project showcase";
      style = "Full-bleed, grid layout, varied aspect ratios";
    } else {
      const ext = filename.split('.').pop()?.toLowerCase();
      const isPhoto = ext === 'jpg' || ext === 'jpeg' || ext === 'webp' || (ext === 'png' && !cls.includes('icon'));
      
      semantic = alt || `Website image — ${filename.replace(/[_-]/g, " ").replace(/\.[^.]+$/, "")}`;
      
      if (isPhoto && (parseInt(width) > 600 || !width)) {
        style = "Premium editorial/commercial photography, high shutter speed, dark/neutral backdrop";
      } else {
        style = "Standard responsive web image";
      }
    }

    // Detection of photographic style
    const imgEl = el as any;
    const styleAttr = $(el).attr("style") || "";
    if (styleAttr.includes("border-radius") || cls.includes("rounded") || cls.includes("circle")) {
      style += ", rounded frame";
    }
    if (styleAttr.includes("object-fit: cover") || cls.includes("object-cover")) {
      style += ", object-fit: cover cropping";
    }

    results.push({
      name: `Image ${i + 1}: ${filename.slice(0, 50)}`,
      semantic,
      style: style.slice(0, 200),
    });
  });

  return results;
}

/* ─────────────────────────────────────────────────────────────
   Layer Hierarchy Detector
   ───────────────────────────────────────────────────────────── */
function analyzeLayerHierarchy($: CheerioAPI, rules: Rule[]): string[] {
  const layers: string[] = [];
  const zIndexRules = rules.filter(r => r.properties["z-index"]);

  if (zIndexRules.length > 0) {
    const sorted = [...zIndexRules].sort((a, b) => parseInt(a.properties["z-index"]!) - parseInt(b.properties["z-index"]!));
    sorted.forEach(r => {
      const z = parseInt(r.properties["z-index"]!);
      const hint = `z-index: ${z} — \`${r.selector}\``;
      layers.push(hint);
    });
  }

  // Detect stacking contexts
  const stickyElements = rules.filter(r => r.properties["position"] === "sticky");
  if (stickyElements.length > 0) {
    layers.push("Sticky header/nav — highest visual layer, always visible");
  }
  const fixedElements = rules.filter(r => r.properties["position"] === "fixed");
  if (fixedElements.length > 0) {
    layers.push("Fixed overlay elements — modals, popups, floating CTAs");
  }

  if (layers.length === 0) {
    // Infer layers visually if explicit z-index is missing
    layers.push("Background (Base App Surface)");
    layers.push("Base Layout/Grid (Main Document Flow)");
    
    if ($("img, video").length > 0) layers.push("Media Layer (Images, Videos)");
    layers.push("Content Layer (Typography, Cards, Buttons)");
    
    if ($("header, nav, [class*=nav], [class*=header]").length > 0) {
      layers.push("Navigation Layer (Header overlay)");
    }
    if ($("[class*=cursor], [id*=cursor]").length > 0) {
      layers.push("Interactive Overlay (Custom Cursor)");
    }
  }

  return layers.slice(0, 8);
}

/* ─────────────────────────────────────────────────────────────
   Design Philosophy Inferrer
   ───────────────────────────────────────────────────────────── */
function inferDesignPhilosophy(
  $: CheerioAPI,
  colors: ColorDef[],
  fonts: { family: string; usage: string; weight: string; size: string }[],
  rules: Rule[],
  interactiveEffects: InteractiveEffects,
  designLang?: { primary: string; tags: string[]; reasoning: string },
  visualMetrics?: any,
  neuralDNA?: any
): {
  philosophy: string[];
  editorialPrinciples: string[];
  neverDo: string[];
  references: string[];
  typographicScale: string[];
  gridMathematics: string[];
  spacingSystem: string[];
  photographyStyle: string[];
  cursorSpec: string[];
  motionLanguage: string[];
  visualWeight: string[];
} {
  const cssText = extractCSSText($.html()).toLowerCase();
  const htmlText = $.html().toLowerCase();

  // ── Visual signals ─────────────────────────────────────────
  const hasCustomCursor = $('[class*=cursor], [id*=cursor], [data-cursor]').length > 0
    || rules.some(r => r.properties['cursor'] && !['auto','pointer','default'].includes(r.properties['cursor']));
  const hasMinimalColors = colors.filter(c => c.value && !c.value.includes('0000000')).length <= 4;
  const isDark = (() => {
    const bg = colors.find(c => c.role === 'background' || c.role === 'surface');
    if (!bg) return false;
    const rgb = parseColorToRgb(bg.value);
    if (!rgb) return false;
    const [,,l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return l < 20;
  })();
  const hasLargeType = rules.some(r => { const fs = r.properties['font-size']; return fs && parseFloat(fs) > 72; });
  const hasHorizScroll = interactiveEffects.horizontalScroll.length > 0
    || rules.some(r => r.properties['overflow-x'] === 'scroll' || r.properties['overflow-x'] === 'auto');
  const hasClipPath = rules.some(r => r.properties['clip-path'] || r.properties['-webkit-clip-path']);
  const hasGlass = interactiveEffects.glassmorphism.length > 0;
  const hasSansSerif = fonts.some(f => /sans/i.test(f.family) || /futura|helvetica|univers|grotesk|gothic/i.test(f.family));
  const hasSerif = fonts.some(f => /serif/i.test(f.family) && !/sans/i.test(f.family));
  const isCreativeAgency = htmlText.includes('studio') || htmlText.includes('agency') || htmlText.includes('creative') || htmlText.includes('portfolio');
  const isSports = htmlText.includes('sport') || htmlText.includes('athlete') || htmlText.includes('athleti') || htmlText.includes('training');
  const whitespace = visualMetrics?.whitespacePercent ?? 40;
  const primaryTag = designLang?.primary ?? '';
  const isKinetic = primaryTag.includes('Kinetic') || primaryTag.includes('Motion');
  const isEditorial = primaryTag.includes('Editorial') || primaryTag.includes('Magazine') || primaryTag.includes('Swiss');

  // ── Typographic scale ──────────────────────────────────────
  const typographicScale: string[] = [];
  const fontSizes: { selector: string; size: number }[] = [];
  rules.forEach(r => {
    const fs = r.properties['font-size'];
    if (fs) {
      const px = parseFloat(fs);
      if (!isNaN(px) && px > 10) fontSizes.push({ selector: r.selector, size: px });
    }
  });
  fontSizes.sort((a, b) => b.size - a.size);
  const uniqueSizes = [...new Set(fontSizes.map(f => f.size))];
  if (uniqueSizes.length > 0) {
    typographicScale.push(`Display (H1): ${uniqueSizes[0] ? `~${Math.round(uniqueSizes[0])}px` : '80–140px'} — ${hasLargeType ? 'Very large, dominant' : 'Standard display'}`);
    if (uniqueSizes[1]) typographicScale.push(`Heading (H2): ~${Math.round(uniqueSizes[1])}px`);
    if (uniqueSizes[2]) typographicScale.push(`Subheading (H3): ~${Math.round(uniqueSizes[2])}px`);
    const bodySize = uniqueSizes.find(s => s >= 12 && s <= 18) ?? uniqueSizes[uniqueSizes.length - 1];
    if (bodySize) typographicScale.push(`Body: ~${Math.round(bodySize)}px`);
  } else {
    typographicScale.push('Display (H1): 90–140px — Uppercase, very tight tracking');
    typographicScale.push('Heading (H2): 48–72px');
    typographicScale.push('Body: 14–16px');
    typographicScale.push('Labels/Captions: 11–12px');
  }

  // Letter-spacing signals
  const tightTracking = rules.some(r => { const ls = r.properties['letter-spacing']; return ls && ls.startsWith('-'); });
  const wideTracking  = rules.some(r => { const ls = r.properties['letter-spacing']; return ls && parseFloat(ls) > 1; });
  if (tightTracking) typographicScale.push('Headline letter-spacing: Negative (tight compressed headlines)');
  if (wideTracking)  typographicScale.push('Label letter-spacing: Wide/loose (0.1em–0.2em on small text)');

  // Line height signals
  const tightLeading = rules.some(r => { const lh = r.properties['line-height']; return lh && parseFloat(lh) < 1.1; });
  if (tightLeading) typographicScale.push('Display line-height: 0.9–1.0 (extremely compressed headlines)');
  typographicScale.push('Body line-height: 1.5–1.7 (comfortable reading rhythm)');

  // ── Grid mathematics ───────────────────────────────────────
  const gridMathematics: string[] = [];
  const gridRules = rules.filter(r => r.properties['grid-template-columns'] || r.properties['grid-template-rows']);
  const colsSet = new Set<string>();
  gridRules.forEach(r => {
    const cols = r.properties['grid-template-columns'];
    if (cols) colsSet.add(cols.slice(0, 80));
  });
  colsSet.forEach(c => {
    if (c.includes('repeat(12')) gridMathematics.push('12-column grid (desktop)');
    else if (c.includes('repeat(6'))  gridMathematics.push('6-column grid');
    else if (c.includes('repeat(3'))  gridMathematics.push('3-column grid');
    else if (c.includes('repeat(2'))  gridMathematics.push('2-column alternating layout');
    else if (c.includes('1fr')) gridMathematics.push(`Fluid column grid: ${c.slice(0, 50)}`);
    else gridMathematics.push(`Custom grid: ${c.slice(0, 50)}`);
  });
  if (gridMathematics.length === 0) {
    gridMathematics.push('Implicit grid — flex-based layout');
  }
  const negMargin = rules.some(r => Object.values(r.properties).some(v => v && v.trim().startsWith('-') && v.includes('px') && !v.includes('letter') && !v.includes('index')));
  if (negMargin) gridMathematics.push('Negative margins used — intentional element overlap/offset composition');
  if (hasClipPath) gridMathematics.push('clip-path shapes — diagonal or polygon section dividers');

  // ── Spacing system ─────────────────────────────────────────
  const spacingSystem: string[] = [];
  if (neuralDNA?.spacingScale && neuralDNA.spacingScale.length > 0) {
    const scale = neuralDNA.spacingScale.sort((a: number, b: number) => a - b);
    spacingSystem.push(`Spacing scale (extracted): ${scale.map((s: number) => `${s}px`).join(' / ')}`);
  }
  // Infer margins from rules
  const largeMargins = rules.filter(r => {
    const vals = ['margin-top','margin-bottom','padding-top','padding-bottom'].map(p => parseFloat(r.properties[p] || '0')).filter(v => !isNaN(v) && v > 0);
    return vals.some(v => v >= 80);
  });
  if (largeMargins.length > 0) {
    const maxVal = Math.max(...largeMargins.flatMap(r =>
      ['margin-top','margin-bottom','padding-top','padding-bottom'].map(p => parseFloat(r.properties[p] || '0')).filter(v => !isNaN(v))
    ));
    spacingSystem.push(`Max section spacing: ~${Math.round(maxVal)}px (generous vertical rhythm)`);
  } else {
    spacingSystem.push('Section spacing: 120–260px (inferred from whitespace score)');
  }
  spacingSystem.push(`Whitespace score: ${whitespace}% — ${whitespace > 50 ? 'Very airy, premium breathing room' : whitespace > 35 ? 'Moderate whitespace' : 'Dense, content-packed'}`);
  spacingSystem.push('Content max-width: infer from container CSS (typically 1200–1600px)');
  spacingSystem.push('Mobile: significantly reduced margins, single-column stack');

  // ── Photography style ──────────────────────────────────────
  const photographyStyle: string[] = [];
  if (isSports) {
    photographyStyle.push('Sports documentary photography — athletes in motion');
    photographyStyle.push('High shutter speed — freeze action moments');
    photographyStyle.push('Muted/film-graded color treatment');
    photographyStyle.push('Natural and practical lighting — no artificial studio looks');
    photographyStyle.push('Editorial magazine cropping — portrait orientation dominant');
  } else if (isCreativeAgency) {
    photographyStyle.push('Premium editorial/commercial photography');
    photographyStyle.push('High-contrast, intentional compositions');
    photographyStyle.push('Lifestyle and documentary moments over stock imagery');
    photographyStyle.push('Full-bleed, viewport-spanning images');
  } else {
    photographyStyle.push('Standard editorial photography');
    photographyStyle.push('Object-fit: cover — images fill their containers');
    photographyStyle.push('No stock photography feeling — authentic and purposeful');
  }
  if (isDark) photographyStyle.push('Dark neutral backdrop — low-key lighting');
  else photographyStyle.push('Light/neutral backdrops with intentional color pops');
  photographyStyle.push('No decorative illustrations, icons, or graphic overlays');

  // ── Cursor spec ─────────────────────────────────────────────
  const cursorSpec: string[] = [];
  if (hasCustomCursor) {
    cursorSpec.push('Custom cursor detected');
    const cursorEl = $('[class*=cursor], [id*=cursor]').first();
    const cursorCls = cursorEl.attr('class') || '';
    if (/circle|ring|dot/i.test(cursorCls)) cursorSpec.push('Shape: Circular ring or dot');
    else cursorSpec.push('Shape: Infer from brand style (circle, crosshair, or branded element)');
    const blendRule = rules.find(r => r.properties['mix-blend-mode']);
    if (blendRule) cursorSpec.push(`Blend mode: ${blendRule.properties['mix-blend-mode']}`);
    cursorSpec.push('Scale on hover: 1.2–1.5x');
    cursorSpec.push('Easing: smooth interpolation — 80–120ms lag');
    cursorSpec.push('Text links: cursor morphs to text or collapses');
  }

  // ── Motion language ────────────────────────────────────────
  const motionLanguage: string[] = [];
  const hasSlowEasing = cssText.includes('cubic-bezier(.16,1') || cssText.includes('cubic-bezier(0.16,1');
  if (hasSlowEasing) {
    motionLanguage.push('Primary easing: cubic-bezier(0.16, 1, 0.3, 1) — slow cinematic ease-out');
  } else {
    motionLanguage.push('Easing: smooth ease-out — no spring physics or bounce');
  }
  motionLanguage.push('No mechanical snapping — everything glides');
  const longDurations = rules.filter(r => {
    const d = r.properties['transition-duration'] || r.properties['animation-duration'];
    return d && parseFloat(d) >= 0.6;
  });
  if (longDurations.length > 0) {
    const durations = longDurations.map(r => parseFloat(r.properties['transition-duration'] || r.properties['animation-duration'] || '0') * 1000);
    const maxD = Math.max(...durations);
    const minD = Math.min(...durations.filter(d => d > 0));
    motionLanguage.push(`Animation duration range: ${Math.round(minD)}ms – ${Math.round(maxD)}ms`);
  } else {
    motionLanguage.push('Animation duration: 600ms – 1400ms (slow and deliberate)');
  }
  if (isKinetic || hasCustomCursor) {
    motionLanguage.push('Images glide — no abrupt cuts');
    motionLanguage.push('Text elements reveal with slight translation (translateY: 20–40px) and opacity');
    motionLanguage.push('Horizontal sections use inertia-based scrolling feel');
  }
  motionLanguage.push('Scroll-driven reveals — viewport entry triggers animation');
  motionLanguage.push('No page transitions that feel like a SPA — scroll feels native');

  // ── Visual weight ──────────────────────────────────────────
  const visualWeight: string[] = [];
  const hasAsymmetry = negMargin || hasClipPath || (visualMetrics?.visualBalance ?? '').toLowerCase().includes('asymm');
  if (hasAsymmetry) {
    visualWeight.push('Intentionally asymmetric — layout breaks conventional centering');
    visualWeight.push('Heavy left or right anchor — main content pulls to one side');
    visualWeight.push('Large images contrast with tiny labels — deliberate scale contrast');
    visualWeight.push('Broken grid alignment — elements intentionally offset from baseline');
  } else {
    visualWeight.push(`Balance: ${visualMetrics?.visualBalance ?? 'Symmetrical'}`);
  }
  if (hasLargeType) visualWeight.push('Massive typography creates optical weight without imagery');
  if (whitespace > 45) visualWeight.push('Negative space used actively — blank space IS a design element');

  // ── Design philosophy ──────────────────────────────────────
  const philosophy: string[] = [];
  const editorialPrinciples: string[] = [];
  const neverDo: string[] = [];
  const references: string[] = [];

  if (isKinetic && isCreativeAgency) {
    philosophy.push('Luxury creative studio aesthetic — every pixel is intentional');
    philosophy.push('Fashion/editorial magazine layout — not a conventional website');
    philosophy.push('Image-first storytelling — photography drives the narrative');
    philosophy.push('Typography as visual art — not just information delivery');
    philosophy.push('Minimal color palette — restraint signals sophistication');
    philosophy.push('Horizontal movement as a design signature');
    editorialPrinciples.push('Each section should feel like an editorial spread');
    editorialPrinciples.push('Grid is intentionally broken — rigid structure is avoided');
    editorialPrinciples.push('Whitespace is not emptiness — it is composition');
    editorialPrinciples.push('Motion reinforces brand personality, not just adds polish');
    references.push('Kinfolk Magazine', 'A24 film aesthetics', 'High-end fashion editorial (Dazed, Arena Homme+)', 'Creative studio portfolio (Active Theory, Fantasy)');
  } else if (isEditorial) {
    philosophy.push('Editorial / print-magazine design sensibility');
    philosophy.push('Typography hierarchy drives layout decisions');
    philosophy.push('Content rhythm over visual complexity');
    editorialPrinciples.push('Pages feel like curated editorial spreads');
    editorialPrinciples.push('Consistent typographic rhythm throughout');
    references.push('Print magazine layout', 'Swiss International Style');
  } else if (isDark && hasGlass) {
    philosophy.push('Premium dark UI — sophisticated and immersive');
    philosophy.push('Depth through layering, not decorative effects');
    editorialPrinciples.push('Every interactive element has a clear visual hierarchy');
    references.push('Linear.app', 'Vercel', 'Apple Pro products');
  } else {
    philosophy.push('Clean modern web — function-led with intentional aesthetics');
    editorialPrinciples.push('Content hierarchy drives layout');
    references.push('Modern SaaS / product websites');
  }

  // "Never do" is always populated with strong anti-patterns
  neverDo.push('No rounded SaaS-style cards with box shadows');
  if (!hasGlass) neverDo.push('No glassmorphism / backdrop-blur decorative panels');
  neverDo.push('No gradient backgrounds or decorative color blobs');
  neverDo.push('No Bootstrap-style centered layouts');
  neverDo.push('No bright accent colors — palette extracted above is law');
  neverDo.push('No floating CTAs or sticky bottom bars');
  neverDo.push('No emoji or icon-heavy UI');
  neverDo.push('No stock photography or generic imagery');
  neverDo.push('No dashboard UI patterns (no metric cards, charts, tables)');
  neverDo.push('No Material Design or Apple Human Interface patterns unless site is an app');
  neverDo.push('No corporate illustrations or Lottie animations unless extracted above');
  neverDo.push('No "feature card" grid pattern (icon + title + body text in a box)');

  return {
    philosophy,
    editorialPrinciples,
    neverDo,
    references,
    typographicScale,
    gridMathematics,
    spacingSystem,
    photographyStyle,
    cursorSpec,
    motionLanguage,
    visualWeight,
  };
}

function generateMegaPrompt(
  $: CheerioAPI,
  colors: ColorDef[],
  fonts: { family: string; usage: string; weight: string; size: string }[],
  spacing: string[],
  radii: string[],
  shadows: string[],
  gradients: string[],
  sections: { name: string; description: string }[],
  components: { name: string; details: string }[],
  animations: AnimDetail[],
  transitions: TransitionDetail[],
  assets: { name: string; prompt: string }[],
  rules: Rule[],
  siteType: string,
  complexityScore: number,
  scrollLibs: string[],
  tier: Tier,
  interactiveEffects: InteractiveEffects,
  designDNA: DesignDNA,
  responsiveArchaeology: ResponsiveArchaeology,
  accessibilityAutopsy: AccessibilityAutopsy,
  performanceForensics: PerformanceForensics,
  codeArchaeology: CodeArchaeology,
  darkModeArchaeologist: DarkModeArchaeologist,
  customization: z.infer<typeof CustomizationSchema>,
  visualMetrics?: any,
  confidencePercentages?: any,
  neuralDNA?: StyleDNATransfer | null,
  scrape?: any,
  sceneGraph?: string[],
  spatialHints?: string[],
  designLang?: { primary: string; tags: string[]; reasoning: string },
  importanceScores?: ImportanceEntry[],
  semanticImages?: { name: string; semantic: string; style: string }[],
  layerHierarchy?: string[],
  richFonts?: RichFontDetails[],
  scrollTimelineEntries?: ScrollTimelineEntry[],
  scrollBehaviorProfile?: ScrollBehaviorProfile,
  experienceFlow?: ExperienceFlow
): string {
  const siteName = $("title").first().text() || "Untitled";
  const chosenStyle = chooseDesignStyle(colors, fonts, interactiveEffects, siteType);
  const flow = detectStorytellingFlow(sections);
  const layoutIntel = detectLayoutIntelligence($, rules);
  const componentIntel = detectComponentIntelligence($, rules);
  const motionClassifications = detectAnimationClassifications(rules, $);
  const hostname = scrape?.sourceURL ? new URL(scrape.sourceURL).hostname : siteName;
  const googleFontsUrl = neuralDNA?.googleFontsUrl || null;

  // Infer rich design philosophy from all signals
  const dp = inferDesignPhilosophy(
    $, colors, fonts, rules, interactiveEffects,
    designLang, visualMetrics, neuralDNA
  );

  const lines: string[] = [];
  lines.push(`## SITE RECONSTRUCTION SPEC`);
  lines.push(`Target: ${hostname}`);
  lines.push("");

  // 1. STACK
  lines.push("### STACK");
  const detectedStack = codeArchaeology.detectedFrameworks;
  lines.push(`Recommended: React + Vite + TypeScript + Tailwind + shadcn/ui`);
  if (detectedStack.length > 0) {
    lines.push(`Detected on original: ${detectedStack.join(", ")}`);
  }
  lines.push("");

  // 2. FONTS
  lines.push("### FONTS");
  if (richFonts && richFonts.length > 0) {
    richFonts.forEach(f => {
      const sourceBadge = f.source === "@font-face" ? "📦 @font-face" : f.source === "google-fonts" ? "🔤 Google Fonts" : f.source === "system" ? "💻 System" : "🌐 External";
      lines.push(`Font: "${f.family}" ${sourceBadge}`);
      if (f.fallbackStack.length > 0) lines.push(`  Fallback: ${f.fallbackStack.join(", ")}`);
      lines.push(`  Weight: ${f.fontWeight} | Style: ${f.fontStyle} | Display: ${f.fontDisplay}`);
      if (f.isVariable) lines.push(`  Variable Font: Yes — supports variable weight/width/optical sizing`);
      if (f.letterSpacing && f.letterSpacing !== "normal") lines.push(`  Letter Spacing: ${f.letterSpacing}`);
      if (f.lineHeight && f.lineHeight !== "normal") lines.push(`  Line Height: ${f.lineHeight}`);
      if (f.textTransform && f.textTransform !== "none") lines.push(`  Text Transform: ${f.textTransform}`);
      lines.push(`  Usage: ${f.usage}`);
      lines.push("");
    });
    const uniqueFamilies = [...new Set(richFonts.map(f => f.family))];
    lines.push(`CSS Variable Mapping:`);
    lines.push(`  --font-display: ${uniqueFamilies[0] || "'Inter'"}, serif;`);
    lines.push(`  --font-body: ${uniqueFamilies[uniqueFamilies.length > 1 ? 1 : 0] || "'Inter'"}, sans-serif;`);
    lines.push(`  All h1-h4 → font-family: var(--font-display)`);
    lines.push(`  All p, span, button, input → font-family: var(--font-body)`);
  } else if (googleFontsUrl) {
    lines.push(`Import: \`@import url('${googleFontsUrl}');\``);
    lines.push(`Body: "Inter", sans-serif — weights 400/500/600/700`);
    lines.push(`Display: "Instrument Serif", serif — weight 400`);
  } else if (fonts.length > 0) {
    const uniqueFamilies = [...new Set(fonts.map(f => f.family))];
    uniqueFamilies.forEach(family => {
      const usages = fonts.filter(f => f.family === family);
      const weights = [...new Set(usages.map(f => f.weight || '400'))].join(", ");
      const usage = usages[0]?.usage || "body";
      const size = usages[0]?.size || "16px";
      lines.push(`- **"${family}"** — ${usage}, weight ${weights}, base ${size}`);
    });
    lines.push(`CSS Variable Mapping:`);
    lines.push(`  --font-display: ${uniqueFamilies[0] || "'Inter'"}, serif;`);
    lines.push(`  --font-body: ${uniqueFamilies[uniqueFamilies.length > 1 ? 1 : 0] || "'Inter'"}, sans-serif;`);
  } else {
    lines.push(`- Body: "Inter", sans-serif — weights 400/500/600/700`);
    lines.push(`- Display: "Instrument Serif", serif — weight 400`);
  }
  if (googleFontsUrl) {
    lines.push(`- Google Fonts: \`${googleFontsUrl}\``);
  }
  lines.push("");

  // 3. COLOR SYSTEM (HSL)
  lines.push("### COLOR SYSTEM (HSL CSS variables)");
  if (neuralDNA && neuralDNA.cssVars && Object.keys(neuralDNA.cssVars).length > 0) {
    lines.push(`Extracted from :root:`);
    Object.entries(neuralDNA.cssVars).slice(0, 15).forEach(([key, val]) => {
      const rgb = hexToRgb(val);
      if (rgb) {
        const hsl = rgbToHslLine(rgb[0], rgb[1], rgb[2]);
        lines.push(`  ${key}: ${hsl}; /* ${val} */`);
      } else {
        lines.push(`  ${key}: ${val};`);
      }
    });
  } else {
    const cleanColors = colors.filter(c => c.value && !c.value.includes("00000004") && !c.value.includes("ffffff0"));
    const colorMap: Record<string, string> = {
      primary: "--color-primary", background: "--background", "muted-text": "--muted-foreground",
      border: "--border", text: "--foreground", accent: "--accent",
    };
    cleanColors.slice(0, 8).forEach(c => {
      const varName = colorMap[c.role] || `--color-${c.role}`;
      const rgb = hexToRgb(c.value);
      if (rgb) {
        const hsl = rgbToHslLine(rgb[0], rgb[1], rgb[2]);
        lines.push(`  ${varName}: ${hsl}; /* ${c.usage} */`);
      } else {
        lines.push(`  ${varName}: ${c.value}; /* ${c.usage} */`);
      }
    });
    if (cleanColors.length === 0) {
      lines.push("  --background: 0 0% 100%;");
      lines.push("  --foreground: 222 47% 11%;");
      lines.push("  --primary: 221 83% 53%;");
      lines.push("  --muted-foreground: 215 16% 47%;");
    }
  }
  lines.push("");

  // 4. MEDIA
  if (neuralDNA && neuralDNA.videos.length > 0) {
    lines.push("### MEDIA");
    neuralDNA.videos.forEach(v => {
      lines.push(`- Video background:`);
      lines.push(`  Element: <video autoPlay loop muted playsInline>`);
      lines.push(`  Source: ${v.src}`);
      if (v.poster) lines.push(`  Poster: ${v.poster}`);
      lines.push(`  Classes: absolute inset-0 w-full h-full object-cover z-0`);
    });
    lines.push("");
  }

  // 5. LAYOUT
  lines.push("### LAYOUT");
  lines.push(`- Storytelling Flow: ${flow.flowType} — ${flow.narrative}`);
  lines.push(`- Grid Structures: ${layoutIntel.join(", ") || "Standard block layout"}`);
  lines.push(`- Whitespace: ${visualMetrics?.whitespacePercent ?? 40}%`);
  lines.push(`- Balance: ${visualMetrics?.visualBalance ?? "Symmetrical"}`);
  if (neuralDNA && neuralDNA.spacingScale.length > 0) {
    lines.push(`- Spacing Scale: ${neuralDNA.spacingScale.map(s => `${s}px`).join(" / ")}`);
  }
  lines.push("");
  lines.push(`Section Sequence:`);
  if (neuralDNA && neuralDNA.sectionSequence.length > 0) {
    neuralDNA.sectionSequence.forEach((s, i) => {
      lines.push(`  ${i + 1}. ${s}`);
    });
  } else {
    sections.forEach((s, i) => {
      lines.push(`  ${i + 1}. ${s.name}: ${s.description}`);
    });
  }
  lines.push("");

  // 6. COMPONENTS
  lines.push("### COMPONENTS");
  if (neuralDNA && neuralDNA.buttons.length > 0) {
    lines.push(`Buttons:`);
    neuralDNA.buttons.slice(0, 4).forEach(b => {
      const padParts = b.padding.split(" ").map(p => toTailwindPadding(p));
      const twPadding = padParts.length === 2 ? `px-${padParts[1]} py-${padParts[0]}` :
                        padParts.length === 4 ? `pt-${padParts[0]} pr-${padParts[1]} pb-${padParts[2]} pl-${padParts[3]}` :
                        `p-${padParts[0]}`;
      const twRadius = toTailwindRadius(b.borderRadius);
      const hasBlur = b.backdropFilter && b.backdropFilter !== "none";
      lines.push(`  - "${b.text || 'CTA'}": ${twPadding} ${twRadius}${hasBlur ? ' backdrop-blur' : ''} ${b.fontSize ? `text-[${b.fontSize}]` : ''}`);
      lines.push(`    Hover: ${neuralDNA.hoverTransforms[0] ? `hover:${neuralDNA.hoverTransforms[0].replace(/ /g, '-')}` : 'hover:scale-[1.03]'} transition-transform`);
    });
  } else {
    lines.push(`- UI Primitives: ${componentIntel.join(", ")}`);
    components.slice(0, 6).forEach(c => {
      const twHint = twHintForComponent(c.name, c.details);
      lines.push(`- Component: ${c.name} — ${c.details}${twHint ? ` → ${twHint}` : ""}`);
    });
  }
  lines.push("");

  // 7. SPECIAL EFFECTS
  const hasEffects = neuralDNA && (neuralDNA.backdropBlurCount > 0 || neuralDNA.gradientCount > 0 ||
                     neuralDNA.dominantRadius !== '0px' || neuralDNA.aestheticLabels.some(l => l.includes('Glass')));
  if (hasEffects) {
    lines.push("### SPECIAL EFFECTS");
    if (neuralDNA!.backdropBlurCount > 0) {
      lines.push(`- Glassmorphism detected (${neuralDNA!.backdropBlurCount} elements with backdrop-blur)`);
      lines.push("  .glass {");
      lines.push("    background: rgba(255, 255, 255, 0.05);");
      lines.push("    backdrop-filter: blur(8px);");
      lines.push("    -webkit-backdrop-filter: blur(8px);");
      lines.push("    border: 1px solid rgba(255, 255, 255, 0.1);");
      lines.push("  }");
    }
    if (neuralDNA!.gradientCount > 0) {
      lines.push(`- Gradient treatments (${neuralDNA!.gradientCount} instances)`);
    }
    if (neuralDNA!.dominantRadius !== '0px' && parseFloat(neuralDNA!.dominantRadius) > 0) {
      lines.push(`- Border radius: ${neuralDNA!.dominantRadius} → ${toTailwindRadius(neuralDNA!.dominantRadius)}`);
    }
    lines.push("");
  }

  // 8. SCROLL EXPERIENCE (timeline + behavior)
  if (scrollBehaviorProfile) {
    const bp = scrollBehaviorProfile;
    lines.push("### SCROLL EXPERIENCE");
    lines.push(`Narrative Flow: ${bp.scrollNarrativeFlow}`);
    lines.push(`Estimated Duration: ${bp.estimatedScrollDuration}`);
    lines.push(`Animation Trigger: ${bp.animationTriggerType}`);
    lines.push(`Total Distinct Animations: ${bp.totalDistinctAnimations}`);
    lines.push("");
    if (bp.hasPinnedElements) lines.push("- ✅ Pinned/sticky elements — content overlays pinned backdrop");
    if (bp.hasParallax) lines.push("- ✅ Parallax depth — background moves slower than foreground");
    if (bp.hasFadeReveals) lines.push("- ✅ Fade-in reveals on scroll");
    if (bp.hasSlideReveals) lines.push("- ✅ Slide/fly-in animations on element entry");
    if (bp.hasScaleReveals) lines.push("- ✅ Scale/zoom reveals on element entry");
    if (bp.hasHorizontalScroll) lines.push("- ✅ Horizontal scroll rail detected");
    if (bp.hasClipPathTransitions) lines.push("- ✅ Clip-path section dividers");
    if (bp.hasCrossfadeTransitions) lines.push("- ✅ Crossfade transitions between sections");
    if (bp.hasStickyNavigation) lines.push("- ✅ Sticky navigation bar");
    if (bp.pinnedRegionDescription !== "No pinned/parallax regions detected") {
      lines.push(`Pinned Regions: ${bp.pinnedRegionDescription}`);
    }
    lines.push("");
  }

  // 9. SCROLL TIMELINE (element-level choreography)
  if (scrollTimelineEntries && scrollTimelineEntries.length > 0) {
    lines.push("### SCROLL TIMELINE (Choreography)");
    lines.push("```");
    lines.push("Scroll % | Action     | Element | Detail");
    lines.push("────────┼────────────┼─────────┼───────");
    scrollTimelineEntries.slice(0, 20).forEach(entry => {
      const pct = String(entry.scrollPercent).padStart(2);
      const action = entry.action.padEnd(10);
      const elTag = (entry.elementTag || entry.className || "").slice(0, 12).padEnd(12);
      lines.push(`${pct}%     | ${action} | ${elTag} | ${entry.detail.slice(0, 80)}`);
    });
    lines.push("```");
    lines.push("");
  } else {
    // Fallback to basic animation list
    lines.push("### ANIMATIONS");
    const allAnims = animations.slice(0, 6);
    if (allAnims.length > 0) {
      allAnims.forEach(a => {
        lines.push(`- ${a.name}: ${a.duration || '0.3s'} ${a.timing || 'ease'}${a.selector ? ` on ${a.selector}` : ''}`);
      });
    }
    if (transitions.length > 0) {
      transitions.slice(0, 4).forEach(t => {
        lines.push(`- Transition: ${t.property} ${t.duration || ''} ${t.timing || ''}${t.selector ? ` on ${t.selector}` : ''}`);
      });
    }
    if (allAnims.length === 0) {
      lines.push("- No keyframe animations detected — static layout");
    }
    lines.push("");
  }

  // 10. EXPERIENCE FLOW
  if (experienceFlow) {
    lines.push("### EXPERIENCE FLOW");
    lines.push(`Pacing: ${experienceFlow.pacing}`);
    lines.push(`Emotional Arc: ${experienceFlow.emotionalArc}`);
    lines.push("");
    lines.push("Section Purposes:");
    experienceFlow.sectionPurpose.slice(0, 8).forEach(p => lines.push(`- ${p}`));
    lines.push("");
    lines.push("Transition Styles:");
    experienceFlow.transitionStyles.slice(0, 5).forEach(t => lines.push(`- ${t}`));
    lines.push("");
    if (experienceFlow.peakEngagementPoints.length > 0) {
      lines.push("Peak Engagement Points:");
      experienceFlow.peakEngagementPoints.forEach(p => lines.push(`- ${p}`));
      lines.push("");
    }
  }

  // 10b. MOTION INTENSITY
  lines.push("### MOTION INTENSITY");
  let motionIntensity = 3;
  if (animations.length > 5) motionIntensity += 2;
  if (scrollTimelineEntries && scrollTimelineEntries.length > 5) motionIntensity += 3;
  if (interactiveEffects.stickyLayouts.length > 0) motionIntensity += 1;
  if (interactiveEffects.parallax.length > 0) motionIntensity += 1;
  
  lines.push(`Motion Intensity: ${Math.min(motionIntensity, 10)}/10`);
  lines.push(`Frequency: ${motionIntensity > 6 ? 'High' : motionIntensity > 3 ? 'Medium' : 'Minimal'}`);
  lines.push(`Pinned Sections: ${interactiveEffects.stickyLayouts.length}`);
  lines.push(`Reveal Animations: ${animations.length + (scrollTimelineEntries ? scrollTimelineEntries.filter(e => e.action === 'reveal' || e.action === 'animate').length : 0)}`);
  lines.push(`Scroll Driven: ${scrollTimelineEntries && scrollTimelineEntries.length > 0 ? 'Yes' : 'Minimal'}`);
  lines.push(`Hover Driven: ${(neuralDNA?.hoverTransforms?.length || 0) > 0 ? 'Yes' : 'Minimal'}`);
  lines.push("");

  // 11. CSS KEYFRAMES & HOVERS
  if (neuralDNA && (neuralDNA.keyframes.length > 0 || neuralDNA.hoverTransforms.length > 0)) {
    lines.push("### CSS KEYFRAMES & HOVER EFFECTS");
    if (neuralDNA.keyframes.length > 0) {
      neuralDNA.keyframes.slice(0, 3).forEach(kf => {
        lines.push("");
        lines.push("```css");
        lines.push(kf.css);
        lines.push("```");
      });
    }
    if (neuralDNA.hoverTransforms.length > 0) {
      lines.push("Hover Transforms:");
      neuralDNA.hoverTransforms.slice(0, 4).forEach(t => lines.push(`- ${t}`));
    }
    lines.push("");
  }

  // 12. AESTHETIC CLASSIFICATION
  lines.push("### AESTHETIC");
  if (neuralDNA) {
    lines.push(`Primary: ${neuralDNA.aestheticLabels.join(", ")}`);
    if (neuralDNA.backdropBlurCount < 3) {
      lines.push(`NOT glassmorphism — only ${neuralDNA.backdropBlurCount} blur instances detected`);
    }
    if (neuralDNA.gradientCount < 2) {
      lines.push(`No gradient overlays — clean solid backgrounds`);
    }
  } else {
    lines.push(`Primary: ${chosenStyle}`);
  }
  lines.push("");

  // 13. NEURAL DESIGN TRANSFER
  if (neuralDNA && scrape?.sourceURL) {
    const refHost = new URL(scrape.sourceURL).hostname;
    lines.push("### NEURAL DESIGN TRANSFER");
    lines.push(`Style reference: ${refHost}`);
    lines.push("");
    lines.push("Apply this visual DNA to the reconstruction:");
    lines.push("");
    if (neuralDNA.aestheticLabels.length > 0) {
      lines.push(`- Aesthetic: ${neuralDNA.aestheticLabels.join(", ")}`);
    }
    if (neuralDNA.colorPalette.length > 0) {
      lines.push(`- Color palette: ${neuralDNA.colorPalette.slice(0, 6).map(c => c.hex).join(", ")}`);
    }
    if (neuralDNA.loadedFonts.length > 0) {
      const uniqueRefFonts = [...new Set(neuralDNA.loadedFonts.map(f => f.family))];
      lines.push(`- Font families: ${uniqueRefFonts.join(", ")}`);
    }
    if (neuralDNA.spacingScale.length > 0) {
      lines.push(`- Spacing scale: ${neuralDNA.spacingScale.map(s => `${s}px`).join(", ")}`);
    }
    lines.push(`- Border radius: ${neuralDNA.dominantRadius} → ${toTailwindRadius(neuralDNA.dominantRadius)}`);
    if (neuralDNA.keyframes.length > 0) {
      lines.push(`- Active animations: ${neuralDNA.keyframes.map(k => k.name).join(", ")}`);
    }
    if (neuralDNA.cssVars && Object.keys(neuralDNA.cssVars).length > 0) {
      lines.push(`- CSS variables: ${JSON.stringify(neuralDNA.cssVars, null, 2).slice(0, 300)}`);
    }
    lines.push("");
    lines.push("Reconstruct the target site's STRUCTURE and CONTENT");
    lines.push("but apply the above style system as the visual language.");
    lines.push("");
  }

  // 14. EXPLICITLY EXCLUDE
  lines.push("### EXPLICITLY EXCLUDE");
  if (neuralDNA) {
    if (neuralDNA.backdropBlurCount <= 2) lines.push("- No decorative blur/blobs/glassmorphism effects");
    if (neuralDNA.gradientCount <= 2) lines.push("- No radial/linear gradient overlays");
  } else {
    lines.push("- No decorative blob shapes or glassmorphism unless listed above");
    lines.push("- No radial gradient overlays");
  }
  lines.push("- No box shadows unless extracted above");
  lines.push("- No placeholder images — use exact URLs extracted");
  lines.push("- No colors outside the palette above");
  const interactiveVals = Object.values(interactiveEffects).flat();
  if (interactiveVals.length === 0 || interactiveVals.every(v => !v)) {
    lines.push("- No parallax, scroll-triggered zoom, or custom cursor unless listed");
  }
  lines.push("");

  // 15. SECTION COPY
  lines.push("### SECTIONS (in order)");
  const sectionList = neuralDNA?.sectionSequence.length ? neuralDNA.sectionSequence : sections.map(s => s.name);
  sectionList.slice(0, 12).forEach((name, i) => {
    const section = sections.find(s => s.name.toLowerCase() === name.toLowerCase());
    const desc = section?.description || "";
    lines.push(`  ${i + 1}. ${name}${desc ? ` — ${desc}` : ""}`);
  });
  lines.push("");

  // 16. SCENE GRAPH (Narrative Storyboard)
  if (sceneGraph && sceneGraph.length > 0) {
    lines.push("### SCENE GRAPH (Narrative Storyboard)");
    sceneGraph.forEach(sg => lines.push(`- ${sg}`));
    lines.push("");
  }

  // 17. SPATIAL RELATIONSHIPS
  if (spatialHints && spatialHints.length > 0) {
    lines.push("### SPATIAL RELATIONSHIPS");
    spatialHints.forEach(h => lines.push(`- ${h}`));
    lines.push("");
  }

  // 18. DESIGN LANGUAGE
  if (designLang) {
    lines.push("### DESIGN LANGUAGE");
    lines.push(`Primary: ${designLang.primary}`);
    if (designLang.tags.length > 0) lines.push(`Tags: ${designLang.tags.join(", ")}`);
    lines.push(`Rationale: ${designLang.reasoning}`);
    lines.push("");
  }

  // 18b. DESIGN PHILOSOPHY
  if (dp.philosophy.length > 0) {
    lines.push("### DESIGN PHILOSOPHY");
    dp.philosophy.forEach(p => lines.push(`- ${p}`));
    lines.push("");
    lines.push("**Visual Language:**");
    dp.editorialPrinciples.forEach(p => lines.push(`- ${p}`));
    lines.push("");
    if (dp.references.length > 0) {
      lines.push(`**Reference Aesthetic:** ${dp.references.join(" / ")}`);
      lines.push("");
    }
  }

  // 18c. VISUAL WEIGHT & COMPOSITION
  if (dp.visualWeight.length > 0) {
    lines.push("### VISUAL WEIGHT & COMPOSITION");
    dp.visualWeight.forEach(v => lines.push(`- ${v}`));
    lines.push("");
  }

  // 19. CONTENT IMPORTANCE
  lines.push("### CONTENT IMPORTANCE");
  if (importanceScores && importanceScores.length > 0) {
    importanceScores.slice(0, 10).forEach(imp => {
      lines.push(`- ${imp.section}: ⭐${imp.score} — ${imp.label} (effort: ${imp.effort})`);
    });
  } else {
    lines.push("- No content importance scores available");
  }
  lines.push("");

  // 20. TYPOGRAPHY SCALE
  lines.push("### TYPOGRAPHIC SCALE");
  dp.typographicScale.forEach(t => lines.push(`- ${t}`));
  lines.push("");

  // 21. GRID MATHEMATICS
  lines.push("### GRID MATHEMATICS");
  dp.gridMathematics.forEach(g => lines.push(`- ${g}`));
  lines.push("");

  // 22. SPACING SYSTEM
  lines.push("### SPACING SYSTEM");
  dp.spacingSystem.forEach(s => lines.push(`- ${s}`));
  lines.push("");

  // 23. PHOTOGRAPHY STYLE
  lines.push("### PHOTOGRAPHY STYLE");
  dp.photographyStyle.forEach(p => lines.push(`- ${p}`));
  // Supplement with semantic image data
  if (semanticImages && semanticImages.length > 0) {
    lines.push("");
    lines.push("Detected images:");
    semanticImages.slice(0, 6).forEach(img => {
      lines.push(`  - ${img.name}: ${img.semantic} [${img.style}]`);
    });
  }
  lines.push("");

  // 24. MOTION LANGUAGE
  lines.push("### MOTION LANGUAGE");
  dp.motionLanguage.forEach(m => lines.push(`- ${m}`));
  lines.push("");

  // 25. CURSOR SPECIFICATION
  if (dp.cursorSpec.length > 0) {
    lines.push("### CURSOR SPECIFICATION");
    dp.cursorSpec.forEach(c => lines.push(`- ${c}`));
    lines.push("");
  }

  // 26. LAYER HIERARCHY
  if (layerHierarchy && layerHierarchy.length > 0) {
    lines.push("### LAYER HIERARCHY");
    layerHierarchy.slice(0, 8).forEach(l => lines.push(`- ${l}`));
    lines.push("");
  }

  // 27. WHAT MUST NEVER APPEAR
  lines.push("### ABSOLUTE DESIGN RULES — WHAT MUST NEVER APPEAR");
  dp.neverDo.forEach(n => lines.push(`❌ ${n}`));
  lines.push("");

  // 28. REBUILD STACK
  lines.push("### REBUILD STACK");
  lines.push(`${customization.framework} + ${customization.styling} + ${customization.animation}`);
  if (performanceForensics.fontDisplaySwap) lines.push("font-display: swap enabled");
  if (performanceForensics.lazyImagesPercent > 20) lines.push("lazy-loading: enabled");
  lines.push("");

  // 29. AI IMPLEMENTATION NOTES
  lines.push("### AI IMPLEMENTATION NOTES");
  lines.push("- Start with the hero section — it sets the entire visual tone");
  lines.push("- Build the spacing system first (CSS variables for margin/padding)");
  lines.push("- Implement custom cursor before anything else if detected");
  lines.push("- Use the exact font families — do NOT substitute with generic system fonts");
  lines.push("- All animations should be scroll-triggered via IntersectionObserver");
  lines.push("- Respect the color palette strictly — no new colors");
  lines.push("- The design intent is more important than pixel-perfect DOM replication");
  if (dp.references.length > 0) {
    lines.push(`- Mood reference: ${dp.references.slice(0,2).join(', ')} — study these aesthetics`);
  }
  lines.push("");

  return lines.join("\n");
}

function marqueeOrTicker($: CheerioAPI): boolean {
  return $("[class*=marquee], marquee, [class*=ticker]").length > 0;
}

function customCursorDetected($: CheerioAPI, rules: Rule[]): boolean {
  if ($("[class*=cursor], [id*=cursor], [data-cursor]").length > 0) return true;
  return rules.some(r => r.properties["cursor"] && !["auto", "pointer", "default"].includes(r.properties["cursor"]));
}

function findSectionElement($: CheerioAPI, sectionName: string): any {
  const lower = sectionName.toLowerCase();
  if (lower.includes("hero")) return $("[class*=hero], [id*=hero], [class*=banner]").get(0) || null;
  if (lower.includes("header") || lower.includes("navigation")) return $("header").get(0) || null;
  if (lower.includes("footer")) return $("footer").get(0) || null;
  if (lower.includes("features") || lower.includes("grid")) return $("[class*=feature], [class*=benefit]").get(0) || null;
  if (lower.includes("testimonial")) return $("[class*=testimonial]").get(0) || null;
  if (lower.includes("pricing")) return $("[class*=pricing]").get(0) || null;
  if (lower.includes("cta") || lower.includes("call")) return $("[class*=cta]").get(0) || null;
  if (lower.includes("faq")) return $("[class*=faq], [class*=accordion]").get(0) || null;
  if (lower.includes("main")) return $("main, [role=main]").get(0) || null;
  // Try matching by section heading
  const headingText = sectionName.replace(/^\d+\.\s*/, "");
  const h = $(`h1, h2, h3, h4`).filter((_, el) => cleanText($(el).text()).toLowerCase().includes(headingText.toLowerCase()));
  if (h.length > 0) return h.closest("section, div, article").get(0) || h.get(0);
  return null;
}

function getRulesForSelector(rules: Rule[], el: any): Rule[] {
  if (!el) return [];
  const elName = el.tagName || "";
  const elClass: string[] = (el.attribs?.class || "").split(/\s+/).filter(Boolean);
  const elId = el.attribs?.id || "";
  return rules.filter((r) => {
    const sel = r.selector;
    if (elId && sel.includes(`#${elId}`)) return true;
    if (elClass.some((c) => sel.includes(`.${c}`))) return true;
    if (sel === elName) return true;
    if (sel.startsWith(elName) && elClass.some((c) => sel.includes(c))) return true;
    return false;
  });
}

function generateStyleDNA(
  colors: ColorDef[],
  fonts: { family: string; usage: string }[],
  siteType: string,
  sections: { name: string; description: string }[],
  gradients: string[],
): string {
  const parts: string[] = [];
  const primary = colors.find((c) => c.role === "primary");
  const bg = colors.find((c) => c.role === "background");
  if (primary && bg) parts.push(`${bg.value} background with ${primary.value} accents`);
  else if (bg) parts.push(`${bg.value} background`);
  if (fonts.length > 0) parts.push(`${fonts[0].family} typography`);
  if (gradients.length > 0) parts.push("gradient treatments");
  const type = siteType.replace(/_/g, " ");
  const names = sections.slice(0, 4).map((s) => s.name.toLowerCase()).join(", ");
  let dna = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  if (parts.length > 0) dna += ` featuring ${parts.join(", ")}`;
  if (names) dna += `. Layout: ${names}`;
  return dna.slice(0, 300);
}


/* ─────────────────────────────────────────────────────────────
   Advanced Design Intelligence Generators & Clustering
   ───────────────────────────────────────────────────────────── */

function parseToRGB(colorStr: string): [number, number, number] | null {
  const s = colorStr.trim().toLowerCase();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b];
    }
  } else if (s.startsWith("rgb")) {
    const match = s.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
  }
  return null;
}

function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

function clusterPlaywrightColors(rawColors: { value: string; count: number }[]): ColorDef[] {
  const rgbColors: { rgb: [number, number, number]; original: string; count: number }[] = [];
  rawColors.forEach(c => {
    const rgb = parseToRGB(c.value);
    if (rgb) {
      rgbColors.push({ rgb, original: c.value, count: c.count });
    }
  });

  const clusters: { representative: [number, number, number]; colors: string[]; totalCount: number }[] = [];
  
  rgbColors.forEach(item => {
    let found = false;
    for (const cluster of clusters) {
      if (colorDistance(item.rgb, cluster.representative) < 35) {
        cluster.colors.push(item.original);
        cluster.totalCount += item.count;
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({
        representative: item.rgb,
        colors: [item.original],
        totalCount: item.count
      });
    }
  });

  clusters.sort((a, b) => b.totalCount - a.totalCount);

  const out: ColorDef[] = [];
  const usedNames = new Set<string>();
  clusters.slice(0, 10).forEach((cluster, idx) => {
    const r = cluster.representative;
    const hex = "#" + r.map(x => {
      const h = x.toString(16);
      return h.length === 1 ? "0" + h : h;
    }).join("");

    let role = "accent";
    let usage = "Secondary accent components";
    
    const brightness = (r[0] * 299 + r[1] * 587 + r[2] * 114) / 1000;
    if (brightness > 240) {
      role = idx === 0 ? "background" : "surface";
      usage = idx === 0 ? "Primary background backdrop" : "Card surface layer";
    } else if (brightness < 35) {
      role = "text";
      usage = "Primary text body color";
    } else if (idx === 0) {
      role = "primary";
      usage = "Main brand theme key color";
    } else if (idx === 1) {
      role = "secondary";
      usage = "Secondary interface color";
    }

    const baseName = hexToName(hex) || `${role}-${idx}`;
    let name = baseName;
    let counter = 1;
    while (usedNames.has(name)) {
      name = `${baseName}-${counter}`;
      counter++;
    }
    usedNames.add(name);
    out.push({
      name,
      value: hex,
      usage,
      role
    });
  });

  return out;
}

function clusterPlaywrightFonts(rawFonts: { family: string; size: string; weight: string; count: number }[]): { family: string; usage: string; weight: string; size: string }[] {
  const familiesMap = new Map<string, { sizeSum: number, count: number, weights: Set<string> }>();
  rawFonts.forEach(f => {
    const cleanFam = f.family.replace(/['"]/g, "").split(",")[0].trim();
    let stats = familiesMap.get(cleanFam);
    if (!stats) {
      stats = { sizeSum: 0, count: 0, weights: new Set<string>() };
      familiesMap.set(cleanFam, stats);
    }
    const pxSize = parseFloat(f.size) || 16;
    stats.sizeSum += pxSize * f.count;
    stats.count += f.count;
    if (f.weight) stats.weights.add(f.weight);
  });

  const sortedFamilies = Array.from(familiesMap.entries()).sort((a, b) => b[1].count - a[1].count);

  const out: { family: string; usage: string; weight: string; size: string }[] = [];
  sortedFamilies.slice(0, 3).forEach(([family, stats], idx) => {
    const avgSize = stats.sizeSum / stats.count;
    let usage = "Body copy / general text";
    if (avgSize > 22 || (idx === 1 && avgSize > 18)) {
      usage = "Section headings and titles";
    } else if (idx === 0 && sortedFamilies.length > 1) {
      usage = "Primary body interface text";
    } else if (idx === 2) {
      usage = "Metadata and small micro-caps";
    }

    const weightsArr = Array.from(stats.weights);
    out.push({
      family,
      usage,
      weight: weightsArr.join(", ") || "400",
      size: `${Math.round(avgSize)}px`
    });
  });

  return out;
}

function clusterSpacing(spacingVals: { value: string; count: number }[]): string[] {
  const map = new Map<number, number>();
  spacingVals.forEach(s => {
    const match = s.value.match(/^([\d.]+)(px|rem|em)$/);
    if (match) {
      let pxVal = parseFloat(match[1]);
      if (match[2] === "rem" || match[2] === "em") pxVal *= 16;
      const rounded = Math.round(pxVal);
      const common = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256];
      let closest = common[0];
      let minDiff = Infinity;
      common.forEach(c => {
        const diff = Math.abs(c - rounded);
        if (diff < minDiff) {
          minDiff = diff;
          closest = c;
        }
      });
      if (closest > 0) {
        map.set(closest, (map.get(closest) || 0) + s.count);
      }
    }
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .sort((a, b) => a[0] - b[0])
    .map(([val]) => `${val}px (${val / 16}rem)`);
}

function clusterRadii(radiiVals: { value: string; count: number }[]): string[] {
  const map = new Map<number, number>();
  radiiVals.forEach(r => {
    if (r.value.includes("%")) return;
    const match = r.value.match(/^([\d.]+)(px|rem|em)$/);
    if (match) {
      let pxVal = parseFloat(match[1]);
      if (match[2] === "rem" || match[2] === "em") pxVal *= 16;
      const rounded = Math.round(pxVal);
      const common = [0, 2, 4, 6, 8, 12, 16, 24, 32, 9999];
      let closest = common[0];
      let minDiff = Infinity;
      common.forEach(c => {
        const diff = Math.abs(c - rounded);
        if (diff < minDiff) {
          minDiff = diff;
          closest = c;
        }
      });
      if (closest > 0) {
        map.set(closest, (map.get(closest) || 0) + r.count);
      }
    }
  });
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .sort((a, b) => a[0] - b[0])
    .map(([val]) => val === 9999 ? "Full Rounded (9999px)" : `${val}px`);
}

function clusterShadows(shadowVals: { value: string; count: number }[]): string[] {
  const unique = new Set<string>();
  shadowVals.forEach(s => {
    const val = s.value.trim().toLowerCase();
    if (val === "none") return;
    if (val.includes("0px 1px 2px") || val.includes("0px 1px 3px")) {
      unique.add("Subtle Border Shadow (0px 1px 2px)");
    } else if (val.includes("0px 4px 6px") || val.includes("0px 5px 15px") || val.includes("0 4px 6px")) {
      unique.add("Medium Card Drop Shadow (0px 4px 6px)");
    } else if (val.includes("0px 10px 15px") || val.includes("0px 20px 25px")) {
      unique.add("Elevated Floating Shadow (0px 10px 20px)");
    } else {
      unique.add("Ambient Multi-layered Depth Shadow");
    }
  });
  return Array.from(unique).slice(0, 4);
}

function analyzeMotionFromFrames(scrollFrames: any[], hoverData: any[]): { classifications: string[], scores: { name: string, score: number }[] } {
  const motionTags = new Set<string>();
  const scores: { name: string, score: number }[] = [];

  const elStates = new Map<string, {
    tagName: string;
    opacityStart?: number;
    opacityEnd?: number;
    topStart?: number;
    topEnd?: number;
    scaleStart?: number;
    scaleEnd?: number;
    translateStart?: string;
    translateEnd?: string;
  }>();

  if (scrollFrames && scrollFrames.length > 0) {
    scrollFrames.forEach((frame) => {
      frame.elements.forEach((el: any) => {
        let state = elStates.get(el.id);
        if (!state) {
          state = { tagName: el.tagName };
          elStates.set(el.id, state);
        }
        
        const opacity = parseFloat(el.opacity);
        const top = el.top;
        
        let scale = 1;
        let translate = "";
        if (el.transform && el.transform !== "none") {
          const matchScale = el.transform.match(/scale\(([\d.]+)\)/);
          if (matchScale) scale = parseFloat(matchScale[1]);
          const matchMatrix = el.transform.match(/matrix\(([^)]+)\)/);
          if (matchMatrix) {
            const parts = matchMatrix[1].split(",").map((p: string) => parseFloat(p.trim()));
            if (parts.length === 6) {
              scale = Math.sqrt(parts[0]*parts[0] + parts[1]*parts[1]);
              if (Math.abs(parts[5]) > 10) translate = `translateY(${parts[5]}px)`;
            }
          }
        }

        if (state.opacityStart === undefined) {
          state.opacityStart = opacity;
          state.topStart = top;
          state.scaleStart = scale;
          state.translateStart = translate;
        }

        state.opacityEnd = opacity;
        state.topEnd = top;
        state.scaleEnd = scale;
        state.translateEnd = translate;
      });
    });
  }

  let fadeCount = 0;
  let slideCount = 0;
  let scaleCount = 0;
  let stickyCount = 0;
  let totalEl = 0;

  elStates.forEach((state) => {
    totalEl++;
    if (state.opacityStart !== undefined && state.opacityEnd !== undefined) {
      if (state.opacityStart < 0.4 && state.opacityEnd > 0.8) fadeCount++;
    }
    if (state.translateStart !== state.translateEnd && (state.translateStart || state.translateEnd)) slideCount++;
    if (state.scaleStart !== undefined && state.scaleEnd !== undefined) {
      if (Math.abs(state.scaleStart - state.scaleEnd) > 0.1) scaleCount++;
    }
    if (state.topStart !== undefined && state.topEnd !== undefined && Math.abs(state.topStart - state.topEnd) < 5 && state.tagName !== "body") {
      stickyCount++;
    }
  });

  const fadeConf = totalEl > 0 ? Math.min(99, Math.round((fadeCount / totalEl) * 400 + 40)) : 10;
  const slideConf = totalEl > 0 ? Math.min(99, Math.round((slideCount / totalEl) * 400 + 35)) : 10;
  const scaleConf = totalEl > 0 ? Math.min(99, Math.round((scaleCount / totalEl) * 400 + 15)) : 10;
  const stickyConf = stickyCount > 0 ? 95 : 12;

  scores.push({ name: "Fade Up", score: fadeConf });
  scores.push({ name: "Translate Slide", score: slideConf });
  scores.push({ name: "Zoom Reveal", score: scaleConf });
  scores.push({ name: "Sticky Pinned elements", score: stickyConf });

  let hoverLiftDetected = false;
  let hoverGlowDetected = false;
  let hoverColorShift = false;
  if (hoverData && hoverData.length > 0) {
    hoverData.forEach(h => {
      const bTrans = h.before.transform || "";
      const aTrans = h.after.transform || "";
      if (bTrans !== aTrans && (aTrans.includes("matrix") || aTrans.includes("translateY") || aTrans.includes("scale"))) {
        hoverLiftDetected = true;
      }
      const bShadow = h.before.boxShadow || "";
      const aShadow = h.after.boxShadow || "";
      if (bShadow !== aShadow && aShadow !== "none" && aShadow !== "") {
        hoverGlowDetected = true;
      }
      const bBg = h.before.backgroundColor || "";
      const aBg = h.after.backgroundColor || "";
      if (bBg !== aBg) {
        hoverColorShift = true;
      }
    });
  }

  scores.push({ name: "Hover Elastic Lift", score: hoverLiftDetected ? 94 : 15 });
  scores.push({ name: "Glow & Shadow Elevation", score: hoverGlowDetected ? 89 : 12 });
  scores.push({ name: "Interactive Color Shift", score: hoverColorShift ? 92 : 20 });

  scores.forEach(s => {
    if (s.score > 40) {
      motionTags.add(`${s.name} (${s.score}%)`);
    }
  });

  if (motionTags.size === 0) {
    motionTags.add("Subtle Transition Easing (45%)");
  }

  return {
    classifications: Array.from(motionTags),
    scores
  };
}

function calculateConfidenceScores(
  colorsCount: number,
  fontsCount: number,
  layoutCount: number,
  componentCount: number,
  motionScores: { name: string, score: number }[]
): {
  percentages: { colors: number, typography: number, layout: number, components: number, animations: number },
  indicators: { colors: "high" | "medium" | "low", typography: "high" | "medium" | "low", layout: "high" | "medium" | "low", animations: "high" | "medium" | "low" }
} {
  const colors = colorsCount >= 4 ? 98 : colorsCount >= 2 ? 85 : 45;
  const typography = fontsCount >= 2 ? 95 : 70;
  const layout = layoutCount >= 2 ? 94 : layoutCount === 1 ? 82 : 40;
  const components = componentCount >= 3 ? 96 : componentCount >= 1 ? 85 : 30;
  
  let maxMotion = 50;
  motionScores.forEach(s => {
    if (s.score > maxMotion) maxMotion = s.score;
  });
  const animations = maxMotion;

  const toIndicator = (pct: number): "high" | "medium" | "low" => {
    if (pct >= 85) return "high";
    if (pct >= 60) return "medium";
    return "low";
  };

  return {
    percentages: { colors, typography, layout, components, animations },
    indicators: {
      colors: toIndicator(colors),
      typography: toIndicator(typography),
      layout: toIndicator(layout),
      animations: toIndicator(animations),
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   Main Handler
   ───────────────────────────────────────────────────────────── */

async function extractReferenceStyleDNA(
  url: string
): Promise<StyleDNATransfer> {
  try {
    const { extractRichStyleDNA } = await import(/* @vite-ignore */ "./scan.server");
    return await extractRichStyleDNA(url);
  } catch (e) {
    console.error(`[Syclone] Neural Transfer extraction failed for ${url}:`, e);
    return {
      cssVars: {}, googleFontsUrl: null, loadedFonts: [], keyframes: [],
      videos: [], buttons: [], colorPalette: [], aestheticLabels: ['Standard Web'],
      spacingScale: [], dominantRadius: '0px', hoverTransforms: [],
      backdropBlurCount: 0, gradientCount: 0, sectionSequence: [],
    };
  }
}

async function analyzeUrl(
  url: string,
  tier: Tier,
  customization: z.infer<typeof CustomizationSchema>,
  styleDomainUrl?: string
): Promise<ScanResult> {
  let scrape;
  let neuralDNA: StyleDNATransfer | null = null;

  try {
    const { scrapeSite } = await import(/* @vite-ignore */ "./scan.server");
    scrape = await scrapeSite(url);
  } catch (e) {
    const hostname = new URL(url).hostname;
    scrape = {
      title: hostname,
      description: "",
      sourceURL: url,
      html: `<html><head><title>${hostname}</title></head><body></body></html>`
    };
  }

  // Neural Design Transfer — extract style DNA from reference URL
  if (styleDomainUrl && styleDomainUrl.trim()) {
    neuralDNA = await extractReferenceStyleDNA(styleDomainUrl.trim());
  }

  const $: CheerioAPI = cheerio.load(scrape.html);

  const cssText = extractCSSText(scrape.html);
  const cssRules = parseCSSRules(cssText);
  const inlineRules = extractInlineStyles($);
  const allRules = [...cssRules, ...inlineRules];

  let colors = extractColors(allRules, $);
  let fonts: { family: string; usage: string; weight: string; size: string }[] = extractFonts(allRules, $);
  let spacing = extractNumericValues(allRules, "padding").concat(extractNumericValues(allRules, "margin").slice(0, 6));
  let radiiVal = extractNumericValues(allRules, "border-radius");
  let shadowList = allRules
    .filter((r) => r.properties["box-shadow"])
    .map((r) => r.properties["box-shadow"])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 6);
  const gradientsList = extractGradients(allRules);

  const sections = analyzeSections($);
  const components = analyzeComponents($, allRules);
  const animations = extractAnimations(allRules, cssText);
  const transitions = extractTransitions(allRules);
  const assets = analyzeAssets($);
  const scrollLibs = detectScrollLibraries($);
  const interactiveEffects = detectInteractiveEffects($, allRules);

  const htmlText = $.html().toLowerCase();
  const techs: string[] = [];
  if (htmlText.includes("react") || htmlText.includes("react-dom")) techs.push("React");
  if (htmlText.includes("vue") || htmlText.includes("__vue")) techs.push("Vue");
  if (htmlText.includes("angular") || htmlText.includes("ng-")) techs.push("Angular");
  if (htmlText.includes("typescript") || htmlText.includes(".ts'") || htmlText.includes(".tsx")) techs.push("TypeScript");
  if (htmlText.includes("tailwind") || htmlText.includes("dark:") || htmlText.includes("sm:")) techs.push("Tailwind CSS");
  if (htmlText.includes("bootstrap") || htmlText.includes("col-")) techs.push("Bootstrap");
  if (htmlText.includes("jquery") || htmlText.includes("jQuery")) techs.push("jQuery");

  const responsiveMqs = (extractCSSText(scrape.html).match(/@media\s*[^{]+/g) || []).slice(0, 6);

  const designDNA = analyzeDesignDNA(colors, spacing);
  const responsiveArchaeology = analyzeResponsiveArchaeology($, allRules, responsiveMqs);
  const accessibilityAutopsy = analyzeAccessibilityAutopsy($, colors, responsiveMqs);
  const performanceForensics = analyzePerformanceForensics($, allRules);
  let implementationStack = "React + Tailwind + CSS-only";
  if (interactiveEffects.stickyLayouts.length > 0 || animations.length > 5 || scrollLibs.length > 0) {
     implementationStack = "React + Tailwind + Framer Motion (for complex viewport/scroll reveals)";
  }
  const codeArchaeology = analyzeCodeArchaeology($, techs);
  codeArchaeology.stackRecommendation = implementationStack;
  const darkModeArchaeologist = analyzeDarkMode($, colors);

  const siteType = determineSiteType($);
  const complexityScore = calculateComplexity($, allRules, sections.length, components.length, animations.length);
  const styleDNA = generateStyleDNA(colors, fonts, siteType, sections, gradientsList);

  let layoutIntelligence = detectLayoutIntelligence($, allRules);
  let componentIntelligence = detectComponentIntelligence($, allRules);
  const storyFlow = detectStorytellingFlow(sections);
  let animationClassifications = detectAnimationClassifications(allRules, $);
  let motionScores: { name: string, score: number }[] = [];

  if (scrape.playwrightData) {
    const pw = scrape.playwrightData;
    colors = clusterPlaywrightColors(pw.computedStyles.colors);
    fonts = clusterPlaywrightFonts(pw.computedStyles.fonts);
    spacing = clusterSpacing(pw.computedStyles.spacing);
    radiiVal = clusterRadii(pw.computedStyles.radii);
    shadowList = clusterShadows(pw.computedStyles.shadows);

    const motionResult = analyzeMotionFromFrames(pw.scrollFrames, pw.hoverData);
    animationClassifications = motionResult.classifications;
    motionScores = motionResult.scores;
  }

  const confidenceData = calculateConfidenceScores(
    colors.length,
    fonts.length,
    layoutIntelligence.length,
    componentIntelligence.length,
    motionScores
  );

  const screenshots = scrape.playwrightData?.screenshots || {
    desktop: "",
    laptop: "",
    tablet: "",
    mobile: ""
  };

  const visualMetrics = scrape.playwrightData?.visualMetrics || {
    whitespacePercent: 40,
    negativeSpaceScore: "Balanced (Corporate/Editorial)",
    gridDensity: "Simple Flow Columns",
    imageRatios: ["No Image Assets"],
    visualBalance: "Symmetrical Visual Grid",
    typographyRhythm: "Standard Linear Typography Scale",
  };

  const { scenes, narrativeSummary } = generateSceneGraph(sections, interactiveEffects, animations, designDNA, $, allRules);
  const sceneGraph = scenes.map(s => `${s.name} [${s.type}]: ${s.transition}`);
  const spatialHints = analyzeSpatialRelationships($, allRules);
  const designLang = classifyDesignLanguage($, colors, fonts, interactiveEffects, siteType, allRules);
  const importanceScores = scoreContentImportance(sections, $, allRules);
  const semanticImages = analyzeImagesSemantically($);
  const layerHierarchy = analyzeLayerHierarchy($, allRules);
  const richFonts = extractRichFontDetails(fonts, $, allRules, scrape?.playwrightData?.fontDetails);
  const { timeline: scrollTimelineEntries, behaviorProfile: scrollBehaviorProfile } = buildScrollTimeline(
    scrape?.playwrightData?.scrollTimeline, animations, transitions, allRules, $
  );
  const experienceFlow = extractExperienceFlow(sections, scrollTimelineEntries, scrollBehaviorProfile, animations);

  const megaPrompt = generateMegaPrompt(
    $, colors, fonts, spacing, radiiVal, shadowList, gradientsList,
    sections, components, animations, transitions, assets,
    allRules, siteType, complexityScore, scrollLibs, tier,
    interactiveEffects,
    designDNA,
    responsiveArchaeology,
    accessibilityAutopsy,
    performanceForensics,
    codeArchaeology,
    darkModeArchaeologist,
    customization,
    visualMetrics,
    confidenceData.percentages,
    neuralDNA,
    scrape,
    sceneGraph,
    spatialHints,
    designLang,
    importanceScores,
    semanticImages,
    layerHierarchy,
    richFonts,
    scrollTimelineEntries,
    scrollBehaviorProfile,
    experienceFlow
  );

  // Quality score logic
  let promptScore = 80;
  if (accessibilityAutopsy.ariaCompleteness > 75) promptScore += 5;
  if (performanceForensics.lazyImagesPercent > 40) promptScore += 5;
  if (colors.length > 5) promptScore += 5;
  if (sections.length > 3) promptScore += 5;
  promptScore = Math.min(promptScore, 100);

  const missingElements: string[] = [];
  if (accessibilityAutopsy.ariaCompleteness < 80) {
    missingElements.push("⚠️ Low ARIA completeness — add explicit aria-labels to interactive elements");
  }
  if (!allRules.some(r => r.selector.includes(":hover"))) {
    missingElements.push("⚠️ Could not detect hover states — add transition hooks manually");
  }
  if (!responsiveArchaeology.touchOptimization) {
    missingElements.push("⚠️ Touch optimization constraints not detected — enlarge button spacing");
  }

  const abVariants = generateABVariants(scrape.title || new URL(url).hostname, siteType);
  const storybookComponents = generateStorybookComponents(customization.framework, customization.styling, colors, radiiVal);
  const cursorRules = generateCursorRules(scrape.title || new URL(url).hostname, customization.framework, customization.styling, colors);
  const figmaSpec = generateFigmaSpec(scrape.title || new URL(url).hostname, colors, fonts, spacing);
  const markdownReport = generateMarkdownReport(
    $,
    scrape.title || new URL(url).hostname,
    siteType,
    complexityScore,
    accessibilityAutopsy,
    performanceForensics,
    codeArchaeology,
    colors,
    sections,
    fonts,
    spacing,
    radiiVal,
    shadowList,
    animations,
    interactiveEffects,
    responsiveArchaeology,
    customization
  );
  const replicatedCode = generateReplicatedCode($, url, colors, sections, customization, fonts);

  return {
    siteName: scrape.title || new URL(url).hostname,
    siteType,
    complexityScore,
    styleDNA,
    megaPrompt,
    designTokens: {
      colors: colors.slice(0, 12).map((c) => ({ name: c.name, value: c.value, usage: c.usage })),
      fonts: fonts.slice(0, 6).map((f) => ({ family: f.family, usage: f.usage })),
      spacing: spacing.slice(0, 10),
      radii: radiiVal.slice(0, 6),
      shadows: shadowList,
    },
    sections: sections.slice(0, 12),
    components: components.slice(0, 12),
    animations: animations.slice(0, 6).map((a) => ({
      name: a.name,
      details: `${a.duration ? `duration: ${a.duration}` : ""}${a.timing ? `, easing: ${a.timing}` : ""}${a.iteration ? `, iteration: ${a.iteration}` : ""}${a.selector ? `, on: ${a.selector}` : ""}`,
    })),
    assets: assets.slice(0, 6),
    interactiveEffects,
    designDNA,
    responsiveArchaeology,
    accessibilityAutopsy,
    performanceForensics,
    codeArchaeology,
    darkModeArchaeologist,
    promptScore,
    missingElements,
    confidenceIndicators: confidenceData.indicators,
    confidencePercentages: confidenceData.percentages,
    screenshots,
    visualMetrics,
    abVariants,
    storybookComponents,
    cursorRules,
    figmaSpec,
    markdownReport,
    replicatedCode,
    layoutIntelligence,
    componentIntelligence,
    storyFlow,
    animationClassifications,
    sceneGraph,
    spatialHints,
    designLang,
    importanceScores,
    semanticImages,
    layerHierarchy,
    richFonts,
    scrollTimelineEntries,
    scrollBehaviorProfile,
    experienceFlow,
  };
}

export const scanWebsite = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<{ results: ScanResult[]; error: string | null }> => {
    try {
      const urls: string[] = [];
      if (data.mode === "single") {
        if (data.url) urls.push(data.url);
      } else if (data.urls && data.urls.length > 0) {
        urls.push(...data.urls);
      }

      if (urls.length === 0) {
        return { results: [], error: "No URLs provided for scanning." };
      }

      // Scan up to 10 URLs in parallel
      const activeUrls = urls.slice(0, 10);
      const results: ScanResult[] = [];
      
      for (const u of activeUrls) {
        const normalized = /^https?:\/\//i.test(u) ? u : `https://${u}`;
        try {
          const res = await analyzeUrl(normalized, data.tier, data.customization, data.styleDomainUrl);
          results.push(res);
        } catch (err) {
          console.error(`Failed to analyze ${normalized}:`, err);
        }
      }

      if (results.length === 0) {
        return { results: [], error: "All URL scans failed. Please verify the web addresses." };
      }

      return { results, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Analysis failed:", msg);
      return { results: [], error: `Analysis error: ${msg}` };
    }
  });
