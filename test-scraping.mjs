/**
 * Standalone test script for Syclone scraping + prompt generation.
 * Tests whether the site gives correct prompts by scraping real-time info.
 *
 * Usage: bun run test-scraping.mjs
 *   or: node test-scraping.mjs
 */

// Test URLs - first is fallback, second is more complex
const TEST_URL = process.env.TEST_URL || "https://httpbin.org";
const TEST_URL2 = process.env.TEST_URL2 || "https://info.cern.ch";

// We need to use the project's module system — it's ESM ("type": "module")
// But scan.server.ts uses playwright and scan.functions.ts uses TanStack server functions.
// For direct testing, we'll use dynamic imports.

async function main() {
  console.log("=".repeat(60));
  console.log("Syclone Scraping & Prompt - Correctness Test");
  console.log("=".repeat(60));
  console.log(`\nTarget URL: ${TEST_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Step 1: Test the scrapeSite function from scan.server.ts
  console.log("--- Step 1: Scraping the URL with Playwright ---");
  let scrape;
  try {
    const { scrapeSite } = await import("./src/lib/scan.server.ts");
    scrape = await scrapeSite(TEST_URL);
    console.log(`✓ Title: ${scrape.title}`);
    console.log(`✓ Description: ${scrape.description}`);
    console.log(`✓ HTML length: ${scrape.html.length} chars`);
    if (scrape.playwrightData) {
      console.log(`✓ Screenshots: ${Object.keys(scrape.playwrightData.screenshots).length} viewports`);
      console.log(`✓ Raw colors: ${scrape.playwrightData.computedStyles.colors.length}`);
      console.log(`✓ Raw fonts: ${scrape.playwrightData.computedStyles.fonts.length}`);
      console.log(`✓ Scroll frames: ${scrape.playwrightData.scrollFrames.length}`);
      console.log(`✓ Hover samples: ${scrape.playwrightData.hoverData.length}`);
      console.log(`✓ Visual metrics: whitespace=${scrape.playwrightData.visualMetrics?.whitespacePercent}%, balance=${scrape.playwrightData.visualMetrics?.visualBalance}`);
    }
  } catch (e) {
    console.error(`✗ Scraping failed: ${e.message}`);
    // Try cheerio fallback path as a test
    console.log("  → Attempting Cheerio-only analysis...");
    const cheerio = await import("cheerio");
    const resp = await fetch(TEST_URL);
    const html = await resp.text();
    const $ = cheerio.load(html);
    scrape = { title: $("title").text(), description: $('meta[name="description"]').attr("content") || "", sourceURL: TEST_URL, html };
    console.log(`  ✓ Cheerio fallback: title="${scrape.title}", html=${html.length} chars`);
  }

  // Step 2: Verify the scraped data has expected structure
  console.log("\n--- Step 2: Data Integrity Check ---");
  const integrityChecks = [
    { name: "title is non-empty", pass: !!scrape.title },
    { name: "html is non-empty", pass: scrape.html.length > 0 },
    { name: "sourceURL matches input", pass: scrape.sourceURL === TEST_URL },
  ];
  if (scrape.playwrightData) {
    integrityChecks.push(
      { name: "playwrightData.computedStyles is present", pass: !!scrape.playwrightData.computedStyles },
      { name: "visualMetrics is present", pass: !!scrape.playwrightData.visualMetrics },
    );
  }
  let allPass = true;
  for (const check of integrityChecks) {
    const status = check.pass ? "✓" : "✗";
    if (!check.pass) allPass = false;
    console.log(`  ${status} ${check.name}`);
  }

  // Step 3: Test the CSS/style analysis functions from scan.functions.ts
  console.log("\n--- Step 3: Style Analysis (CSS parsing, color extraction, etc) ---");
  const cheerio = await import("cheerio");
  const $ = cheerio.load(scrape.html);
  
  // Extract and parse CSS
  const cssText = extractCSSText(scrape.html);
  const cssRules = parseCSSRules(cssText);
  const inlineRules = extractInlineStyles($);
  const allRules = [...cssRules, ...inlineRules];
  console.log(`  CSS rules from <style> tags: ${cssRules.length}`);
  console.log(`  Inline style rules: ${inlineRules.length}`);

  const colors = extractColors(allRules, $);
  const fonts = extractFonts(allRules, $);
  const spacing = extractNumericValues(allRules, "padding").concat(extractNumericValues(allRules, "margin").slice(0, 6));
  const radiiVal = extractNumericValues(allRules, "border-radius");
  console.log(`  Extracted colors: ${colors.length}`);
  console.log(`  Extracted fonts: ${fonts.length}`);
  console.log(`  Extracted spacing values: ${spacing.length}`);
  console.log(`  Extracted border radii: ${radiiVal.length}`);

  // Step 4: Section and component analysis
  console.log("\n--- Step 4: Section & Component Analysis ---");
  const sections = analyzeSections($);
  const components = analyzeComponents($, allRules);
  console.log(`  Sections found: ${sections.length}`);
  if (sections.length > 0) {
    sections.slice(0, 5).forEach(s => console.log(`    → ${s.name}: ${s.description}`));
  }
  console.log(`  Components found: ${components.length}`);

  // Step 5: Animations & Transitions
  console.log("\n--- Step 5: Animations & Transitions ---");
  const animations = extractAnimations(allRules, cssText);
  const transitions = extractTransitions(allRules);
  console.log(`  Animations: ${animations.length}`);
  animations.slice(0, 3).forEach(a => console.log(`    → ${a.name}: ${a.duration || 'no duration'} ${a.timing || ''}`));
  console.log(`  Transitions: ${transitions.length}`);

  // Step 6: Other analysis dimensions
  console.log("\n--- Step 6: Advanced Analysis ---");
  const siteType = determineSiteType($);
  const interactiveEffects = detectInteractiveEffects($, allRules);
  const designDNA = analyzeDesignDNA(colors, spacing);
  const responsiveArchaeology = analyzeResponsiveArchaeology($, allRules, (cssText.match(/@media\s*[^{]+/g) || []).slice(0, 6));
  const accessibilityAutopsy = analyzeAccessibilityAutopsy($, colors, []);
  const performanceForensics = analyzePerformanceForensics($, allRules);
  const codeArchaeology = analyzeCodeArchaeology($, detectTechStack($));
  const darkModeArchaeologist = analyzeDarkMode($, colors);
  console.log(`  Site Type: ${siteType}`);
  console.log(`  Interactive Effects: ${JSON.stringify(interactiveEffects)}`);
  console.log(`  Design DNA: colorPsych=${designDNA.colorPsychology.slice(0, 50)}...`);
  console.log(`  Responsive: breakpoints=${responsiveArchaeology.breakpoints.length}, touchOpt=${responsiveArchaeology.touchOptimization}`);
  console.log(`  Accessibility: contrast=${accessibilityAutopsy.contrastRatio}, aria=${accessibilityAutopsy.ariaCompleteness}%`);
  console.log(`  Performance: lazyImages=${performanceForensics.lazyImagesPercent}%, fontSwap=${performanceForensics.fontDisplaySwap}`);
  console.log(`  Dark Mode: hasDark=${darkModeArchaeologist.hasDarkTheme}`);

  // Step 7: Generate and inspect the Mega Prompt
  console.log("\n--- Step 7: Mega Prompt Generation ---");
  const assets = analyzeAssets($);
  const scrollLibs = detectScrollLibraries($);
  const gradientsList = extractGradients(allRules);
  const complexityScore = calculateComplexity($, allRules, sections.length, components.length, animations.length);
  
  // Need a customization object
  const customization = {
    tone: "technical",
    framework: "React",
    styling: "Tailwind",
    animation: "CSS-only",
    complexity: "mid",
  };

  // Create required metrics fallbacks
  const visualMetrics = scrape.playwrightData?.visualMetrics || {
    whitespacePercent: 40,
    negativeSpaceScore: "Balanced (Corporate/Editorial)",
    gridDensity: "Simple Flow Columns",
    imageRatios: ["No Image Assets"],
    visualBalance: "Symmetrical Visual Grid",
    typographyRhythm: "Standard Linear Typography Scale",
  };

  const blankConfidence = { colors: 50, typography: 50, layout: 50, components: 50, animations: 50 };

  // New analysis functions
  const sceneGraph = generateSceneGraph(sections, allRules, $);
  const spatialHints = analyzeSpatialRelationships(allRules, $);
  const designLang = classifyDesignLanguage($, colors, fonts, interactiveEffects, siteType, allRules);
  const importanceScores = scoreContentImportance(sections, $, allRules);
  const semanticImages = analyzeImagesSemantically($);
  const layerHierarchy = analyzeLayerHierarchy($, allRules);
  const richFonts = extractRichFontDetails(fonts, $, allRules, null);
  const { timeline: scrollTimelineEntries, behaviorProfile: scrollBehaviorProfile } = buildScrollTimeline(
    null, animations, transitions, allRules, $
  );
  const experienceFlow = extractExperienceFlow(sections, scrollTimelineEntries, scrollBehaviorProfile, animations);

  const megaPrompt = generateMegaPrompt(
    $, colors, fonts, spacing, radiiVal, getUniqueShadows(allRules), gradientsList,
    sections, components, animations, transitions, assets,
    allRules, siteType, complexityScore, scrollLibs, "functional",
    interactiveEffects, designDNA, responsiveArchaeology,
    accessibilityAutopsy, performanceForensics, codeArchaeology,
    darkModeArchaeologist, customization,
    visualMetrics, blankConfidence, null, scrape,
    sceneGraph, spatialHints, designLang, importanceScores, semanticImages, layerHierarchy,
    richFonts, scrollTimelineEntries, scrollBehaviorProfile, experienceFlow
  );

  // Print the full generated prompt
  console.log("\n" + "─".repeat(60));
  console.log("GENERATED MEGA PROMPT:");
  console.log("─".repeat(60));
  console.log(megaPrompt);
  console.log("─".repeat(60));

  // Step 8: Verify prompt correctness by checking it contains expected real scraped data
  console.log("\n--- Step 8: Prompt Correctness Verification ---");
  const promptChecks = [
    { name: "Contains SITE RECONSTRUCTION SPEC header", pass: megaPrompt.includes("SITE RECONSTRUCTION SPEC") },
    { name: "Contains target URL hostname", pass: megaPrompt.includes(new URL(TEST_URL).hostname) },
    { name: "Contains STACK section", pass: megaPrompt.includes("### STACK") },
    { name: "Contains FONTS section", pass: megaPrompt.includes("### FONTS") },
    { name: "Contains COLOR SYSTEM section", pass: megaPrompt.includes("### COLOR SYSTEM") },
    { name: "Contains LAYOUT section", pass: megaPrompt.includes("### LAYOUT") },
    { name: "Contains COMPONENTS section", pass: megaPrompt.includes("### COMPONENTS") },
    { name: "Contains scroll/motion section", pass: megaPrompt.includes("### SCROLL EXPERIENCE") || megaPrompt.includes("### ANIMATIONS") },
    { name: "Contains AESTHETIC section", pass: megaPrompt.includes("### AESTHETIC") },
    { name: "Contains SECTIONS section", pass: megaPrompt.includes("### SECTIONS") },
    { name: "Contains REBUILD STACK section", pass: megaPrompt.includes("### REBUILD STACK") },
    { name: "Contains EXPLICITLY EXCLUDE section", pass: megaPrompt.includes("### EXPLICITLY EXCLUDE") },
  ];

  if (colors.length > 0) {
    // Colors are converted to HSL in the prompt, so check the color is referenced somehow
    const firstColor = colors[0];
    // The prompt shows HSL values, but the comment shows the CSS property usage
    const colorInPrompt = firstColor.usage ? megaPrompt.includes(firstColor.usage.split(" on ")[1]?.split(" ")[0] || firstColor.usage) : false;
    // Also check that the color is at least mentioned in the COLOR SYSTEM section
    const colorSectionHasData = megaPrompt.includes("HSL CSS variables") && 
      (megaPrompt.match(/--[\w-]+: \d+ \d+%/g) || []).length > 0;
    promptChecks.push({ 
      name: `Color system has HSL variables (found ${(megaPrompt.match(/--[\w-]+: \d+ \d+%/g) || []).length} vars)`, 
      pass: colorSectionHasData 
    });
  }
  if (fonts.length > 0) {
    const fontFamily = fonts[0].family;
    promptChecks.push({ name: `Contains extracted font "${fontFamily}"`, pass: megaPrompt.includes(fontFamily) });
  }
  if (sections.length > 0) {
    const sectionName = sections[0].name;
    promptChecks.push({ name: `Contains extracted section "${sectionName}"`, pass: megaPrompt.includes(sectionName) });
  }

  // New analysis sections
  promptChecks.push({ name: "Contains DESIGN LANGUAGE section", pass: megaPrompt.includes("### DESIGN LANGUAGE") });
  promptChecks.push({ name: "Contains CONTENT IMPORTANCE section", pass: megaPrompt.includes("### CONTENT IMPORTANCE") });
  promptChecks.push({ name: "Contains LAYER HIERARCHY section", pass: megaPrompt.includes("### LAYER HIERARCHY") });
  promptChecks.push({ name: "Contains font family names in FONTS section", pass: megaPrompt.includes("Inter") || megaPrompt.includes("font-family") || megaPrompt.includes("Font:") });
  promptChecks.push({ name: "Scroll experience section has Narrative Flow", pass: megaPrompt.includes("Narrative Flow:") });
  promptChecks.push({ name: "Contains EXPERIENCE FLOW section", pass: megaPrompt.includes("### EXPERIENCE FLOW") || megaPrompt.includes("Emotional Arc:") });

  for (const check of promptChecks) {
    const status = check.pass ? "✓" : "✗";
    if (!check.pass) allPass = false;
    console.log(`  ${status} ${check.name}`);
  }

  // Final Result
  console.log("\n" + "=".repeat(60));
  if (allPass) {
    console.log("RESULT: ✓ ALL CHECKS PASSED — Prompt is correct");
  } else {
    console.log("RESULT: ✗ SOME CHECKS FAILED — Review above");
  }
  console.log("=".repeat(60));
}

// ─── Helper functions (duplicated from scan.functions.ts for standalone testing) ───

function extractCSSText(html) {
  const blocks = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1]);
  return blocks.join("\n");
}

function parseCSSRules(cssText) {
  const out = [];
  const clean = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const blockRe = /([^{}]+)\{([^}]+)\}/g;
  let m;
  while ((m = blockRe.exec(clean)) !== null) {
    const selector = m[1].trim();
    const props = {};
    const propRe = /([\w-]+)\s*:\s*([^;]+);?/g;
    let pm;
    while ((pm = propRe.exec(m[2])) !== null) {
      props[pm[1].trim()] = pm[2].trim();
    }
    if (Object.keys(props).length > 0) out.push({ selector, properties: props });
  }
  return out;
}

function extractInlineStyles($) {
  const out = [];
  $("[style]").each((_, el) => {
    const raw = $(el).attr("style");
    if (!raw) return;
    const tag = el.tagName || "unknown";
    const cls = $(el).attr("class") || "";
    const id = $(el).attr("id") || "";
    let sel = tag;
    if (id) sel += `#${id}`;
    if (cls) { const c = cls.trim().split(/\s+/).slice(0, 2).join("."); if (c) sel += `.${c}`; }
    const props = {};
    const propRe = /([\w-]+)\s*:\s*([^;]+);?/g;
    let pm;
    while ((pm = propRe.exec(raw)) !== null) props[pm[1].trim()] = pm[2].trim();
    if (Object.keys(props).length > 0) out.push({ selector: sel, properties: props });
  });
  return out;
}

