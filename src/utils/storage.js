// src/utils/storage.js
const STORAGE_KEY = "mood-tracker-data";

export function saveMood(date, mood) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  data[date] = mood;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getMoods() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}
