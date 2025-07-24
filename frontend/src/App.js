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

      {/* Info Banner */}
      <div
        style={{
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fde68a",
          borderRadius: "8px",
          padding: "14px 20px",
          margin: "0 auto 24px auto",
          maxWidth: "700px",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "1.1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <h4 style={{margin: 0}}>
          Please wait a moment ⏳. Responses may take a few minutes because our backend is hosted on Render’s free tier 🕒.
        </h4>
      </div>

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
