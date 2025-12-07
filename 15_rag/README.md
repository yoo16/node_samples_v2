
## 概要
| ステップ        | 処理内容            | 使用技術                           |
| ----------- | --------------- | ------------------------------ |
| 1️⃣ 文書ベクトル化 | 文書を数値ベクトルに変換    | OpenAI Embeddings              |
| 2️⃣ 保存      | ベクトルDBに格納       | ChromaDB / Pinecone / Weaviate |
| 3️⃣ 検索      | 質問のベクトルと近い文書を検索 | ベクトルDB検索                       |
| 4️⃣ 生成      | 検索結果＋質問をLLMに渡す  | GPT-4 / Claude など              |

## インストール
### openai & gemini
```bash
npm i chromadb dotenv openai @google/genai
```

### Pinecone
```bash
npm install @pinecone-database/pinecone
```

## 実行
