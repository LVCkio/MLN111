// src/pages/Quiz_Sidebar.jsx
import React from "react";
import { createPortal } from "react-dom";
import {
  Brain,
  Lightbulb,
  Layers,
  FileQuestion,
  PencilLine,
  CheckCircle2,
  Timer,
  Target,
  X,
  BookOpen,
  Circle,
  AlarmClock,
} from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import TestSetupModal from "@components/TestSetupModal";

/* ========= Modal Tip (render qua Portal) ========= */
function TipModal({ open, onClose, darkMode }) {
  const closeBtnRef = React.useRef(null);
  const [tab, setTab] = React.useState("overview"); // "overview" | "flashcard" | "quiz" | "fill"

  // Khóa scroll body khi mở + focus close
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  // Đóng bằng ESC
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // THEME
  const wrap = darkMode
    ? "bg-slate-800 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";
  const subtle = darkMode ? "text-slate-400" : "text-slate-500";

  const tabs = [
    { key: "overview", label: "Tổng quan", icon: Lightbulb },
    { key: "flashcard", label: "Flashcard", icon: Layers },
    { key: "quiz", label: "Trắc nghiệm", icon: FileQuestion },
    { key: "fill", label: "Điền đáp án", icon: PencilLine },
  ];

  // Card tiện dụng
  const TipCard = ({ tone = "amber", title, children, icon: Icon }) => {
    const lightBg =
      tone === "amber"
        ? "bg-amber-50"
        : tone === "green"
          ? "bg-green-50"
          : tone === "blue"
            ? "bg-blue-50"
            : tone === "violet"
              ? "bg-violet-50"
              : "bg-slate-100";

    const darkBg = "bg-slate-700/60";
    const titleColor =
      tone === "amber"
        ? "text-amber-600"
        : tone === "green"
          ? "text-green-500"
          : tone === "blue"
            ? "text-blue-500"
            : tone === "violet"
              ? "text-violet-500"
              : "text-slate-200";

    return (
      <div className={`${darkMode ? darkBg : lightBg} p-3 rounded-lg`}>
        <div className="flex items-center gap-2 mb-1.5">
          {Icon && <Icon className={`${titleColor} w-4 h-4`} />}
          <div className={`font-medium ${titleColor}`}>{title}</div>
        </div>
        <div className={darkMode ? "text-slate-200" : "text-slate-700"}>
          {children}
        </div>
      </div>
    );
  };

  // Bullet có icon
  const Bullet = ({ children }) => (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 mt-[2px] text-emerald-500" />
      <span>{children}</span>
    </div>
  );

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {/* Overlay */}
      <motion.button
        key="overlay"
        type="button"
        aria-label="Đóng mẹo học"
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-tip-title"
        className={`fixed z-[101] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      w-[min(92vw,680px)] max-h-[100vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient nhỏ */}
        <div
          className={`px-5 sm:px-6 pt-5 pb-4 flex items-start justify-between ${wrap}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl grid place-items-center bg-gradient-to-br
                from-amber-400/30 to-amber-500/20 ring-1 ring-amber-400/30`}
            >
              <Brain className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 id="study-tip-title" className="text-lg font-bold">
                Mẹo học ghi nhớ hiệu quả
              </h3>
              <p className={`text-xs ${subtle}`}>
                Áp dụng nhanh 2–3 phút rồi quay lại luyện tập để tối đa hoá
                retention.
              </p>
            </div>
          </div>

          <motion.button
            ref={closeBtnRef}
            whileHover={{ rotate: 90 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className={`p-2 rounded-lg  ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
              }`}
            onClick={onClose}
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className={`${wrap} border-t flex-1 min-h-0 flex flex-col`}>
          <div className="px-5 sm:px-6 pt-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tabs.map(({ key, label }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`group flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      border transition
                      ${active
                        ? darkMode
                          ? "bg-gradient-to-r from-amber-300/20 via-amber-300/15 to-amber-400/10 text-amber-100 shadow-sm border-amber-200/40"
                          : "bg-amber-500 text-white ring-amber-500"
                        : darkMode
                          ? "text-slate-200 ring-slate-700 hover:bg-slate-700 border-slate-600"
                          : "text-slate-700 ring-slate-200 hover:bg-slate-50"
                      }`}
                    aria-pressed={active ? "true" : "false"}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {/* OVERVIEW */}
            {tab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <TipCard
                  tone="amber"
                  title="🎯 Chiến thuật 3–2–1"
                  icon={Target}
                >
                  <div className="space-y-1.5">
                    <Bullet>Làm 3 câu dễ → nghỉ 2 phút → tóm 1 ý chính.</Bullet>
                    <Bullet>Lặp 2–3 vòng để củng cố đường mòn ghi nhớ.</Bullet>
                    <Bullet>
                      <span className={subtle}>Bonus:</span> đặt timer{" "}
                      <Timer className="inline w-4 h-4 -mt-1" /> 5–7 phút mỗi
                      vòng.
                    </Bullet>
                  </div>
                </TipCard>

                <TipCard
                  tone="green"
                  title="🧠 Đọc câu hỏi trước"
                  icon={Lightbulb}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Xác định từ khóa → lướt đáp án → quay lại câu hỏi.
                    </Bullet>
                    <Bullet>Loại trừ đáp án sai trước khi chọn.</Bullet>
                  </div>
                </TipCard>

                <TipCard
                  tone="blue"
                  title="✍️ Nhật ký lỗi sai"
                  icon={PencilLine}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Ghi 1 câu: “Sai vì…”. Không cần dài, chỉ cần trúng.
                    </Bullet>
                    <Bullet>
                      Ôn lại “lỗi sai” trước khi làm vòng tiếp theo.
                    </Bullet>
                  </div>
                </TipCard>

                <TipCard tone="violet" title="⏱️ Quy tắc 80/20" icon={Target}>
                  <div className="space-y-1.5">
                    <Bullet>
                      Hoàn thành 70–80% câu dễ trước để lấy điểm/đà.
                    </Bullet>
                    <Bullet>Quay lại câu khó khi đã ấm máy.</Bullet>
                  </div>
                </TipCard>
              </motion.div>
            )}

            {/* FLASHCARD */}
            {tab === "flashcard" && (
              <motion.div
                key="flashcard"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 gap-3"
              >
                <TipCard tone="amber" title="Active Recall" icon={Layers}>
                  <div className="space-y-1.5">
                    <Bullet>
                      Nhìn thuật ngữ, thử nói ra định nghĩa trước khi lật.
                    </Bullet>
                    <Bullet>Đánh dấu “chưa nhớ” để ôn lại vòng sau.</Bullet>
                  </div>
                </TipCard>
                <TipCard tone="green" title="Spaced Repetition" icon={Timer}>
                  <div className="space-y-1.5">
                    <Bullet>Ôn lại thẻ sai sau 10–30 phút, rồi 1 ngày.</Bullet>
                    <Bullet>
                      Trộn (shuffle) định kỳ để tránh thuộc vị trí.
                    </Bullet>
                  </div>
                </TipCard>
                <TipCard tone="blue" title="Dual Coding" icon={Lightbulb}>
                  <div className="space-y-1.5">
                    <Bullet>Thêm ví dụ/ảnh nhỏ giúp khái niệm “có móc”.</Bullet>
                    <Bullet>Dùng từ khóa súc tích để dễ quét nhanh.</Bullet>
                  </div>
                </TipCard>
                <TipCard
                  tone="violet"
                  title="Say it out loud"
                  icon={CheckCircle2}
                >
                  <div className="space-y-1.5">
                    <Bullet>Đọc to định nghĩa bằng lời của bạn.</Bullet>
                    <Bullet>1 câu – 1 ý – 1 ví dụ.</Bullet>
                  </div>
                </TipCard>
              </motion.div>
            )}

            {/* TRẮC NGHIỆM */}
            {tab === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 gap-3"
              >
                <TipCard
                  tone="green"
                  title="Loại trừ thông minh"
                  icon={FileQuestion}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Gạch 2 đáp án yếu trước khi cân giữa 2 đáp án cuối.
                    </Bullet>
                    <Bullet>
                      Tìm từ “bẫy”: tuyệt đối (luôn/không bao giờ), mâu thuẫn
                      logic.
                    </Bullet>
                  </div>
                </TipCard>
                <TipCard
                  tone="amber"
                  title="Đọc chậm – chọn nhanh"
                  icon={Target}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Đọc kỹ câu hỏi một lần, không đọc qua loa nhiều lần.
                    </Bullet>
                    <Bullet>
                      Chọn đáp án hợp lý nhất, không phải đúng 100%.
                    </Bullet>
                  </div>
                </TipCard>
                <TipCard tone="blue" title="Quản lý thời gian" icon={Timer}>
                  <div className="space-y-1.5">
                    <Bullet>
                      Timebox: ~60–90s/câu, quá thời gian → đánh dấu & đi tiếp.
                    </Bullet>
                    <Bullet>
                      Ưu tiên điểm dễ trước, quay lại câu khó sau.
                    </Bullet>
                  </div>
                </TipCard>
                <TipCard
                  tone="violet"
                  title="Đối chiếu từ khóa"
                  icon={Lightbulb}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Từ khóa trong đáp án phải khớp ngữ cảnh câu hỏi.
                    </Bullet>
                    <Bullet>
                      Nếu 2 đáp án gần giống, chọn đáp án cụ thể hơn.
                    </Bullet>
                  </div>
                </TipCard>
              </motion.div>
            )}

            {/* ĐIỀN ĐÁP ÁN */}
            {tab === "fill" && (
              <motion.div
                key="fill"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 gap-3"
              >
                <TipCard
                  tone="blue"
                  title="Nói bằng lời của bạn"
                  icon={PencilLine}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Viết ngắn gọn, đúng ý – không sa đà câu dài.
                    </Bullet>
                    <Bullet>
                      Dùng keyword/thuật ngữ bắt buộc nếu đề yêu cầu.
                    </Bullet>
                  </div>
                </TipCard>
                <TipCard tone="green" title="Tách ý → ghép câu" icon={Layers}>
                  <div className="space-y-1.5">
                    <Bullet>
                      Liệt kê 2–3 ý chính, sau đó ghép thành câu hoàn chỉnh.
                    </Bullet>
                    <Bullet>
                      Check chính tả / số / thuật ngữ trước khi nộp.
                    </Bullet>
                  </div>
                </TipCard>
                <TipCard
                  tone="amber"
                  title="Gợi ý chữ cái đầu"
                  icon={Lightbulb}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Nếu bí, viết chữ cái đầu mỗi từ để “kéo” ký ức.
                    </Bullet>
                    <Bullet>Nhìn cấu trúc câu để đoán dạng từ cần điền.</Bullet>
                  </div>
                </TipCard>
                <TipCard
                  tone="violet"
                  title="Kiểm tra ngược"
                  icon={CheckCircle2}
                >
                  <div className="space-y-1.5">
                    <Bullet>
                      Thay đáp án vào đề, đọc lại xem có mượt và đúng nghĩa.
                    </Bullet>
                    <Bullet>
                      Chỉ sửa khi chắc chắn; tránh “đổi đúng thành sai”.
                    </Bullet>
                  </div>
                </TipCard>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* ========= Sidebar ========= */
export default function QuizSidebar({
  darkMode,
  chapters,
  activeChapter,
  setActiveChapter,
  setCurrentQuestionIndex,
  calculateProgress,
  onClose,
  onOpenTest,
}) {
  const [showTip, setShowTip] = React.useState(false);
  // NEW: mở modal setup test
  const [openTestSetup, setOpenTestSetup] = React.useState(false);

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  const openStudyTipModal = () => setShowTip(true);

  const handleOpenTest = () => {
    setOpenTestSetup(true);
  };
  //  tổng câu toàn bộ (để modal dùng)
  const totalQuestions = React.useMemo(() => {
    return (chapters || []).reduce(
      (sum, ch) => sum + (ch?.questions?.length || 0),
      0
    );
  }, [chapters]);

  const footerWrap = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-slate-50";

  const footerBtn = darkMode
    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100"
    : "bg-white hover:bg-amber-50 border-slate-200 text-slate-800";

  const footerSub = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <>
      <aside
        className={`grid grid-rows-[auto,1fr,auto] h-[100svh] overflow-hidden w-80 sm:w-88 transition-colors duration-500
    ${darkMode
            ? "bg-slate-900 text-slate-200"
            : "bg-slate-50 border-r border-gray-300 text-slate-800"
          }`}
        role="navigation"
        aria-label="Danh sách chương"
      >
        {/* Header */}
        <div
          className={`relative pl-4 pr-2 pt-3 lg:pl-6 lg:pr-3 lg:pt-4 border-b ${darkMode ? "border-slate-800" : "border-slate-200"
            }`}
        >
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <div
                className={`${darkMode
                    ? "bg-gradient-to-br from-amber-300 to-amber-400 text-slate-900"
                    : "bg-amber-200 text-slate-800"
                  }
                w-9 h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center`}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1
                  className={`text-base lg:text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"
                    }`}
                >
                  CHỦ NGHĨA DUY VẬT BIỆN CHỨNG
                </h1>
                <p
                  className={`${darkMode ? "text-slate-400" : "text-slate-600"
                    } text-xs lg:text-sm`}
                >
                  Hệ thống ôn tập thông minh
                </p>
              </div>
            </div>

            {/* Nút bóng đèn → mở modal tip */}
            <div className="flex items-center gap-2">
              <Tooltip title="Mẹo học ghi nhớ" placement="top" arrow>
                <button
                  onClick={openStudyTipModal}
                  className={`p-2 rounded-lg transition-all duration-300 group ${darkMode
                      ? "bg-slate-800 hover:bg-slate-700"
                      : "bg-white border border-slate-200 hover:bg-amber-50 hover:border-amber-200"
                    }`}
                  aria-label="Mở mẹo học ghi nhớ"
                >
                  <Lightbulb className="w-5 h-5 text-slate-200 group-hover:text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </Tooltip>

              {/* Close (mobile) */}
              <button
                type="button"
                onClick={handleClose}
                className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${darkMode
                    ? "bg-slate-800 hover:bg-slate-700 border border-slate-900"
                    : "bg-white hover:bg-slate-100 border border-slate-200"
                  }`}
                aria-label="Đóng menu"
              >
                <X
                  className={`w-5 h-5 ${darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ===== List chương ===== */}
        <div className="overflow-y-auto py-3 lg:py-4 pl-4 pr-3 lg:pl-6 lg:pr-4 custom-scrollbar">
          <div className="space-y-2.5 lg:space-y-3">
            {chapters.map((ch, i) => {
              const progress = calculateProgress(i);
              const active = i === activeChapter;
              return (
                <div key={ch.id ?? `chapter-${i}`} className="group">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChapter(i);
                      setCurrentQuestionIndex(0);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`w-full text-left relative p-3 lg:p-4 rounded-xl border shadow-sm transition-all hover:scale-[1.02]
                      ${darkMode
                        ? active
                          ? "bg-gradient-to-r from-amber-300/20 via-amber-300/15 to-amber-400/10 text-amber-100 shadow-inner border-amber-200/40"
                          : "bg-slate-800 border-slate-700 hover:border-amber-300/50"
                        : active
                          ? "bg-amber-50 border-amber-400"
                          : "bg-white border-slate-300 hover:border-amber-400/50 hover:shadow-md"
                      }`}
                  >
                    {/* badge số thứ tự */}
                    {/* badge số thứ tự (có lớp che góc) */}
                    <div className="absolute -top-2 -left-2 z-20">
                      {/* lớp “mask” che góc card */}
                      <div
                        className={`p-1 rounded-full ${darkMode ? "bg-slate-900" : "bg-slate-50"
                          }`}
                      >
                        <div
                          className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold
        ${darkMode
                              ? active
                                ? "bg-gradient-to-br from-amber-200 to-amber-400 text-slate-900 shadow-md shadow-amber-400/30"
                                : "bg-slate-700/80 text-slate-300 border border-slate-600 group-hover:border-amber-300/50"
                              : active
                                ? "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-800 shadow-md shadow-amber-400/40"
                                : "bg-slate-200 text-slate-600 border border-slate-300 group-hover:border-amber-400/50"
                            }`}
                        >
                          {i + 1}
                        </div>
                      </div>
                    </div>

                    <div className="ml-3.5 lg:ml-4">
                      <div className="flex justify-between mb-2 items-start">
                        <h3
                          className={`font-semibold text-sm lg:text-base leading-tight flex-1
                            ${darkMode
                              ? active
                                ? "text-amber-100"
                                : "text-white"
                              : active
                                ? "text-amber-600"
                                : "text-slate-800"
                            }`}
                        >
                          {ch.title}
                        </h3>
                        <span
                          className={`ml-2.5 px-2 py-0.5 rounded-full text-[10px] lg:text-xs font-medium
                            ${darkMode
                              ? active
                                ? "bg-amber-200/20 text-amber-300"
                                : "bg-slate-700 text-slate-300"
                              : active
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {progress}%
                        </span>
                      </div>

                      <p
                        className={`text-xs lg:text-sm mb-2.5 lg:mb-3 leading-relaxed
                          ${darkMode
                            ? active
                              ? "text-slate-200"
                              : "text-slate-400"
                            : active
                              ? "text-slate-700"
                              : "text-slate-500"
                          }`}
                      >
                        {ch.description}
                      </p>

                      <div
                        className={`${darkMode
                            ? active
                              ? "bg-gradient-to-br from-slate-500 to-slate-600"
                              : "bg-gradient-to-br from-slate-600 to-slate-700"
                            : "bg-slate-200"
                          } w-full rounded-full h-1.5 lg:h-2 overflow-hidden`}
                      >
                        <div
                          style={{ width: `${progress}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${active
                              ? darkMode
                                ? "bg-amber-400"
                                : "bg-amber-500"
                              : darkMode
                                ? "bg-slate-500"
                                : "bg-amber-300"
                            }`}
                        />
                      </div>

                      <div
                        className={`mt-2 text-[11px] lg:text-xs flex items-center gap-1 ${darkMode
                            ? active
                              ? "text-slate-200"
                              : "text-slate-400"
                            : "text-slate-500"
                          }`}
                      >
                        <Circle className="w-3 h-3" />
                        {ch.questions?.length || 0} câu hỏi
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`shrink-0 border-t px-4 lg:px-6 py-4 ${footerWrap}`}>
          <button
            type="button"
            onClick={handleOpenTest}
            className={`w-full h-12 rounded-xl border flex items-center justify-between px-3 transition-all hover:scale-[1.01] ${footerBtn}`}
            aria-label="Mở bài kiểm tra"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 grid place-items-center border border-amber-300/20">
                <AlarmClock className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Kiểm tra</div>
                <div className={`text-xs ${footerSub}`}>
                  Tạo bài thi theo số câu / hẹn giờ
                </div>
              </div>
            </div>

            <div className="text-xs px-2 py-1 rounded-lg bg-amber-400/15 border border-amber-300/20 text-amber-200">
              Start
            </div>
          </button>
        </div>
      </aside>
      <TestSetupModal
        open={openTestSetup}
        onClose={() => setOpenTestSetup(false)}
        onStart={(cfg) => {
          // cfg là object modal trả về (chapterIndex, numQuestions, mode, withTimer, minutes, ...)
          setOpenTestSetup(false);

          // đóng drawer/sidebar mobile sau khi user bấm Start
          handleClose();

          // parent handle chuyển trang / mở trang test
          onOpenTest?.(cfg);
        }}
        totalQuestions={totalQuestions}
        chapters={chapters}
        activeChapter={activeChapter}
        onPickChapter={(ci) => {
          setActiveChapter(ci);
          setCurrentQuestionIndex(0);
        }}
      />

      {/* Modal Tip */}
      <TipModal
        open={showTip}
        onClose={() => setShowTip(false)}
        darkMode={darkMode}
      />
    </>
  );
}
