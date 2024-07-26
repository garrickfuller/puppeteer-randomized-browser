const puppeteer = require('puppeteer');
const readline = require('readline');
 
let rl = readline.createInterface(
                    process.stdin, process.stdout);

             
let userAgentPool = [];
userAgentPool[0] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
userAgentPool[1] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/115.0';
userAgentPool[2]= 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1';
userAgentPool[3] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/115.0.1901.183';
userAgentPool[4]= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:114.0) Gecko/20100101 Firefox/114.0';
userAgentPool[5] = 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36';
userAgentPool[6] = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:114.0) Gecko/20100101 Firefox/114.0';
userAgentPool[7] = 'Mozilla/5.0 (iPad; CPU OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Safari/604.1';
userAgentPool[8] = 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; AS; rv:11.0) like Gecko';
userAgentPool[9] = 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/91.0.4472.120 Mobile Safari/537.36';


// Leave proxyPool blank if you will not be using proxies. Proxies should be UserPass auth. 
let proxyPool = [];
proxyPool[0] = 'host:port:username:password';


// General function to launch browsers with parameters
const launchBrowser = async (url, width, height) => {
    
    const args = [];
    const [proxyHost, proxyPort, username, password] = proxyPool.length > 0 ? proxyPool[Math.floor
        (Math.random() * proxyPool.length)].split(':') : [];

        if (proxyHost && proxyPort) {
            const proxy = `${proxyHost}:${proxyPort}`;
            args.push(`--proxy-server=${proxy}`);
        }
    
    const browser = await puppeteer.launch({ headless: false, args });

    
    
    const page = await browser.newPage();
    await page.authenticate({ username, password });
    await page.setViewport({ width, height });
    await page.goto(url);
    

    await page.setUserAgent(userAgentPool[Math.floor(Math.random() * 10)]);
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log('User Agent:', userAgent);
    return browser;
};


const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const main = async () => {
try {
    let numBrowsersAnswer = await askQuestion("Number of browsers to open:");
    let numBrowsers = parseInt(numBrowsersAnswer,10);
    if (numBrowsers < 1 || numBrowsers > 50) {
        numBrowsers = 1;
    }
    
    
    
    let browsers = [];
    for (let i = 0; i < numBrowsers; i++) {
        const browser = await launchBrowser('https://developer.chrome.com/', 1080, 1024);
        browsers.push(browser);
         
    }
} catch (error) {
    console.error("An error occurred:", error);
} finally {
    rl.close();
}



}
main();