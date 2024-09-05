// app/actions/openAi.ts
"use server";

import { createHash } from "crypto";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache: Record<string, any> = {};

// Free tier rate limits
//
//Model	RPM	RPD	TPM	Batch Queue Limit
//gpt-3.5-turbo	3	200	40,000	200,000
export async function analyzeKeywords(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a keyword analysis expert in all languages. Analyze the given text and return the top keywords and long-tail keywords along with their counts. Format the response as JSON.",
      },
      {
        role: "user",
        content: `Analyze the following text and provide the top keywords and top long-tail keywords with their counts: "${text}"`,
      },
    ],
    response_format: { type: "json_object" },
  });
  console.log("🚀 ~ file: openAi.ts:analyzeKeywords ~ response", response);

  return JSON.parse(response.choices[0].message.content || "{}");
}

// OpenAI's text embedding model (like "text-embedding-ada-002") can be used to create vector representations of words and phrases in your text. We can then use these embeddings to identify important keywords and phrases.
// This approach gives you a more efficient, cost-effective, and flexible solution for keyword analysis. It leverages the power of embeddings to capture semantic relationships in the text, potentially leading to more meaningful keyword extraction across various languages and contexts.
function getEmbedding(text: string) {
  return openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
}

export async function analyzeKeywordsEmbedding(text: string) {
  // Create a hash of the input text to use as a cache key
  const hash = createHash("md5").update(text).digest("hex");

  if (cache[hash]) {
    return cache[hash];
  }

  // Tokenize the text into words and phrases
  const tokens = text.match(/\b(\w+(?:\s+\w+){0,2})\b/g) || [];

  // Get embeddings for the full text and each token
  const fullTextEmbedding = await getEmbedding(text);
  const tokenEmbeddings = await Promise.all(
    tokens.map((token) => getEmbedding(token)),
  );

  // Calculate similarity scores
  const similarities = tokenEmbeddings.map((embedding) =>
    cosineSimilarity(
      fullTextEmbedding.data[0].embedding,
      embedding.data[0].embedding,
    ),
  );

  // Combine tokens with their similarity scores and sort
  const tokenScores = tokens
    .map((token, index) => ({
      token,
      score: similarities[index],
    }))
    .sort((a, b) => b.score - a.score);

  // Extract top keywords and long-tail keywords
  const topKeywords = tokenScores
    .filter((item) => item.token.split(" ").length === 1)
    .slice(0, 10)
    .map((item) => ({ word: item.token, count: Math.round(item.score * 100) }));

  const longTailKeywords = tokenScores
    .filter((item) => item.token.split(" ").length > 1)
    .slice(0, 5)
    .map((item) => ({ word: item.token, count: Math.round(item.score * 100) }));

  const result = { topKeywords, longTailKeywords };

  // Cache the result
  cache[hash] = result;

  return result;
}
