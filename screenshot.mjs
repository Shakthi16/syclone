import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'public/images/screenshot_home.png' });
  await page.goto('http://localhost:5173/scan');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'public/images/screenshot_scan.png' });
  await browser.close();
})();