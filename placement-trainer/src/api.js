import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
export default API_BASE;

// ---- Auth ----
export async function registerUser(userData) {
  // userData = { fname, lname, email, year, field, password }
  const res = await axios.post(`${API_BASE}/api/register`, userData);
  return res.data;
}

export async function loginUser(credentials) {
  // credentials = { email, password }
  const res = await axios.post(`${API_BASE}/api/login`, credentials);
  return res.data;
}

// ---- Questions ----
export async function generateQuestions(module, topic, difficulty, count) {
  const res = await axios.post(`${API_BASE}/api/mcqs/test`, {
    module,
    topic,
    difficulty,
    count,
  });
  return res.data;
}

export async function listQuestions(module, topic, limit = 20) {
  const res = await axios.get(`${API_BASE}/api/questions`, {
    params: { module, topic, limit },
  });
  return res.data;
}

// ---- Tests ----
export async function createTest(module, topic, difficulty, questionIds) {
  const res = await axios.post(`${API_BASE}/api/tests`, {
    module,
    topic,
    difficulty,
    question_ids: questionIds,
  });
  return res.data;
}

export async function getTest(testId) {
  const res = await axios.get(`${API_BASE}/api/tests/${testId}`);
  return res.data;
}

// ---- Attempts ----
export async function submitAttempt(testId, userId, responses) {
  const res = await axios.post(`${API_BASE}/api/attempts`, {
    test_id: testId,
    user_id: userId,
    responses,
  });
  return res.data;
}
