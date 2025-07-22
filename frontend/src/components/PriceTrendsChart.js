import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const PriceTrendsChart = () => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/price-trends?source=london&destination=paris")
      .then((res) => {
        const flights = res.data.flights || [];
        const formatted = flights.map((f, idx) => ({
          date: `Flight ${idx + 1}`,
          average_price: f.price
        }));
        setPriceData(formatted);
      })
      .catch((err) => console.error("Error fetching price trends:", err));
  }, []);

  return (
    <div style={{ width: "100%", height: 400, marginBottom: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Price Trends Over Time</h2>
      <ResponsiveContainer>
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="average_price" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceTrendsChart;
