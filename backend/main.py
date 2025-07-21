import os
import requests
from fastapi import FastAPI
import pandas as pd
from sample_data import get_airline_data
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

AVIATIONSTACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
BASE_URL = os.getenv("BASE_URL")


@app.get("/")
def home():
    return {"message": "Airline Demand Insights API running!"}

@app.get("/popular-routes")
def get_popular_routes():
    response = requests.get(
        f"{BASE_URL}/flights",
        params={"access_key": AVIATIONSTACK_API_KEY, "limit": 30}
    )
    flights = response.json().get("data", [])

    route_count = {}
    for flight in flights:
        dep = flight.get("departure", {}).get("airport") or "Unknown"
        arr = flight.get("arrival", {}).get("airport") or "Unknown"
        route = f"{dep} → {arr}"
        route_count[route] = route_count.get(route, 0) + 1

    return [{"route": k, "bookings": v} for k, v in route_count.items()][:7]