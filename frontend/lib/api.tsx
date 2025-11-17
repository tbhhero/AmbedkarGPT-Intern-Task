import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function buildDb() {
  const resp = await axios.post(`${API_BASE}/api/build-db`);
  return resp.data;
}

export async function queryQuestion(question: string) {
  const resp = await axios.post(`${API_BASE}/api/query`, { question });
  return resp.data;
}

export async function getDbStatus() {
  const resp = await axios.get(`${API_BASE}/api/status`);
  return resp.data;
}

