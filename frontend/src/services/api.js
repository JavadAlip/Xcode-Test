// const BASE_URL = "http://localhost:5000/api/coins"; // Adjust if needed
const BASE_URL = "https://xcode-test-backend.onrender.com/api/coins";

export const fetchCoins = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch coins");
  return res.json();
};