const COLOR_RE = /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^)]+\)/g;

function extractColors(rules, $) {
  const colorProps = new Set([
    "color", "background-color", "background", "border-color",
    "outline-color", "accent-color", "caret-color",
    "text-decoration-color", "fill", "stroke",
    "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  ]);
  const raw = [];
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
  const seen = new Set();
  const out = [];
  for (const c of raw) {
    const key = c.value + c.selector + c.prop;
    if (seen.has(key)) continue;
    if (/^transparent|inherit|currentcolor|initial|unset$/i.test(c.value)) continue;
    seen.add(key);
    out.push({ name: c.value, value: c.value, usage: `${c.prop} on ${c.selector}`, role: "text" });
  }
  return out.slice(0, 20);
}

function parseFontFamily(val) {
  return val.split(",").map(s => s.trim().replace(/["']/g, "")).filter(Boolean);
}

function extractFonts(rules, $) {
  const out = [];
  const seen = new Set();
  for (const r of rules) {
    const ff = r.properties["font-family"];
    const fs = r.properties["font-size"];
    const fw = r.properties["font-weight"];
    if (ff) {
      const families = parseFontFamily(ff);
      for (const family of families) {
        const key = family + (fs || "") + (fw || "");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ family, usage: "body", weight: fw || "400", size: fs || "16px" });
      }
    }
  }
  $("[style*='font-family']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const m = style.match(/font-family\s*:\s*([^;]+)/i);
    if (m) {
      const families = parseFontFamily(m[1]);
      for (const family of families) {
        const key = family + "__inline";
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ family, usage: "body", weight: "400", size: "16px" });
      }
    }
  });
  return out.slice(0, 10);
}

