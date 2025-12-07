import { ChromaClient } from "chromadb";

const chroma = new ChromaClient();

/**
 * ✅ コレクション取得／作成（Chroma v3対応）
 * デフォルト埋め込み関数を使わないため、ダミーembeddingFunctionを指定。
 */
export async function getCollection(name = "knowledge") {
  return await chroma.getOrCreateCollection({
    name,
    // Chroma v3以降では embeddingFunction が必須
    embeddingFunction: {
      // 実際の埋め込みは別（OpenAI/Gemini）で行うため、ダミー配列を返す
      generate: async (texts) => texts.map(() => [0]),
    },
  });
}

/**
 * ✅ 文書をコレクションに追加
 */
export async function addDocument(collection, id, text, embedding) {
  await collection.add({
    ids: [id],
    embeddings: [embedding],
    documents: [text],
  });
}

/**
 * ✅ 類似検索（埋め込みを元に類似文書を取得）
 */
export async function querySimilar(collection, queryEmbedding, n = 3) {
  const res = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: n,
  });

  // 検索結果がない場合に備えて安全に返す
  return res.documents?.[0] ?? [];
}