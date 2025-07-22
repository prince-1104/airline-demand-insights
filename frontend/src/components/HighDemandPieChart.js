import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { backendUrl } from "../config";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HighDemandPieChart() {
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/popular-routes`)
      .then((res) => {
        const rawRoutes = res.data.popular_routes || [];
        const formatted = rawRoutes
          .map((r) => ({
            name: r.route,
            value: r.data?.total_itineraries || 0,
          }))
          .filter((r) => r.value > 0);

        setDemandData(formatted);
      })
      .catch((err) => console.error("Error fetching demand:", err));
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1e293b",
          fontWeight: "700",
          marginBottom: "16px",
        }}
      >
        High-Demand Routes
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={demandData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {demandData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
