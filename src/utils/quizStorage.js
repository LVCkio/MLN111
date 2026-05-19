// src/utils/quizStorage.js
const UI_KEY = "quiz_ui_state"; // map: {"chapterIndex-questionIndex": {selectedOption, showResult, showAnswer, userAnswer, studyMode}}

export const readJSON = (key, fallback = {}) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const clearAllQuizStorage = () => {
  try {
    localStorage.removeItem(UI_KEY);
  } catch {}
};

export const makeKey = (chapterIndex, questionIndex) =>
  `${chapterIndex}-${questionIndex}`;

export const loadUIFor = (chapterIndex, questionIndex) => {
  const all = readJSON(UI_KEY, {});
  return all[makeKey(chapterIndex, questionIndex)] || null;
};

export const saveUIFor = (chapterIndex, questionIndex, ui) => {
  const all = readJSON(UI_KEY, {});
  all[makeKey(chapterIndex, questionIndex)] = ui;
  writeJSON(UI_KEY, all);
};
