const puppeteer = require('puppeteer');

async function blockOnRouter(macAddress) {
    const browser = await puppeteer.launch({ headless: true }); // Орқа фонда браузерни очиш
    const page = await browser.newPage();

    try {
        // 1. Роутер панелига кириш
        await page.goto('http://192.168.101.1');
        
        // 2. Логин ва паролни киритиш
        await page.type('#username', 'admin'); 
        await page.type('#password', 'admin');
        await page.click('#login_button');

        // 3. Security -> MAC Filter бўлимига ўтиш
        await page.waitForNavigation();
        await page.goto('http://192.168.101.1/mac_filter_settings.asp'); // Манзил роутер менюсига қараб фарқ қилиши мумкин

        // 4. Бегона MAC манзилни қўшиш ва сақлаш
        await page.type('#mac_address_field', macAddress);
        await page.click('#add_button');
        await page.click('#save_apply');

        console.log(`🚫 Қурилма роутер даражасида блокланди: ${macAddress}`);
    } catch (err) {
        console.error("Роутерда блоклашда хатолик:", err);
    } finally {
        await browser.close();
    }
}