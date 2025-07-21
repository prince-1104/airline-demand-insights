from fastapi import FastAPI
import pandas as pd
from sample_data import get_airline_data

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Airline Demand Insights API running!"}

@app.get("/insights")
def get_insights():
    df = get_airline_data()
    df["route"] = df["origin"] + " → " + df["destination"]
    df["date"] = pd.to_datetime(df["date"])

    # Popular Routes
    popular_routes = df["route"].value_counts().head(5).to_dict()

    # Price Trends by Date
    price_trends = df.groupby("date")["price"].mean().reset_index()
    price_trends = price_trends.to_dict(orient="records")

    # High-Demand Destinations
    demand_dest = df["destination"].value_counts().to_dict()

    return {
        "popular_routes": popular_routes,
        "price_trends": price_trends,
        "high_demand_destinations": demand_dest
    }