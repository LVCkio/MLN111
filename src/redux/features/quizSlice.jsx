import { createSlice } from "@reduxjs/toolkit";
import { chapters as sourceChapters, DATASET_VERSION } from "./data";

const keyOf = (c, q) => `${c}-${q}`;

const DEFAULT_UI = {
  selectedOption: null,
  showResult: false,
  userAnswer: "",
  showAnswer: false,
  revealCount: 0,
  isCorrect: null,
};

const initialState = {
  chapters: sourceChapters,
  dataVersion: DATASET_VERSION, // để so sánh khi rehydrate
  activeChapter: 0,
  currentPage: 0,
  // tổng thể (không theo mode)
  questionStates: {}, // "c-q" => "not-started" | "learning" | "completed"
  // UI per-mode
  uiState: {
    quiz: {}, // "c-q" => { selectedOption, showResult, userAnswer, showAnswer, revealCount, isCorrect }
    fill: {},
    flashcard: {},
  },
  studyMode: "quiz",
};

const ensureUI = (state, mode, c, q) => {
  const k = keyOf(c, q);
  if (!state.uiState[mode][k]) state.uiState[mode][k] = { ...DEFAULT_UI };
  return { k, ui: state.uiState[mode][k] };
};

// Fisher–Yates shuffle
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setActiveChapter: (state, action) => {
      state.activeChapter = action.payload;
      state.currentPage = 0;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      const total = state.chapters[state.activeChapter].questions.length;
      if (state.currentPage < total - 1) state.currentPage++;
    },
    prevPage: (state) => {
      if (state.currentPage > 0) state.currentPage--;
    },

    // đổi mode thì reset về câu 1
    setStudyMode: (state, action) => {
      const next = action.payload;
      if (next !== state.studyMode) {
        state.studyMode = next;
        state.currentPage = 0;
      }
    },

    setShowAnswer: (state, action) => {
      const {
        chapterIndex,
        questionIndex,
        value,
        mode = "flashcard",
      } = action.payload;
      const { ui } = ensureUI(state, mode, chapterIndex, questionIndex);
      ui.showAnswer = !!value;
    },

    setUserAnswer: (state, action) => {
      const {
        chapterIndex,
        questionIndex,
        value,
        mode = "fill",
      } = action.payload;
      const { ui } = ensureUI(state, mode, chapterIndex, questionIndex);
      ui.userAnswer = value;
    },

    // TRẮC NGHIỆM
    answerQuiz: (state, action) => {
      const {
        chapterIndex,
        questionIndex,
        optionIndex,
        mode = "quiz",
      } = action.payload;
      const { k, ui } = ensureUI(state, mode, chapterIndex, questionIndex);
      const q = state.chapters[chapterIndex].questions[questionIndex];
      const isCorrect = optionIndex === q.quiz.correct;

      const wasShown = ui.showResult;
      ui.selectedOption = optionIndex;
      if (!wasShown) ui.revealCount += 1;
      ui.showResult = true;
      ui.isCorrect = isCorrect;

      // tổng thể
      state.questionStates[k] = isCorrect ? "completed" : "learning";
    },

    // ĐIỀN KHUYẾT
    submitFill: (state, action) => {
      const {
        chapterIndex,
        questionIndex,
        userAnswer,
        mode = "fill",
      } = action.payload;
      const { k, ui } = ensureUI(state, mode, chapterIndex, questionIndex);
      const q = state.chapters[chapterIndex].questions[questionIndex];
      const userLower = (userAnswer || "").toLowerCase().trim();
      const correctLower = q.answer.toLowerCase().trim();
      const isCorrect =
        userLower === correctLower || userLower.includes(correctLower);

      const wasShown = ui.showResult;
      ui.userAnswer = userAnswer || "";
      if (!wasShown) ui.revealCount += 1;
      ui.showResult = true;
      ui.isCorrect = isCorrect;

      // tổng thể
      state.questionStates[k] = isCorrect ? "completed" : "learning";
    },

    // FLASHCARD
    flipFlashcard: (state, action) => {
      const { chapterIndex, questionIndex } = action.payload;
      const { ui } = ensureUI(state, "flashcard", chapterIndex, questionIndex);
      const next = !ui.showAnswer;
      if (!ui.showAnswer && next) ui.revealCount += 1; // lần đầu lật mặt sau
      ui.showAnswer = next;
    },

    // reset UI 1 câu
    resetQuestionUI: (state, action) => {
      const { chapterIndex, questionIndex, mode = "all" } = action.payload;
      const k = keyOf(chapterIndex, questionIndex);
      if (mode === "all") {
        delete state.uiState.quiz[k];
        delete state.uiState.fill[k];
        delete state.uiState.flashcard[k];
      } else {
        delete state.uiState[mode][k];
      }
    },

    // reset cả chương
    resetChapter: (state, action) => {
      const chapterIndex = action.payload;
      const total = state.chapters[chapterIndex].questions.length;
      for (let i = 0; i < total; i++) {
        const k = keyOf(chapterIndex, i);
        delete state.uiState.quiz[k];
        delete state.uiState.fill[k];
        delete state.uiState.flashcard[k];
        delete state.questionStates[k];
      }
      state.currentPage = 0;
    },

    // TRÁO THẺ / XÁO THỨ TỰ CÂU HỎI CỦA CHƯƠNG HIỆN TẠI
    shuffleChapterQuestions: (state, action) => {
      const chapterIndex =
        typeof action.payload === "number"
          ? action.payload
          : state.activeChapter;

      const ch = state.chapters[chapterIndex];
      if (!ch || !Array.isArray(ch.questions)) return;

      // Lưu độ dài cũ để reset key UI/tiến trình theo index
      const originalLen = ch.questions.length;

      // 1) Xáo trộn mảng questions
      const shuffled = shuffleArray(ch.questions.slice());
      state.chapters[chapterIndex] = { ...ch, questions: shuffled };

      // 2) Reset toàn bộ UI & tổng trạng thái của chương
      for (let i = 0; i < originalLen; i++) {
        const k = keyOf(chapterIndex, i);
        delete state.uiState.quiz[k];
        delete state.uiState.fill[k];
        delete state.uiState.flashcard[k];
        delete state.questionStates[k];
      }

      // 3) Quay về trang đầu
      state.currentPage = 0;
    },
  },
});

