import pandas as pd
def get_airline_data():
    data = [
        {"origin": "DEL", "destination": "SYD", "price": 45000, "date": "2025-07-21"},
        {"origin": "BOM", "destination": "MEL", "price": 47000, "date": "2025-07-22"},
        {"origin": "MAA", "destination": "SYD", "price": 43000, "date": "2025-07-23"},
        {"origin": "BLR", "destination": "MEL", "price": 48000, "date": "2025-07-24"},
        {"origin": "DEL", "destination": "MEL", "price": 46000, "date": "2025-07-25"},
    ]
    return pd.DataFrame(data)