✈️ Airline Demand Insights Dashboard
Project Overview
This is a full-stack web application that fetches airline booking demand data, processes it, and visualizes useful insights in a simple, interactive dashboard.

You can view:
Popular Flight Routes
Price Trends for specific routes
High-demand routes & destinations
It’s designed for quick market demand analysis using free/public APIs.

 Features
 Popular Flight Routes visualized in a bar chart
 Price Trends for selected routes with a dynamic dropdown
 High-Demand Routes displayed as a pie chart
 FastAPI Backend serving REST APIs
 React Frontend with Recharts for interactive visualizations

 Tech Stack
Backend: [FastAPI, Python, Uvicorn]

Frontend: [React, Axios, Recharts

Deployment:
Backend: Render
Frontend: Vercel

 Installation & Setup
 Clone this repository
git clone https://github.com/your-username/airline-demand-insights.git
cd airline-demand-insights

 Setup Backend
pip install -r requirements.txt
# Set your API key in .env
RAPIDAPI_KEY=your_api_key
uvicorn main:app --reload

 Setup Frontend
npm install
npm start

 Access the Dashboard

Backend runs on 
https://airline-demand-insights.onrender.com/
API endpoints available:
https://airline-demand-insights.onrender.com/popular-routes
https://airline-demand-insights.onrender.com/price-trends?source=london&destination=paris
           
Frontend runs on
https://airline.doptonin.in/

 How it works
 Backend: Fetches airline booking data (routes, pricing, demand) from a free/public API.
 Frontend: Consumes backend APIs and visualizes insights using charts (Bar, Line, Pie).
