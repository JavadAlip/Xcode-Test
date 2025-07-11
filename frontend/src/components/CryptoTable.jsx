import { useEffect, useState } from "react";
import { fetchCoins } from "../services/api";

const CryptoTable = () => {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterChange, setFilterChange] = useState("all");

  const loadCoins = async () => {
    try {
      const data = await fetchCoins();
      const top10 = data.slice(0, 10);
      setCoins(top10);
    } catch (error) {
      console.error("Error:", error);
    }
  };    

  useEffect(() => {
    loadCoins();
    const interval = setInterval(loadCoins, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });

  const filteredCoins = sortedCoins
    .filter((coin) => {
      if (filterChange === "positive") return coin.change24h >= 0;
      if (filterChange === "negative") return coin.change24h < 0;
      return true;
    })
    .filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Top 10 Cryptocurrencies
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or symbol..."
            className="p-2 px-4 border border-gray-300 rounded-md w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="p-2 px-4 border border-gray-300 rounded-md w-full md:w-1/4"
            value={filterChange}
            onChange={(e) => setFilterChange(e.target.value)}
          >
            <option value="all">📊 All Coins</option>
            <option value="positive">📈 Gainers (24h)</option>
            <option value="negative">📉 Losers (24h)</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                {[
                  ["name", "Name"],
                  ["symbol", "Symbol"],
                  ["price", "Price (USD)"],
                  ["marketCap", "Market Cap"],
                  ["change24h", "24h % Change"],
                  ["timestamp", "Last Updated"],
                ].map(([field, label]) => (
                  <th
                    key={field}
                    className="p-3 cursor-pointer whitespace-nowrap hover:text-blue-600"
                    onClick={() => toggleSort(field)}
                  >
                    {label}
                    {sortField === field && (
                      <span>{sortOrder === "asc" ? " 🔼" : " 🔽"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr
                  key={coin._id}
                  className="hover:bg-gray-50 transition border-t"
                >
                  <td className="p-3 font-medium text-gray-800">{coin.name}</td>
                  <td className="p-3 uppercase text-gray-600">{coin.symbol}</td>
                  <td className="p-3">${coin.price.toLocaleString()}</td>
                  <td className="p-3">${coin.marketCap?.toLocaleString()}</td>
                  <td
                    className={`p-3 font-semibold ${
                      coin.change24h >= 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {coin.change24h?.toFixed(2)}%
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(
                      coin.updatedAt || coin.timestamp
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;
