import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const model = "gpt-4o-mini"; // 高速／軽量モデル
const embedModel = "text-embedding-3-small"; // 埋め込みモデル
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// テキスト生成
export async function generateWithOpenAI(prompt) {
    const res = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
    });
    return res.choices[0].message.content;
}

// 埋め込み生成
export async function embedWithOpenAI(text) {
    const res = await openai.embeddings.create({
        model: embedModel,
        input: text,
    });
    return res.data[0].embedding;
}