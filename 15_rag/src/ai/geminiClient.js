import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// テキスト生成
export async function generateWithGemini(prompt) {
    // `ai.models.generateContent(...)` という構文が使われる形
    const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
    });
    return result.text();
}

// 埋め込み生成
export async function embedWithGemini(text) {
    // SDK に embedContent のメソッドがあれば、それに従う
    const result = await ai.models.embedContent({
        model: "text-embedding-004",
        content: text,
    });
    return result.embedding.values;
}