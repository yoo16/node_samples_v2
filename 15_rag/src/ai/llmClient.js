import { MODEL_PROVIDER } from "../config.js";
import {
    generateWithOpenAI,
    embedWithOpenAI,
} from "./openaiClient.js";
import {
    generateWithGemini,
    embedWithGemini,
} from "./geminiClient.js";

export async function generateResponse(prompt) {
    if (MODEL_PROVIDER === "gemini") return await generateWithGemini(prompt);
    return await generateWithOpenAI(prompt);
}

export async function generateEmbedding(text) {
    if (MODEL_PROVIDER === "gemini") return await embedWithGemini(text);
    return await embedWithOpenAI(text);
}