import * as cheerio from "cheerio";
import { chromium } from "playwright";

export type ScrapeBundle = {
  title: string;
  description: string;
  sourceURL: string;
  html: string;
  playwrightData?: {
    scrollFrames: any[];
    hoverData: any[];
    screenshots: {
      desktop?: string;
      laptop?: string;
      tablet?: string;
      mobile?: string;
    };
    visualMetrics?: {
      whitespacePercent: number;
      negativeSpaceScore: string;
      gridDensity: string;
      imageRatios: string[];
      visualBalance: string;
      typographyRhythm: string;
    };
    computedStyles: {
      colors: { value: string; prop: string; selector: string; count: number }[];
      fonts: { family: string; size: string; weight: string; count: number }[];
      spacing: { value: string; count: number }[];
      radii: { value: string; count: number }[];
      shadows: { value: string; count: number }[];
    };
    fontDetails?: {
      fontFaces: { family: string; src: string; fontWeight: string; fontStyle: string; fontDisplay: string; unicodeRange: string }[];
      fontSamples: { selector: string; fontFamily: string; fontSize: string; fontWeight: string; fontStyle: string; letterSpacing: string; lineHeight: string; textTransform: string; fontOpticalSizing: string }[];
      loadedFonts: { family: string; weight: string; style: string }[];
    };
    scrollTimeline?: {
      atEntry: any[];
      pinnedElements: any[];
      elementTransitions: { elementId: string; tagName: string; text: string; className: string; scrollPercentEnter: number; scrollPercentExit: number; opacityAtEnter: number; opacityAtExit: number; transformAtEnter: string; transformAtExit: string; topAtEnter: number; topAtExit: number }[];
      scrollPercentages: { scrollPercent: number; scrollY: number; entering: any[]; exiting: any[]; activeTransitions: string[] }[];
    };
  };
};

