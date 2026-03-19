import { GoogleGenAI, Type } from "@google/genai";
import { CarDetails, AnalysisResult, SubscriptionPlan } from "../types";

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    reliabilityScore: {
      type: Type.NUMBER,
      description: "A score from 1.0 to 10.0 indicating reliability. Final score after all deductions.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Low", "Moderate", "High", "Critical"],
      description: "Overall risk assessment.",
    },
    technicalSummary: {
      type: Type.STRING,
      description: "A deep, long-form technical analysis for mechanics or enthusiasts.",
    },
    nonTechnicalSummary: {
      type: Type.STRING,
      description: "A comprehensive but easy-to-understand verdict for the buyer.",
    },
    carfaxInsights: {
      type: Type.STRING,
      description: "Detailed analysis of the CARFAX report findings.",
    },
    inspectionInsights: {
      type: Type.STRING,
      description: "Detailed analysis of the Pre-Inspection report findings, focusing on mechanical and structural condition.",
    },
    commonIssues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of common failures.",
    },
    inspectionChecklist: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Detailed inspection items.",
    },
    positiveIndicators: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Good signs and strengths.",
    },
    recalls: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Critical", "Moderate", "Historical"] }
        },
        required: ["title", "description", "severity"]
      },
      description: "NHTSA and safety recall data."
    },
    priceAnalysis: {
      type: Type.STRING,
      description: "In-depth analysis of price value vs market data.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.NUMBER },
          make: { type: Type.STRING },
          model: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["year", "make", "model", "reason"]
      },
      description: "Alternative vehicles."
    },
    deductionLogic: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          deduction: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["category", "deduction", "reasoning"]
      },
      description: "Step-by-step reasoning for each category deduction."
    },
    verdict: {
      type: Type.STRING,
      description: "The 'Buy or Walk' Verdict: A 1-sentence summary of the risk."
    }
  },
  required: [
    "reliabilityScore", "riskLevel", "technicalSummary", "nonTechnicalSummary",
    "commonIssues", "inspectionChecklist", "positiveIndicators", "priceAnalysis", 
    "suggestions", "recalls", "deductionLogic", "verdict"
  ],
};

export const analyzeCar = async (details: CarDetails, plan: SubscriptionPlan = 'free'): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";

  const depthPrompt = plan === 'premium' 
    ? "Provide a VERBOSE, deep-dive technical analysis. Reference specific engine designations, common torque specs, and historical TSB (Technical Service Bulletin) data."
    : "Provide a direct and accurate 1-2 paragraph reliability and value assessment.";

  const promptText = `
    Conduct exhaustive research on: ${details.year} ${details.make} ${details.model}
    Mileage: ${details.mileage.toLocaleString()} miles | Price: $${details.price.toLocaleString()}
    ${details.description ? `User Observations: ${details.description}` : ""}

    Plan Depth: ${depthPrompt}

    SCORING LOGIC & WEIGHTS:
    Start with a base score of 10.0. Apply deductions based on these weights:
    1. Mechanical Risk (35% | Max 3.5 pts): Engine/transmission durability. Penalize for known generation-specific defects.
    2. Recall & Safety (20% | Max 2.0 pts): NHTSA/Transport Canada data. CRITICAL: Any open fire, steering, or braking recall reduces this category to 0 immediately.
    3. Ownership Cost Index (15% | Max 1.5 pts): 5–10 year maintenance. 
    4. Mileage & Usage (10% | Max 1.0 pts): Highway vs City miles. Penalize heavy towing/rideshare.
    5. Vehicle History Integrity (10% | Max 1.0 pts): Title status and service gaps. Salvage/Rebuilt = 0 pts for this section.
    6. Reliability Track Record (5% | Max 0.5 pts): Forum clustering and repair trends. Penalize "First Year Redesigns."
    7. Resale & Depreciation (2.5% | Max 0.25 pts): 3-year value retention.
    8. Configuration Risk (2.5% | Max 0.25 pts): "Bad Combos" (reliable model + failure-prone transmission).

    THE DEALBREAKER RULE:
    If a car has a known catastrophic engine/transmission flaw, the total score CANNOT exceed 4.0.

    SAFETY SEARCH: Use Google Search to check NHTSA.gov and Safety.gov for active or historical recalls.
    Include recall campaign numbers if found.

    ${details.carfaxReport ? "ANALYZE ATTACHED CARFAX in extreme detail for title issues and maintenance gaps." : "No CARFAX provided."}
    ${details.inspectionReport ? "ANALYZE ATTACHED PRE-INSPECTION REPORT for mechanical health, structural integrity, and immediate repair needs." : "No Pre-Inspection report provided."}

    TOOLTIP GUIDELINES:
    Identify technical jargon and wrap in {{Term|Brief Definition}}.

    Use **bold markdown** for critical warnings.
  `;

  const parts: any[] = [{ text: promptText }];

  if (plan === 'premium') {
    if (details.images && details.images.length > 0) {
      details.images.forEach(img => {
        const base64Data = img.split(',')[1] || img;
        const mimeType = img.match(/data:(.*?);/)?.[1] || 'image/jpeg';
        parts.push({ inlineData: { data: base64Data, mimeType } });
      });
    }
    if (details.carfaxReport && details.carfaxMimeType) {
      const base64Data = details.carfaxReport.split(',')[1] || details.carfaxReport;
      parts.push({ inlineData: { data: base64Data, mimeType: details.carfaxMimeType } });
    }
    if (details.inspectionReport && details.inspectionMimeType) {
      const base64Data = details.inspectionReport.split(',')[1] || details.inspectionReport;
      parts.push({ inlineData: { data: base64Data, mimeType: details.inspectionMimeType } });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        systemInstruction: `You are the Automotive Risk Architect AI. 
        Your goal is to analyze used vehicles and provide a definitive Risk Score from 1 to 10. 
        You prioritize mechanical longevity and passenger safety over aesthetics.
        You must show your "Deduction Logic" for each category before revealing the final score.
        Use the {{Term|Definition}} syntax purely as a glossary feature.`,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data");

    const report = JSON.parse(jsonText);
    const sources: any[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ uri: chunk.web.uri, title: chunk.web.title });
      });
    }

    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      carDetails: details,
      report: report,
      sources: sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i),
    };
  } catch (error) {
    throw error;
  }
};