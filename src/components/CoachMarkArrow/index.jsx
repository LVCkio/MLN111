// src/components/CoachMarkArrow.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";

/**
 * CoachMarkArrow
 * - Hiện bong bóng + mũi tên trỏ vào phần tử anchor (bằng id)
 * - Tự động mở nếu sessionStorage["coachmark:study-tips"] === "1"
 */
export default function CoachMarkArrow({
  anchorId,
  text = "Mẹo học ghi nhớ ở đây!",
  darkMode = false,
  onClose, // optional
}) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Kiểm tra "ý định" mở coachmark từ trang trước
  useEffect(() => {
    if (sessionStorage.getItem("coachmark:study-tips") === "1") {
      sessionStorage.removeItem("coachmark:study-tips");
      setVisible(true);
    }
  }, []);

  // Tính vị trí dựa theo anchor
  const updatePosition = () => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    // đặt bong bóng ngay dưới, lệch phải một chút
    setPos({
      top: r.bottom + 10 + window.scrollY,
      left: Math.min(r.left + window.scrollX, window.innerWidth - 320), // tránh tràn
    });
  };

  useLayoutEffect(() => {
    if (!visible) return;
    updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* Bubble */}
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute max-w-[300px] pointer-events-auto rounded-xl border shadow-xl p-3 ${
          darkMode
            ? "bg-slate-800 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
        style={{ top: pos.top, left: pos.left }}
      >
        {/* Arrow (nhỏ hình vuông xoay 45deg) */}
        <div
          className={`absolute -top-2 left-6 w-3 h-3 rotate-45 ${
            darkMode ? "bg-slate-800 border-l border-t border-slate-700" : "bg-white border-l border-t border-slate-200"
          }`}
        />
        <div className="text-sm leading-relaxed">{text}</div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleClose}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