export async function scrapeSite(url: string): Promise<ScrapeBundle> {
  console.log(`[Syclone Engine] Commencing 10-stage deconstruction for URL: ${url}`);
  
  let browser;
  try {
    // Launch headless browser with a 10s launch timeout
    browser = await chromium.launch({
      headless: true,
      timeout: 10000,
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
    });

    const page = await browser.newPage();
    
    // Stage 1: Browser Rendering & Hydration wait (30s timeout, domcontentloaded for SPA compat)
    console.log(`[Syclone Stage 1] Rendering page with Playwright...`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    
    // Wait for SPA hydration and client-side rendering to stabilize
    await page.waitForTimeout(3000);

    // Dismiss common cookie consent banners and popups
    console.log(`[Syclone Stage 1] Dismissing cookie/popup overlays...`);
    await page.evaluate(() => {
      const dismiss = (sel: string) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) el.click();
      };
      const commonButtons = [
        '[aria-label*="cookie"] button, [aria-label*="accept"]',
        'button:has-text("Accept All"), button:has-text("Accept"), button:has-text("Got it")',
        'button:has-text("Continue"), button:has-text("Dismiss")',
        '.cookie-banner button, .cookie-consent button, .cc-btn',
        '[class*="cookie"] [class*="close"], [class*="cookie"] [class*="accept"]',
        '[class*="popup"] button, [class*="modal"] button, [class*="overlay"] button',
      ];
      for (const sel of commonButtons) {
        try {
          const matches = document.querySelectorAll(sel);
          matches.forEach(el => { if (el instanceof HTMLElement) el.click(); });
        } catch {}
      }
    });
    await page.waitForTimeout(500);

    const title = await page.title();
    const description = (await page.locator('meta[name="description"]').getAttribute("content").catch(() => null)) ||
                         (await page.locator('meta[property="og:description"]').getAttribute("content").catch(() => null)) ||
                         "";
    const html = await page.content();

    // Stage 2 & 7: Scroll & Hover Observers
    console.log(`[Syclone Stage 2 & 7] Starting step-wise scroll recording and hover simulation...`);
    const observerResult = await page.evaluate(async () => {
      const scrollStep = 300;
      const height = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      const watchSelectors = "section, header, footer, [class*='hero'], [class*='card'], button, a, h1, h2, h3, h4, img, svg, p, li, [class*='item'], [class*='tile'], [class*='btn'], nav, form, input, select, textarea, video, iframe, figure, figcaption, blockquote, [class*='icon'], [class*='logo'], [class*='badge'], [class*='tag'], [class*='pricing'], [class*='plan']";
      const elementsToWatch = Array.from(document.querySelectorAll(watchSelectors)).slice(0, 250).map((el, i) => {
        el.setAttribute("data-syclone-id", String(i));
        return {
          id: String(i),
          tagName: el.tagName.toLowerCase(),
          className: typeof (el as HTMLElement).className === "string" ? (el as HTMLElement).className : String((el as any).className?.baseVal || ""),
          text: (el.textContent || "").trim().slice(0, 40)
        };
      });

      const frames = [];
      
      // Scroll in steps
      for (let scrollY = 0; scrollY < height; scrollY += scrollStep) {
        window.scrollTo(0, scrollY);
        // Wait briefly for scroll animations to fire
        await new Promise(r => setTimeout(r, 20));
        
        const frameElements = [];
        for (const item of elementsToWatch) {
          const el = document.querySelector(`[data-syclone-id='${item.id}']`);
          if (!el) continue;
          
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top < viewportHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
          if (!isVisible) continue;
          
          const computedStyle = window.getComputedStyle(el);
          frameElements.push({
            id: item.id,
            tagName: item.tagName,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            transform: computedStyle.transform,
            opacity: computedStyle.opacity,
          });
        }
        
        frames.push({
          scrollY,
          elements: frameElements
        });

        if (frames.length > 50) break;
      }

      // Scroll back to top
      window.scrollTo(0, 0);

      // Collect raw computed style lists for clustering (optimized target selector list to prevent CPU loop timeouts)
      const colorsMap = new Map<string, number>();
      const fontsMap = new Map<string, number>();
      const spacingMap = new Map<string, number>();
      const radiiMap = new Map<string, number>();
      const shadowsMap = new Map<string, number>();

      const targetSelectors = "body, section, header, footer, div, p, a, button, input, h1, h2, h3, h4, h5, h6, select, label";
      const allElements = Array.from(document.body.querySelectorAll(targetSelectors)).slice(0, 1500);
      
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        
        // Colors
        const bg = style.backgroundColor;
        const col = style.color;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          colorsMap.set(bg, (colorsMap.get(bg) || 0) + 1);
        }
        if (col && col !== "rgba(0, 0, 0, 0)" && col !== "transparent") {
          colorsMap.set(col, (colorsMap.get(col) || 0) + 1);
        }

        // Fonts
        const ff = style.fontFamily;
        const fs = style.fontSize;
        const fw = style.fontWeight;
        if (ff) {
          const fontKey = `${ff}|${fs}|${fw}`;
          fontsMap.set(fontKey, (fontsMap.get(fontKey) || 0) + 1);
        }

        // Spacing
        const pt = style.paddingTop;
        const pb = style.paddingBottom;
        const mt = style.marginTop;
        const mb = style.marginBottom;
        if (pt && pt !== "0px") spacingMap.set(pt, (spacingMap.get(pt) || 0) + 1);
        if (pb && pb !== "0px") spacingMap.set(pb, (spacingMap.get(pb) || 0) + 1);
        if (mt && mt !== "0px") spacingMap.set(mt, (spacingMap.get(mt) || 0) + 1);
        if (mb && mb !== "0px") spacingMap.set(mb, (spacingMap.get(mb) || 0) + 1);

        // Radii
        const br = style.borderRadius;
        if (br && br !== "0px" && br !== "0%") {
          radiiMap.set(br, (radiiMap.get(br) || 0) + 1);
        }

        // Shadows
        const bs = style.boxShadow;
        if (bs && bs !== "none") {
          shadowsMap.set(bs, (shadowsMap.get(bs) || 0) + 1);
        }
      });

      return {
        frames,
        elements: elementsToWatch,
        rawStyles: {
          colors: Array.from(colorsMap.entries()).map(([value, count]) => ({ value, prop: "color", selector: "*", count })),
          fonts: Array.from(fontsMap.entries()).map(([key, count]) => {
            const [family, size, weight] = key.split("|");
            return { family, size, weight, count };
          }),
          spacing: Array.from(spacingMap.entries()).map(([value, count]) => ({ value, count })),
          radii: Array.from(radiiMap.entries()).map(([value, count]) => ({ value, count })),
          shadows: Array.from(shadowsMap.entries()).map(([value, count]) => ({ value, count }))
        }
      };
    });

    // Hover simulator (Stage 7) - optimized slice limit
    console.log(`[Syclone Stage 7] Simulating mouse pointer hovers on interactive nodes...`);
    const hoverData: any[] = [];
    const hoverCandidates = await page.$$("button, a, [class*='card'], [class*='hover'], [class*='btn'], [class*='cta'], li, [class*='item'], [class*='tile'], img, svg, [class*='icon'], [class*='link'], [class*='nav'], label");
    for (const el of hoverCandidates.slice(0, 16)) {
      try {
        const styleBefore = await el.evaluate(e => {
          const s = window.getComputedStyle(e);
          return { transform: s.transform, opacity: s.opacity, backgroundColor: s.backgroundColor, boxShadow: s.boxShadow, color: s.color };
        });
        
        await el.hover();
        await page.waitForTimeout(60);
        
        const styleAfter = await el.evaluate(e => {
          const s = window.getComputedStyle(e);
          return { transform: s.transform, opacity: s.opacity, backgroundColor: s.backgroundColor, boxShadow: s.boxShadow, color: s.color };
        });
        
        hoverData.push({
          tagName: await el.evaluate(e => e.tagName.toLowerCase()),
          class: await el.evaluate(e => e.className),
          before: styleBefore,
          after: styleAfter
        });
      } catch (e) {
        // Suppress pointer errors
      }
    }

    // Stage 3: Rich Font & Typography Extraction
    console.log(`[Syclone Stage 3] Extracting rich font details with @font-face rules...`);
    const fontDetails = await page.evaluate(() => {
      const fontFaces: { family: string; src: string; fontWeight: string; fontStyle: string; fontDisplay: string; unicodeRange: string }[] = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSFontFaceRule) {
              fontFaces.push({
                family: rule.style.fontFamily?.replace(/["']/g, "") || "",
                src: (rule.style as any).src || "",
                fontWeight: rule.style.fontWeight || "400",
                fontStyle: rule.style.fontStyle || "normal",
                fontDisplay: (rule.style as any).fontDisplay || "auto",
                unicodeRange: (rule.style as any).unicodeRange || "",
              });
            }
          }
        } catch {}
      }

      const fontSamples: { selector: string; fontFamily: string; fontSize: string; fontWeight: string; fontStyle: string; letterSpacing: string; lineHeight: string; textTransform: string; fontOpticalSizing: string }[] = [];
      const sampleSelectors = ["h1", "h2", "h3", "h4", "p", "button", "a", "nav", "li", "blockquote", "small", "figcaption", "label", "input", "select", "textarea"];
      for (const sel of sampleSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const s = getComputedStyle(el);
          fontSamples.push({
            selector: sel,
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            fontStyle: s.fontStyle,
            letterSpacing: s.letterSpacing,
            lineHeight: s.lineHeight,
            textTransform: s.textTransform,
            fontOpticalSizing: (s as any).fontOpticalSizing || "auto",
          });
        }
      }

      const loadedFonts: { family: string; weight: string; style: string }[] = [];
      if (document.fonts) {
        for (const f of document.fonts) {
          if (f.status === "loaded" || (f as any).status === "ready") {
            loadedFonts.push({ family: f.family, weight: f.weight, style: f.style });
          }
        }
      }

      return { fontFaces, fontSamples, loadedFonts };
    });

    // Stage 4: Scroll Timeline — capture element states at percentage-based intervals
    console.log(`[Syclone Stage 4] Capturing scroll timeline with element state transitions...`);
    const scrollTimeline = await page.evaluate(async () => {
      const height = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(height - viewportHeight, 1);
      const steps = 20;
      const scrollIncrement = maxScroll / steps;

      const watchSel = "section, header, footer, [class*=hero], [class*=card], [class*=feature], [class*=testimonial], [class*=pricing], [class*=cta], [class*=banner], h1, h2, h3, h4, p, blockquote, figure, img, video, svg, button, a, nav, [class*=item], [class*=tile], [class*=marquee], [class*=parallax], [class*=sticky], [class*=pin]";
      const elements = Array.from(document.querySelectorAll(watchSel)).slice(0, 80).map((el, i) => {
        el.setAttribute("data-syclone-tl", String(i));
        const classNameStr = typeof (el as HTMLElement).className === "string" ? (el as HTMLElement).className : String((el as any).className?.baseVal || "");
        return { id: String(i), tagName: el.tagName.toLowerCase(), text: (el.textContent || "").trim().slice(0, 50), className: classNameStr.slice(0, 60) };
      });

      const atEntry: any[] = [];
      for (const item of elements) {
        const el = document.querySelector(`[data-syclone-tl='${item.id}']`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          atEntry.push({
            id: item.id,
            tagName: item.tagName,
            text: item.text,
            className: item.className,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            opacity: s.opacity,
            transform: s.transform,
            position: s.position,
            zIndex: s.zIndex,
            clipPath: s.clipPath,
          });
        }
      }

      // Track each element through scroll
      const elementLog: Record<string, { scrollPercents: number[]; opacities: number[]; transforms: string[]; tops: number[] }> = {};
      for (const item of elements) {
        elementLog[item.id] = { scrollPercents: [], opacities: [], transforms: [], tops: [] };
      }

      const scrollPercentages: { scrollPercent: number; scrollY: number; entering: any[]; exiting: any[]; activeTransitions: string[] }[] = [];

      for (let step = 0; step <= steps; step++) {
        const scrollY = Math.round(step * scrollIncrement);
        window.scrollTo(0, scrollY);
        await new Promise(r => setTimeout(r, 30));

        const scrollPercent = Math.round((scrollY / maxScroll) * 100);
        const entering: any[] = [];
        const exiting: any[] = [];
        const activeTransitions: string[] = [];

        for (const item of elements) {
          const el = document.querySelector(`[data-syclone-tl='${item.id}']`);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          const opacity = parseFloat(s.opacity);
          const top = rect.top;
          const transform = s.transform;
          const isVisible = rect.top < viewportHeight && rect.bottom > 0;
          const wasVisible = elementLog[item.id].scrollPercents.length > 0;

          elementLog[item.id].scrollPercents.push(scrollPercent);
          elementLog[item.id].opacities.push(opacity);
          elementLog[item.id].transforms.push(transform);
          elementLog[item.id].tops.push(top);

          if (isVisible && !wasVisible) {
            entering.push({ id: item.id, tagName: item.tagName, text: item.text, opacity: s.opacity, transform: s.transform, top: Math.round(top) });
            activeTransitions.push(`${item.tagName} "${item.text.slice(0, 30)}" entered viewport`);
          }
          if (!isVisible && wasVisible && elementLog[item.id].scrollPercents.length > 1) {
            exiting.push({ id: item.id, tagName: item.tagName, text: item.text, opacity: s.opacity, transform: s.transform, top: Math.round(top) });
            activeTransitions.push(`${item.tagName} "${item.text.slice(0, 30)}" exited viewport`);
          }

          // Detect opacity or transform change (animation in progress)
          if (isVisible && elementLog[item.id].opacities.length >= 2) {
            const prevOpacity = elementLog[item.id].opacities[elementLog[item.id].opacities.length - 2];
            if (Math.abs(opacity - prevOpacity) > 0.1) {
              const dir = opacity > prevOpacity ? "fading in" : "fading out";
              activeTransitions.push(`${item.tagName} "${item.text.slice(0, 25)}" ${dir} (${prevOpacity.toFixed(2)}→${opacity.toFixed(2)})`);
            }
            const prevTransform = elementLog[item.id].transforms[elementLog[item.id].transforms.length - 2];
            if (transform !== prevTransform && transform !== "none") {
              activeTransitions.push(`${item.tagName} "${item.text.slice(0, 25)}" transform: ${transform.slice(0, 40)}`);
            }
          }
        }

        scrollPercentages.push({ scrollPercent, scrollY, entering, exiting, activeTransitions: activeTransitions.slice(0, 6) });
      }

      // Build element transition summaries
      const elementTransitions: any[] = [];
      for (const item of elements) {
        const log = elementLog[item.id];
        const enterIdx = log.scrollPercents.findIndex((pct, i) => log.opacities[i] > 0.3 && log.tops[i] < viewportHeight);
        const exitIdx = log.scrollPercents.length - 1 - [...log.scrollPercents].reverse().findIndex((_, i) => {
          const ri = log.scrollPercents.length - 1 - i;
          return log.opacities[ri] > 0.3 && log.tops[ri] < viewportHeight;
        });
        if (enterIdx === -1) continue;

        elementTransitions.push({
          elementId: item.id,
          tagName: item.tagName,
          text: item.text,
          className: item.className,
          scrollPercentEnter: log.scrollPercents[enterIdx],
          scrollPercentExit: log.scrollPercents[exitIdx] || log.scrollPercents[log.scrollPercents.length - 1],
          opacityAtEnter: log.opacities[enterIdx],
          opacityAtExit: log.opacities[exitIdx] || log.opacities[log.opacities.length - 1],
          transformAtEnter: log.transforms[enterIdx] || "none",
          transformAtExit: log.transforms[exitIdx] || log.transforms[log.transforms.length - 1] || "none",
          topAtEnter: log.tops[enterIdx],
          topAtExit: log.tops[exitIdx] || log.tops[log.tops.length - 1],
        });
      }

      // Pinned elements detection: elements with viewport-relative top staying nearly constant across scroll
      const pinnedElements: any[] = [];
      for (const item of elements) {
        const log = elementLog[item.id];
        if (log.tops.length < 3) continue;
        const topRange = Math.max(...log.tops) - Math.min(...log.tops);
        const el = document.querySelector(`[data-syclone-tl='${item.id}']`);
        const s = el ? getComputedStyle(el) : null;
        const isPositionFixed = s?.position === "fixed";
        const isPositionSticky = s?.position === "sticky";
        if (topRange < 50 && (isPositionFixed || isPositionSticky || topRange < 20)) {
          pinnedElements.push({ id: item.id, tagName: item.tagName, text: item.text.slice(0, 40), className: item.className, topRange, isPositionFixed, isPositionSticky });
        }
      }

      window.scrollTo(0, 0);

      return { atEntry, pinnedElements, elementTransitions, scrollPercentages };
    });

    // Stage 9: Visual Analysis
    console.log(`[Syclone Stage 9] Analyzing visual metrics and capturing viewport snapshots...`);
    const visualMetrics = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth || window.innerWidth;
      const docHeight = document.documentElement.scrollHeight || window.innerHeight;
      const totalArea = docWidth * docHeight;

      // Find all leaf nodes containing visible content
      const leafElements = Array.from(document.body.querySelectorAll("*")).filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const hasText = Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim().length > 0);
        const isMedia = el.tagName === "IMG" || el.tagName === "SVG" || el.tagName === "VIDEO" || el.tagName === "IFRAME";
        const hasBg = style.backgroundImage && style.backgroundImage !== "none";
        return (hasText || isMedia || hasBg) && rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
      });

      let contentArea = 0;
      leafElements.forEach(el => {
        const r = el.getBoundingClientRect();
        contentArea += r.width * r.height;
      });

      const computedWhitespace = totalArea > 0 ? ((totalArea - Math.min(contentArea, totalArea * 0.85)) / totalArea) * 100 : 40;
      const whitespacePercent = Math.max(15, Math.min(95, Math.round(computedWhitespace)));
      
      const negativeSpaceScore = whitespacePercent > 65 ? "Generous (Minimalist/Premium)" :
                                 whitespacePercent > 45 ? "Balanced (Corporate/Editorial)" : 
                                 "Dense (Portal/Information-heavy)";

      const gridItems = Array.from(document.querySelectorAll("div")).filter(el => {
        const s = window.getComputedStyle(el);
        return s.display === "grid" || s.display === "flex";
      }).length;
      const gridDensity = gridItems > 20 ? "High Grid Complexity" : gridItems > 6 ? "Medium Grid Segmentation" : "Simple Flow Columns";

      const imageRatios: string[] = [];
      Array.from(document.querySelectorAll("img")).slice(0, 5).forEach(img => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (w && h) {
          const ratio = w / h;
          if (Math.abs(ratio - 1.777) < 0.15) imageRatios.push("16:9 Landscape");
          else if (Math.abs(ratio - 1.333) < 0.1) imageRatios.push("4:3 Standard");
          else if (Math.abs(ratio - 1) < 0.05) imageRatios.push("1:1 Square");
          else if (ratio < 0.8) imageRatios.push("Portrait Aspect");
          else imageRatios.push(`${w}:${h} Custom`);
        }
      });
      const uniqueRatios = [...new Set(imageRatios)];

      let leftArea = 0;
      let rightArea = 0;
      const midX = window.innerWidth / 2;
      leafElements.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.left + r.width / 2 < midX) {
          leftArea += r.width * r.height;
        } else {
          rightArea += r.width * r.height;
        }
      });
      const balanceRatio = leftArea && rightArea ? Math.max(leftArea, rightArea) / Math.min(leftArea, rightArea) : 1;
      const visualBalance = balanceRatio < 1.35 ? "Symmetrical Visual Grid" : "Asymmetrical Dynamic Contrast";

      const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
      const paragraphs = Array.from(document.querySelectorAll("p"));
      let typRhythm = "Standard Linear Typography Scale";
      if (headings.length > 0 && paragraphs.length > 0) {
        const hSize = parseFloat(window.getComputedStyle(headings[0]).fontSize);
        const pSize = parseFloat(window.getComputedStyle(paragraphs[0]).fontSize);
        if (pSize > 0 && hSize > 0) {
          const scale = hSize / pSize;
          if (scale > 2.0) typRhythm = "Oversized Editorial (Golden Ratio 1.618+)";
          else if (scale > 1.4) typRhythm = "Harmonic Hierarchy (Perfect Fourth 1.33x-1.5x)";
        }
      }

      return {
        whitespacePercent,
        negativeSpaceScore,
        gridDensity,
        imageRatios: uniqueRatios.length > 0 ? uniqueRatios : ["No Image Assets"],
        visualBalance,
        typographyRhythm: typRhythm,
      };
    });

    // Capture screenshots for viewports (optimized wait delay)
    const viewports = {
      desktop: { width: 1440, height: 900 },
      laptop: { width: 1200, height: 750 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 812 },
    };

    const screenshots: { [key: string]: string } = {};
    for (const [name, vp] of Object.entries(viewports)) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(100);
      const buffer = await page.screenshot({ type: "jpeg", quality: 50 });
      screenshots[name] = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }

    await browser.close();
    console.log(`[Syclone Engine] Playwright deconstruction finished successfully!`);

    return {
      title,
      description,
      sourceURL: url,
      html,
      playwrightData: {
        scrollFrames: observerResult.frames,
        hoverData,
        screenshots,
        visualMetrics,
        computedStyles: observerResult.rawStyles,
        fontDetails,
        scrollTimeline,
      }
    };

  } catch (err) {
    console.error(`[Syclone Engine] Playwright failed, falling back to static Cheerio fetch.`, err);
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    return executeCheerioFallback(url);
  }
}

