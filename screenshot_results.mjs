import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/scan?url=https://github.com');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'public/images/screenshot_github_scan.png' });
  await page.goto('http://localhost:5173/scan?url=https://stripe.com');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'public/images/screenshot_stripe_scan.png' });
  await browser.close();
})();