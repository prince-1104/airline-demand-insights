import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ROUTES = [
  { label: "London → Paris", source: "london", destination: "paris" },
  { label: "London → Dubrovnik", source: "london", destination: "dubrovnik" },
  { label: "New York → Los Angeles", source: "newyork", destination: "losangeles" },
  { label: "Sydney → Los Angeles", source: "sydney", destination: "losangeles" }
];

const PriceTrendsChart = () => {
  const [priceData, setPriceData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0]);
  const [loading, setLoading] = useState(false);

  const fetchPriceTrends = async (route) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/price-trends?source=${route.source}&destination=${route.destination}`
      );
      const formatted =
        res.data.flights?.map((f, idx) => ({
          date: `Option ${idx + 1}`,
          average_price: f.price,
        })) || [];
      setPriceData(formatted);
    } catch (err) {
      console.error("Error fetching price trends:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPriceTrends(selectedRoute);
  }, [selectedRoute]);

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        marginBottom: "2rem",
        background: "linear-gradient(135deg, #f3f4f6, #e0e7ff)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1f2937",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        ✈️ Price Trends Visualization
      </h2>


      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1.5rem",
          gap: "10px",
        }}
      >
        <select
          value={selectedRoute.label}
          onChange={(e) => {
            const route = ROUTES.find((r) => r.label === e.target.value);
            setSelectedRoute(route);
          }}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #6366f1",
            background: "white",
            color: "#1f2937",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {ROUTES.map((route) => (
            <option key={route.label} value={route.label}>
              {route.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => fetchPriceTrends(selectedRoute)}
          style={{
            padding: "8px 18px",
            background: "linear-gradient(90deg, #4f46e5, #6366f1)",
            color: "white",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "0.2s ease-in-out",
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "linear-gradient(90deg,#4338ca,#4f46e5)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "linear-gradient(90deg, #4f46e5, #6366f1)")
          }
        >
          🔄 Refresh
        </button>
      </div>

   
      <div style={{ width: "100%", height: 400 }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#4f46e5", fontWeight: "600" }}>
            Loading price data...
          </p>
        ) : priceData.length === 0 ? (
          <p style={{ textAlign: "center", color: "#ef4444", fontWeight: "600" }}>
            ⚠️ No price data available
          </p>
        ) : (
          <ResponsiveContainer>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="date" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="average_price"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 6, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PriceTrendsChart;
