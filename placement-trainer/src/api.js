// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export async function registerUser(fname, lname, email, password) {
  try {
    const res = await api.post("/api/auth/register", {
      fname,
      lname,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
}

export async function loginUser(email, password) {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
}

// ---- Questions ----
export async function generateQuestions(module, topic, difficulty, count) {
  try {
    const res = await api.post("/api/mcqs/test", {
      module,
      topic,
      difficulty,
      count,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Question generation failed" };
  }
}

export async function listQuestions(module, topic, limit = 20) {
  try {
    const res = await api.get("/api/questions", {
      params: { module, topic, limit },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch questions" };
  }
}

// ---- Tests ----
export async function createTest(module, topic, difficulty, questionIds) {
  try {
    const res = await api.post("/api/tests", {
      module,
      topic,
      difficulty,
      question_ids: questionIds,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to create test" };
  }
}

export async function getTest(testId) {
  try {
    const res = await api.get(`/api/tests/${testId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch test" };
  }
}

// ---- Attempts ----
export async function submitAttempt(testId, userId, responses) {
  try {
    const res = await api.post("/api/attempts", {
      test_id: testId,
      user_id: userId,
      responses,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to submit attempt" };
  }
}

export default api;
