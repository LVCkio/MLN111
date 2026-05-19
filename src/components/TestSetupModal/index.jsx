import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Play, ChevronDown } from "lucide-react";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const cx = (...arr) => arr.filter(Boolean).join(" ");

const EASE = [0.22, 1, 0.36, 1]; // easeOutCubic-ish
const reduceSpring = { type: "spring", stiffness: 520, damping: 34 };

// Tạo/ lấy modal-root và đảm bảo nó nằm cuối body
function getOrCreateModalRoot() {
  if (typeof document === "undefined") return null;
  let el = document.getElementById("modal-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "modal-root";
    document.body.appendChild(el);
  } else {
    // đảm bảo nó là phần tử cuối cùng trong body để thắng DOM order
    if (el.parentNode === document.body) {
      document.body.appendChild(el);
    }
  }
  return el;
}

function FocusRing({ darkMode, active }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-2xl"
      initial={false}
      animate={{
        boxShadow: active
          ? darkMode
            ? "0 0 0 1px rgba(251,191,36,0.16), 0 14px 38px rgba(0,0,0,0.40)"
            : "0 0 0 1px rgba(245,158,11,0.18), 0 12px 28px rgba(15,23,42,0.10)"
          : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.18 }}
    />
  );
}

// ====== UI blocks ======
function FieldShell({
  label,
  hint,
  darkMode,
  isActive,
  children,
  className = "",
}) {
  return (
    <motion.div
      className={cx(
        "relative rounded-2xl border p-3 sm:p-4 transition-colors",
        darkMode
          ? "border-slate-700/80 bg-slate-800/70 hover:bg-slate-800/85"
          : "border-slate-200 bg-white hover:bg-slate-50/60",
        className
      )}
    >
      <FocusRing darkMode={darkMode} active={isActive} />

      <div className="relative flex items-start justify-between gap-3 mb-2">
        <div
          className={cx(
            "text-sm font-semibold",
            darkMode ? "text-slate-100" : "text-slate-800"
          )}
        >
          {label}
        </div>
        {hint ? (
          <div
            className={cx(
              "text-xs",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}
          >
            {hint}
          </div>
        ) : null}
      </div>

      <div className="relative">{children}</div>
    </motion.div>
  );
}

function SelectLike({ darkMode, value, onChange, onFocus, onBlur, children }) {
  return (
    <motion.div className="relative" initial={false}>
      <select
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cx(
          "h-11 w-full appearance-none rounded-xl border px-3 pr-10 text-sm outline-none transition-all",
          darkMode
            ? "border-slate-700 bg-slate-700/60 text-slate-100 focus:border-amber-300/35 focus:ring-1 focus:ring-amber-300/10"
            : "border-slate-200 bg-white text-slate-900 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-400/10"
        )}
      >
        {children}
      </select>

      <motion.div
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center"
        initial={false}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.18 }}
      >
        <ChevronDown
          className={cx(
            "h-4 w-4",
            darkMode ? "text-slate-300" : "text-slate-500"
          )}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: darkMode ? 0.08 : 0.04 }}
        transition={{ duration: 0.2 }}
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 65%)",
        }}
      />
    </motion.div>
  );
}

