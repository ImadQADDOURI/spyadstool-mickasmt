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
}

function parseResponse(responseText: string): AdAnalysis {
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.log("Attempting to extract partial data...");
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
  console.log("🤖🤖🤖🤖 Parsed Text:", parsedText);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze this ad text. Return JSON:
{
  "top": [{"w": "word", "c": count}, ...],
  "long": [{"p": "phrase", "c": count}, ...],
  "gender_target": ["Men", "Women", "All"],
  "age_target": ["13-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  "ad_categories": ["category1", ...],
  "target_audience": ["audience1", ...],
  "estimated_budget": string,
  "ad_objective": ["objective1", ...]
}

Rules:
- top: 15 most frequent words (3+ chars)
- long: 15 most frequent 2-4 word phrases
- gender_target & age_target: Estimate based on content
- Other fields: Infer from text, use general terms
- Simple analysis, no deep processing
- JSON only, no explanations

Ad text: "${parsedText}"
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = response.text();

    // Clean the response text
    responseText = responseText.replace(/^```json\n|\n```$/g, "").trim();
    console.log("🤖🤖🤖🤖 Raw API Response:", responseText);

    const analysisResult = parseResponse(responseText);
    return analysisResult;
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
    };
  }
}

{
  /*
   const prompt = `
Analyze this ad text. Return JSON:
{
"langs": ["language1", ...],
"top": [{"w": "word", "c": count}, ...],
"long": [{"p": "phrase", "c": count}, ...],
"gender_target": ["Men", "Women", "All"],
"age_target": ["13-24", "25-34", "35-44", "45-54", "55-64", "65+"],
"ad_categories": ["category1", ...],
"target_audience": ["audience1", ...],
"estimated_budget": string,
"ad_objective": ["objective1", ...]
}

Rules:
- langs: All detected languages, full names
- top: 15 most frequent words (3+ chars)
- long: 15 most frequent 2-4 word phrases
- gender_target & age_target: Estimate based on content
- Other fields: Infer from text, use general terms
- Simple analysis, no deep processing
- JSON only, no explanations

Ad text: "${parsedText}"
`;
{
  */
  /* const prompt = `
Analyze this ad text and return a JSON object:
{
"langs": ["language1", "language2", ...],
"top": [{"w": "word", "c": count}, ...],
"long": [{"p": "phrase", "c": count}, ...],
"gender_target": ["gender1", "gender2", ...],
"age_target": ["age_range1", "age_range2", ...],
"tone": ["tone1", "tone2", ...],
"ad_categories": ["category1", "category2", ...],
"target_audience": ["audience1", "audience2", ...],
"estimated_budget": "low/medium/high",
"ad_objective": ["objective1", "objective2", ...]
}

Guidelines:
1. langs: List ALL languages detected in the text, even if mixed. Use full language names.
2. top: List the 15 most frequent words. Only include words with 3 or more characters. Perform simple frequency counts.
3. long: List the 15 most frequent 2-4 word combinations. Use simple frequency analysis.
4. gender_target: Estimate targeted genders (e.g., "men", "women", "all").
5. age_target: Estimate age ranges (e.g., "13-24", "25-34", "35-44", "45-54", "55-64", "65+").
6. tone: Infer the tone of the ad (e.g., "professional", "casual", "urgent", "informative").
7. ad_categories: Categorize the ad (e.g., "product", "service", "event", "brand awareness").
8. target_audience: Identify specific audience segments (e.g., "parents", "students", "professionals", "tech enthusiasts").
9. estimated_budget: Guess the ad's budget level based on content and complexity.
10. ad_objective: Infer the main objectives of the ad (e.g., "sales", "lead generation", "brand awareness", "app install").

Important:
- Keep analysis simple and fast. Use basic text patterns, not deep analysis.
- Return only the JSON object, no explanations.

Ad text (first 1000 characters): "${parsedText.substring(0, 1000)}"
`;

*/
}
