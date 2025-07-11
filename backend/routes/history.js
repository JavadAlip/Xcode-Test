// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const HistoryData = require("../models/HistoryData");

// // POST /api/history — Append new snapshot
// router.post("/", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
//       params: {
//         vs_currency: "usd",
//         order: "market_cap_desc",
//         per_page: 10,
//         page: 1,
//       },
//     });

//     const coins = response.data;

//     const saved = await Promise.all(
//       coins.map((coin) =>
//         HistoryData.create({
//           coinId: coin.id,
//           name: coin.name,
//           symbol: coin.symbol,
//           price: coin.current_price,
//           marketCap: coin.market_cap,
//           change24h: coin.price_change_percentage_24h,
//           timestamp: new Date(),
//         })
//       )
//     );

//     res.status(201).json(saved);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save history snapshot" });
//   }
// });

// // GET /api/history — All snapshots
// router.get("/", async (req, res) => {
//   try {
//     const data = await HistoryData.find().sort({ timestamp: -1 });
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch history" });
//   }
// });

// // GET /api/history/:coinId — Specific coin's history
// router.get("/:coinId", async (req, res) => {
//   const { coinId } = req.params;
//   try {
//     const data = await HistoryData.find({ coinId }).sort({ timestamp: -1 });
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch coin history" });
//   }
// });

// module.exports = router;


const express = require("express");
const axios = require("axios");
const router = express.Router();
const HistoryData = require("../models/HistoryData");

// POST /api/history — Append new snapshot
router.post("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
      },
    });

    const coins = response.data;

    const saved = await Promise.all(
      coins.map((coin) =>
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

// GET /api/history — All snapshots
router.get("/", async (req, res) => {
  try {
    const data = await HistoryData.find().sort({ timestamp: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// GET /api/history/:coinId — Specific coin's history
router.get("/:coinId", async (req, res) => {
  const { coinId } = req.params;
  try {
    const data = await HistoryData.find({ coinId }).sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coin history" });
  }
});

module.exports = router;
