

// const cron = require("node-cron");
// const axios = require("axios");
// const HistoryData = require("../models/HistoryData");

// // Schedule: Every 1 hour (minute 0 of every hour)
// const startCronJob = () => {
//   cron.schedule("*/5 * * * *", async () => {
//     console.log("⏳ Fetching crypto data from CoinGecko...");

//     try {
//       const response = await axios.get(
//         "https://api.coingecko.com/api/v3/coins/markets",
//         {
//           params: {
//             vs_currency: "usd",
//             ids: "bitcoin,ethereum", // Add more coin IDs if needed
//           },
//         }
//       );

//       const coins = response.data;

//       for (let coin of coins) {
//         await HistoryData.create({
//           coinId: coin.id,
//           name: coin.name,
//           symbol: coin.symbol,
//           price: coin.current_price,
//         });
//       }

//       console.log("✅ Per 5 Minute crypto data saved.");
//     } catch (err) {
//       console.error("❌ Error fetching data:", err.message);
//     }
//   });
// };

// module.exports = startCronJob;



const cron = require("node-cron");
const { chromium } = require("playwright");
const HistoryData = require("../models/HistoryData");

const fetchWithPlaywright = async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum";

  try {
    await page.goto(url, { waitUntil: "networkidle" });

    const bodyText = await page.textContent("body");
    const data = JSON.parse(bodyText);

    await browser.close();

    return data;
  } catch (err) {
    console.error("❌ Playwright fetch failed:", err.message);
    await browser.close();
    return null;
  }
};

const startPlaywrightCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏳ Fetching crypto data using Playwright...");

    const coins = await fetchWithPlaywright();

    if (!coins) {
      console.error("❌ No data fetched from CoinGecko.");
      return;
    }

    try {
      for (let coin of coins) {
        await HistoryData.create({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
        });
      }

      console.log("✅ Data saved successfully to MongoDB.");
    } catch (dbError) {
      console.error("❌ Error saving to DB:", dbError.message);
    }
  });
};

module.exports = startPlaywrightCronJob;
