// scrape-followers.js
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer';
puppeteerExtra.use(StealthPlugin());

export async function scrapeFollowers(targetUsername) {
  const browser = await puppeteerExtra.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const igUser = 'ovikingdomotion';
  const igPass = '1q2w3egG#';

  try {
    // Login no Instagram
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', igUser, { delay: 50 });
    await page.type('input[name="password"]', igPass, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Acessa o perfil desejado
    await page.goto(`https://www.instagram.com/${targetUsername}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Clica em "seguidores"
    const followersBtn = await page.$('a[href$="/followers/"]');
    if (!followersBtn) throw new Error('Botão de seguidores não encontrado!');
    await followersBtn.click();

    // Espera o modal
    await page.waitForSelector('._aano');
    await page.waitForTimeout(1000);

    const scrollContainer = await page.$('._aano');

    let followers = new Set();
    let lastHeight = 0;
    let sameCount = 0;

    while (sameCount < 3) {
      const current = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('._aano span span'))
          .map(el => el.textContent)
          .filter(Boolean);
      });

      current.forEach(f => followers.add(f));

      const height = await page.evaluate(el => el.scrollHeight, scrollContainer);
      if (height === lastHeight) sameCount++;
      else sameCount = 0;
      lastHeight = height;

      await page.evaluate(el => el.scrollTo(0, el.scrollHeight), scrollContainer);
      await page.waitForTimeout(1500);
    }

    await browser.close();
    return Array.from(followers);
  } catch (err) {
    console.error('[Scraper] Erro:', err.message);
    await browser.close();
    throw err;
  }
}
