<div align="center">
  
# 🌍 WanderAI - LLM-Driven Travel Intelligence & Geospatial Recommendation Platform

WanderAI is a premium, full-stack travel planning platform that leverages advanced AI to instantly generate incredibly detailed, personalized multi-day travel itineraries. 

Say goodbye to endless hours of researching! WanderAI effortlessly crafts daily schedules, provides intelligent cost estimates, and seamlessly plots beautiful recommended hotels directly onto an interactive map.


## ✨ Key Features
- **🤖 AI-Powered Itineraries**: Generate complete 1-14 day travel schedules customized to your budget and specific interests using state-of-the-art LLMs (LLaMA 3.3 via OpenRouter/Groq).
- **🗺️ Interactive Hotel Maps**: View real-time, curated hotel recommendations exactly where you're traveling, seamlessly plotted on an interactive Leaflet map synced with OpenStreetMap.
- **🌗 Stunning UI & Theme Support**: A gorgeous, animated dashboard built with Framer Motion, fully supporting true Light and Dark modes.
- **🔐 Secure Authentication**: Integrated with Supabase to provide safe, instant user authentication and profile management.
- **💾 Trip Management**: Save your favorite itineraries directly to your account. 
- **🚀 Ultra-Fast Architecture**: Robust Next.js 14 frontend paired with a parallelized Python FastAPI backend.

## 🛠️ Tech Stack
**Frontend:**
- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Leaflet](https://leafletjs.com/) & React Leaflet

**Backend:**
- [Python 3.10+](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)

**APIs & Services:**
- [Supabase](https://supabase.com/) (Auth)
- [OpenRouter](https://openrouter.ai/) / [Groq](https://groq.com/) (LLMs)
- [OpenStreetMap Overpass API](https://overpass-api.de/) (Geocoding & Lodging)

---

## 💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/janhvisaste/WanderAI.git
cd WanderAI
```

### 2. Set up the Environment Variables
You will need two `.env` files.

**Frontend (`.env.local`) in the root directory:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (`backend/.env`) in the backend module:**
```env
OPENROUTER_API_KEY=your_openrouter_api_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Install Dependencies
**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

---

## 🚀 Running the Project

WanderAI comes with a convenient, unified startup script that gracefully boots both the Next.js frontend and the Python backend simultaneously.

Simply run:
```bash
./start.sh
```

- **Frontend** runs on [http://localhost:3000](http://localhost:3000)
- **Backend API** runs on [http://localhost:8000](http://localhost:8000)
- **FastAPI Auto-Docs** are available at [http://localhost:8000/docs](http://localhost:8000/docs)

*(Note: Ensure you have made the script executable via `chmod +x start.sh` if running manually for the first time)*

---

*Built with ❤️ for passionate worldwide travelers.*
