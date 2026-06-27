import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  console.log('Navigating to Github scan...');
  await page.goto('http://localhost:5173/scan?url=https://github.com');
  await page.waitForTimeout(15000); // Wait 15s for the backend to finish the scan
  await page.screenshot({ path: 'public/images/screenshot_github_scan.png' });
  console.log('Navigating to Stripe scan...');
  await page.goto('http://localhost:5173/scan?url=https://stripe.com');
  await page.waitForTimeout(15000); // Wait 15s for the backend to finish the scan
  await page.screenshot({ path: 'public/images/screenshot_stripe_scan.png' });
  await browser.close();
  console.log('Done');
})();