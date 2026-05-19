import React from "react";
import { CheckCircle, RotateCcw, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectQuiz,
  selectQuestionUI,
  resetQuestionUI,
  setUserAnswer,
  submitFill,
} from "@redux/features/quizSlice";

const FillCard = ({ currentQuestion, darkMode, cardClasses }) => {
  const dispatch = useDispatch();
  const { activeChapter, currentPage } = useSelector(selectQuiz);
  const ui = useSelector((state) =>
    selectQuestionUI(state, activeChapter, currentPage, "fill")
  );

  const userAnswer = ui.userAnswer || "";
  const showResult = ui.showResult;

  const isCorrect =
    userAnswer.toLowerCase().trim() ===
      currentQuestion.answer.toLowerCase().trim() ||
    userAnswer
      .toLowerCase()
      .trim()
      .includes(currentQuestion.answer.toLowerCase().trim());

  const onInput = (v) =>
    dispatch(
      setUserAnswer({
        chapterIndex: activeChapter,
        questionIndex: currentPage,
        value: v,
        mode: "fill",
      })
    );

  const onCheck = () =>
    dispatch(
      submitFill({
        chapterIndex: activeChapter,
        questionIndex: currentPage,
        userAnswer,
        mode: "fill",
      })
    );

  const onRetry = () =>
    dispatch(
      resetQuestionUI({
        chapterIndex: activeChapter,
        questionIndex: currentPage,
        mode: "fill",
      })
    );

  // ⬇️ Nhấn Enter để nộp câu trả lời
  const handleKeyDown = (e) => {
    if (e.isComposing) return; // tránh xung đột với bộ gõ tiếng Việt/IME
    if (e.key === "Enter" && !showResult) {
      e.preventDefault();
      if (userAnswer.trim()) onCheck();
    }
  };

  return (
    <div className={`${cardClasses} rounded-xl shadow-lg p-8`}>
      <h3
        className={`text-md italic font-base mb-6 ${
          darkMode ? "text-slate-300" : "text-slate-800"
        }`}
      >
        * Điền từ còn thiếu vào chỗ trống :
      </h3>

      <p
        className={`mb-6 ml-4 text-lg leading-relaxed ${
          darkMode ? "text-slate-100" : "text-slate-700"
        }`}
      >
        {currentQuestion.fillAnswer.split("___").map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && (
              <span
                className={`underline font-semibold ${
                  darkMode ? "text-slate-300" : "text-slate-500"
                }`}
              >
                ____________
              </span>
            )}
          </React.Fragment>
        ))}
      </p>

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => onInput(e.target.value)}
        onKeyDown={handleKeyDown} // ⬅️ thêm dòng này
        placeholder="Nhập từ còn thiếu..."
        className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none transition-all duration-200
          ${
            darkMode
              ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-amber-400/40"
              : "bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:border-amber-500"
          }`}
        disabled={showResult}
      />

      <div
        className={`text-right text-sm mt-1 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {userAnswer.length}/100 ký tự
      </div>

      {!showResult && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCheck}
            disabled={!userAnswer.trim()}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm
              ${
                darkMode
                  ? "bg-yellow-500/90 text-white hover:brightness-90 disabled:bg-slate-600 disabled:text-slate-400"
                  : "bg-yellow-400/60 text-slate-600 hover:brightness-90 disabled:bg-slate-200 disabled:text-slate-400"
              } disabled:cursor-not-allowed`}
          >
            <CheckCircle className="w-4 h-4" /> Kiểm tra đáp án
          </button>

          <button
            onClick={() => onInput("")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200
              ${
                darkMode
                  ? "border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-600"
                  : "border-slate-200 text-slate-600 hover:bg-red-100 hover:border-red-100"
              }`}
          >
            Xóa
          </button>
        </div>
      )}

      {showResult && (
        <div className="space-y-4 mt-4">
          <div
            className={`p-4 rounded-lg border-l-4
              ${
                isCorrect
                  ? `bg-green-50 text-green-800 border-green-500 ${
                      darkMode ? "bg-green-900/20 text-green-400" : ""
                    }`
                  : `bg-orange-50 text-orange-800 border-orange-500 ${
                      darkMode ? "bg-orange-900/20 text-orange-400" : ""
                    }`
              }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <div className="text-2xl">🌟</div>
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-green-50" : "text-green-800"
                    }`}
                  >
                    Tuyệt vời! Câu trả lời của bạn chính xác.
                  </span>
                </>
              ) : (
                <>
                  <div className="text-2xl">📚</div>
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-orange-50" : "text-orange-800"
                    }`}
                  >
                    Chưa hoàn toàn chính xác, hãy tham khảo đáp án mẫu.
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-slate-800" : "bg-amber-50"
            } p-4 rounded-lg border ${
              darkMode ? "border-slate-600" : "border-amber-200"
            }`}
          >
            <h4
              className={`font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-orange-200" : "text-slate-600"
              }`}
            >
              <BookOpen className="w-4 h-4" /> Đáp án mẫu:
            </h4>
            <p
              className={`${
                darkMode ? "text-slate-300" : "text-amber-800"
              } leading-relaxed`}
            >
              {currentQuestion.fullFillAnswer}
            </p>

            {!isCorrect && (
              <div
                className={`mt-3 p-3 rounded-lg ${
                  darkMode
                    ? "bg-blue-50"
                    : "border border-slate-200 bg-slate-50"
                }`}
              >
                <span className="font-medium text-slate-600">
                  Từ khóa chính:
                </span>
                <span className="text-amber-600 ml-2 font-semibold text-lg">
                  {currentQuestion.answer}
                </span>
              </div>
            )}
          </div>

          {/* Chỉ hiện “Thử lại” khi sai */}
          {!isCorrect && (
            <div className="flex gap-3">
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Thử lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FillCard;
