import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
/// All of these routes are prefixed with /api/weather
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/weather hit');
        const city = req.body.cityName;
        console.log('City received:', city);
        if (!city) {
            return res.status(400).json({ error: 'City name is required' });
        }
        const weatherArray = await WeatherService.getWeatherForCity(city);
        console.log('Weather array returned:', weatherArray);
        await HistoryService.addCity(city);
        res.json(weatherArray);
    }
    catch (err) {
        console.error('Error in POST /api/weather:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// TODO: GET search history
// this route is 'api/weather/history'
router.get('/history', async (_req, res) => {
    const historyData = await HistoryService.getCities();
    res.json(historyData);
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(400).json({ error: 'City ID is required' });
            return;
        }
        await HistoryService.removeCity(id);
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json(error);
    }
});
export default router;
