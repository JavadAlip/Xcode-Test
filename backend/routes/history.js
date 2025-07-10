
const express = require("express");
const axios = require("axios");
const router = express.Router();
const HistoryData = require("../models/HistoryData");


// 🔁 POST /api/history — Append a new history snapshot
router.post("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: "bitcoin,ethereum", // Add more coins if needed
      },
    });
    console.log(response.data); 

    const coins = response.data;

    const saved = await Promise.all(
      coins.map(coin =>
        HistoryData.create({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          marketCap: coin.market_cap,
          change24h: coin.price_change_percentage_24h,
          timestamp: new Date(),
        })
      )
    );

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Failed to save history snapshot" });
  }
});

// 📥 GET /api/history — Get all saved snapshots (latest first)
router.get("/", async (req, res) => {
  try {
    const data = await HistoryData.find().sort({ timestamp: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 📥 GET /api/history/:coinId — Get history by coinId (for charts)
router.get("/:coinId", async (req, res) => {
  const { coinId } = req.params;
  console.log("✅ Route hit for:", req.params.coinId); // Debug log

  try {
    const data = await HistoryData.find({ coinId }).sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coin history" });
  }
});

module.exports = router;
