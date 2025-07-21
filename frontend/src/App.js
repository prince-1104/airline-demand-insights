import React, { useEffect, useState } from "react";
import axios from "axios";
import PopularRoutesChart from "./components/PopularRoutesChart";


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/insights")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <h2>Loading insights...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1> Airline Demand Insights</h1>
      <PopularRoutesChart data={data.popular_routes} />
    </div>
  );
}

export default App;
