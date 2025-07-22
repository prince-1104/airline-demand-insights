import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const PopularRoutesChart = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/popular-routes")
      .then((res) => {
        const rawRoutes = res.data.popular_routes || [];
        const formatted = rawRoutes.map((r) => ({
          route: r.route,
          bookings: r.data?.avg_price || 0 
        }));
        setRoutes(formatted);
      })
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  return (
    <div style={{ width: "100%", height: 400, marginBottom: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>Popular Flight Routes</h2>
      <ResponsiveContainer>
        <BarChart data={routes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="route" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bookings" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularRoutesChart;