export const {
  setActiveChapter,
  setCurrentPage,
  nextPage,
  prevPage,
  setStudyMode,
  setShowAnswer,
  setUserAnswer,
  answerQuiz,
  submitFill,
  flipFlashcard,
  resetQuestionUI,
  resetChapter,
  shuffleChapterQuestions, // <-- export action mới
} = quizSlice.actions;

// -------- Selectors --------
export const selectQuiz = (state) => state.quiz;

export const selectQuestionUI = (
  state,
  chapterIndex,
  questionIndex,
  mode = "quiz"
) => {
  const k = `${chapterIndex}-${questionIndex}`;
  const DEFAULT = { ...DEFAULT_UI };
  return state.quiz.uiState?.[mode]?.[k] || DEFAULT;
};

// % đã làm THEO MODE (attempt-based, không theo vị trí)
export const selectModeAttemptPercent = (state, chapterIndex, mode) => {
  const ch = state.quiz.chapters[chapterIndex];
  if (!ch) return 0;
  const attempted = ch.questions.reduce((acc, _, i) => {
    const k = `${chapterIndex}-${i}`;
    const ui = state.quiz.uiState?.[mode]?.[k];
    const done =
      mode === "flashcard" ? (ui?.revealCount ?? 0) > 0 : !!ui?.showResult;
    return done ? acc + 1 : acc;
  }, 0);
  return Math.round((attempted / ch.questions.length) * 100);
};

// số câu đúng theo mode (flashcard không có đúng/sai)
export const selectModeCorrectCount = (state, chapterIndex, mode) => {
  const ch = state.quiz.chapters[chapterIndex];
  if (!ch) return 0;
  return ch.questions.reduce((acc, _, i) => {
    const k = `${chapterIndex}-${i}`;
    const ui = state.quiz.uiState?.[mode]?.[k];
    return ui?.isCorrect ? acc + 1 : acc;
  }, 0);
};

export default quizSlice.reducer;
