# challenge-9# Weather Dashboard

A full-stack weather dashboard application that allows users to search for current weather and a 5-day forecast using the OpenWeatherMap API. The app stores and retrieves search history, and has both frontend and backend deployed.

## Live URLs

- **Frontend (Netlify):** [https://apiweathermap2.netlify.app]
- **Backend (Render):** [https://challenge-9a.onrender.com]
---

## Project Criteria

This application fulfills the following full-stack development criteria:

### Folder Structure
- **Client**: Vite + TypeScript React app
- **Server**: Node.js + Express API server, TypeScript setup with MongoDB

### 🔧 Technologies Used
- TypeScript
- Node.js
- Express
- MongoDB (via Mongoose)
- React (Vite)
- OpenWeatherMap API

### Features
- User can enter a city and fetch current weather + 5-day forecast
- City is added to search history
- History stored and can be deleted individually
- Backend has structured API endpoints:
  - `POST /api/weather`
  - `GET /api/weather/history`
  - `DELETE /api/weather/history/:id`

---

## ⚙️ Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/shawnachirillo/challenge-9a.git
cd challenge-9a
```

### 2. Setup `.env` for server
Create a `.env` file inside the `/server` directory:
```
API_KEY=your_openweathermap_api_key
```

### 3. Install dependencies & build
#### In `/server`:
```bash
npm install
npm run build
npm start
```

#### In `/client`:
```bash
npm install
npm run dev
```

---

##  Deployment

### Render (Backend)
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`
- **Environment Variable**:
  - `API_KEY=your_openweathermap_api_key`

### Netlify (Frontend)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variable**:
  - `VITE_API_URL=https://challenge-9a.onrender.com`

---

## 🧠 Author
Shawna Chirillo  
GitHub: [@shawnachirillo](https://github.com/shawnachirillo)

---

