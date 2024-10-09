import launchBrowser from './browser.js';
import schedule from 'node-schedule';

const rhsUrl = 'https://rhs.intra.rakuten.co.jp/cws31/srwtimerec?user_id=$EmployeeID&dakoku=taisya'

// 设置 9:30 触发规则
let rhsRuleMorning = new schedule.RecurrenceRule();
rhsRuleMorning.hour = 9;
rhsRuleMorning.minute = 30;
rhsRuleMorning.dayOfWeek = [1, 2, 3, 4, 5];

// 设置 19:30 触发规则
let rhsRuleAfternoon = new schedule.RecurrenceRule();
rhsRuleAfternoon.hour = 19;
rhsRuleAfternoon.minute = 30;
rhsRuleAfternoon.dayOfWeek = [1, 2, 3, 4, 5];

// 定义两个任务
schedule.scheduleJob(rhsRuleMorning, async () => {
  await rhsCheck("in");
});
schedule.scheduleJob(rhsRuleAfternoon, async () => {
  await rhsCheck("out");
});

async function rhsCheck(inOrOut) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.goto(rhsUrl, { timeout: 30000 });
  await page.locator('input[name="user_id"]').click();
  await page.locator('input[name="user_id"]').fill('300089117');

  if (inOrOut === 'in') {
    await page.getByRole('button', { name: 'Time In' }).click();
  } else {
    await page.getByRole('button', { name: 'Time Out' }).click();
  }

  const time = new Date().toLocaleString();
  console.log(`login ${inOrOut} at ${time}`);

  await browser.close();
}
