// src/components/TestSetupModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  Zap,
  Shuffle,
  ShieldCheck,
  Volume2,
  Clock3,
  AlarmClock,
  CheckCircle2,
  CheckCircle,
  X,
  HelpCircle,
  Layers,
  FileQuestion,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---------- Anim variants ---------- */
const fadeContainer = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

/* ---------- Helpers (dark-only) ---------- */
const Backdrop = ({ onClick }) => (
  <motion.div
    onClick={onClick}
    className="fixed inset-0 z-[98] bg-black/60"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
);

// Tooltip màu xám rõ ràng
const TooltipBubble = ({ show, children, className = "" }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        role="tooltip"
        className={`absolute top-full mt-1 left-0 z-10 whitespace-nowrap
          rounded-md p-1 text-[12px] font-medium
          bg-amber-100 text-slate-700 shadow-2xl ring-1 ring-slate-500
          ${className}`}
      >
        <span
          className="absolute -top-1 left-3 w-1.5 h-1.5 rotate-45
                     bg-amber-100 ring-1 ring-slate-500"
        />
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Radio card (dark-only)
const Radio = ({ name, value, checked, onChange, label, desc }) => (
  <label
    className={`flex items-start gap-3 p-2 rounded-md cursor-pointer border transition-colors
      ${
        checked
          ? "border-amber-300/60 bg-amber-300/10"
          : "border-slate-600 bg-transparent"
      }
      hover:bg-slate-700/50`}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="mt-1 accent-amber-500"
    />
    <div>
      <div className="text-sm font-medium text-slate-100">{label}</div>
      {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
    </div>
  </label>
);

// Switch (dark-only, cố định chiều cao/không nảy UI)
const Switch = ({ checked, onChange, label, icon: Icon }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-full flex items-center justify-between px-3 h-10 rounded-lg border transition
      ${
        checked
          ? "border-amber-300/60 bg-amber-300/10"
          : "border-slate-600 bg-transparent"
      }`}
  >
    <div className="flex items-center gap-2 text-sm text-slate-100">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
    <span
      className={`shrink-0 inline-flex h-5 w-10 items-center rounded-full px-0.5 transition-colors
        ${checked ? "bg-amber-400" : "bg-slate-500"}`}
      aria-pressed={checked}
      role="switch"
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-out
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </span>
  </button>
);

/* ---------- Main Modal (dark-only) ---------- */
export default function TestSetupModal({
  open,
  onClose,
  onStart,
  totalQuestions = 10,
  chapters = [],
  activeChapter = 0,
  onPickChapter,
}) {
  const maxQ = Math.max(1, totalQuestions);

  // Required selections
  const [mode, setMode] = useState(null); // OFF (chưa chọn)
  const [modeTouched, setModeTouched] = useState(false);

  const [num, setNum] = useState(""); // OFF (trống)
  const [numTouched, setNumTouched] = useState(false);

  // Timer - OFF mặc định
  const presetMins = [5, 10, 15, 20];
  const [withTimer, setWithTimer] = useState(false); // OFF khi mở modal
  const [mins, setMins] = useState(null);
  const [custom, setCustom] = useState("");
  const [timerTouched, setTimerTouched] = useState(true);
  // Giải thích: OFF là một lựa chọn hợp lệ => đánh dấu đã "xác nhận" trạng thái thời gian
  // để không bắt user phải bật/tắt lại. Nếu bạn muốn bắt buộc tương tác, đổi true -> false.

  // Optional toggles — OFF mặc định
  const [shuffle, setShuffle] = useState(false);
  const [strict, setStrict] = useState(false);
  const [sound, setSound] = useState(false);
  const [revealAfterEach, setRevealAfterEach] = useState(false);

  // Chapter dropdown
  const [chapterIndex, setChapterIndex] = useState(
    Number.isFinite(activeChapter) ? activeChapter : 0
  );
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!dropOpen) return;
    const onDocMouseDown = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown, true);
    return () =>
      document.removeEventListener("mousedown", onDocMouseDown, true);
  }, [dropOpen]);

  // Derived
  const numValid = useMemo(() => {
    const n = Number(num);
    return Number.isFinite(n) && n >= 1 && n <= maxQ;
  }, [num, maxQ]);

  const minutesFromCustom = useMemo(() => {
    const c = Number(custom);
    if (!custom) return null;
    if (!Number.isFinite(c)) return null;
    return Math.max(1, Math.min(180, c));
  }, [custom]);

  const minutesValid = useMemo(() => {
    if (!withTimer) return true; // OFF là hợp lệ
    return (mins && mins > 0) || (!!minutesFromCustom && minutesFromCustom > 0);
  }, [withTimer, mins, minutesFromCustom]);

  // Header status checks
  const reqModeOk = modeTouched && !!mode;
  const reqNumOk = numTouched && numValid;
  const reqTimerOk = timerTouched && minutesValid;

  const canStart = reqModeOk && reqNumOk && reqTimerOk;

  const finalMinutes = useMemo(() => {
    if (!withTimer) return null;
    if (minutesFromCustom) return minutesFromCustom;
    return mins || null;
  }, [withTimer, mins, minutesFromCustom]);

  const start = () => {
    if (!canStart) return;
    const cfg = {
      mode,
      numQuestions: Number(num),
      shuffle,
      strictMode: strict,
      sound,
      revealAfterEach,
      withTimer,
      minutes: finalMinutes,
      chapterIndex,
      startedAt: Date.now(),
    };
    onPickChapter?.(chapterIndex);
    onStart?.(cfg);
    onClose?.();
  };

  // Handlers (mark touched)
  const chooseMode = (m) => {
    setMode(m);
    setModeTouched(true);
  };
  const onNumChange = (e) => {
    setNum(e.target.value);
    setNumTouched(true);
  };
  const onToggleTimer = (v) => {
    setWithTimer(v);
    setTimerTouched(true);
  };
  const choosePreset = (m) => {
    setMins(m);
    setCustom("");
    setTimerTouched(true);
  };
  const onCustomMinutes = (v) => {
    setCustom(v);
    setMins(null);
    setTimerTouched(true);
  };

  // Label chương
  const chapterLabel = useMemo(() => {
    if (!chapters?.length) return "Mặc định chương hiện tại";
    const ch = chapters[chapterIndex];
    return ch
      ? `Chương ${chapterIndex + 1}: ${ch.title ?? "Không tên"}`
      : "Chọn chương";
  }, [chapters, chapterIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 top-6 z-[99] mx-auto w-[92vw] max-w-xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <motion.div
              className="bg-slate-800 text-white rounded-2xl border border-slate-600 shadow-2xl overflow-hidden flex flex-col max-h-[95svh]"
              layout
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <AlarmClock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold">
                    Thiết lập bài kiểm tra
                  </h3>

                  {/* Check status ngang hàng tiêu đề */}
                  <ul className="ml-2 sm:ml-4 hidden sm:flex items-center gap-3 text-xs text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          reqModeOk ? "text-green-500" : "text-slate-500"
                        }`}
                      />
                      Hình thức
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          reqNumOk ? "text-green-500" : "text-slate-500"
                        }`}
                      />
                      Số câu
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle
                        className={`w-4 h-4 ${
                          reqTimerOk ? "text-green-500" : "text-slate-500"
                        }`}
                      />
                      Thời gian
                    </li>
                  </ul>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className={"p-2 rounded-md hover:bg-slate-700"}
                  onClick={onClose}
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Body */}
              <motion.div
                className="px-5 py-4 space-y-5 overflow-y-auto custom-scrollbar"
                variants={fadeContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Hình thức */}
                <motion.div className="space-y-2" variants={fadeItem}>
                  <div className="text-sm font-semibold text-slate-200">
                    Hình thức
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Radio
                      name="mode"
                      value="quiz"
                      checked={mode === "quiz"}
                      onChange={chooseMode}
                      label="Trắc nghiệm"
                      desc="Chọn 1 đáp án đúng"
                    />
                    <Radio
                      name="mode"
                      value="fill"
                      checked={mode === "fill"}
                      onChange={chooseMode}
                      label="Điền đáp án"
                      desc="Nhập từ khóa đúng"
                    />
                    <Radio
                      name="mode"
                      value="mixed"
                      checked={mode === "mixed"}
                      onChange={chooseMode}
                      label="Hỗn hợp"
                      desc="Trộn quiz + điền"
                    />
                  </div>
                </motion.div>

                {/* Một hàng: Chọn chương (2/3) + Số câu (1/3) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Chọn chương (2/3) */}
                  <motion.div
                    className="space-y-2 sm:col-span-2"
                    variants={fadeItem}
                  >
                    <div className="text-sm font-semibold text-slate-200">
                      Chọn chương
                    </div>
                    <div ref={dropRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setDropOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3 h-10 rounded-lg border border-slate-600 bg-transparent text-sm focus:outline-none focus:border-amber-300/50"
                      >
                        <span className="truncate">{chapterLabel}</span>
                        {dropOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {dropOpen && (
                          <motion.ul
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 24,
                            }}
                            className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-slate-600 bg-slate-800 shadow-lg"
                          >
                            {(chapters?.length
                              ? chapters
                              : [{ title: "Chương hiện tại" }]
                            ).map((ch, idx) => {
                              const active = idx === chapterIndex;
                              return (
                                <li
                                  key={idx}
                                  onClick={() => {
                                    setChapterIndex(idx);
                                    setDropOpen(false);
                                    onPickChapter?.(idx);
                                  }}
                                  className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-700/50 ${
                                    active
                                      ? "bg-amber-300/10 text-white"
                                      : "text-slate-200"
                                  }`}
                                >
                                  <span className="shrink-0 text-xs font-semibold w-10 text-amber-300">
                                    #{idx + 1}
                                  </span>
                                  <span className="truncate">{`Chương ${
                                    idx + 1
                                  }: ${ch.title ?? "Không tên"}`}</span>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Số câu (1/3) */}
                  <motion.div
                    className="space-y-2 sm:col-span-1"
                    variants={fadeItem}
                  >
                    <div className="text-sm font-semibold text-slate-200">
                      Số câu
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-3 rounded-lg border border-slate-600 px-3 h-10 focus-within:border-amber-300/50">
                        <Layers className="w-5 h-5 text-amber-400" />
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={maxQ}
                          value={num}
                          onChange={onNumChange}
                          placeholder={`1…${maxQ}`}
                          aria-invalid={numTouched && !numValid}
                          className="w-16 bg-transparent text-white placeholder:text-slate-500 focus:outline-none underline decoration-slate-500/60 underline-offset-2"
                        />
                        <div className="text-sm text-slate-400">/ {maxQ}</div>
                      </div>

                      {/* Tooltip lỗi số câu */}
                      <TooltipBubble show={numTouched && !numValid}>
                        Vui lòng nhập số từ 1 đến {maxQ}.
                      </TooltipBubble>
                      <span className="sr-only" id="numHint">
                        Nhập số hợp lệ trong khoảng 1 đến {maxQ}.
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Thời gian */}
                <motion.div className="space-y-2" variants={fadeItem}>
                  <div className="text-sm font-semibold text-slate-200">
                    Thời gian
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Switch
                      checked={withTimer}
                      onChange={onToggleTimer}
                      label="Bật hẹn giờ (đếm ngược) hoặc tắt để luyện tập"
                      icon={Timer}
                    />
                    {withTimer ? (
                      <>
                        <div className="relative">
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {presetMins.map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => choosePreset(m)}
                                className={`min-w-[48px] h-10 px-2 rounded-lg border text-sm text-center
                                  ${
                                    m === mins && !custom
                                      ? "border-amber-300/60 bg-amber-300/10"
                                      : "border-slate-600 bg-transparent hover:bg-slate-700/50"
                                  }`}
                              >
                                <div className="flex items-center gap-1.5 justify-center">
                                  <Clock3 className="w-4 h-4" /> {m}’
                                </div>
                              </button>
                            ))}
                            <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Tùy chọn"
                                value={custom}
                                onChange={(e) =>
                                  onCustomMinutes(e.target.value)
                                }
                                aria-invalid={timerTouched && !minutesValid}
                                className="w-full h-10 px-3 rounded-lg border border-slate-600 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-300/50"
                              />
                              <span className="text-sm text-slate-400">
                                phút
                              </span>
                            </div>
                          </div>

                          {/* Tooltip lỗi thời gian */}
                          <TooltipBubble show={timerTouched && !minutesValid}>
                            Chọn preset hoặc nhập số phút &gt; 0.
                          </TooltipBubble>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <HelpCircle className="w-4 h-4" /> Chế độ luyện tập
                        (không giới hạn thời gian).
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Tùy chọn nhanh */}
                <motion.div className="space-y-2" variants={fadeItem}>
                  <div className="text-sm font-semibold text-slate-200">
                    Tùy chọn nhanh
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Switch
                      checked={shuffle}
                      onChange={setShuffle}
                      label="Trộn thứ tự câu hỏi"
                      icon={Shuffle}
                    />
                    <Switch
                      checked={strict}
                      onChange={setStrict}
                      label="Chế độ nghiêm ngặt"
                      icon={ShieldCheck}
                    />
                    <Switch
                      checked={sound}
                      onChange={setSound}
                      label="Âm thanh khi hết giờ"
                      icon={Volume2}
                    />
                    <Switch
                      checked={revealAfterEach}
                      onChange={setRevealAfterEach}
                      label="Hiện đáp án sau mỗi câu"
                      icon={FileQuestion}
                    />
                  </div>
                </motion.div>

                {/* Tùy chọn nâng cao — chevron sát chữ & xoay khi mở */}
                <motion.div variants={fadeItem} className="pt-1">
                  <details className="group">
                    <summary className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300 transition-colors duration-200">
                      <span className="flex items-center gap-1.5 hover:text-amber-200 transition-colors duration-200">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">Tùy chọn nâng cao</span>
                        <ChevronDown className="mt-1 mr-1 w-4 h-4 transition-transform group-open:rotate-180" />
                      </span>
                    </summary>
                    <div className="mt-3 p-3 rounded-lg border border-slate-600">
                      <div className="text-xs text-slate-300">
                        Có thể bổ sung <b>đồng hồ kiểu vòng</b>,{" "}
                        <b>ẩn câu dài</b>, <b>khóa sao chép</b>, v.v. khi bạn
                        cần.
                      </div>
                    </div>
                  </details>
                </motion.div>
              </motion.div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm border border-slate-600 hover:bg-slate-700"
                >
                  Hủy
                </button>

                <button
                  onClick={start}
                  disabled={!canStart}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition
                    ${
                      canStart
                        ? "bg-amber-400 text-slate-900 shadow-md hover:brightness-95"
                        : "bg-slate-600 text-slate-300 cursor-not-allowed"
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bắt đầu
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