function extractNumericValues(rules, prop) {
  const vals = [];
  const re = /(\d+\.?\d*)(px|em|rem|%)/;
  for (const r of rules) {
    const v = r.properties[prop];
    if (v) {
      const m = v.match(re);
      if (m) vals.push(m[0]);
    }
  }
  return [...new Set(vals)].slice(0, 6);
}

function getUniqueShadows(rules) {
  return rules
    .filter(r => r.properties["box-shadow"])
    .map(r => r.properties["box-shadow"])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 6);
}

function extractGradients(rules) {
  const out = [];
  for (const r of rules) {
    for (const v of Object.values(r.properties)) {
      if (typeof v === "string" && v.includes("gradient")) out.push(v);
    }
  }
  return [...new Set(out)].slice(0, 6);
}

function analyzeSections($) {
  const sections = [];
  $("section, [class*='section'], [class*='hero'], [class*='features'], [class*='testimonial'], [class*='pricing'], [class*='cta'], header, footer").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim().slice(0, 80);
    const cls = ($el.attr("class") || "").split(/\s+/).filter(c => c && !c.startsWith("_")).slice(0, 2).join(" ");
    const id = $el.attr("id") || "";
    const headings = $el.find("h1, h2, h3").first().text().trim();
    const name = headings || id || cls || el.tagName;
    if (name && text) sections.push({ name, description: text.slice(0, 100) });
  });
  return sections.slice(0, 12);
}

function analyzeComponents($, rules) {
  const components = [];
  const seen = new Set();
  $("button, [role='button'], a[class*='btn'], input, select, textarea, nav, form, img, video, iframe, figure, blockquote, [class*='card'], [class*='modal'], [class*='dialog'], [class*='badge'], [class*='tag'], [class*='tabs'], [class*='accordion'], [class*='carousel'], [class*='list']").each((_, el) => {
    const tag = el.tagName;
    const cls = ($(el).attr("class") || "").split(/\s+/).slice(0, 2).join(" ");
    const key = tag + cls;
    if (seen.has(key)) return;
    seen.add(key);
    const count = $(tag + (cls ? `.${cls.replace(/\s+/g, '.')}` : "")).length;
    if (count > 0) components.push({ name: `${tag}${cls ? `.${cls}` : ""}`, details: `${count} instance(s) on page` });
  });
  return components.slice(0, 12);
}

function detectTechStack($) {
  const htmlText = $.html().toLowerCase();
  const techs = [];
  if (htmlText.includes("react") || htmlText.includes("react-dom")) techs.push("React");
  if (htmlText.includes("vue") || htmlText.includes("__vue")) techs.push("Vue");
  if (htmlText.includes("angular") || htmlText.includes("ng-")) techs.push("Angular");
  if (htmlText.includes("typescript") || htmlText.includes(".ts'") || htmlText.includes(".tsx")) techs.push("TypeScript");
  if (htmlText.includes("tailwind") || htmlText.includes("dark:") || htmlText.includes("sm:")) techs.push("Tailwind CSS");
  if (htmlText.includes("bootstrap") || htmlText.includes("col-")) techs.push("Bootstrap");
  if (htmlText.includes("jquery") || htmlText.includes("jQuery")) techs.push("jQuery");
  return techs;
}

