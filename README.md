 AI-Driven Real Estate Intelligence
Aqari-Agent is an autonomous investment analyst for the Kuwaiti Real Estate market. Unlike static search tools, it uses the Model Context Protocol (MCP) to bridge the gap between Large Language Models and live market data, providing automated valuations, ROI forecasting, and risk assessment.

✨ Key Features
🤖 Agentic Valuation: Leverages LLMs to perform comparative market analysis (CMA) using live data tools.

🔌 MCP Integration: Uses the 2026 Model Context Protocol to securely connect to property databases without exposing sensitive raw data to the model.

📈 ROI Forecaster: Automates complex financial modeling, including rental yield projections and 5-year appreciation forecasts.

⚖️ Risk Orchestrator: Identifies overpriced anomalies and flags properties located in high-volatility or infrastructure-changing zones.

🇰🇼 Localized Intelligence: Specifically tuned for the Kuwaiti market (KWD currency, local zoning laws, and neighborhood-specific growth trends).

🛠️ Tech Stack
Language: Python 3.11

AI Protocol: Model Context Protocol (MCP) / FastMCP SDK

LLM Host: Claude 3.5 Sonnet / Gemini 1.5 Pro

Database: SQLite (Mocked 2026 Kuwaiti Transaction Data)

Tools: BeautifulSoup (Scraping), Pandas (Analysis)

🚀 Getting Started
Prerequisites
Python 3.10+

An LLM API Key (Anthropic or Google)

An MCP-compatible host (e.g., Claude Desktop or custom Python client)

Installation
Clone the repo

Bash

git clone https://github.com/yourusername/aqari-agent.git
cd aqari-agent
Install dependencies

Bash

pip install -r requirements.txt
Configure the MCP Server
Add the server to your claude_desktop_config.json:

JSON

   "mcpServers": {
     "aqari-expert": {
       "command": "python",
       "args": ["path/to/aqari_server.py"]
     }
   }
📊 Example Usage
User Input: "I'm looking at a 500sqm villa in Jabriya for 600,000 KWD. Evaluate the investment."

Aqari-Agent Response:

"Checking market averages for Jabriya... Current average is 1,100 KWD/sqm. This property is priced at 1,200 KWD/sqm (9% above market). However, factoring in its proximity to the new metro expansion (Infrastructure Tool), I project a 12% appreciation over 3 years. Recommendation: Moderate Buy."

🛡️ Security & Privacy
This project implements Tool-Gated Access. The LLM never "reads" the entire database; it can only request specific calculations through the MCP interface, ensuring data integrity and user privacy.

📝 License
Distributed under the MIT License. See LICENSE for more information.
