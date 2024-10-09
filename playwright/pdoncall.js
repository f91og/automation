import launchBrowser from './browser.js';
import process from 'node:process';
import fetch  from 'node-fetch';

const args = process.argv.slice(2);
const pdUrl = args[0];
const refreshInterval = args.length == 2 ? args[1] : 10000;

const waitTime = 120000;
const browser = await launchBrowser()
const page = await browser.newPage();
await page.goto(pdUrl, { timeout: waitTime });

for (; ;) {
    await page.reload({ timeout: waitTime });
    await page.getByText('Assigned to me').click();
    
    await page.waitForSelector('td>>nth=6', waitTime);
    const urgency = await page.$eval('td>>nth=5', element => element.textContent);
    console.log(urgency);

    if (urgency === 'High') {
        await page.click('input[type=checkbox] >> nth=1');

        const title = await page.$eval('td>>nth=7', element => element.textContent);
        // let title = (await page.locator('td>>nth=7').innerText()).valueOf()
        const alert = title.toLowerCase()
        if (alert.includes('master') || alert.includes('router') || alert.includes('coredns')) {
            fetch('https://hooks.slack.com/services/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', {
                method: 'POST',
                body: new URLSearchParams({
                    'payload': `{"person": "@Xue a Yu", "username": "webhookbot", "text": '${title}', "icon_emoji": ":ghost:"}`
                })
            });
            break;
        } else {
            await page.locator('"Snooze"').click();
            await page.locator('"24 hrs"').click();
            console.log("Snoozed alert:", title);
        }
    }

    await page.waitForTimeout(refreshInterval);
}

await browser.close();