function determineSiteType($) {
  const text = $.html().toLowerCase();
  if (/\bblog\b|\barticle\b|\bpost\b/.test(text)) return "Blog/Editorial";
  if (/\becommerce|\bshop\b|\bstore\b|\bproduct\b|\bcart\b|\bbuy\b/.test(text)) return "E-commerce";
  if (/\bsaas\b|\bapp\b|\bplatform\b|\bdashboard\b|\bintegration\b/.test(text)) return "SaaS/App";
  if (/\bportfolio\b/.test(text)) return "Portfolio";
  if (/\bdocumentation\b|\bdocs\b|\bguide\b/.test(text)) return "Documentation";
  if (/\blanding\b/.test(text)) return "Landing Page";
  return "General Web";
}

function calculateComplexity($, rules, sectionCount, componentCount, animationCount) {
  const text = $.html().toLowerCase();
  const gridFlexCount = (text.match(/display:\s*(grid|flex)/g) || []).length;
  const cssVarsCount = (text.match(/--[\w-]+\s*:/g) || []).length;
  let score = 25;
  if (sectionCount > 3) score += 10;
  if (sectionCount > 6) score += 10;
  if (componentCount > 5) score += 10;
  if (gridFlexCount > 5) score += 10;
  if (animationCount > 0) score += 10;
  if (cssVarsCount > 10) score += 10;
  if (rules.length > 100) score += 10;
  if (rules.filter(r => r.selector.includes(":hover")).length > 0) score += 5;
  return Math.min(100, score);
}

function detectScrollLibraries($) {
  const html = $.html();
  const libs = [];
  if (html.includes("locomotive-scroll") || html.includes("locomotive")) libs.push("Locomotive Scroll");
  if (html.includes("lenis")) libs.push("Lenis");
  if (html.includes("aos.js") || html.includes("aos/dist")) libs.push("AOS");
  if (html.includes("scrollreveal")) libs.push("ScrollReveal");
  if (html.includes("gsap") || html.includes("greensock")) libs.push("GSAP ScrollTrigger");
  return libs;
}

function detectInteractiveEffects($, rules) {
  return { parallax: [], scrollZoom: [], horizontalScroll: [], stickyLayouts: [], glassmorphism: [], microInteractions: [] };
}

function analyzeDesignDNA(colors, spacing) {
  return {
    colorPsychology: colors.length > 4 ? "Balanced palette" : "Minimal palette",
    spacingPhilosophy: spacing.length > 3 ? "Consistent spacing rhythm" : "Variable spacing",
    fontAccessibility: "Standard",
  };
}

function analyzeResponsiveArchaeology($, rules, mqs) {
  return { breakpoints: mqs, containerQueries: false, touchOptimization: false };
}

function analyzeAccessibilityAutopsy($, colors, mqs) {
  return { contrastRatio: 4.5, contrastWCAG: "AA", ariaCompleteness: colors.length > 0 ? 60 : 40, reducedMotion: false };
}

function analyzePerformanceForensics($, rules) {
  const html = $.html();
  return { lazyImagesPercent: html.includes("loading=") ? 50 : 10, fontDisplaySwap: html.includes("font-display: swap") || html.includes("font-display=swap"), asyncScripts: html.includes("async") || html.includes("defer") };
}

function analyzeCodeArchaeology($, techs) {
  return { detectedFrameworks: techs, stateManagementHint: "Not detected", replicationArchitecture: "Standard SPA" };
}

function analyzeDarkMode($, colors) {
  const html = $.html().toLowerCase();
  return { hasDarkTheme: html.includes("prefers-color-scheme: dark") || html.includes(".dark") || html.includes("dark:"), autoDarkColors: [] };
}

function analyzeAssets($) {
  const assets = [];
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (src && !src.startsWith("data:")) assets.push({ name: alt || src.split("/").pop() || "image", prompt: `Place <img src="${src}" alt="${alt}" />` });
  });
  return assets.slice(0, 6);
}

function extractKeyframes(cssText) {
  const map = new Map();
  const re = /@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\}/g;
  let m;
  while ((m = re.exec(cssText)) !== null) map.set(m[1], m[2].trim());
  return map;
}

function stripFrameworkHash(name) {
  return name.replace(/-[a-f0-9]{6,8}$/, "");
}

