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
    console.log('[Scraper] Acessando página de login...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForSelector('input[name="username"]', { timeout: 20000 });

    console.log('[Scraper] Digitando credenciais...');
    await page.type('input[name="username"]', igUser, { delay: 50 });
    await page.type('input[name="password"]', igPass, { delay: 50 });
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 90000 });

    if (page.url().includes('/challenge')) {
      throw new Error('Instagram pediu verificação (challenge)');
    }

    console.log(`[Scraper] Acessando perfil de ${targetUsername}...`);
    await page.goto(`https://www.instagram.com/${targetUsername}/`, { waitUntil: 'domcontentloaded', timeout: 90000 });

    await page.waitForTimeout(3000);

    const btn = await page.$('a[href$="/followers/"]');
    if (!btn) throw new Error('Botão de seguidores não encontrado');

    console.log('[Scraper] Clicando no botão de seguidores...');
    await btn.click();

    await page.waitForSelector('div[role="dialog"]', { timeout: 20000 });
    const scrollContainer = await page.$('div[role="dialog"] .isgrP') || await page.$('._aano');

    if (!scrollContainer) {
      throw new Error('Container de seguidores não encontrado');
    }

    let followers = new Set();
    let lastHeight = 0;
    let sameCount = 0;

    console.log('[Scraper] Iniciando scroll...');
    while (sameCount < 3) {
      const items = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div[role="dialog"] li span a span'))
          .map(el => el.textContent)
          .filter(Boolean);
      });

      items.forEach(i => followers.add(i));

      const height = await page.evaluate(el => el.scrollHeight, scrollContainer);
      if (height === lastHeight) {
        sameCount++;
      } else {
        sameCount = 0;
        lastHeight = height;
      }

      await page.evaluate(el => el.scrollTo(0, el.scrollHeight), scrollContainer);
      await page.waitForTimeout(1500);
    }

    await browser.close();
    console.log(`[Scraper] Seguidores coletados: ${followers.size}`);
    return Array.from(followers);
  } catch (err) {
    console.error('[Scraper] Erro:', err.message);
    await browser.close();
    throw err;
  }
}