async function executeCheerioFallback(url: string): Promise<ScrapeBundle> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // reduced Cheerio timeout to 10s

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml"))
      throw new Error(`Unsupported content type: ${contentType}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Fetch external stylesheets (max 3 sheets for speed)
    const absoluteUrls: string[] = [];
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        try {
          const absoluteUrl = new URL(href, url).href;
          if (!absoluteUrls.includes(absoluteUrl)) {
            absoluteUrls.push(absoluteUrl);
          }
        } catch {}
      }
    });

    const fetchCSS = async (cssUrl: string): Promise<string> => {
      try {
        const cssController = new AbortController();
        const cssTimeout = setTimeout(() => cssController.abort(), 4000);
        const res = await fetch(cssUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/css,*/*;q=0.1",
          },
          signal: cssController.signal,
          redirect: "follow"
        });
        clearTimeout(cssTimeout);
        if (res.ok) return await res.text();
      } catch {}
      return "";
    };

    if (absoluteUrls.length > 0) {
      const cssBlocks = await Promise.all(absoluteUrls.slice(0, 3).map(fetchCSS));
      const mergedCSS = cssBlocks.filter(Boolean).join("\n");
      if (mergedCSS) {
        $("head").append(`<style id="scraped-external-styles">${mergedCSS}</style>`);
      }
    }

    const title = $("title").first().text().trim() || new URL(url).hostname;
    const description = $('meta[name="description"]').attr("content") || "";

    return { title, description, sourceURL: url, html: $.html() };
  } finally {
    clearTimeout(timeout);
  }
}

/* ─────────────────────────────────────────────────────────────
   Rich Style Extraction — used for Neural Design Transfer
   ───────────────────────────────────────────────────────────── */

export type RichStyleDNA = {
  cssVars: Record<string, string>;
  googleFontsUrl: string | null;
  loadedFonts: { family: string; weight: string; style: string }[];
  keyframes: { name: string; css: string }[];
  videos: { src: string; poster?: string }[];
  buttons: {
    text: string;
    padding: string;
    borderRadius: string;
    background: string;
    fontSize: string;
    fontWeight: string;
    backdropFilter: string;
    border: string;
    boxShadow: string;
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

export async function extractRichStyleDNA(
  url: string,
  existingBrowser?: any
): Promise<RichStyleDNA> {
  let browser;
  let ownBrowser = false;
  try {
    if (existingBrowser) {
      browser = existingBrowser;
    } else {
      ownBrowser = true;
      browser = await chromium.launch({
        headless: true,
        timeout: 10000,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      });
    }

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);

    // Full scroll to trigger lazy loading
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let total = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, 200);
          total += 200;
          if (total >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
      window.scrollTo(0, 0);
    });

    const dna = await page.evaluate(() => {
      // 1. CSS Variables from :root
      const cssVars: Record<string, string> = {};
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if ((rule as CSSStyleRule).selectorText === ':root') {
              const style = (rule as CSSStyleRule).style;
              for (let i = 0; i < style.length; i++) {
                const prop = style[i];
                if (prop.startsWith('--')) {
                  cssVars[prop] = style.getPropertyValue(prop).trim();
                }
              }
            }
          }
        } catch {}
      }

      // 2. Google Fonts link
      let googleFontsUrl: string | null = null;
      const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      if (fontLinks.length > 0) {
        googleFontsUrl = (fontLinks[0] as HTMLLinkElement).href;
      }

      // 3. Loaded fonts
      const loadedFonts: { family: string; weight: string; style: string }[] = [];
      if (document.fonts) {
        for (const f of document.fonts) {
          if (f.status === 'loaded' || (f as any).status === 'ready') {
            loadedFonts.push({ family: f.family, weight: f.weight, style: f.style });
          }
        }
      }

      // 4. Keyframes
      const keyframes: { name: string; css: string }[] = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule) {
              keyframes.push({ name: rule.name.replace(/-[a-f0-9]{6,8}$/, ""), css: rule.cssText });
            }
          }
        } catch {}
      }

      // 5. Videos
      const videos: { src: string; poster?: string }[] = [];
      document.querySelectorAll('video').forEach(v => {
        const src = v.currentSrc || v.querySelector('source')?.getAttribute('src') || '';
        if (src) videos.push({ src, poster: v.poster || undefined });
      });

      // 6. Buttons
      const buttons: any[] = [];
      document.querySelectorAll('button, [role="button"], a[class*="btn"], a[class*="cta"]').forEach(el => {
        const s = getComputedStyle(el);
        buttons.push({
          text: (el.textContent || '').trim().slice(0, 40),
          padding: s.padding,
          borderRadius: s.borderRadius,
          background: s.background || s.backgroundColor,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          backdropFilter: s.backdropFilter,
          border: s.border,
          boxShadow: s.boxShadow,
        });
      });

      // 7. Color palette — count all visible colors
      const colorCount: Record<string, number> = {};
      document.querySelectorAll('*').forEach(el => {
        const s = getComputedStyle(el);
        ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
          const val = s.getPropertyValue(prop);
          if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent' && !val.includes('initial')) {
            colorCount[val] = (colorCount[val] || 0) + 1;
          }
        });
      });
      const sortedColors = Object.entries(colorCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12);

      function rgbToHslArr(r: number, g: number, b: number): [number, number, number] {
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
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
      }

      function parseHex(hex: string): [number, number, number] | null {
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

      const colorPalette = sortedColors.map(([hex, count]) => {
        const rgb = parseHex(hex);
        if (rgb) {
          const [h, s, l] = rgbToHslArr(rgb[0], rgb[1], rgb[2]);
          return { hsl: `${h} ${s}% ${l}%`, hex, count };
        }
        return { hsl: '0 0% 50%', hex, count };
      });

      // 8. Aesthetic classification
      const allEls = document.querySelectorAll('*');
      const blurCount = [...allEls].filter(el => getComputedStyle(el).backdropFilter.includes('blur')).length;
      const gradientCount = [...allEls].filter(el => getComputedStyle(el).backgroundImage.includes('gradient')).length;
      const borderRadiuses: string[] = [];
      allEls.forEach(el => {
        const r = getComputedStyle(el).borderRadius;
        if (r && r !== '0px') borderRadiuses.push(r);
      });
      const dominantRadius = borderRadiuses.sort((a, b) =>
        borderRadiuses.filter(v => v === b).length - borderRadiuses.filter(v => v === a).length
      )[0] || '0px';

      const whitespace = [...allEls].filter(el => {
        const s = getComputedStyle(el);
        return parseInt(s.padding) > 32 || parseInt(s.margin) > 32;
      }).length / Math.max(allEls.length, 1);

      const colorSet = new Set<string>();
      allEls.forEach(el => {
        const s = getComputedStyle(el);
        ['backgroundColor', 'color', 'borderColor'].forEach(p => {
          const v = s.getPropertyValue(p);
          if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' && !v.includes('initial')) {
            colorSet.add(v);
          }
        });
      });

      const aestheticLabels: string[] = [];
      if (blurCount >= 1) aestheticLabels.push('Glassmorphism');
      if (gradientCount >= 1) aestheticLabels.push('Gradient-heavy');
      if (dominantRadius === '0px' || (parseInt(dominantRadius) || 0) === 0) aestheticLabels.push('Brutalist/Sharp edges');
      if (whitespace > 0.25) aestheticLabels.push('Luxury-Minimal');
      else if (whitespace > 0.1) aestheticLabels.push('Clean White Space');
      if (colorSet.size <= 4) aestheticLabels.push('Minimalist Palette');
      else if (colorSet.size <= 8) aestheticLabels.push('Balanced Palette');
      else aestheticLabels.push('Vibrant Palette');
      if (blurCount === 0 && gradientCount === 0 && whitespace <= 0.1 && colorSet.size <= 3) {
        aestheticLabels.push('Editorial-Standard');
      }
      if (aestheticLabels.length === 0) aestheticLabels.push('Standard Web');

      // 9. Spacing scale
      const spacingValues: Set<number> = new Set();
      allEls.forEach(el => {
        const s = getComputedStyle(el);
        ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom', 'gap'].forEach(prop => {
          const v = parseInt(s.getPropertyValue(prop));
          if (v > 0 && v < 200) spacingValues.add(v);
        });
      });
      const spacingScale = [...spacingValues].sort((a, b) => a - b).slice(0, 10);

      // 10. Hover transforms
      const hoverTransforms: string[] = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            const css = (rule as any).cssText || '';
            if (css.includes(':hover') && (css.includes('transform') || css.includes('scale') || css.includes('translate'))) {
              const match = css.match(/transform\s*:\s*([^;}]+)/);
              if (match) hoverTransforms.push(match[1].trim());
            }
          }
        } catch {}
      }

      // 11. Section sequence
      const sectionSequence: string[] = [];
      document.querySelectorAll('section, [class*="section"], header, footer, main > div').forEach(el => {
        const id = el.id || '';
        const classNameStr = typeof (el as HTMLElement).className === "string" ? (el as HTMLElement).className : String((el as any).className?.baseVal || "");
        const cls = classNameStr.split(/\s+/).filter(c => c && !c.startsWith('_') && !c.startsWith('css-')).slice(0, 2).join(' ');
        const heading = el.querySelector('h1, h2, h3');
        const headingText = heading?.textContent?.trim().slice(0, 50) || '';
        const label = headingText || id || cls || el.tagName.toLowerCase();
        if (label && !sectionSequence.includes(label)) sectionSequence.push(label);
      });

      return {
        cssVars,
        googleFontsUrl,
        loadedFonts,
        keyframes,
        videos: videos.slice(0, 3),
        buttons: buttons.slice(0, 8),
        colorPalette,
        aestheticLabels,
        spacingScale,
        dominantRadius,
        hoverTransforms: [...new Set(hoverTransforms)].slice(0, 6),
        backdropBlurCount: blurCount,
        gradientCount,
        sectionSequence: sectionSequence.slice(0, 20),
      };
    });

    if (ownBrowser) await browser.close();
    return dna;
  } catch (err) {
    console.error(`[Syclone] Rich style extraction failed for ${url}:`, err);
    if (ownBrowser && browser) {
      try { await browser.close(); } catch {}
    }
    return {
      cssVars: {},
      googleFontsUrl: null,
      loadedFonts: [],
      keyframes: [],
      videos: [],
      buttons: [],
      colorPalette: [],
      aestheticLabels: ['Standard Web'],
      spacingScale: [],
      dominantRadius: '0px',
      hoverTransforms: [],
      backdropBlurCount: 0,
      gradientCount: 0,
      sectionSequence: [],
    };
  }
}
