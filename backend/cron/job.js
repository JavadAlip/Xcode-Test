const cron = require("node-cron");
const axios = require("axios");
const HistoryData = require("../models/HistoryData");

// Schedule: Every 5 minutes
const startCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Fetching crypto data from CoinGecko...");

    try {
      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CryptoApp/1.0; +http://yourdomain.com)"
        },
        params: {
          vs_currency: "usd",
          ids: "bitcoin,ethereum,tether,xrp,bnb", // add more coin IDs as needed
        },
      });

      const coins = response.data;

      for (let coin of coins) {
        await HistoryData.create({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          marketCap: coin.market_cap,
          change24h: coin.price_change_percentage_24h,
          timestamp: new Date(),
        });
      }

      console.log("Per 5 minute crypto data saved.");
    } catch (err) {
      console.error(" Error fetching data:", err.message);
    }
  });
};

module.exports = startCronJob;
