const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const htmlPath = 'file:///' + path.join(__dirname, 'resume.html').replace(/\\/g, '/');
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: 'resume.pdf',
      format: 'A4',
      printBackground: true
    });
    await browser.close();
    console.log('PDF generated successfully as resume.pdf');
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
})();
