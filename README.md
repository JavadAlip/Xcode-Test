🧾 Crypto Tracker - README

This is a full-stack cryptocurrency tracking application built with the MERN stack. It allows users to view real-time data for the top 10 cryptocurrencies, historical pricing charts, and more.

---

⚙️ Tech Stack Used

 🖥️ Frontend
- React.js (with Vite)
- Tailwind CSS
- Recharts (for charting)
- Deployed on Vercel

🖧 Backend
- Node.js with Express.js
- Axios (for API fetching)
- MongoDB with Mongoose
- Node-cron (for scheduled tasks)
- Deployed on Render

 📡 API Source
- [CoinGecko API](https://www.coingecko.com/)

---

🛠️ Setup & Installation Steps

 Backend Setup (`/backend`)

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
MONGO_URI=mongodb_connection_string
PORT=5000
```

Run the server:

```bash
node index.js
```

 Frontend Setup (`/frontend`)

```bash
cd frontend
npm install
```

Run the app locally:

```bash
npm run dev
```

---
⏱️ How the Cron Job Works

- Located in: `backend/cron/job.js`
- Uses the `node-cron` package
- Runs **every 1 hours**
- Fetches the top 10 cryptocurrencies from CoinGecko
- Saves their prices with a timestamp into MongoDB (`HistoryData` collection)
- Enables charting historical trends per coin

 Example Log:
```
Per hour crypto data saved.
```

---

🌐 Live Project Links

- 🔗 **Frontend (Vercel)**: [https://xcode-test-frontend.vercel.app](https://xcode-test-frontend.vercel.app)
- 🔗 **Backend (Render)**: [https://xcode-test-backend.onrender.com](https://xcode-test-backend.onrender.com)
