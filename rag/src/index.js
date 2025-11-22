import dotenv from "dotenv";
dotenv.config();

console.log("✅ Node.js の import 構文 OK");
console.log("🔑 GEMINI_API_KEY =", process.env.GEMINI_API_KEY ? "設定済み" : "未設定");

import { getCollection, addDocument } from "./db.js";
import { generateEmbedding } from "./ai/llmClient.js";
import { askQuestion } from "./rag.js";
import fs from "fs";

(async () => {
    // 1️⃣ 知識ベースを登録（初回のみ）
    const collection = await getCollection("knowledge");
    const texts = fs.readFileSync("./src/data/documents.txt", "utf-8").split("\n");

    for (let i = 0; i < texts.length; i++) {
        const emb = await generateEmbedding(texts[i]);
        await addDocument(collection, String(i + 1), texts[i], emb);
    }

    console.log("✅ 文書をChromaDBに登録しました");

    // 2️⃣ ユーザーの質問に回答
    const query = "AIと機械学習の違いは？";
    const answer = await askQuestion(query);
    console.log("\n🤖 回答:", answer);
})();