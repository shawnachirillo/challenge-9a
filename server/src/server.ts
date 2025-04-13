// server/src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

// Required workaround for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Serve static files from the compiled frontend (Vite)
app.use(express.static(path.resolve(__dirname, '../../client/dist')));

// ✅ Middleware for JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount all API routes under /api
app.use('/api', routes);

// ✅ Root route (non-API) — needed so Render shows something if visiting base URL
app.get('/', (_req, res) => {
  res.send('🌤️ Weather API is running! Try a POST request to /api/weather.');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is live at: http://localhost:${PORT}`);
});
