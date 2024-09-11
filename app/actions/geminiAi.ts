// app/actions/geminiAi.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { Ad } from "@/types/ad";
import { extractText, parseText } from "@/lib/adTextExtractor";

export interface AdAnalysis {
  topKeywords: Array<{ word: string; count: number }>;
  longTailKeywords: Array<{ phrase: string; count: number }>;
  genderTarget: string[];
  ageTarget: string[];
  adCategories: string[];
  targetAudience: string[];
  estimatedBudget: string;
  adObjective: string[];
  marketingStrategies: string[];
  seasonTarget: string[];
  competition: number;
  cpm: number;
}

export interface AdCreative {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

function robustJSONParse(text: string): any {
  // First, try standard JSON parsing
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("Standard JSON parsing failed, attempting robust parsing");
  }

  // If that fails, try to extract as much as possible
  const result: any = {};
  const keyValueRegex =
    /"(\w+)":\s*(?:(\[[^\]]*\])|(\{[^}]*\})|"([^"]*)"|(true|false|null|-?\d+(?:\.\d+)?)|(\{[^{]*\}))/g;
  let match;

  while ((match = keyValueRegex.exec(text)) !== null) {
    const [
      ,
      key,
      arrayValue,
      objectValue,
      stringValue,
      primitiveValue,
      nestedObjectValue,
    ] = match;
    try {
      if (arrayValue) {
        result[key] = JSON.parse(arrayValue);
      } else if (objectValue || nestedObjectValue) {
        result[key] = robustJSONParse(objectValue || nestedObjectValue);
      } else if (stringValue !== undefined) {
        result[key] = stringValue;
      } else if (primitiveValue) {
        result[key] = JSON.parse(primitiveValue);
      }
    } catch (e) {
      console.warn(`Couldn't parse value for key ${key}`);
    }
  }

  return result;
}

function parseResponse(responseText: string): AdAnalysis {
  const parsedResponse = robustJSONParse(responseText);

  return {
    topKeywords: (parsedResponse.top || []).map(
      ({ w, c }: { w: string; c: number }) => ({ word: w, count: c }),
    ),
    longTailKeywords: (parsedResponse.long || []).map(
      ({ p, c }: { p: string; c: number }) => ({ phrase: p, count: c }),
    ),
    genderTarget: parsedResponse.gender_target || [],
    ageTarget: parsedResponse.age_target || [],
    adCategories: parsedResponse.ad_categories || [],
    targetAudience: parsedResponse.target_audience || [],
    estimatedBudget: parsedResponse.estimated_budget || "",
    adObjective: parsedResponse.ad_objective || [],
    marketingStrategies: parsedResponse.marketing_strategies || [],
    seasonTarget: parsedResponse.season_target || [],
    competition: parsedResponse.competition || 0,
    cpm: parsedResponse.cpm || 0,
  };
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Analyze ad text & Estimation
export async function analyzeKeywords(ad: Ad): Promise<AdAnalysis> {
  const extractedText = extractText(ad);
  const parsedText = parseText(extractedText);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze ad. Return JSON:
{
  "top": [{"w": "word", "c": count}],
  "long": [{"p": "phrase", "c": count}],
  "gender_target": ["Men"|"Women"|"All"],
  "age_target": ["min-max"],
  "ad_categories": ["category"],
  "target_audience": ["specific audience"],
  "estimated_budget": "Low"|"Medium"|"High",
  "ad_objective": ["primary objective"],
  "marketing_strategies": ["Problem-Solving"|"Prestige"|"Emotional"|"Trends"|"Holidays"],
  "season_target": ["Spring"|"Summer"|"Autumn"|"Winter"],
  "competition": 0-100,
  "cpm": estimated USD
}
Rules:
- top/long: 15 most relevant, exclude common words
- Infer from content, tone, and context
- competition: market competitiveness
- cpm: based on targeting and content quality
- Concise, accurate analysis
Ad: "${parsedText}"
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response
      .text()
      .replace(/^```json\n|\n```$/g, "")
      .trim();
    console.log("🤖🤖🤖🤖 Raw API Response:", responseText);

    return parseResponse(responseText);
  } catch (error) {
    console.error("Error in keyword analysis:", error);
    return {
      topKeywords: [],
      longTailKeywords: [],
      genderTarget: [],
      ageTarget: [],
      adCategories: [],
      targetAudience: [],
      estimatedBudget: "",
      adObjective: [],
      marketingStrategies: [],
      seasonTarget: [],
      competition: 0,
      cpm: 0,
    };
  }
}

// Generate ad creative
export async function generateAdCreative(ad: Ad): Promise<AdCreative> {
  const extractedText = extractText(ad);
  const parsedText = parseText(extractedText);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Create high-converting Facebook Ad. Return JSON:
  {
    "primaryText": "Engaging text with emojis (125 chars max)",
    "headline": "Powerful headline (5-7 words)",
    "description": "Compelling description (2-3 sentences)",
    "callToAction": "Best CTA"
  }
  Rules:
  - Use AIDA: Attention, Interest, Desire, Action
  - Incorporate urgency/scarcity
  - Highlight unique value proposition
  - Use power words and emotional triggers
  - Include social proof
  - Ensure ad stands out
  - Maintain core message
  - Strategic emoji use
  - Choose from CTAs: [Sign up, Subscribe, Learn more, Shop now, Book now, Get offer, Download, Contact us]
  Original ad: "${parsedText}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response
      .text()
      .replace(/^```json\n|\n```$/g, "")
      .trim();
    console.log("🎨🎨🎨🎨 Generated Ad Creative:", responseText);

    const parsedResponse = robustJSONParse(responseText);
    return {
      primaryText: parsedResponse.primaryText || "",
      headline: parsedResponse.headline || "",
      description: parsedResponse.description || "",
      callToAction: parsedResponse.callToAction || "Learn more",
    };
  } catch (error) {
    console.error("Error in ad creative generation:", error);
    return {
      primaryText: "Error generating ad creative",
      headline: "Error",
      description: "An error occurred while generating the ad creative.",
      callToAction: "Learn more",
    };
  }
}

// Usage example in your component or API route
// const adCreative = await generateAdCreative(adObject);
