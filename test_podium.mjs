import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  console.log('Navigating to Podium scan...');
  await page.goto('http://localhost:5173/scan?url=https://podium.global');
  await page.waitForTimeout(25000); // Wait 25s for the backend to finish the scan
  await page.screenshot({ path: 'public/images/screenshot_podium_scan.png' });
  await browser.close();
  console.log('Done');
})();