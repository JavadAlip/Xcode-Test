const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const currentRoute = require("./routes/current");
const historyRoute = require("./routes/history");
const startCronJob = require("./cron/job");

dotenv.config();

const app = express();

// ✅ Fix for CORS issue with Vercel
const corsOptions = {
  origin: "https://xcode-test-frontend.vercel.app",
};
app.use(cors(corsOptions));

app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ API Routes
app.use("/api/coins", currentRoute);
app.use("/api/history", historyRoute);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Start cron job
startCronJob();
