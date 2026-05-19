import { configureStore, combineReducers } from "@reduxjs/toolkit";
import quizReducer from "../features/quizSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";
import localforage from "localforage";
import { chapters as sourceChapters, DATASET_VERSION } from "../features/data";

const rootReducer = combineReducers({
  quiz: quizReducer,
});

/**
 * Transform:
 *  - SAVE: bỏ `chapters` để không lưu dữ liệu cũ.
 *  - LOAD: luôn gắn `chapters` từ data.js; nếu version khác => reset UI/progress.
 */
const quizTransform = createTransform(
  // SAVE
  (inboundState) => {
    if (!inboundState) return inboundState;
    const { chapters, ...rest } = inboundState;
    return rest;
  },
  // LOAD
  (outboundState) => {
    if (!outboundState) {
      return { chapters: sourceChapters, dataVersion: DATASET_VERSION };
    }
    const sameVersion = outboundState.dataVersion === DATASET_VERSION;
    return {
      ...outboundState,
      chapters: sourceChapters,
      dataVersion: DATASET_VERSION,
      ...(sameVersion
        ? {}
        : {
            uiState: { quiz: {}, fill: {}, flashcard: {} },
            questionStates: {},
            currentPage: 0,
            activeChapter: 0,
          }),
    };
  },
  { whitelist: ["quiz"] }
);

// Persist config
const persistConfig = {
  key: "root",
  version: 2, // bump khi thay đổi cách persist
  storage: localforage,
  whitelist: ["quiz"],
  transforms: [quizTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
