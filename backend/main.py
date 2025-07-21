import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
KIWI_API_HOST = os.getenv("KIWI_API_HOST", "kiwi-com-cheap-flights.p.rapidapi.com")

print(" RAPIDAPI_KEY:", RAPIDAPI_KEY)
print(" KIWI_API_HOST:", KIWI_API_HOST)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Kiwi API backend running!"}

def fetch_kiwi_round_trip(source="Country:GB", destination="City:dubrovnik_hr", currency="usd"):
    url = f"https://{KIWI_API_HOST}/round-trip"

    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": KIWI_API_HOST
    }

    params = {
        "source": source,
        "destination": destination,
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
        "outbound": "SUNDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,MONDAY,TUESDAY",
        "transportTypes": "FLIGHT",
        "contentProviders": "KIWI",
        "limit": 5
    }

    response = requests.get(url, headers=headers, params=params)
    print("DEBUG STATUS:", response.status_code)
    print("DEBUG RAW RESPONSE (first 300):", response.text[:300])

    if response.status_code != 200:
        return []

    data = response.json()
    itineraries = data.get("itineraries", [])
    if not itineraries:
        print("⚠️ No itineraries found in response.")
        return []

    results = []
    for it in itineraries:
        price_info = it.get("price", {})
        amount = price_info.get("amount")
        currency_code = price_info.get("currencyCode") or currency.upper()  # ✅ fallback to requested currency

        legs = it.get("legs", []) or []  # ensure list
        dep_time = legs[0].get("departure", {}).get("time") if legs else None
        arr_time = legs[-1].get("arrival", {}).get("time") if legs else None

        results.append({
            "price": float(amount) if amount else None,
            "currency": currency_code,
            "departure_time": dep_time,
            "arrival_time": arr_time,
            "legs_count": len(legs)
        })

    return results

@app.get("/price-trends")
def price_trends(
    source: str = "Country:GB",
    destination: str = "City:dubrovnik_hr",
    currency: str = "usd"
):
    flights = fetch_kiwi_round_trip(source, destination, currency)

    if not flights:
        return {"message": "No itineraries found"}

    prices = [f["price"] for f in flights if f["price"] is not None]
    if not prices:
        return {"message": "No valid prices"}

    avg_price = round(sum(prices) / len(prices), 2)
    min_price = min(prices)
    max_price = max(prices)

    return {
        "source": source,
        "destination": destination,
        "avg_price": avg_price,
        "min_price": min_price,
        "max_price": max_price,
        "total_itineraries": len(flights),
        "flights": flights
    }