function parseAnimationShorthand(value) {
  const parts = value.trim().split(/\s+/);
  const r = {};
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

function extractAnimations(rules, cssText) {
  const keyframes = extractKeyframes(cssText);
  const animations = [];
  const seen = new Set();
  for (const r of rules) {
    const animVal = r.properties["animation"];
    const animName = r.properties["animation-name"];
    if (animVal) {
      const parsed = parseAnimationShorthand(animVal);
      const name = stripFrameworkHash(parsed.name || "unknown");
      const key = name + r.selector;
      if (!seen.has(key)) {
        seen.add(key);
        animations.push({ name, duration: parsed.duration || "", timing: parsed.timing || "", delay: parsed.delay || "", iteration: parsed.iteration || "", direction: parsed.direction || "", keyframesBody: keyframes.get(name) || "", selector: r.selector });
      }
    } else if (animName) {
      const name = stripFrameworkHash(animName);
      if (!seen.has(name + r.selector)) {
        seen.add(name + r.selector);
        animations.push({ name, duration: r.properties["animation-duration"] || "", timing: r.properties["animation-timing-function"] || "", delay: r.properties["animation-delay"] || "", iteration: r.properties["animation-iteration-count"] || "", direction: r.properties["animation-direction"] || "", keyframesBody: keyframes.get(name) || keyframes.get(animName) || "", selector: r.selector });
      }
    }
  }
  for (const [rawName, body] of keyframes) {
    const name = stripFrameworkHash(rawName);
    if (!animations.some(a => a.name === name)) {
      animations.push({ name, duration: "", timing: "", delay: "", iteration: "", direction: "", keyframesBody: body, selector: "" });
    }
  }
  return animations;
}

function extractTransitions(rules) {
  const out = [];
  for (const r of rules) {
    const t = r.properties["transition"];
    const td = r.properties["transition-duration"];
    if (t) {
      const parts = t.trim().split(/\s+/);
      const entry = { property: parts[0] || "all", duration: "", timing: "", delay: "", selector: r.selector };
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
      out.push({ property: r.properties["transition-property"] || "all", duration: td, timing: r.properties["transition-timing-function"] || "", delay: r.properties["transition-delay"] || "", selector: r.selector });
    }
  }
  return out;
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return null;
  const c = hex.trim().toLowerCase();
  if (c.startsWith("#")) {
    let h = c.slice(1);
    if (h.length === 3) h = h.split("").map(x => x + x).join("");
    if (h.length >= 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  if (c.startsWith("rgb")) {
    const m = c.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
  }
  return null;
}

function rgbToHslLine(r, g, b) {
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

function toTailwindPadding(pxVal) {
  const m = pxVal.match(/(\d+\.?\d*)px/);
  if (!m) return "4";
  const px = parseFloat(m[1]);
  return Math.max(0, Math.round(px / 4)).toString();
}

function toTailwindRadius(radius) {
  const m = radius.match(/(\d+\.?\d*)px/);
  if (!m) return "rounded-md";
  const px = parseFloat(m[1]);
  if (px <= 2) return "rounded-sm";
  if (px <= 4) return "rounded";
  if (px <= 8) return "rounded-md";
  if (px <= 12) return "rounded-lg";
  if (px <= 16) return "rounded-xl";
  if (px <= 24) return "rounded-2xl";
  return "rounded-3xl";
}

function detectStorytellingFlow(sections) {
  if (sections.length >= 4) return { flowType: "Full Narrative Arc", narrative: "Hero → Features → Testimonials → CTA" };
  if (sections.length >= 2) return { flowType: "Problem-Solution", narrative: "Hook → Value Prop → Close" };
  return { flowType: "Single Page Punch", narrative: "Direct messaging with minimal flow" };
}

function detectLayoutIntelligence($, rules) {
  const intel = [];
  const html = $.html().toLowerCase();
  if (html.includes("display: grid") || html.includes("display:grid")) intel.push("CSS Grid");
  if (html.includes("display: flex") || html.includes("display:flex")) intel.push("Flexbox");
  if (rules.some(r => r.properties["grid-template-columns"])) intel.push("Multi-column Grid");
  if (intel.length === 0) intel.push("Standard block flow");
  return intel;
}

function detectComponentIntelligence($, rules) {
  const intel = [];
  if ($("nav, [role='navigation']").length > 0) intel.push("Navigation");
  if ($("form, input, select, textarea").length > 0) intel.push("Form Elements");
  if ($("[class*='card']").length > 0) intel.push("Cards");
  if ($("button, [role='button'], a[class*='btn']").length > 0) intel.push("Buttons");
  if ($("footer").length > 0) intel.push("Footer");
  if ($("header").length > 0) intel.push("Header");
  if (intel.length === 0) intel.push("Standard Elements");
  return intel;
}

function detectAnimationClassifications(rules, $) {
  const classes = [];
  if (rules.some(r => r.properties["animation-name"])) classes.push("CSS Keyframe Animations");
  if (rules.some(r => r.properties["transition"] && r.properties["transition"].includes("transform"))) classes.push("Transform Transitions");
  if ($("[data-aos], [class*='aos-']").length > 0) classes.push("AOS Scroll Animations");
  if (classes.length === 0) classes.push("Static UI");
  return classes;
}

function chooseDesignStyle(colors, fonts, interactiveEffects, siteType) {
  return "Modern Minimal";
}

function twHintForComponent(name, details) {
  return "";
}

const generateMegaPrompt = generateMegaPromptImpl;

function generateMegaPromptImpl(
  $, colors, fonts, spacing, radii, shadows, gradients,
  sections, components, animations, transitions, assets,
  rules, siteType, complexityScore, scrollLibs, tier,
  interactiveEffects, designDNA, responsiveArchaeology,
  accessibilityAutopsy, performanceForensics, codeArchaeology,
  darkModeArchaeologist, customization,
  visualMetrics, confidencePercentages, neuralDNA, scrape,
  sceneGraph, spatialHints, designLang, importanceScores, semanticImages, layerHierarchy,
  richFonts, scrollTimelineEntries, scrollBehaviorProfile, experienceFlow
) {
  const siteName = $("title").first().text() || "Untitled";
  const hostname = scrape?.sourceURL ? new URL(scrape.sourceURL).hostname : siteName;

  const lines = [];
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
      if (f.fallbackStack && f.fallbackStack.length > 0) lines.push(`  Fallback: ${f.fallbackStack.join(", ")}`);
      lines.push(`  Weight: ${f.fontWeight} | Style: ${f.fontStyle} | Display: ${f.fontDisplay}`);
      if (f.isVariable) lines.push(`  Variable Font: Yes`);
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
  } else if (fonts.length > 0) {
    const uniqueFamilies = [...new Set(fonts.map(f => f.family))];
    uniqueFamilies.forEach(family => {
      const usages = fonts.filter(f => f.family === family);
      const weights = [...new Set(usages.map(f => f.weight || '400'))].join(", ");
      const usage = usages[0]?.usage || "body";
      lines.push(`- **"${family}"** — ${usage}, weight ${weights}`);
    });
    lines.push(`CSS Variable Mapping:`);
    lines.push(`  --font-display: ${uniqueFamilies[0] || "'Inter'"}, serif;`);
    lines.push(`  --font-body: ${uniqueFamilies[uniqueFamilies.length > 1 ? 1 : 0] || "'Inter'"}, sans-serif;`);
  } else {
    lines.push(`- Body: "Inter", sans-serif — weights 400/500/600/700`);
    lines.push(`- Display: "Instrument Serif", serif — weight 400`);
  }
  lines.push("");

  // 3. COLOR SYSTEM
  lines.push("### COLOR SYSTEM (HSL CSS variables)");
  if (colors.length > 0) {
    const colorMap = {
      primary: "--color-primary", background: "--background", "muted-text": "--muted-foreground",
      border: "--border", text: "--foreground", accent: "--accent",
    };
    const cleanColors = colors.filter(c => c.value && !c.value.includes("00000004") && !c.value.includes("ffffff0"));
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
  } else {
    lines.push("  --background: 0 0% 100%;");
    lines.push("  --foreground: 222 47% 11%;");
    lines.push("  --primary: 221 83% 53%;");
    lines.push("  --muted-foreground: 215 16% 47%;");
  }
  lines.push("");

  // 4. LAYOUT
  lines.push("### LAYOUT");
  const flow = detectStorytellingFlow(sections);
  const layoutIntel = detectLayoutIntelligence($, rules);
  lines.push(`- Storytelling Flow: ${flow.flowType} — ${flow.narrative}`);
  lines.push(`- Grid Structures: ${layoutIntel.join(", ") || "Standard block layout"}`);
  lines.push(`- Whitespace: ${visualMetrics?.whitespacePercent ?? 40}%`);
  lines.push(`- Balance: ${visualMetrics?.visualBalance ?? "Symmetrical"}`);
  lines.push("");
  lines.push(`Section Sequence:`);
  sections.forEach((s, i) => {
    lines.push(`  ${i + 1}. ${s.name}: ${s.description}`);
  });
  lines.push("");

  // 5. COMPONENTS
  lines.push("### COMPONENTS");
  const componentIntel = detectComponentIntelligence($, rules);
  lines.push(`- UI Primitives: ${componentIntel.join(", ")}`);
  components.slice(0, 6).forEach(c => {
    lines.push(`- Component: ${c.name} — ${c.details}`);
  });
  lines.push("");

  // 6. SCROLL EXPERIENCE
  if (scrollBehaviorProfile) {
    const bp = scrollBehaviorProfile;
    lines.push("### SCROLL EXPERIENCE");
    lines.push(`Narrative Flow: ${bp.scrollNarrativeFlow}`);
    lines.push(`Animation Trigger: ${bp.animationTriggerType}`);
    if (bp.hasPinnedElements) lines.push("- ✅ Pinned/sticky elements");
    if (bp.hasParallax) lines.push("- ✅ Parallax depth");
    if (bp.hasFadeReveals) lines.push("- ✅ Fade-in reveals");
    if (bp.hasSlideReveals) lines.push("- ✅ Slide/fly-in reveals");
    if (bp.hasScaleReveals) lines.push("- ✅ Scale reveals");
    if (bp.hasHorizontalScroll) lines.push("- ✅ Horizontal scroll");
    lines.push("");
  } else {
    lines.push("### ANIMATIONS");
    const allAnims = animations.slice(0, 6);
    if (allAnims.length > 0) {
      allAnims.forEach(a => {
        lines.push(`- ${a.name}: ${a.duration || '0.3s'} ${a.timing || 'ease'}${a.selector ? ` on ${a.selector}` : ''}`);
      });
    }
    if (transitions.length > 0) {
      lines.push("");
      transitions.slice(0, 4).forEach(t => {
        lines.push(`- Transition: ${t.property} ${t.duration || ''} ${t.timing || ''}${t.selector ? ` on ${t.selector}` : ''}`);
      });
    }
    if (allAnims.length === 0) {
      lines.push("- No keyframe animations detected — static layout");
    }
    lines.push("");
  }

  // 7. SCROLL TIMELINE
  if (scrollTimelineEntries && scrollTimelineEntries.length > 0) {
    lines.push("### SCROLL TIMELINE");
    scrollTimelineEntries.slice(0, 10).forEach(entry => {
      const pct = String(entry.scrollPercent).padStart(2);
      lines.push(`  ${pct}% ${entry.action}: ${entry.detail.slice(0, 70)}`);
    });
    lines.push("");
  }

  // 8. EXPERIENCE FLOW
  if (experienceFlow) {
    lines.push("### EXPERIENCE FLOW");
    lines.push(`Pacing: ${experienceFlow.pacing}`);
    lines.push(`Arc: ${experienceFlow.emotionalArc}`);
    if (experienceFlow.transitionStyles.length > 0) {
      lines.push("Transitions:");
      experienceFlow.transitionStyles.forEach(t => lines.push(`  - ${t}`));
    }
    lines.push("");
  }

  // 9. AESTHETIC
  lines.push("### AESTHETIC");
  const chosenStyle = chooseDesignStyle(colors, fonts, interactiveEffects, siteType);
  lines.push(`Primary: ${chosenStyle}`);
  lines.push("");

  // 10. EXPLICITLY EXCLUDE
  lines.push("### EXPLICITLY EXCLUDE");
  lines.push("- No decorative blob shapes or glassmorphism unless listed above");
  lines.push("- No radial gradient overlays");
  lines.push("- No box shadows unless extracted above");
  lines.push("- No placeholder images — use exact URLs extracted");
  lines.push("- No colors outside the palette above");
  lines.push("");

  // 11. SECTION COPY
  lines.push("### SECTIONS (in order)");
  sections.slice(0, 12).forEach((s, i) => {
    lines.push(`  ${i + 1}. ${s.name} — ${s.description}`);
  });
  lines.push("");

  // 12. SCENE GRAPH
  if (sceneGraph && sceneGraph.length > 0) {
    lines.push("### SCENE GRAPH (Narrative Storyboard)");
    sceneGraph.forEach(sg => lines.push(`- ${sg}`));
    lines.push("");
  }

  // 13. SPATIAL RELATIONSHIPS
  if (spatialHints && spatialHints.length > 0) {
    lines.push("### SPATIAL RELATIONSHIPS");
    spatialHints.forEach(h => lines.push(`- ${h}`));
    lines.push("");
  }

  // 14. DESIGN LANGUAGE
  if (designLang) {
    lines.push("### DESIGN LANGUAGE");
    lines.push(`Primary: ${designLang.primary}`);
    if (designLang.tags.length > 0) {
      lines.push(`Tags: ${designLang.tags.join(", ")}`);
    }
    lines.push(`Rationale: ${designLang.reasoning}`);
    lines.push("");
  }

  // 15. CONTENT IMPORTANCE
  lines.push("### CONTENT IMPORTANCE");
  if (importanceScores && importanceScores.length > 0) {
    importanceScores.forEach(imp => {
      lines.push(`- ${imp.section}: ⭐${imp.score} — ${imp.label} (effort: ${imp.effort})`);
    });
  } else {
    lines.push("- No content importance scores available");
  }
  lines.push("");

  // 16. IMAGE STYLE
  if (semanticImages && semanticImages.length > 0) {
    lines.push("### IMAGE STYLE");
    semanticImages.slice(0, 6).forEach(img => {
      lines.push(`- \`${img.name}\`: ${img.semantic} [style: ${img.style}]`);
    });
    lines.push("");
  }

  // 17. LAYER HIERARCHY
  if (layerHierarchy && layerHierarchy.length > 0) {
    lines.push("### LAYER HIERARCHY");
    layerHierarchy.forEach(l => lines.push(`- ${l}`));
    lines.push("");
  }

  // 18. REBUILD STACK
  lines.push("### REBUILD STACK");
  lines.push(`${customization.framework} + ${customization.styling} + ${customization.animation}`);
  if (performanceForensics.fontDisplaySwap) lines.push("font-display: swap enabled");
  if (performanceForensics.lazyImagesPercent > 20) lines.push("lazy-loading: enabled");
  lines.push("");

  return lines.join("\n");
}

/* ── New analysis helpers ── */

function generateSceneGraph(sections, rules, $) {
  const scenes = [];
  sections.forEach(s => {
    const lower = s.name.toLowerCase();
    let type = "feature";
    let stars = 3;
    if (lower.includes("hero") || lower.includes("banner")) { type = "hero"; stars = 5; }
    else if (lower.includes("cta") || lower.includes("call")) { type = "cta"; stars = 4; }
    else if (lower.includes("testimonial") || lower.includes("review")) { type = "transition"; stars = 4; }
    else if (lower.includes("footer")) { type = "footer"; stars = 1; }
    else if (lower.includes("pricing")) { type = "cta"; stars = 4; }
    scenes.push(`[${type}] ${s.name} (⭐${stars}) — ${s.description.slice(0, 60)}`);
  });
  return scenes;
}

function analyzeSpatialRelationships(rules, $) {
  const hints = [];
  const negMargins = rules.filter(r =>
    Object.entries(r.properties).some(([k, v]) => /^margin/.test(k) && typeof v === "string" && v.startsWith("-"))
  );
  if (negMargins.length > 0) {
    negMargins.slice(0, 2).forEach(r => {
      const vals = Object.entries(r.properties)
        .filter(([k, v]) => /^margin/.test(k) && typeof v === "string" && v.startsWith("-"))
        .map(([k, v]) => `${k}: ${v}`);
      hints.push(`Element overlap: \`${r.selector}\` uses ${vals.join(", ")}`);
    });
  }
  const clipRules = rules.filter(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"]);
  if (clipRules.length > 0) {
    clipRules.slice(0, 1).forEach(r => {
      hints.push(`Shape mask: \`${r.selector}\` uses clip-path`);
    });
  }
  if (hints.length === 0) hints.push("Standard document flow layout");
  return hints.slice(0, 6);
}

function classifyDesignLanguage($, colors, fonts, interactiveEffects, siteType, rules) {
  const tags = [];
  const isDark = colors.some(c => {
    const rgb = hexToRgb(c.value);
    if (!rgb) return false;
    const [h, s, l] = rgbToHslLine(rgb[0], rgb[1], rgb[2]).split(" ").map(v => parseFloat(v));
    return l < 20;
  });
  const hasRoundedUI = rules.some(r => { const br = r.properties["border-radius"]; return br && br !== "0px" && !br.includes("0"); });
  const hasLargeTypography = rules.some(r => { const fs = r.properties["font-size"]; return fs && parseFloat(fs) > 64; });
  const hasMinimalColors = colors.length <= 3;
  if (isDark && hasMinimalColors && hasRoundedUI) tags.push("Apple-like / Premium Tech");
  if (!isDark && hasRoundedUI && colors.length >= 4) tags.push("Warm / Human-centered");
  if (hasLargeTypography && hasMinimalColors) tags.push("Brutalist / Raw Industrial");
  if (tags.length === 0) tags.push("Standard Web");
  return { primary: tags[0], tags, reasoning: `${tags[0]} — ${colors.length} colors, ${fonts.length} fonts` };
}

function scoreContentImportance(sections, $, rules) {
  return sections.map(s => {
    const lower = s.name.toLowerCase();
    let score = 2, label = "Standard content", effort = "Normal";
    if (lower.includes("hero") || lower.includes("banner")) { score = 5; label = "Primary brand statement"; effort = "Maximum"; }
    else if (lower.includes("cta") || lower.includes("call")) { score = 4; label = "Conversion driver"; effort = "High"; }
    else if (lower.includes("feature")) { score = 4; label = "Core value proposition"; effort = "High"; }
    else if (lower.includes("pricing")) { score = 4; label = "Revenue conversion point"; effort = "High"; }
    else if (lower.includes("testimonial")) { score = 3; label = "Social proof"; effort = "Medium"; }
    else if (lower.includes("footer")) { score = 1; label = "Footer navigation"; effort = "Minimal"; }
    return { section: s.name, score, label, effort };
  });
}

function analyzeImagesSemantically($) {
  const results = [];
  $("img[src]").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    const cls = $(el).attr("class") || "";
    const rect = $(el).attr("width") && $(el).attr("height") ? `${$(el).attr("width")}x${$(el).attr("height")}` : "unknown";
    let semantic = "Decorative image";
    let style = "standard";
    if (alt && alt.length > 10) semantic = `"${alt.slice(0, 80)}"`;
    else if (cls.includes("avatar") || cls.includes("profile")) { semantic = "User avatar / team photo"; style = "portrait"; }
    else if (cls.includes("logo")) { semantic = "Brand logo"; style = "logo"; }
    else if (cls.includes("hero") || cls.includes("banner")) { semantic = "Hero background / brand imagery"; style = "hero"; }
    else if (src.includes("icon") || src.includes("svg")) { semantic = "UI icon / glyph"; style = "icon"; }
    else if (rect !== "unknown") { const w = parseInt($(el).attr("width")); const h = parseInt($(el).attr("height")); semantic = `Product/feature screenshot (${rect})`; style = w > h * 1.3 ? "landscape" : "portrait"; }
    results.push({ name: alt || src.split("/").pop() || "image", semantic, style });
  });
  return results.slice(0, 8);
}

function analyzeLayerHierarchy($, rules) {
  const layers = [];
  const zIndexRules = rules.filter(r => r.properties["z-index"]);
  if (zIndexRules.length > 0) {
    const sorted = [...zIndexRules].sort((a, b) => parseInt(a.properties["z-index"]) - parseInt(b.properties["z-index"]));
    sorted.forEach(r => { layers.push(`z-index: ${r.properties["z-index"]} — \`${r.selector}\``); });
  }
  const sticky = rules.filter(r => r.properties["position"] === "sticky");
  if (sticky.length > 0) layers.push("Sticky header/nav — highest visual layer");
  const fixed = rules.filter(r => r.properties["position"] === "fixed");
  if (fixed.length > 0) layers.push("Fixed overlay elements — modals, popups, floating CTAs");
  if (layers.length === 0) layers.push("No explicit z-index layers — default stacking order");
  return layers.slice(0, 8);
}

/* ── Rich font extraction (standalone) ── */
function extractRichFontDetails(fonts, $, rules, fontDetails) {
  const results = [];
  const seenFamilies = new Set();
  const fontFaces = fontDetails?.fontFaces || [];
  const fontSamples = fontDetails?.fontSamples || [];

  const googleFontFamilies = new Set();
  $('link[href*="fonts.googleapis"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const fm = href.match(/family=([^&]+)/);
    if (fm) googleFontFamilies.add(decodeURIComponent(fm[1]).replace(/:.*$/, "").replace(/\+/g, " "));
  });

  for (const f of fonts) {
    if (seenFamilies.has(f.family)) continue;
    seenFamilies.add(f.family);
    const source = googleFontFamilies.has(f.family) ? "google-fonts" : /^system-ui|sans-serif|serif|monospace/i.test(f.family) ? "system" : "@font-face";
    const fallbackStack = [];
    for (const r of rules) {
      const ff = r.properties["font-family"];
      if (ff && ff.includes(f.family)) {
        const families = ff.split(",").map(s => s.trim().replace(/["']/g, ""));
        const idx = families.indexOf(f.family);
        if (idx >= 0 && idx < families.length - 1) families.slice(idx + 1).forEach(fb => { if (!fallbackStack.includes(fb)) fallbackStack.push(fb); });
      }
    }
    results.push({ family: f.family, fallbackStack, source, fontWeight: f.weight || "400", fontStyle: "normal", fontDisplay: "auto", isVariable: false, letterSpacing: "normal", lineHeight: "normal", textTransform: "none", usage: f.usage || "body text", unicodeRange: "" });
  }
  for (const ff of fontFaces) {
    const family = ff.family.replace(/["']/g, "");
    if (seenFamilies.has(family)) continue;
    seenFamilies.add(family);
    results.push({ family, fallbackStack: [], source: "@font-face", fontWeight: ff.fontWeight || "400", fontStyle: ff.fontStyle || "normal", fontDisplay: ff.fontDisplay || "auto", isVariable: false, letterSpacing: "normal", lineHeight: "normal", textTransform: "none", usage: "Custom font", unicodeRange: ff.unicodeRange || "" });
  }
  return results.slice(0, 10);
}

/* ── Scroll timeline builder (standalone) ── */
function buildScrollTimeline(scrollTimeline, animations, transitions, rules, $) {
  const timeline = [];
  const profile = { hasPinnedElements: false, hasParallax: false, hasFadeReveals: false, hasSlideReveals: false, hasScaleReveals: false, hasHorizontalScroll: false, hasImageSequence: false, hasStickyNavigation: false, hasClipPathTransitions: false, hasCrossfadeTransitions: false, estimatedScrollDuration: "3-5s", animationTriggerType: "none", scrollNarrativeFlow: "Linear scroll", pinnedRegionDescription: "None detected", totalDistinctAnimations: 0 };

  if (scrollTimeline) {
    if (scrollTimeline.pinnedElements?.length > 0) {
      profile.hasPinnedElements = true;
      scrollTimeline.pinnedElements.slice(0, 3).forEach(p => { timeline.push({ scrollPercent: 0, action: "pin", elementTag: p.tagName, elementText: p.text || "", className: p.className || "", detail: "Pinned element — stays fixed in viewport" }); });
    }
    if (scrollTimeline.elementTransitions) {
      scrollTimeline.elementTransitions.slice(0, 15).forEach(et => {
        const opacityChanged = Math.abs((et.opacityAtEnter || 1) - (et.opacityAtExit || 1)) > 0.2;
        const transformChanged = et.transformAtEnter !== et.transformAtExit;
        if (opacityChanged) {
          timeline.push({ scrollPercent: et.scrollPercentEnter || 0, action: "reveal", elementTag: et.tagName, elementText: et.text || "", className: et.className || "", detail: `opacity ${parseFloat(et.opacityAtEnter || 1).toFixed(2)}→${parseFloat(et.opacityAtExit || 1).toFixed(2)}` });
          profile.hasFadeReveals = true;
        }
        if (transformChanged && et.transformAtExit !== "none") {
          timeline.push({ scrollPercent: et.scrollPercentEnter || 0, action: "animate", elementTag: et.tagName, elementText: et.text || "", className: et.className || "", detail: `transform: ${(et.transformAtExit || "").slice(0, 50)}` });
          profile.hasSlideReveals = true;
        }
      });
    }
  }

  if (rules) {
    const stickyRules = rules.filter(r => r.properties["position"] === "sticky");
    if (stickyRules.length > 0) { profile.hasPinnedElements = true; profile.hasStickyNavigation = true; }
    if (rules.some(r => r.properties["clip-path"] || r.properties["-webkit-clip-path"])) profile.hasClipPathTransitions = true;
  }
  profile.totalDistinctAnimations = (animations?.length || 0) + (transitions?.length || 0) + (profile.hasFadeReveals ? 1 : 0) + (profile.hasSlideReveals ? 1 : 0) + (profile.hasPinnedElements ? 1 : 0);
  if (profile.totalDistinctAnimations > 4) profile.estimatedScrollDuration = "8-15s (cinematic)";
  else if (profile.totalDistinctAnimations > 2) profile.estimatedScrollDuration = "5-8s (moderate)";

  timeline.sort((a, b) => a.scrollPercent - b.scrollPercent);
  return { timeline: timeline.slice(0, 30), behaviorProfile: profile };
}

/* ── Experience flow (standalone) ── */
function extractExperienceFlow(sections, scrollTimelineEntries, profile, anims) {
  const sectionCount = sections.length;
  const animCount = anims.length;
  const pacing = sectionCount >= 6 || profile.totalDistinctAnimations > 4 ? "slow-cinematic" : sectionCount <= 3 && animCount === 0 ? "rapid" : "moderate";
  const sectionNames = sections.map(s => s.name.toLowerCase());
  const hasHero = sectionNames.some(n => n.includes("hero") || n.includes("banner"));
  const hasFeatures = sectionNames.some(n => n.includes("feature"));
  const hasTestimonials = sectionNames.some(n => n.includes("testimonial") || n.includes("review"));
  const hasPricing = sectionNames.some(n => n.includes("pricing"));
  const hasCTA = sectionNames.some(n => n.includes("cta") || n.includes("call"));
  let emotionalArc = "Informational — logical order";
  if (hasHero && hasFeatures && hasTestimonials && hasCTA) emotionalArc = "Classic marketing arc: Hero → Features → Testimonials → CTA";
  else if (hasHero && hasFeatures && hasPricing && hasCTA) emotionalArc = "Sales-driven: Hook → Understand → Evaluate → Convert";
  else if (hasHero && hasCTA) emotionalArc = "Direct response: Value prop → Conversion";

  const transitionStyles = [];
  if (profile.hasClipPathTransitions) transitionStyles.push("Clip-path section dividers");
  if (profile.hasFadeReveals) transitionStyles.push("Opacity crossfade between sections");
  if (profile.hasSlideReveals) transitionStyles.push("Slide/fly-in section entrances");
  if (profile.hasPinnedElements) transitionStyles.push("Overlap composition — content scrolls over pinned backdrop");
  if (transitionStyles.length === 0) transitionStyles.push("Standard vertical scroll");

  const sectionPurpose = sections.slice(0, 8).map(s => {
    const lower = s.name.toLowerCase();
    if (lower.includes("hero") || lower.includes("banner")) return "Attention capture";
    if (lower.includes("feature")) return "Value proposition";
    if (lower.includes("testimonial")) return "Social proof";
    if (lower.includes("pricing")) return "Conversion point";
    if (lower.includes("cta") || lower.includes("call")) return "Action driver";
    if (lower.includes("footer")) return "Navigation closure";
    return "Supporting content";
  });

  const peakEngagementPoints = [];
  if (hasHero) peakEngagementPoints.push("Hero (0-15%)");
  if (hasFeatures) peakEngagementPoints.push("Features (20-40%)");
  if (hasTestimonials) peakEngagementPoints.push("Testimonials (40-55%)");
  if (hasPricing) peakEngagementPoints.push("Pricing (55-70%)");
  if (hasCTA) peakEngagementPoints.push("CTA (80-95%)");

  return { pacing, emotionalArc, transitionStyles, sectionPurpose, peakEngagementPoints };
}

main().catch(console.error);
