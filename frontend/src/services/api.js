const BASE_URL = "http://localhost:5000/api/coins"; // Adjust if needed

export const fetchCoins = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch coins");
  return res.json();
};
