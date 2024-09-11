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

function parseResponse(responseText: string): AdAnalysis {
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    parsedResponse = extractPartialJSON(responseText);
  }

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

function extractPartialJSON(text: string): any {
  const result: any = {};
  const regex = /"(\w+)":\s*(\[[^\]]+\]|"[^"]+")/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    try {
      result[match[1]] = JSON.parse(match[2]);
    } catch (e) {
      console.warn(`Couldn't parse value for key ${match[1]}`);
    }
  }

  return result;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function analyzeKeywords(ad: Ad): Promise<AdAnalysis> {
  const extractedText = extractText(ad);
  const parsedText = parseText(extractedText);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze ad text. Return JSON:
{
  "top": [{"w": "word", "c": count}, ...],
  "long": [{"p": "phrase", "c": count}, ...],
  "gender_target": ["Men", "Women", "All"],
  "age_target": ["13-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  "ad_categories": ["category1", ...],
  "target_audience": ["audience1", ...],
  "estimated_budget": "Low" | "Medium" | "High",
  "ad_objective": ["objective1", ...],
  "marketing_strategies": ["Problem-Solving", "Prestige", "Emotional", "Trends", "Holidays"],
  "season_target": ["Spring", "Summer", "Autumn", "Winter"],
  "competition": number,
  "cpm": number
}
Rules:
- top/long: 15 most frequent words/phrases (3+ chars)
- Simple analysis, basic patterns
- competition: estimated market competition (0-100)
- cpm: estimated average Cost Per Mille in USD
- JSON only, no explanations

Ad text: "${parsedText}"
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
      estimatedBudget: "Unknown",
      adObjective: [],
      marketingStrategies: [],
      seasonTarget: [],
      competition: 0,
      cpm: 0,
    };
  }
}

// Generate ad creative
export interface AdCreative {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

// Add this new function to your geminiAi.ts file
export async function generateAdCreative(ad: Ad): Promise<AdCreative> {
  const extractedText = extractText(ad);
  const parsedText = parseText(extractedText);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Optimize this ad text into a professional Facebook Ad creative. Return JSON:
{
  "primaryText": "Engaging text with emojis (max 125 chars)",
  "headline": "Short, catchy headline",
  "description": "Compelling description",
  "callToAction": "One of: [No button, Sign up, Subscribe, Watch more, Send WhatsApp message, Apply now, Book now, Contact us, Download, Get offer, Get quote, Get showtimes, Learn more, Listen now, Send message, Order now, Play game, Request time, See menu, Shop now]"
}
Rules:
- Enhance marketing appeal and professionalism
- Use appropriate emojis in primaryText
- Maintain original message and tone
- Choose most suitable CTA
- JSON only, no explanations

Original ad: "${parsedText}"
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response.text().replace(/^```json\n|\n```$/g, "").trim();
    console.log("🎨🎨🎨🎨 Generated Ad Creative:", responseText);

    const parsedResponse = JSON.parse(responseText);
    return {
      primaryText: parsedResponse.primaryText || "",
      headline: parsedResponse.headline || "",
      description: parsedResponse.description || "",
      callToAction: parsedResponse.callToAction || "",
    };
  } catch (error) {
    console.error("Error in ad creative generation:", error);
    return {
      primaryText: "Error ",
      headline: "Error ",
      description: "Error ",
      callToAction: "Error ",
    };
  }
}

// Usage example in your component or API route
// const adCreative = await generateAdCreative(adObject);