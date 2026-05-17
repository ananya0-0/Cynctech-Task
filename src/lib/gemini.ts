import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function summarizeUrl(url: string): Promise<string> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Summarise the content of the following URL in 2–3 sentences. 
Focus on what the page is about, its main topic, and any key takeaways. 
Be concise and informative. URL: ${url}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text || text.trim().length === 0) {
    throw new Error("Gemini returned an empty summary.");
  }

  return text.trim();
}