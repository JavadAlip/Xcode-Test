const cron = require("node-cron");
const axios = require("axios");
const HistoryData = require("../models/HistoryData");

// Schedule: Every 1 hour (minute 0 of every hour)
const startCronJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏳ Fetching crypto data from CoinGecko...");

    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: "bitcoin,ethereum", // Add more coin IDs if needed
          },
        }
      );

      const coins = response.data;

      for (let coin of coins) {
        await HistoryData.create({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
        });
      }

      console.log("Per minute crypto data saved.");
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  });
};

module.exports = startCronJob;
