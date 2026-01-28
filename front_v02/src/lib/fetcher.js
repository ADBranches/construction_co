// src/lib/fetcher.js
import { apiRequest } from "./api";

export async function fetcher(path) {
  try {
    return await apiRequest(path, { method: "GET" });
  } catch (err) {
    console.error("Fetcher error:", err);
    throw err;
  }
}
