import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HighDemandPieChart() {
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/popular-routes")
      .then((res) => {
        const rawRoutes = res.data.popular_routes || [];       
        const formatted = rawRoutes.map((r) => ({
          name: r.route,
          value: r.data?.total_itineraries || 0
        })).filter((r) => r.value > 0); 

        setDemandData(formatted);
      })
      .catch((err) => console.error("Error fetching demand:", err));
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>High-Demand Routes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={demandData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {demandData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