function ToggleCard({ darkMode, title, desc, checked, onChange }) {
  return (
    <motion.label
      className={cx(
        "group relative flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 sm:px-4 cursor-pointer",
        darkMode
          ? "border-slate-700/80 bg-slate-800/70 hover:bg-slate-800/85"
          : "border-slate-200 bg-white hover:bg-slate-50/60"
      )}
    >
      <div className="relative">
        <div
          className={cx(
            "text-sm font-semibold",
            darkMode ? "text-slate-100" : "text-slate-800"
          )}
        >
          {title}
        </div>
        {desc ? (
          <div
            className={cx(
              "text-xs mt-0.5",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}
          >
            {desc}
          </div>
        ) : null}
      </div>

      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className={cx(
            "h-6 w-11 rounded-full border transition-all",
            darkMode ? "border-slate-700" : "border-slate-200",
            "peer-focus:ring-1 peer-focus:ring-amber-400/10",
            checked
              ? darkMode
                ? "bg-amber-300/90"
                : "bg-amber-400"
              : darkMode
              ? "bg-slate-700/80"
              : "bg-slate-200"
          )}
        />
        <motion.span
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          transition={reduceSpring}
        />
      </span>
    </motion.label>
  );
}

export default function TestSetupModal({
  open,
  onClose,
  onStart,
  totalQuestions = 0,
  chapters = [],
  activeChapter = 0,
  darkMode: darkModeProp,
  topicTitle = "Tôn giáo ở Việt Nam và chính sách tôn giáo hiện nay",
  topicSubtitle = "Ôn tập đặc điểm tôn giáo, chính sách hiện hành và công tác tôn giáo.",
}) {
  const reduceMotion = useReducedMotion();
  const darkMode = darkModeProp ?? true;

  // ===== Portal target =====
  const [portalEl, setPortalEl] = useState(null);
  useEffect(() => {
    setPortalEl(getOrCreateModalRoot());
  }, []);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const fn = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  const totalAll = useMemo(() => {
    if (totalQuestions && totalQuestions > 0) return totalQuestions;
    return (chapters || []).reduce(
      (sum, ch) => sum + (ch?.questions?.length || 0),
      0
    );
  }, [totalQuestions, chapters]);

  const maxTotal = Math.max(1, totalAll);
  const [focused, setFocused] = useState("");

  const [form, setForm] = useState(() => ({
    numQuestions: Math.min(10, maxTotal),
    mode: "quiz",
    shuffle: true,
    withTimer: true,
    minutes: 10,
    strictMode: false,
    revealAfterEach: false,
    sound: true,
  }));

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({
      ...prev,
      numQuestions: clamp(Number(prev.numQuestions ?? 10), 1, maxTotal),
    }));
  }, [open, maxTotal]);

  const patch = (p) => setForm((s) => ({ ...s, ...p }));

  const handleStart = () => {
    const withTimer = !!form.withTimer;
    onStart?.({
      chapterIndex: activeChapter,
      numQuestions: clamp(Number(form.numQuestions || 1), 1, maxTotal),
      mode: form.mode,
      shuffle: !!form.shuffle,
      withTimer,
      minutes: withTimer ? clamp(Number(form.minutes || 1), 1, 300) : 0,
      strictMode: !!form.strictMode,
      revealAfterEach: !!form.revealAfterEach,
      sound: !!form.sound,
    });
  };

  const card = darkMode
    ? "bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 text-white border-slate-700 shadow-2xl"
    : "bg-white text-slate-900 border-slate-200 shadow-xl";

  const sub = darkMode ? "text-slate-300/80" : "text-slate-600";
  const divider = darkMode ? "border-slate-700/70" : "border-slate-200";

  const panelVariants = {
    hidden: { y: 18, scale: 0.985, opacity: 0 },
    show: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0.15 }
        : { type: "spring", stiffness: 420, damping: 32 },
    },
    exit: { y: 14, scale: 0.99, opacity: 0, transition: { duration: 0.14 } },
  };

  const bodyContainer = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? {}
        : { staggerChildren: 0.05, delayChildren: 0.03 },
    },
  };
  const bodyItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
  };

  // Nếu chưa mount portal target (SSR / hydrate), không render
  if (!portalEl) return null;

  const modalUI = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2147483647] flex items-start justify-center px-3 pb-4 pt-10 sm:pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // isolation giúp nội bộ modal không bị ảnh hưởng lẫn nhau, nhưng quan trọng nhất vẫn là Portal
          style={{ isolation: "isolate" }}
        >
          {/* Overlay (đặt z thấp hơn panel) */}
          <motion.button
            type="button"
            className={cx(
              "absolute inset-0 z-0",
              darkMode ? "bg-slate-950/60" : "bg-black/40"
            )}
            style={{ backdropFilter: "blur(12px)" }}
            aria-label="Đóng"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cx(
              "relative z-10 w-[96vw] sm:w-[94vw] max-w-2xl overflow-hidden rounded-xl border",
              "max-h-[92svh] flex flex-col",
              card
            )}
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Header */}
            <motion.div
              className={cx(
                "px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b",
                divider
              )}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <div className="text-lg sm:text-xl font-extrabold tracking-tight">
                      Thiết lập bài kiểm tra
                    </div>
                    <div className={cx("text-sm", sub)}>
                      (Chọn số câu, chế độ và thời gian)
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className={cx(
                    "p-2 rounded-lg",
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  )}
                  onClick={onClose}
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Topic banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: EASE }}
              className={cx(
                "border-b px-4 sm:px-6 py-3",
                darkMode
                  ? "border-slate-700/70 bg-slate-800/55"
                  : "border-slate-100 bg-slate-50/70"
              )}
            >
              <div
                className={cx(
                  "text-sm font-bold leading-snug",
                  darkMode ? "text-white" : "text-slate-900"
                )}
              >
                {topicTitle}
              </div>
              <div
                className={cx(
                  "text-xs mt-1 leading-snug",
                  darkMode ? "text-slate-300/80" : "text-slate-600"
                )}
              >
                {topicSubtitle}
              </div>
            </motion.div>

            {/* Body */}
            <motion.div
              variants={bodyContainer}
              initial="hidden"
              animate="show"
              className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4 overflow-y-auto"
            >
              <motion.div
                variants={bodyItem}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <FieldShell
                  label="Chế độ"
                  darkMode={darkMode}
                  isActive={focused === "mode"}
                >
                  <SelectLike
                    darkMode={darkMode}
                    value={form.mode}
                    onChange={(e) => patch({ mode: e.target.value })}
                    onFocus={() => setFocused("mode")}
                    onBlur={() => setFocused("")}
                  >
                    <option value="quiz" className="bg-slate-800 text-white">
                      Trắc nghiệm
                    </option>
                    <option value="fill" className="bg-slate-800 text-white">
                      Điền đáp án
                    </option>
                    <option value="mixed" className="bg-slate-800 text-white">
                      Hỗn hợp
                    </option>
                  </SelectLike>
                  <div className={cx("text-xs mt-2", sub)}>
                    Lựa chọn chế độ kiểm tra
                  </div>
                </FieldShell>

                <FieldShell
                  label="Số câu"
                  hint={`Tối đa: ${maxTotal}`}
                  darkMode={darkMode}
                  isActive={focused === "num"}
                >
                  <motion.input
                    type="number"
                    min={1}
                    max={maxTotal || 80}
                    value={form.numQuestions}
                    onChange={(e) => patch({ numQuestions: e.target.value })}
                    onFocus={() => setFocused("num")}
                    onBlur={() => setFocused("")}
                    className={cx(
                      "h-11 w-full rounded-xl border px-3 text-sm outline-none transition-all",
                      darkMode
                        ? "border-slate-700 bg-slate-700/60 text-slate-100 focus:border-amber-300/35 focus:ring-1 focus:ring-amber-300/10"
                        : "border-slate-200 bg-white text-slate-900 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-400/10"
                    )}
                    whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  />
                  <div className={cx("text-xs mt-2", sub)}>
                    Tổng câu của tất cả phần
                  </div>
                </FieldShell>
              </motion.div>

              <motion.div
                variants={bodyItem}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <ToggleCard
                  darkMode={darkMode}
                  title="Trộn câu hỏi"
                  desc="Xáo trộn thứ tự câu hỏi"
                  checked={form.shuffle}
                  onChange={(v) => patch({ shuffle: v })}
                />
                <ToggleCard
                  darkMode={darkMode}
                  title="Strict"
                  desc="Khóa sửa đáp án"
                  checked={form.strictMode}
                  onChange={(v) => patch({ strictMode: v })}
                />
                <ToggleCard
                  darkMode={darkMode}
                  title="Hiện đáp án"
                  desc="Sau mỗi câu"
                  checked={form.revealAfterEach}
                  onChange={(v) => patch({ revealAfterEach: v })}
                />
                <ToggleCard
                  darkMode={darkMode}
                  title="Âm thanh hết giờ"
                  desc="Báo khi hết thời gian"
                  checked={form.sound}
                  onChange={(v) => patch({ sound: v })}
                />
              </motion.div>

              <motion.div
                variants={bodyItem}
                className={cx(
                  "rounded-3xl border p-4 sm:p-5",
                  darkMode
                    ? "border-slate-700/80 bg-slate-800/70"
                    : "border-slate-200 bg-slate-50/60"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <motion.div
                      className={cx(
                        "inline-flex items-center justify-center rounded-2xl border px-4 h-11 text-sm font-bold",
                        darkMode
                          ? "border-slate-700 bg-slate-700/55 text-slate-100"
                          : "border-slate-200 bg-white text-slate-900"
                      )}
                      whileHover={reduceMotion ? undefined : { y: -1 }}
                      transition={{ duration: 0.18, ease: EASE }}
                    >
                      Hẹn giờ
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {form.withTimer && (
                        <motion.div
                          key="minutes"
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: EASE }}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={cx(
                              "text-xs font-semibold whitespace-nowrap",
                              darkMode ? "text-slate-300" : "text-slate-600"
                            )}
                          >
                            Số phút
                          </span>

                          <motion.input
                            type="number"
                            min={1}
                            max={300}
                            value={form.minutes}
                            onChange={(e) => patch({ minutes: e.target.value })}
                            className={cx(
                              "h-11 w-28 rounded-xl border px-3 text-sm outline-none transition-all",
                              darkMode
                                ? "border-slate-700 bg-slate-700/70 text-slate-100 focus:border-amber-300/35 focus:ring-1 focus:ring-amber-300/10"
                                : "border-slate-200 bg-white text-slate-900 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-400/10"
                            )}
                            whileFocus={
                              reduceMotion ? undefined : { scale: 1.01 }
                            }
                            transition={{ duration: 0.18, ease: EASE }}
                          />

                          <span className={cx("text-xs", sub)}>1–300</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <label className="flex items-center gap-2 text-sm select-none ml-auto">
                    <input
                      type="checkbox"
                      checked={form.withTimer}
                      onChange={(e) => patch({ withTimer: e.target.checked })}
                      className="accent-amber-400"
                    />
                    <span
                      className={cx(
                        darkMode ? "text-slate-100" : "text-slate-700"
                      )}
                    >
                      Bật
                    </span>
                  </label>
                </div>

                <div className={cx("text-xs mt-2", sub)}>
                  Bật/tắt giới hạn thời gian làm bài.
                </div>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className={cx("px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t", divider)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <div className="flex items-center justify-end gap-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -1, boxShadow: "0 12px 28px rgba(0,0,0,0.35)" }
                  }
                  whileTap={{ scale: 0.98 }}
                  className={cx(
                    "px-4 h-11 rounded-xl text-sm font-semibold transition-all border",
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700/85"
                      : "bg-slate-800 border-slate-800 text-white hover:bg-slate-700"
                  )}
                >
                  Hủy
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleStart}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -2,
                          boxShadow: "0 18px 45px rgba(251,191,36,0.18)",
                          filter: "brightness(1.02)",
                        }
                  }
                  whileTap={{ scale: 0.98 }}
                  className={cx(
                    "group px-4 h-11 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all",
                    "bg-amber-300/95 text-slate-900 hover:bg-amber-400"
                  )}
                >
                  <Play className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:scale-105" />
                  Bắt đầu
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ✅ Render ra modal-root/body (thoát stacking context)
  return createPortal(modalUI, portalEl);
}
