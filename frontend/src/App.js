import React from "react";
import PopularRoutesChart from "./components/PopularRoutesChart";
import PriceTrendsChart from "./components/PriceTrendsChart";
import HighDemandPieChart from "./components/HighDemandPieChart";

function App() {
  const demandData = [
    { name: "London", value: 40 },
    { name: "Paris", value: 30 },
    { name: "Sydney", value: 20 },
    { name: "Los Angeles", value: 10 }
  ];

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Airline Demand Insights Dashboard</h1>
  
      <PopularRoutesChart />

      <PriceTrendsChart />

      <HighDemandPieChart data={demandData} />
    </div>
  );
}

export default App;
