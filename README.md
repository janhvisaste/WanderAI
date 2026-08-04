<div align="center">

# 🌍 WanderAI

### AI-Powered Travel Intelligence & Geospatial Recommendation Platform

Generate personalized multi-day travel itineraries in seconds using Large Language Models, complete with intelligent hotel recommendations, interactive maps, and cost estimation.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenRouter-LLM-blue?style=for-the-badge" />
</p>

</div>

---

## 📖 Overview

**WanderAI** is a full-stack AI travel planning platform that combines modern LLMs with geospatial intelligence to generate personalized travel experiences.

Instead of spending hours researching destinations, accommodations, and daily activities, users simply describe their trip preferences and receive a structured itinerary complete with:

- 📅 Day-wise travel plans
- 💰 Estimated travel costs
- 🏨 Curated hotel recommendations
- 🗺️ Interactive location visualization
- 💾 Saved trips with authentication

---

### Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/fa256f1e-9673-4b72-8625-3320430063a6" alt="WanderAI Dashboard" width="100%">
</p>

---

# ✨ Features

### 🤖 AI Travel Planning
- Personalized 1–14 day itineraries
- Interest-based recommendations
- Budget-aware planning
- Day-wise schedules

### 🗺️ Interactive Maps
- Live hotel recommendations
- OpenStreetMap integration
- Leaflet-based visualization
- Destination geocoding

### 🏨 Smart Hotel Discovery
- Nearby accommodation search
- Interactive hotel markers
- Quick navigation

### 💰 Cost Estimation
- Estimated travel expenses
- Budget-aware recommendations

### 🔐 Authentication
- Secure Supabase authentication
- User profile management
- Saved itinerary history

### 🎨 Modern UI
- Responsive interface
- Light & Dark mode
- Framer Motion animations
- Clean dashboard experience

---

# 🏗️ Architecture

```
             User
               │
               ▼
      Next.js + React Frontend
               │
        REST API Requests
               │
               ▼
      Python FastAPI Backend
      ├── LLM Service
      ├── Trip Generator
      ├── Hotel Search
      └── Cost Estimator
               │
       ┌───────┴────────┐
       ▼                ▼
 OpenRouter/Groq   OpenStreetMap
       │
       ▼
    Supabase
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- React Leaflet
- Leaflet

## Backend

- Python 3.10+
- FastAPI
- Uvicorn

## AI

- LLaMA 3.3
- OpenRouter
- Groq

## Services

- Supabase Authentication
- OpenStreetMap
- Overpass API

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/janhvisaste/WanderAI.git

cd WanderAI
```

---

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
```

### Backend (`backend/.env`)

```env
OPENROUTER_API_KEY=YOUR_OPENROUTER_KEY
GROQ_API_KEY=YOUR_GROQ_KEY
```

---

## Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

---

# ▶️ Run the Project

```bash
./start.sh
```

### Frontend

```
http://localhost:3000
```

### Backend

```
http://localhost:8000
```

### API Documentation

```
http://localhost:8000/docs
```

---

# 📂 Project Structure

```
WanderAI
│
├── app/
├── components/
├── backend/
├── assets/
├── public/
├── start.sh
├── README.md
└── package.json
```

---

# 🔮 Future Improvements

- Flight recommendations
- Restaurant recommendations
- Weather-aware itinerary planning
- Multi-city trip optimization
- PDF itinerary export
- Google Maps integration
- Collaborative trip planning

---

# ❤️ Built With

- Next.js
- FastAPI
- LLaMA 3.3
- OpenRouter
- Groq
- Supabase
- OpenStreetMap

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star!

Made with ❤️ by **Janhvi Saste**

</div>
