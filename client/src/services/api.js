import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("interviewiq_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  persistSession(data);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  persistSession(data);
  return data;
}

export async function currentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/resumes/upload", formData);
  return data;
}

export async function listResumes() {
  const { data } = await api.get("/resumes");
  return data;
}

export async function getDashboard() {
  const { data } = await api.get("/dashboard");
  return data;
}

export async function generateInterview(payload) {
  const { data } = await api.post("/interviews/generate", payload);
  return data;
}

export async function listInterviews() {
  const { data } = await api.get("/interviews");
  return data;
}

export async function submitAnswer(interviewId, questionId, answerText) {
  const { data } = await api.post(`/interviews/${interviewId}/questions/${questionId}/answer`, { answer_text: answerText });
  return data;
}

export async function generateRoadmap(payload) {
  const { data } = await api.post("/roadmaps/generate", payload);
  return data;
}

export async function listRoadmaps() {
  const { data } = await api.get("/roadmaps");
  return data;
}

export function persistSession(data) {
  localStorage.setItem("interviewiq_token", data.access_token);
  localStorage.setItem("interviewiq_user", JSON.stringify(data.user));
}

export function readStoredUser() {
  const raw = localStorage.getItem("interviewiq_user");
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem("interviewiq_token");
  localStorage.removeItem("interviewiq_user");
}

export default api;
