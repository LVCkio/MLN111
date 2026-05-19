import React, { useMemo, useEffect, useRef, useState } from "react";
import { CheckCircle, CheckCircle2, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectQuiz,
  selectQuestionUI,
  answerQuiz,
} from "@redux/features/quizSlice";

const QuizCard = ({ currentQuestion, darkMode, cardClasses }) => {
  const dispatch = useDispatch();
  const { activeChapter, currentPage } = useSelector(selectQuiz);
  const ui = useSelector((state) =>
    selectQuestionUI(state, activeChapter, currentPage, "quiz")
  );

  const questionId = useMemo(
    () =>
      currentQuestion?.id ||
      currentQuestion?.quiz?.id ||
      currentQuestion?.quiz?.question ||
      `${activeChapter}-${currentPage}`,
    [currentQuestion, activeChapter, currentPage]
  );

  // Animate chỉ khi showResult chuyển từ false -> true
  const prevShowRef = useRef(undefined);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    prevShowRef.current = undefined;
    setShouldAnimate(false);
  }, [questionId]);

  useEffect(() => {
    const prev = prevShowRef.current;
    if (prev === false && ui.showResult === true) setShouldAnimate(true);
    else setShouldAnimate(false);
    prevShowRef.current = ui.showResult;
  }, [ui.showResult]);

  const handleQuizAnswer = (index) => {
    if (ui.showResult) return;
    dispatch(
      answerQuiz({
        chapterIndex: activeChapter,
        questionIndex: currentPage,
        optionIndex: index,
        mode: "quiz",
      })
    );
  };

  const { showResult, selectedOption } = ui;

  return (
    <div className={`${cardClasses} rounded-xl shadow-lg px-8 pb-8 pt-6`}>
      <h3
        className={`text-xl font-semibold mb-6 ${
          darkMode ? "text-white" : "text-slate-800"
        }`}
      >
        {currentQuestion.quiz.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.quiz.options.map((option, index) => {
          const isCorrect = index === currentQuestion.quiz.correct;
          const isSelected = selectedOption === index;

          const base = `w-full px-4 py-3.5 text-left rounded-lg border transition-all duration-300 transform`;
          const hover = !showResult
            ? darkMode
              ? "hover:border-amber-200/70 hover:text-amber-50 hover:bg-slate-600 hover:scale-[1.01]"
              : "hover:bg-amber-50 hover:scale-[1.01]"
            : "";

          let state = darkMode
            ? "border-slate-500 bg-slate-700/60 text-slate-200"
            : "border-slate-300 bg-white text-slate-700";

          if (showResult) {
            if (isCorrect) {
              state = isSelected
                ? "border-green-500 bg-green-50 text-green-800 shadow-green-200 shadow-md"
                : `border-green-500 bg-green-50 text-green-800 shadow-green-200 shadow-md ${
                    shouldAnimate ? "animate-soft-pulse" : ""
                  }`;
            } else if (isSelected) {
              state = `border-red-500 bg-red-50 text-red-800 shadow-red-200 shadow-md ${
                shouldAnimate ? "animate-shake" : ""
              }`;
            } else {
              state = darkMode
                ? "border-slate-600 bg-slate-600/60 text-slate-300"
                : "border-slate-200 bg-slate-50 text-slate-500";
            }
          }

          return (
            <button
              key={`${questionId}-${index}`}
              type="button"
              onClick={() => handleQuizAnswer(index)}
              disabled={showResult}
              className={`${base} ${hover} ${state}`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
                {showResult && isCorrect && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <div className="w-6 h-6 text-red-500 text-xl">✗</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div
          className={`mt-6 p-4 rounded-lg border-l-4 ${
            selectedOption === currentQuestion.quiz.correct
              ? `bg-green-50 text-green-800 border-green-500 ${
                  darkMode ? "bg-green-900/20 text-slate-50" : ""
                }`
              : `bg-red-50 text-red-800 border-red-500 ${
                  darkMode ? "bg-red-900/20 text-slate-50" : ""
                }`
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {selectedOption === currentQuestion.quiz.correct ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-bold">
                  Xuất sắc! Bạn đã trả lời chính xác.
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="font-bold">
                  Chưa chính xác, hãy xem giải thích!
                </span>
              </>
            )}
          </div>

          {selectedOption !== currentQuestion.quiz.correct && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="font-semibold text-amber-800">Đáp án đúng:</span>
              <span className="text-amber-700 ml-2">
                {currentQuestion.quiz.options[currentQuestion.quiz.correct]}
              </span>
            </div>
          )}

          <div className="mt-3 text-sm opacity-90">
            <span className="font-medium">Giải thích:</span>{" "}
            {currentQuestion.definition}
          </div>
        </div>
      )}

      <style>{`
        @keyframes soft-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.65; } }
        .animate-soft-pulse { animation: soft-pulse 2.5s ease-in-out infinite; }
        @keyframes natural-shake {
          0% { transform: translateX(0); }
          15% { transform: translateX(-3px); }
          30% { transform: translateX(3px); }
          45% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }
        .animate-shake { animation: natural-shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default QuizCard;
