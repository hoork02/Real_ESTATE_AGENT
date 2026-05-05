import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';

// Mock Data for Kuwait Real Estate
const KUWAIT_MARKET_DATA: Record<string, any> = {
  'Salmiya': {
    avgPriceSqm: 1200, // KWD
    avgRent: 450,
    zoning: 'Investment (Expatriate focus)',
    compliance: {
      maxFloors: 10,
      commercialAllowed: true,
      parkingReq: '1 spot per unit'
    },
    sentiment: 0.8, // High
    comps: [
      { id: 1, price: 1150, floors: 5, age: 10, view: 'City' },
      { id: 2, price: 1300, floors: 12, age: 2, view: 'Sea' },
    ]
  },
  'Hawally': {
    avgPriceSqm: 950,
    avgRent: 350,
    zoning: 'Mixed Residential/Commercial',
    compliance: {
      maxFloors: 12,
      commercialAllowed: true,
      parkingReq: '1 spot per 50sqm retail'
    },
    sentiment: 0.6,
    comps: [
      { id: 3, price: 900, floors: 8, age: 15, view: 'Street' },
    ]
  },
  'Sabah Al-Salem': {
    avgPriceSqm: 1100,
    avgRent: 400,
    zoning: 'Investment/High-Rise',
    compliance: {
      maxFloors: 25,
      commercialAllowed: false,
      parkingReq: '1.5 spots per unit'
    },
    sentiment: 0.9,
    comps: []
  },
  'Al Mutla’a': {
    avgPriceSqm: 400,
    avgRent: 150,
    zoning: 'Residential (New Development)',
    compliance: {
      maxFloors: 3,
      commercialAllowed: false,
      parkingReq: 'Internal yard'
    },
    sentiment: 0.95, // Infrastructure boom
    projectPipeline: ['New Metro Hub (2028)', 'Regional Hospital (2027)']
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Tool A: get_market_averages
  app.get('/api/tools/market-averages', (req, res) => {
    const area = req.query.area as string;
    if (area && KUWAIT_MARKET_DATA[area]) {
      res.json(KUWAIT_MARKET_DATA[area]);
    } else {
      res.json({ error: 'Area not found', availableAreas: Object.keys(KUWAIT_MARKET_DATA) });
    }
  });

  // Tool B: calculate_roi
  app.post('/api/tools/calculate-roi', (req, res) => {
    const { purchasePrice, rentalIncome, area } = req.body;
    const annualRent = rentalIncome * 12;
    const roi = (annualRent / purchasePrice) * 100;
    
    let comparison = 'Unknown';
    if (area && KUWAIT_MARKET_DATA[area]) {
      const marketAvgRoi = (KUWAIT_MARKET_DATA[area].avgRent * 12 / (KUWAIT_MARKET_DATA[area].avgPriceSqm * 100)) * 100;
      comparison = roi > marketAvgRoi ? 'Above Market Average' : 'Below Market Average';
    }

    // Prediction for 2026 (simplified)
    const yieldForecast = Array.from({ length: 5 }, (_, i) => ({
      year: 2026 + i,
      predictedYield: roi * (1 + (0.02 * i)) // 2% growth assumption
    }));

    res.json({
      roi: roi.toFixed(2),
      comparison,
      yieldForecast
    });
  });

  // Tool C: check_zoning_laws
  app.get('/api/tools/zoning-laws', (req, res) => {
    const area = req.query.area as string;
    if (area && KUWAIT_MARKET_DATA[area]) {
      res.json({
        area,
        laws: KUWAIT_MARKET_DATA[area].zoning,
        compliance: KUWAIT_MARKET_DATA[area].compliance
      });
    } else {
      res.status(404).json({ error: 'Zoning data for area not found' });
    }
  });

  // Dynamic Valuation Engine (Comps)
  app.post('/api/tools/valuation', (req, res) => {
    const { area, age, floors, view } = req.body;
    const baseData = KUWAIT_MARKET_DATA[area];
    if (!baseData) return res.status(404).json({ error: 'Area data missing' });

    let adjPrice = baseData.avgPriceSqm;
    if (age < 5) adjPrice *= 1.1;
    if (age > 20) adjPrice *= 0.8;
    if (floors > 20) adjPrice *= 1.05;
    if (view === 'Sea') adjPrice *= 1.25;

    res.json({
      estimatedPriceSqm: adjPrice.toFixed(2),
      confidence: baseData.comps.length > 0 ? 0.85 : 0.6,
      compsUsed: baseData.comps
    });
  });

  // Infrastructure Impact Analysis
  app.get('/api/tools/impact-analysis', (req, res) => {
    const area = req.query.area as string;
    const data = KUWAIT_MARKET_DATA[area];
    const appreciationPotential = data?.sentiment * 100 || 50;
    const projects = data?.projectPipeline || ['General Infrastructure Upgrades'];

    res.json({
      area,
      appreciationPotential: appreciationPotential.toFixed(0),
      projects
    });
  });

  // Investment Sentiment Tracker
  app.get('/api/tools/sentiment', (req, res) => {
    const summary = Object.entries(KUWAIT_MARKET_DATA).map(([name, data]) => ({
      area: name,
      score: data.sentiment,
      status: data.sentiment > 0.8 ? 'Hot' : data.sentiment > 0.5 ? 'Stable' : 'Cool'
    }));
    res.json(summary);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
