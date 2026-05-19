import React, { useEffect } from "react";
import { CheckCircle, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  selectQuiz,
  selectQuestionUI,
  flipFlashcard,
  setShowAnswer,
} from "@redux/features/quizSlice";

const flipTransition = { duration: 0.6, ease: [0.4, 0, 0.2, 1] };

// Detect mobile & iOS
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener
      ? mql.addEventListener("change", onChange)
      : mql.addListener(onChange);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", onChange)
        : mql.removeListener(onChange);
    };
  }, []);
  return isMobile;
}
const isIOS =
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

const Flashcard = ({ darkMode }) => {
  const dispatch = useDispatch();
  const { currentPage, activeChapter, chapters } = useSelector(selectQuiz);
  const currentQuestion = chapters[activeChapter].questions[currentPage];

  const ui = useSelector((state) =>
    selectQuestionUI(state, activeChapter, currentPage, "flashcard")
  );
  const showAnswer = ui.showAnswer;

  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(
      setShowAnswer({
        chapterIndex: activeChapter,
        questionIndex: currentPage,
        value: false,
        mode: "flashcard",
      })
    );
  }, [activeChapter, currentPage, dispatch]);

  const handleFlip = () => {
    dispatch(
      flipFlashcard({ chapterIndex: activeChapter, questionIndex: currentPage })
    );
  };

  // iOS: luôn dùng rotateY; đồng thời ẩn mặt không dùng bằng visibility
  const rotateAnim =
    isIOS || isMobile
      ? { rotateY: showAnswer ? 180 : 0 }
      : { rotateX: showAnswer ? 180 : 0 };

  const frontVisibility = isIOS
    ? showAnswer
      ? "hidden"
      : "visible"
    : undefined;
  const backVisibility = isIOS
    ? showAnswer
      ? "visible"
      : "hidden"
    : undefined;

  // iOS: bỏ blur để tránh backface bug
  const backPanelExtras = isIOS ? "" : darkMode ? "backdrop-blur-sm" : "";

  return (
    <div className="mx-auto w-full h-72 relative perspective-1000">
      <motion.div
        key={`${activeChapter}-${currentPage}`}
        onClick={handleFlip}
        animate={rotateAnim}
        transition={flipTransition}
        className="relative w-full h-full cursor-pointer preserve-3d will-change-transform"
        style={{
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        {/* FRONT */}
        <div
          className={`face front absolute inset-0 rounded-2xl shadow-sm border p-6 sm:p-8 flex items-center justify-center overflow-hidden ${
            darkMode
              ? "bg-slate-700 border-none"
              : "bg-slate-50 border-slate-300/50"
          }`}
          style={{ visibility: frontVisibility }}
        >
          <div className="text-center relative z-10 h-full flex flex-col justify-between">
            <div className="flex flex-col justify-center items-center h-full">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                />
                <h3
                  className={`text-2xl font-medium ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Thuật ngữ
                </h3>
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    darkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                />
              </div>
              <div
                className={`${
                  darkMode ? "bg-slate-800/50" : "bg-amber-200/60"
                } px-4 py-3 rounded-xl w-full flex justify-center items-center`}
              >
                <p
                  className={`text-2xl font-semibold leading-snug text-center whitespace-normal break-words ${
                    darkMode ? "text-amber-200" : "text-slate-700"
                  } wrap-long`}
                >
                  {currentQuestion?.term}
                </p>
              </div>
            </div>
            <div
              className={`${
                darkMode ? "text-slate-300/80" : "text-slate-700"
              } flex items-center justify-center gap-2 text-sm animate-pulse`}
            >
              <span className="italic">Nhấn để xem đáp án</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`face back absolute inset-0 ${
            isIOS || isMobile ? "rotate-y-180" : "rotate-x-180"
          } rounded-2xl shadow-sm flex items-center justify-center overflow-hidden ${
            darkMode ? "bg-slate-700 text-white" : "bg-white text-slate-800"
          }`}
          style={{ visibility: backVisibility }}
        >
          <div className="text-center relative z-10 w-full flex flex-col justify-center h-full px-5 sm:px-8 mb-1.5">
            <div className="flex items-center justify-center gap-2.5 mb-4 sm:mb-6">
              <CheckCircle
                className={`${
                  darkMode ? "text-white" : "text-amber-400"
                } w-5 h-5 sm:w-6 sm:h-6`}
              />
              <h3
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-amber-500"
                }`}
              >
                Định nghĩa
              </h3>
            </div>
            <div
              className={`${
                darkMode
                  ? "bg-white/10 border-white/20"
                  : "bg-slate-100/50 border-slate-300"
              } ${backPanelExtras} rounded-xl p-4 sm:p-6 border`}
            >
              <p
                className={`text-lg sm:text-xl leading-relaxed whitespace-pre-wrap break-words ${
                  darkMode ? "text-white" : "text-slate-800"
                } wrap-long`}
              >
                {currentQuestion?.definition}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .perspective-1000{perspective:1000px;-webkit-perspective:1000}
        .preserve-3d{transform-style:preserve-3d;-webkit-transform-style:preserve-3d}
        .face{
          position:absolute;inset:0;
          -webkit-backface-visibility:hidden;backface-visibility:hidden;
          -webkit-transform:translateZ(0);transform:translateZ(0);
        }
        .rotate-x-180{transform:rotateX(180deg)}
        .rotate-y-180{transform:rotateY(180deg);-webkit-transform:rotateY(180deg)}
        .wrap-long{overflow-wrap:anywhere;word-break:break-word;hyphens:auto;-webkit-hyphens:auto}
      `}</style>
    </div>
  );
};

export default Flashcard;
