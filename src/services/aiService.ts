import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const getMarketAveragesDec: FunctionDeclaration = {
  name: "getMarketAverages",
  description: "Get current property prices and market averages for a specific Kuwaiti neighborhood.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      areaName: {
        type: Type.STRING,
        description: "Name of the area (e.g., Salmiya, Hawally, Sabah Al-Salem, Al Mutla’a)."
      }
    },
    required: ["areaName"]
  }
};

const calculateRoiDec: FunctionDeclaration = {
  name: "calculateRoi",
  description: "Calculate the Return on Investment (ROI) and predict 5-year yield forecasts.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      purchasePrice: { type: Type.NUMBER, description: "Total purchase price in KWD." },
      rentalIncome: { type: Type.NUMBER, description: "Monthly rental income in KWD." },
      area: { type: Type.STRING, description: "The neighborhood for market comparison." }
    },
    required: ["purchasePrice", "rentalIncome", "area"]
  }
};

const checkZoningDec: FunctionDeclaration = {
  name: "checkZoningLaws",
  description: "Check zoning laws and building compliance for a neighborhood.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      areaName: { type: Type.STRING, description: "The neighborhood name." }
    },
    required: ["areaName"]
  }
};

const getValuationDec: FunctionDeclaration = {
  name: "getValuation",
  description: "Perform a dynamic property valuation based on specific features like age, floor level, and view.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      area: { type: Type.STRING, description: "Neighborhood name." },
      age: { type: Type.NUMBER, description: "Age of property in years." },
      floors: { type: Type.NUMBER, description: "Number of floors or floor level." },
      view: { type: Type.STRING, description: "View type (e.g., Sea, City, Street)." }
    },
    required: ["area", "age", "floors", "view"]
  }
};

const getInfrastructureImpactDec: FunctionDeclaration = {
  name: "getInfrastructureImpact",
  description: "Analyze the impact of infrastructure projects on property appreciation.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      areaName: { type: Type.STRING, description: "The neighborhood name." }
    },
    required: ["areaName"]
  }
};

const getSentimentDec: FunctionDeclaration = {
  name: "getInvestmentSentiment",
  description: "Get the current investment sentiment and heat map data for Kuwait neighborhoods.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  }
};

export const TOOLS = {
  getMarketAverages: async (args: any) => {
    const res = await fetch(`/api/tools/market-averages?area=${encodeURIComponent(args.areaName)}`);
    return await res.json();
  },
  calculateRoi: async (args: any) => {
    const res = await fetch('/api/tools/calculate-roi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    return await res.json();
  },
  checkZoningLaws: async (args: any) => {
    const res = await fetch(`/api/tools/zoning-laws?area=${encodeURIComponent(args.areaName)}`);
    return await res.json();
  },
  getValuation: async (args: any) => {
    const res = await fetch('/api/tools/valuation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    return await res.json();
  },
  getInfrastructureImpact: async (args: any) => {
    const res = await fetch(`/api/tools/impact-analysis?area=${encodeURIComponent(args.areaName)}`);
    return await res.json();
  },
  getInvestmentSentiment: async () => {
    const res = await fetch('/api/tools/sentiment');
    return await res.json();
  }
};

export async function chatWithAgent(message: string, history: any[] = []) {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `You are Bayanat-RealEstate Agent, a specialized AI for property intelligence in Kuwait (Year 2026).
      You have access to real-time market data, ROI tools, and zoning regulations via MCP tools.
      Always try to provide data-driven insights. If someone asks for a valuation, use 'getValuation'.
      If they ask about the 'best' place to buy, check 'getInvestmentSentiment'.
      Be professional, informative, and precise. Mention Kuwaiti landmarks and neighborhoods often.`,
      tools: [{
        functionDeclarations: [
          getMarketAveragesDec,
          calculateRoiDec,
          checkZoningDec,
          getValuationDec,
          getInfrastructureImpactDec,
          getSentimentDec
        ]
      }]
    }
  });

  let finalResponse = response;
  const functionCalls = response.functionCalls;

  if (functionCalls) {
    const toolResults = await Promise.all(functionCalls.map(async (call) => {
      const toolFn = (TOOLS as any)[call.name];
      if (toolFn) {
        const result = await toolFn(call.args);
        return {
          functionResponse: {
            name: call.name,
            response: result,
            id: call.id
          }
        };
      }
      return null;
    }));

    const validResults = toolResults.filter(r => r !== null);
    
    // Recursive or multi-turn handling would go here, 
    // for simplicity we'll do one follow up
    const followUp = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] },
        response.candidates[0].content, // contains function calls
        { role: 'user', parts: validResults as any } // results
      ]
    });
    return { 
      text: followUp.text, 
      toolResults: validResults.map(r => r?.functionResponse.response),
      history: [
        ...history, 
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: followUp.text }] }
      ]
    };
  }

  return { 
    text: response.text, 
    toolResults: [], 
    history: [
      ...history, 
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: response.text }] }
    ] 
  };
}
