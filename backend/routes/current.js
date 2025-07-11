

const express = require("express");
const axios = require("axios");
const router = express.Router();
const CurrentData = require("../models/CurrentData");

// POST /api/coins — Overwrite current top 10 coins
router.post("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
      },
    });

    const coins = response.data;

    await Promise.all(
      coins.map((coin) =>
        CurrentData.findOneAndUpdate(
          { coinId: coin.id },
          {
            coinId: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            price: coin.current_price,
            marketCap: coin.market_cap,
            change24h: coin.price_change_percentage_24h,
            timestamp: new Date(),
          },
          { upsert: true, new: true }
        )
      )
    );

    res.status(200).json({ message: "Current data updated" });
  } catch (error) {
    console.error("Error in POST /api/coins:", error.message);
    res.status(500).json({ error: "Failed to update current data" });
  }
});

// GET /api/coins — Fetch current top 10 from DB
router.get("/", async (req, res) => {
  try {
    const data = await CurrentData.find().sort({ marketCap: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch current data" });
  }
});

module.exports = router;
