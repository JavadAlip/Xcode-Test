import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CoinChart = ({ coinId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/history/${coinId}`);
        const json = await res.json();
        const formatted = json.map(item => ({
          price: item.price,
          time: new Date(item.timestamp).toLocaleTimeString(),
        })).reverse(); // reverse to go oldest to newest
        setData(formatted);
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    fetchHistory();
  }, [coinId]);

  if (!data.length) return <p className="text-center text-gray-500">Loading chart...</p>;

  return (
    <div className="my-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">📈 Price History - {coinId.toUpperCase()}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinChart;
