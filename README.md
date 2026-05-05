# Bayanat-RealEstate Agent 🇰🇼

**Bayanat-RealEstate Agent** is a state-of-the-art property intelligence and valuation platform specifically designed for the **2026 Kuwaiti Real Estate Market**. Built using a Model Context Protocol (MCP) architecture, it bridges the gap between public market data and private investment rules through an autonomous AI agent.

## Key Features

###  MCP-Powered Intelligence
The agent utilizes a suite of autonomous tools to provide deep market insights:
- **Market Averages Tool**: Connects to a real-time database of prices across major Kuwaiti neighborhoods (Salmiya, Hawally, Sabah Al-Salem, etc.).
- **ROI & Yield Forecaster**: Calculates current Return on Investment and provides a 5-year predictive yield forecast factoring in 2026 economic projections.
- **Zoning & Compliance Checker**: Parses neighborhood-specific regulations (e.g., "Can I build a 3rd floor in Al Mutla’a?").

###  Advanced Industry Features
- **Dynamic Valuation Engine (Automated Comps)**: Adjusts property prices based on age, floor level, and view (e.g., Sea View premium) using recent transaction data.
- **Infrastructure Impact Analysis**: Scores properties based on proximity to major 2026 projects like new Metro Hubs and regional hospitals.
- **Risk Scoring (Red Flag Tool)**: Automatically flags price anomalies or legal concerns that deviate from neighborhood averages.
- **Investment Sentiment Tracker**: Provides a "Heat Map" summary of where "smart money" is moving in Kuwait.

##  Tech Stack

- **Frontend**: React 18, Tailwind CSS (v4), Motion (for animations), Lucide React (icons).
- **Backend**: Express (Full-stack setup) serving as the MCP server provider.
- **AI Engine**: Gemini 1.5 Flash via `@google/genai` with native function calling.
- **Visualization**: Recharts for market sentiment and ROI forecasting.

##  Project Structure

```text
├── server.ts           # MCP Server & API provider with mock market data
├── src/
│   ├── App.tsx         # Dashboard & AI Chat interface
│   ├── services/
│   │   └── aiService.ts # Gemini SDK integration & Tool declarations
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles with Tailwind
├── metadata.json       # App configuration
└── package.json        # Dependencies & scripts
```

##  Getting Started

1. **Configure Environment**:
   Ensure your `GEMINI_API_KEY` is set in the AI Studio secrets.
   
2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Explore the Interface**:
   - **Dashboard**: View high-level market sentiment and risk alerts.
   - **Agent Tab**: Interact with the AI to perform complex valuations or zoning queries.

## ⚖️ Disclaimer
*This application is a 2026 industry prototype. All market data, zoning laws, and infrastructure projections are based on simulated models for demonstration purposes.*
