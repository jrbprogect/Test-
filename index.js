const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const FACEBOOK_URL = 'https://www.facebook.com';
const FACEBOOK_LOGIN = 'o7bdl1uccz@expressletter.net';
const FACEBOOK_PASSWORD = 'Jrbusaco010624';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(FACEBOOK_URL);

    // Log in to Facebook
    await page.type('#email', FACEBOOK_LOGIN, { delay: 100 });
    await page.type('#pass', FACEBOOK_PASSWORD, { delay: 100 });
    await page.click('button[name="login"]');
    await page.waitForNavigation();

    // Navigate to Messenger
    await page.goto('https://www.facebook.com/messages/t/', { waitUntil: 'networkidle0' });

    // Listen for new messages
    setInterval(async () => {
        const messages = await page.evaluate(() => {
            let messageElements = Array.from(document.querySelectorAll('div[role="log"] div[role="listitem"] div[dir="auto"] span span'));
            return messageElements.map(el => el.textContent);
        });

        console.log('New messages:', messages);

        if (messages.length > 0) {
            // Reply to the latest message
            const replyText = 'Hi! This is an automated reply!';
            await page.type('div[aria-label="Message"]', replyText, { delay: 100 });
            await page.keyboard.press('Enter');
        }
    }, 5000);  // Poll for new messages every 5 seconds

})();
                
