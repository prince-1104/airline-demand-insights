import os
import requests
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
KIWI_API_HOST = os.getenv("KIWI_API_HOST", "kiwi-com-cheap-flights.p.rapidapi.com")


CITY_TO_SKYID = {
    "london": "City:london_gb",
    "paris": "City:paris_fr",
    "sydney": "City:sydney_au",
    "new york": "City:newyork_us",
    "los angeles": "City:losangeles_us",
    "dubrovnik": "City:dubrovnik_hr"
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": " Airline Demand Insights Backend Running"}


def get_skyid(city_name: str):
    if not city_name:
        return None
    city_name = city_name.strip().lower()
    return CITY_TO_SKYID.get(city_name)


def fetch_round_trip(source_city: str, dest_city: str, currency="usd"):
    source_id = get_skyid(source_city)
    dest_id = get_skyid(dest_city)

    if not source_id or not dest_id:
        print(f"⚠️ No SkyID for source={source_city}, dest={dest_city}")
        return {"message": f"No SkyID found for '{source_city}' or '{dest_city}'"}

    url = f"https://{KIWI_API_HOST}/round-trip"
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": KIWI_API_HOST
    }
    params = {
        "source": source_id,
        "destination": dest_id,
        "currency": currency,
        "locale": "en",
        "adults": 1,
        "children": 0,
        "infants": 0,
        "handbags": 1,
        "holdbags": 0,
        "cabinClass": "ECONOMY",
        "sortBy": "QUALITY",
        "sortOrder": "ASCENDING",
        "applyMixedClasses": True,
        "allowReturnFromDifferentCity": True,
        "allowChangeInboundDestination": True,
        "allowChangeInboundSource": True,
        "allowDifferentStationConnection": True,
        "enableSelfTransfer": True,
        "allowOvernightStopover": True,
        "enableTrueHiddenCity": True,
        "enableThrowAwayTicketing": True,
        "outbound": "SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY",
        "transportTypes": "FLIGHT",
        "contentProviders": "KIWI",
        "limit": 5
    }

    print(f"Fetching route: {source_id} → {dest_id}")
    resp = requests.get(url, headers=headers, params=params)
    print("ROUND-TRIP STATUS:", resp.status_code)

    if resp.status_code != 200:
        return {"message": f"API error {resp.status_code}"}

    data = resp.json()
    itineraries = data.get("itineraries", [])
    if not itineraries:
        print(" No itineraries found for round-trip.")
        return {"message": "No itineraries found"}

    flights = []
    for it in itineraries:
        price_info = it.get("price", {})
        price = price_info.get("amount")
        currency = price_info.get("currency")
        legs = it.get("legs", [])

        dep_time = legs[0].get("departure", {}).get("time") if legs else None
        arr_time = legs[-1].get("arrival", {}).get("time") if legs else None

        flights.append({
            "price": float(price) if price else None,
            "currency": currency,
            "departure_time": dep_time,
            "arrival_time": arr_time,
            "legs_count": len(legs)
        })

    prices = [f["price"] for f in flights if f["price"]]
    avg_price = round(sum(prices) / len(prices), 2) if prices else None

    return {
        "source": source_city,
        "destination": dest_city,
        "avg_price": avg_price,
        "min_price": min(prices) if prices else None,
        "max_price": max(prices) if prices else None,
        "total_itineraries": len(flights),
        "flights": flights
    }


@app.get("/price-trends")
def price_trends(
    source: str = Query(..., description="Source city name, e.g., London"),
    destination: str = Query(..., description="Destination city name, e.g., Paris"),
    currency: str = "usd"
):
    return fetch_round_trip(source, destination, currency)


@app.get("/popular-routes")
def popular_routes():
    routes = [
        ("london", "paris"),
        ("sydney", "los angeles"),
        ("new york", "los angeles"),
        ("london", "dubrovnik"),
    ]

    insights = []
    for src, dst in routes:
        data = fetch_round_trip(src, dst, "usd")
        insights.append({
            "route": f"{src.title()} → {dst.title()}",
            "data": data
        })
    return {"popular_routes": insights}


@app.get("/routes/compare")
def compare_routes(
    source1: str, destination1: str,
    source2: str, destination2: str
):
    route1 = fetch_round_trip(source1, destination1, "usd")
    route2 = fetch_round_trip(source2, destination2, "usd")

    return {
        "route1": {
            "route": f"{source1.title()} → {destination1.title()}",
            "data": route1
        },
        "route2": {
            "route": f"{source2.title()} → {destination2.title()}",
            "data": route2
        }
    }
