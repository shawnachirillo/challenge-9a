import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

/// All of these routes are prefixed with /api/weather

// POST: Get weather data by city name
router.post('/', async (req: Request, res: Response) => {
  console.log('✅ POST /api/weather hit');
  console.log('🛬 Received cityName:', req.body.cityName);

  const city = req.body.cityName;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherArray = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    console.log('📦 Sending weather data:', weatherArray);
    return res.json(weatherArray);
  } catch (error) {
    console.error('❌ Error in POST /api/weather:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET: Retrieve city search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const historyData = await HistoryService.getCities();
    return res.json(historyData);
  } catch (error) {
    console.error('❌ Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// DELETE: Remove city from history by ID
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'City ID is required' });
  }

  try {
    await HistoryService.removeCity(id);
    console.log(`🗑️ Deleted city with ID: ${id}`);
    return res.status(204).end();
  } catch (error) {
    console.error('❌ Error deleting city:', error);
    return res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
