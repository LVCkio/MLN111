// src/pages/Study_Header.jsx
import React, { memo, useCallback, useMemo } from "react";
import {
  RotateCcw,
  Brain,
  Edit3,
  Shuffle,
  Maximize2,
  RefreshCw,
  Trophy,
  Star,
  Menu,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // ✅ dùng toast mặc định
import {
  selectModeAttemptPercent,
  selectModeCorrectCount,
  selectQuiz,
} from "@redux/features/quizSlice";

function StudyHeader({
  darkMode,
  currentChapter,
  studyMode,
  setStudyMode,
  shuffleQuestions,
  restartChapter,
  toggleFullscreen,
  activeChapter,
  cardClasses,
  onOpenSidebar,
}) {
  const { currentPage } = useSelector(selectQuiz);
  const totalQuestions = currentChapter?.questions?.length ?? 0;
  const currentIndexSafe =
    totalQuestions > 0 ? Math.min(currentPage + 1, totalQuestions) : 0;

  const progressByMode = useSelector((state) =>
    selectModeAttemptPercent(state, activeChapter, studyMode)
  );
  const correctCountByMode = useSelector((state) =>
    selectModeCorrectCount(state, activeChapter, studyMode)
  );

  const textColor = darkMode ? "text-white" : "text-slate-800";
  const subTextColor = darkMode ? "text-slate-400" : "text-slate-600";
  const buttonBase =
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200";
  const actionButtonClasses = darkMode
    ? "bg-slate-700 text-slate-200 hover:bg-slate-600 shadow-md rounded-lg"
    : "bg-white text-slate-800 hover:bg-amber-50 hover:text-slate-900 shadow-lg rounded-lg";

  const studyModes = useMemo(
    () => [
      { mode: "flashcard", icon: RotateCcw, label: "Flashcard" },
      { mode: "quiz", icon: Brain, label: "Trắc nghiệm" },
      { mode: "fill", icon: Edit3, label: "Điền đáp án" },
    ],
    []
  );

  // ===== Toast mặc định (không custom UI) =====
  const handleShuffle = useCallback(() => {
    if (typeof shuffleQuestions === "function") {
      shuffleQuestions();
      toast.success(
        "Đã tráo thẻ! Thứ tự câu hỏi/thẻ đã được xáo trộn ngẫu nhiên.",
        { toastId: "toast-shuffle" }
      );
    }
  }, [shuffleQuestions]);

  const handleRestart = useCallback(() => {
    if (typeof restartChapter === "function") {
      restartChapter();
      toast.success(
        "Đã làm lại! Tất cả câu hỏi được đặt về trạng thái & thứ tự ban đầu.",
        { toastId: "toast-restart" }
      );
    }
  }, [restartChapter]);

  const actions = useMemo(
    () => [
      { onClick: handleShuffle, icon: Shuffle, label: "Tráo thẻ" },
      { onClick: handleRestart, icon: RefreshCw, label: "Làm lại" },
      { onClick: toggleFullscreen, icon: Maximize2, label: "Toàn màn hình" },
    ],
    [handleShuffle, handleRestart, toggleFullscreen]
  );

  const handleChangeMode = useCallback(
    (mode) => {
      if (mode !== studyMode) setStudyMode(mode);
    },
    [studyMode, setStudyMode]
  );

  const modeLabel =
    studyMode === "quiz"
      ? "Trắc nghiệm"
      : studyMode === "fill"
      ? "Điền đáp án"
      : "Flashcard";

  return (
    <div className="mb-8" role="region" aria-label="Thanh điều khiển học tập">
      {/* Title + Progress */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-2">
        <div className="min-w-0">
          {/* Tiêu đề + menu mobile */}
          <div className="flex items-center gap-4 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className={`inline-flex lg:hidden p-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  : "bg-white border-slate-200 hover:bg-amber-50"
              }`}
              aria-label="Mở danh sách chương"
            >
              <Menu
                className={`w-5 h-5 ${
                  darkMode ? "text-white" : "text-slate-700"
                }`}
              />
            </button>
            <h2 className={`text-3xl font-bold mb-3 ${textColor} break-words`}>
              {currentChapter.title}
            </h2>
          </div>
          <p className={`${subTextColor} break-words`}>
            {currentChapter.description}
          </p>

          {/* Mobile progress */}
          <div className="lg:hidden mt-2 py-1">
            <div
              className={`text-sm mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Câu hỏi {currentIndexSafe} / {totalQuestions}
            </div>
            <div className="relative w-full bg-slate-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressByMode}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressByMode}
                role="progressbar"
                aria-label={`Tiến độ đã làm (${modeLabel})`}
              />
              <span
                className={`absolute inset-0 flex items-center justify-center text-[8px] sm:text-[10px] font-semibold ${
                  progressByMode > 50 ? "text-white" : "text-gray-800"
                }`}
              >
                {progressByMode}%
              </span>
            </div>
          </div>
        </div>

        {/* Desktop progress */}
        <div className="hidden lg:block text-right mt-6">
          <div
            className={`text-sm mb-2 ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Câu hỏi ( {currentIndexSafe} / {totalQuestions} )
          </div>
          <div className="relative w-64 bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressByMode}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressByMode}
              role="progressbar"
              aria-label={`Tiến độ đã làm (${modeLabel})`}
            />
            <span
              className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold ${
                progressByMode > 50 ? "text-white" : "text-gray-800"
              }`}
            >
              {progressByMode}%
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2 lg:flex-nowrap lg:gap-0">
        <div className="flex gap-2 flex-wrap">
          {studyModes.map(({ mode, icon: Icon, label }) => {
            const isActive = studyMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleChangeMode(mode)}
                aria-pressed={isActive}
                aria-label={`Chuyển sang chế độ ${label}`}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg transition-all duration-200 transform hover:scale-[1.03] ${
                  isActive
                    ? darkMode
                      ? "bg-gradient-to-r from-amber-300/20 via-amber-300/15 to-amber-400/10 text-amber-100 shadow-inner border-amber-200/20"
                      : "bg-gradient-to-r from-amber-200/40 via-amber-200/30 to-amber-300/40 text-amber-800 shadow-md border-amber-300/70"
                    : `${cardClasses} ${
                        darkMode
                          ? "hover:bg-slate-600 border-slate-600/20"
                          : "hover:bg-amber-50 border-slate-200/40"
                      } shadow-md`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm sm:text-base">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {actions.map(({ onClick, icon: Icon, label }) => (
            <button
              key={label}
              onClick={onClick}
              aria-label={label}
              className={`${buttonBase} ${actionButtonClasses} transform hover:scale-[1.03] text-sm sm:text-base`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-6 text-sm flex-wrap">
        <div className={`flex items-center gap-2 ${subTextColor}`}>
          <Trophy className="w-4 h-4 text-blue-500" />
          <span>
            {progressByMode}% đã làm ({modeLabel})
          </span>
        </div>
        <div className={`flex items-center gap-2 ${subTextColor}`}>
          <Star className="w-4 h-4 text-amber-400" />
          {studyMode === "flashcard" ? (
            <span>
              {totalQuestions} câu hỏi ({modeLabel})
            </span>
          ) : (
            <span>
              {correctCountByMode} câu đúng ({modeLabel})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(StudyHeader);
