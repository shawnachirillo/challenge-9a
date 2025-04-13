import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Serve static files from Vite client build
app.use(express.static(path.resolve(__dirname, '../../client/dist')));

// ✅ JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount your API routes
app.use('/api', routes);

// ✅ Root route so Render shows something
app.get('/', (_req, res) => {
  res.send('🌤️ Weather API is running! Visit /api/weather for POST.');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
