import React from "react";
import PopularRoutesChart from "./components/PopularRoutesChart";
import PriceTrendsChart from "./components/PriceTrendsChart";
import HighDemandPieChart from "./components/HighDemandPieChart";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#1e293b",
          fontWeight: "800",
        }}
      >
        ✈ Airline Demand Insights Dashboard
      </h1>

      {/* Dashboard Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Popular routes as bar chart */}
        <PopularRoutesChart />

        {/* Price trends with dropdown */}
        <PriceTrendsChart />

        {/* High-demand routes as pie chart */}
        <HighDemandPieChart />
      </div>
    </div>
  );
}

export default App;
