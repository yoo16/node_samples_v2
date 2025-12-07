import { generateEmbedding, generateResponse } from "./ai/llmClient.js";
import { getCollection, querySimilar } from "./db.js";

export async function askQuestion(query) {
    const collection = await getCollection("knowledge");

    // 質問をベクトル化
    const qEmb = await generateEmbedding(query);

    // 類似文書検索
    const docs = await querySimilar(collection, qEmb, 3);
    const context = docs.join("\n");

    // プロンプト
    const prompt = `
あなたは知識ベースに基づいて質問に答えます。
以下の情報を参考にしてください。

参考情報:
${context}

質問:
${query}
`;

    // モデル切り替え可能！
    const answer = await generateResponse(prompt);
    return answer;
}