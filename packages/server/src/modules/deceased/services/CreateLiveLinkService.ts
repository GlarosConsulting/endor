import puppeteer from 'puppeteer';

const RTSP_LINK_INPUT = 'input[name="rtspLink"]';
const RTSP_EMAIL_INPUT = 'input[name="rtspEmail"]';
const RTSP_EMAIL = 'comercial@grupoendor.com.br';

class CreateLiveLink {
  public async execute(cam_url: string): Promise<string> {
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    await page.goto('https://rtsp.me/', { waitUntil: 'networkidle2' });
    await page.waitForSelector(RTSP_LINK_INPUT, { timeout: 5000 });
    await page.type(RTSP_LINK_INPUT, cam_url);
    await page.type(RTSP_EMAIL_INPUT, RTSP_EMAIL);

    await page.click('input#rtspCreate');

    await page.waitForSelector('span#rtspWindow > a', { timeout: 5000 });

    /* istanbul ignore next */
    const link = await page.evaluate(() => {
      const element = document.querySelector('span#rtspWindow > a');
      return element?.getAttribute('href');
    });

    browser.close();
    return String(link);
  }
}

export default CreateLiveLink;
