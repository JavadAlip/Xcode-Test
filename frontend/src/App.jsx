import { useState } from "react";
import CryptoTable from "./components/CryptoTable";
import CoinChart from "./components/CoinChart";

function App() {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 px-4">
      <div className="py-6 text-center">
        <label className="mr-2 font-semibold">Select Coin:</label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="tether">Tether</option>
          <option value="solana">Solana</option>
          <option value="xrp">XRP</option>
          <option value="binancecoin">BNB</option>
          <option value="dogecoin">Dogecoin</option>
          <option value="cardano">Cardano</option>
          <option value="toncoin">Toncoin</option>
          <option value="avalanche-2">Avalanche</option>
        </select>
      </div>

      <CryptoTable />
      <CoinChart coinId={selectedCoin} />
    </div>
  );
}

export default App;
