// src/pages/Pagination.jsx (QuestionNavigation)
import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectQuiz,
  setCurrentPage,
  nextPage,
  prevPage,
} from "@redux/features/quizSlice";

const QuestionNavigation = ({ darkMode = false }) => {
  const dispatch = useDispatch();
  const { chapters, activeChapter, currentPage } = useSelector(selectQuiz);
  const totalQuestions = chapters?.[activeChapter]?.questions?.length || 0;

  const [jumpPage, setJumpPage] = useState("");

  // Helper tạo dãy trang với '...'
  const getPages = (maxVisible) => {
    if (totalQuestions <= maxVisible) {
      return Array.from({ length: totalQuestions }, (_, i) => i);
    }
    if (currentPage < Math.ceil(maxVisible / 2)) {
      const head = Array.from({ length: maxVisible - 2 }, (_, i) => i);
      return [...head, "...", totalQuestions - 1];
    }
    if (currentPage > totalQuestions - Math.ceil(maxVisible / 2) - 1) {
      const tailStart = totalQuestions - (maxVisible - 2);
      const tail = Array.from(
        { length: maxVisible - 2 },
        (_, i) => tailStart + i
      );
      return [0, "...", ...tail];
    }
    // ở giữa
    const side = Math.floor((maxVisible - 4) / 2); // 2 đầu + 2 '...'
    return [
      0,
      "...",
      ...[currentPage - side, currentPage, currentPage + side],
      "...",
      totalQuestions - 1,
    ];
  };

  // Desktop giữ nguyên 7, Tablet rút còn 5
  const pagesDesktop = useMemo(
    () => getPages(7),
    [totalQuestions, currentPage]
  );
  const pagesTablet = useMemo(() => getPages(5), [totalQuestions, currentPage]);

  const handleJump = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalQuestions) {
      dispatch(setCurrentPage(pageNum - 1));
      setJumpPage("");
    }
  };

  // Styles chung
  const prevNextBase =
    "flex items-center justify-center rounded-md font-medium transition-colors";
  const prevNextEnabled = darkMode
    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
    : "bg-white shadow-md text-gray-600 hover:bg-amber-50";
  const prevNextDisabled = darkMode
    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
    : "bg-slate-200 text-slate-400 cursor-not-allowed";

  return (
    <div className="mt-8 mb-6 flex flex-col items-center gap-4">
      {/* ====== MOBILE (<sm): chỉ 2 nút tròn + label Câu X/Y ====== */}
      <div className="flex w-full items-center justify-between sm:hidden">
        <button
          onClick={() => dispatch(prevPage())}
          disabled={currentPage === 0}
          aria-label="Câu trước"
          className={[
            "w-10 h-10 rounded-full",
            prevNextBase,
            currentPage === 0 ? prevNextDisabled : prevNextEnabled,
          ].join(" ")}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          className={`text-sm ${
            darkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Câu {currentPage + 1} / {totalQuestions}
        </div>

        <button
          onClick={() => dispatch(nextPage())}
          disabled={currentPage === totalQuestions - 1}
          aria-label="Câu sau"
          className={[
            "w-10 h-10 rounded-full",
            prevNextBase,
            currentPage === totalQuestions - 1
              ? prevNextDisabled
              : prevNextEnabled,
          ].join(" ")}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ====== TABLET (sm–lg): số trang rút gọn, nút nhỏ ====== */}
      <div className="hidden sm:flex lg:hidden w-full items-center justify-between">
        {/* Prev */}
        <button
          onClick={() => dispatch(prevPage())}
          disabled={currentPage === 0}
          className={[
            prevNextBase,
            "gap-1 px-3 py-2 rounded-md text-sm",
            currentPage === 0 ? prevNextDisabled : prevNextEnabled,
          ].join(" ")}
        >
          <ChevronLeft className="w-4 h-4" />
          Trước
        </button>

        {/* Pagination gọn */}
        <div className="flex gap-1">
          {pagesTablet.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-t-${idx}`}
                className={`w-8 h-8 flex items-center justify-center ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                …
              </span>
            ) : (
              <button
                key={`p-t-${activeChapter}-${idx}`}
                onClick={() => dispatch(setCurrentPage(page))}
                className={`w-8 h-8 rounded-md text-xs font-medium transition-colors border
                  ${
                    page === currentPage
                      ? darkMode
                        ? "bg-gradient-to-r from-amber-300/30 via-amber-300/20 to-amber-400/20 text-amber-100 shadow-inner border-amber-200/40"
                        : "bg-gradient-to-r from-amber-100/40 via-amber-100/60 to-amber-100/50 text-amber-800 shadow-sm border-amber-200/60"
                      : darkMode
                      ? "bg-slate-700 text-slate-400 hover:bg-slate-600 border-slate-600"
                      : "bg-white text-slate-600 hover:brightness-95 border-slate-300"
                  }`}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => dispatch(nextPage())}
          disabled={currentPage === totalQuestions - 1}
          className={[
            prevNextBase,
            "gap-1 px-3 py-2 rounded-md text-sm",
            currentPage === totalQuestions - 1
              ? prevNextDisabled
              : prevNextEnabled,
          ].join(" ")}
        >
          Sau
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ====== DESKTOP (≥lg): UI ĐÚNG BẢN GỐC ====== */}
      <div className="hidden lg:flex w-full items-center justify-between">
        {/* Prev */}
        <button
          onClick={() => dispatch(prevPage())}
          disabled={currentPage === 0}
          className={[
            prevNextBase,
            "gap-1 px-3 py-2.5 rounded-md",
            currentPage === 0 ? prevNextDisabled : prevNextEnabled,
          ].join(" ")}
        >
          <ChevronLeft className="w-5 h-5 mt-0.5" />
          Câu trước
        </button>

        {/* Pagination đầy đủ */}
        <div className="flex gap-1">
          {pagesDesktop.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className={`w-10 h-10 flex items-center justify-center ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                …
              </span>
            ) : (
              <button
                key={`p-d-${activeChapter}-${idx}`}
                onClick={() => dispatch(setCurrentPage(page))}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors border
                  ${
                    page === currentPage
                      ? darkMode
                        ? "bg-gradient-to-r from-amber-300/30 via-amber-300/20 to-amber-400/20 text-amber-100 shadow-inner border-amber-200/40"
                        : "bg-gradient-to-r from-amber-100/40 via-amber-100/60 to-amber-100/50 text-amber-800 shadow-sm border-amber-200/60"
                      : darkMode
                      ? "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300 border-slate-600"
                      : "bg-white text-slate-600 hover:brightness-90 hover:border-none border-slate-300"
                  }`}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => dispatch(nextPage())}
          disabled={currentPage === totalQuestions - 1}
          className={[
            prevNextBase,
            "gap-1 px-3 py-2.5 rounded-md",
            currentPage === totalQuestions - 1
              ? prevNextDisabled
              : prevNextEnabled,
          ].join(" ")}
        >
          Câu sau <ChevronRight className="w-5 h-5 mt-0.5" />
        </button>
      </div>

      {/* Jump To Page — chỉ hiện từ tablet trở lên */}
      {totalQuestions > 8 && (
        <div className="hidden sm:flex items-center gap-2">
          <Tooltip title="Nhập số câu muốn tới" arrow>
            <input
              type="number"
              min={1}
              max={totalQuestions}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Number"
              className={`w-24 px-3 py-2 rounded-md border text-sm focus:outline-none ${
                darkMode
                  ? "bg-slate-800 border-slate-600 text-slate-200"
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            />
          </Tooltip>
          <Tooltip title="Nhấn GO để chuyển tới câu..." arrow>
            <button
              onClick={handleJump}
              className="px-3 py-2 rounded-md bg-amber-400/80 text-white text-sm font-medium hover:brightness-90 transition"
            >
              GO
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigation;
