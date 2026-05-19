import React from "react";
import { useSelector, useDispatch } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
// Sections
import QuizSidebar from "./Quiz_Sidebar";
import StudyHeader from "./Study_Header";
import Flashcard from "./Card/Flash_Card";
import QuizCard from "./Card/Quiz_Card";
import FillCard from "./Card/Fill_Card";
import QuestionNavigation from "./Pagination";
import { useNavigate } from "react-router-dom";
import endPoint from "@routes/routes";

import {
  selectQuiz,
  // selectQuestionUI,
  setActiveChapter,
  setCurrentPage,
  setStudyMode,
  resetChapter,
  selectModeAttemptPercent,
  shuffleChapterQuestions, // <-- THÊM IMPORT
} from "@redux/features/quizSlice";

const MarxistPhilosophyQuiz = () => {
  const dispatch = useDispatch();
  const { chapters, activeChapter, currentPage, questionStates, studyMode } =
    useSelector(selectQuiz);

  const currentChapter = chapters[activeChapter];
  const currentQuestion = currentChapter.questions[currentPage];

  const navigate = useNavigate();

  const handleOpenTest = (cfg) => {
    setMobileSidebarOpen(false); // nếu đang mở drawer mobile
    navigate(endPoint.QUIZTEST, { state: { cfg, autoStart: true } });
  };

  // (Giữ nếu component con cần UI tổng quát)
  // const ui = useSelector((state) =>
  //   selectQuestionUI(state, activeChapter, currentPage)
  // );

  // Dark mode cục bộ (persist localStorage)
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });
  React.useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Progress cho Sidebar = trung bình 3 mode
  const chapterAvgProgress = useSelector((state) =>
    state.quiz.chapters.map((_, ci) => {
      const quizP = selectModeAttemptPercent(state, ci, "quiz");
      const fillP = selectModeAttemptPercent(state, ci, "fill");
      const cardP = selectModeAttemptPercent(state, ci, "flashcard");
      return Math.round((quizP + fillP + cardP) / 3);
    })
  );
  const calculateProgress = (chapterIndex) =>
    chapterAvgProgress?.[chapterIndex] ?? 0;

  // Sidebar state/helpers
  const [expandedChapters, setExpandedChapters] = React.useState({ 0: true });
  const toggleDarkMode = () => setDarkMode((v) => !v);
  const toggleChapterExpanded = (idx) =>
    setExpandedChapters((s) => ({ ...s, [idx]: !s[idx] }));

  const restart = () => dispatch(resetChapter(activeChapter));

  const themeClasses = darkMode ? "dark bg-slate-800" : "bg-slate-100";
  const cardClasses = darkMode
    ? "bg-slate-700 text-white"
    : "bg-white text-slate-800";
  const sidebarClasses = darkMode ? "bg-slate-900" : "bg-slate-700";

  // Icon trạng thái tổng thể (không theo mode)
  const getStateIcon = (chapterIndex, questionIndex) => {
    const k = `${chapterIndex}-${questionIndex}`;
    const s = questionStates[k] || "not-started";
    if (s === "completed")
      return (
        <svg
          className="w-4 h-4 text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.95a1 1 0 011.414-1.414l3.101 3.1 6.364-6.343a1 1 0 011.535 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    if (s === "learning")
      return <div className="w-4 h-4 rounded-full bg-amber-400" />;
    return <div className="w-4 h-4 rounded-full border-2 border-slate-400" />;
  };

  // Tổng completed toàn app (optional)
  const getTotalProgress = () => {
    let totalCompleted = 0;
    let totalQ = 0;
    chapters.forEach((ch, ci) => {
      totalQ += ch.questions.length;
      ch.questions.forEach((_, qi) => {
        const k = `${ci}-${qi}`;
        if (questionStates[k] === "completed") totalCompleted++;
      });
    });
    return { completed: totalCompleted, total: totalQ };
  };

  // ===== Mobile Drawer state =====
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Khóa body scroll khi mở + ESC để đóng
  React.useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={`${themeClasses} transition-all duration-300 min-h-[100svh]`}
    >
      {/* ===== Drawer Sidebar (mobile) — smooth open/close with motion ===== */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Đóng menu"
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className={`custom-scrollbar absolute left-0 top-0 h-full w-80.5 max-w-[360px] shadow-xl overflow-y-auto
                ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.28 }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.03}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) setMobileSidebarOpen(false);
              }}
            >
              <QuizSidebar
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                chapters={chapters}
                activeChapter={activeChapter}
                setActiveChapter={(i) => {
                  setMobileSidebarOpen(false);
                  dispatch(setActiveChapter(i));
                  dispatch(setCurrentPage(0));
                }}
                setCurrentQuestionIndex={(i) => {
                  setMobileSidebarOpen(false);
                  dispatch(setCurrentPage(i));
                }}
                expandedChapters={expandedChapters}
                toggleChapterExpanded={toggleChapterExpanded}
                getTotalProgress={getTotalProgress}
                calculateProgress={calculateProgress}
                getStateIcon={getStateIcon}
                sidebarClasses={sidebarClasses}
                themeClasses={themeClasses}
                onClose={() => setMobileSidebarOpen(false)}
                onOpenTest={handleOpenTest}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar desktop GIỮ NGUYÊN */}
        <div className="hidden lg:block lg:sticky lg:top-0 lg:h-full lg:min-w-[300px]">
          <QuizSidebar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            chapters={chapters}
            activeChapter={activeChapter}
            setActiveChapter={(i) => dispatch(setActiveChapter(i))}
            setCurrentQuestionIndex={(i) => dispatch(setCurrentPage(i))}
            expandedChapters={expandedChapters}
            toggleChapterExpanded={toggleChapterExpanded}
            getTotalProgress={getTotalProgress}
            calculateProgress={calculateProgress}
            getStateIcon={getStateIcon}
            sidebarClasses={sidebarClasses}
            themeClasses={themeClasses}
            onOpenTest={handleOpenTest}
          />
        </div>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-3 lg:pt-4 pb-2 min-h-screen">
          <StudyHeader
            darkMode={darkMode}
            currentChapter={currentChapter}
            studyMode={studyMode}
            setStudyMode={(m) => dispatch(setStudyMode(m))}
            shuffleQuestions={() =>
              dispatch(shuffleChapterQuestions(activeChapter))
            } // <-- GỌI ACTION TRÁO THẺ
            restartChapter={restart}
            toggleFullscreen={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen();
              }
            }}
            activeChapter={activeChapter}
            cardClasses={cardClasses}
            onOpenSidebar={() => setMobileSidebarOpen(true)} // nút menu trong header (mobile)
          />

          <div className="max-w-4xl mx-auto">
            {studyMode === "flashcard" && <Flashcard darkMode={darkMode} />}
            {studyMode === "quiz" && (
              <QuizCard
                currentQuestion={currentQuestion}
                darkMode={darkMode}
                cardClasses={cardClasses}
              />
            )}
            {studyMode === "fill" && (
              <FillCard
                currentQuestion={currentQuestion}
                darkMode={darkMode}
                cardClasses={cardClasses}
              />
            )}

            <div className="mt-6">
              <QuestionNavigation darkMode={darkMode} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarxistPhilosophyQuiz;
