import { useEffect, useRef, useState } from "react";
import sections from "./data";
import { Link } from "react-router-dom";

export default function MarxismPhilosophyPage() {
  const steps = sections.length;
  const [step, setStep] = useState(0);

  const [isTransitioning, setIsTransitioning] = useState(false);

  // điều khiển hiển thị
  const [showTopHint, setShowTopHint] = useState(false);
  const [showNextChip, setShowNextChip] = useState(false);

  // nội dung hiển thị (tách khỏi step)
  const [topHintText, setTopHintText] = useState("");
  const [chipProgress, setChipProgress] = useState("");
  const [chipNextTitle, setChipNextTitle] = useState("");

  // KHÓA điều hướng cho tới khi text xong
  const [canNavigate, setCanNavigate] = useState(false);

  const scrollTargetRef = useRef(0);
  const scrollPosRef = useRef(0);
  const lastScrollTime = useRef(0);

  // chống stale closure
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // token mỗi lần điều hướng
  const navTokenRef = useRef(0);

  // gom toàn bộ timer
  const timersRef = useRef({
    topShow: null,
    topHide: null,
    bottomShow: null,
    bottomHide: null,
    unlock: null,
  });

  const nextIndex = (step + 1) % steps;

  // Helper: dọn tất cả timer
  const clearAllTimers = () => {
    Object.keys(timersRef.current).forEach((k) => {
      if (timersRef.current[k]) {
        clearTimeout(timersRef.current[k]);
        timersRef.current[k] = null;
      }
    });
  };

  /* ---------------- RAF: nội suy + snap ---------------- */
  useEffect(() => {
    let rafId;
    const animate = () => {
      const diff = scrollTargetRef.current - scrollPosRef.current;
      scrollPosRef.current += diff * 0.08;
      if (Math.abs(diff) < 0.002)
        scrollPosRef.current = scrollTargetRef.current;

      const newStep = Math.round(scrollPosRef.current);
      if (newStep !== stepRef.current) setStep(newStep);

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* -------- Khi đã TỚI step đích: hẹn lịch hint/chip + mở khóa điều hướng -------- */
  useEffect(() => {
    const arrived = step === Math.round(scrollTargetRef.current);
    if (!arrived) return;

    clearAllTimers();
    const tokenAtSchedule = navTokenRef.current;

    // Tính thời điểm text hoàn tất cho step hiện tại
    // thường: quote (1100 + 1200) = 2300ms; step cuối có CTA (1300 + 1200) = 2500ms
    const isLast = step === steps - 1;
    const TEXT_DONE_MS = (isLast ? 2500 : 2300) + 100; // +100ms buffer
    const TOP_HINT_DELAY = 600; // hint bật nhẹ nhàng
    const TOP_HINT_SHOW_MS = 1400; // hint tồn tại 1.4s
    const CHIP_DELAY = TEXT_DONE_MS + 100; // chip sau khi text xong
    const CHIP_SHOW_MS = 2200; // chip tồn tại 2.2s

    // Mở khóa điều hướng khi text xong
    timersRef.current.unlock = setTimeout(() => {
      if (tokenAtSchedule !== navTokenRef.current) return;
      setCanNavigate(true);
    }, TEXT_DONE_MS);

    // Hint trên
    timersRef.current.topShow = setTimeout(() => {
      if (tokenAtSchedule !== navTokenRef.current) return;
      setTopHintText(
        sections[step]?.hint ?? "Space/PageDown để tiếp • PageUp để lùi"
      );
      setShowTopHint(true);

      timersRef.current.topHide = setTimeout(() => {
        if (tokenAtSchedule !== navTokenRef.current) return;
        setShowTopHint(false);
      }, TOP_HINT_SHOW_MS);
    }, TOP_HINT_DELAY);

    // Chip đáy (từ step >= 1)
    if (step >= 1) {
      timersRef.current.bottomShow = setTimeout(() => {
        if (tokenAtSchedule !== navTokenRef.current) return;

        setChipProgress(`Phần ${step + 1}/${steps}`);
        setChipNextTitle(sections[(step + 1) % steps]?.title ?? "");
        setShowNextChip(true);

        timersRef.current.bottomHide = setTimeout(() => {
          if (tokenAtSchedule !== navTokenRef.current) return;
          setShowNextChip(false);
        }, CHIP_SHOW_MS);
      }, CHIP_DELAY);
    } else {
      setShowNextChip(false);
    }

    return clearAllTimers;
  }, [step, steps]);

  /* ---------------- tiện ích đổi step ------------------ */
  const goToStep = (newTarget) => {
    if (isTransitioning || steps <= 0) return;

    // chặn điều hướng nếu text chưa hoàn tất
    if (!canNavigate) return;

    // chuẩn hóa vòng lặp
    if (newTarget >= steps) newTarget = 0;
    if (newTarget < 0) newTarget = steps - 1;

    // bắt đầu điều hướng: tăng token, ẩn ngay UI & khóa điều hướng
    navTokenRef.current += 1;
    setShowTopHint(false);
    setShowNextChip(false);
    setCanNavigate(false);
    clearAllTimers();

    scrollTargetRef.current = newTarget;
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  /* ---------------- scroll + keyboard ---------------------- */
  useEffect(() => {
    const handleWheel = (e) => {
      if (isTransitioning || !canNavigate) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 280) return;
      lastScrollTime.current = now;
      goToStep(scrollTargetRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    const handleKey = (e) => {
      if (isTransitioning || !canNavigate) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goToStep(scrollTargetRef.current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goToStep(scrollTargetRef.current - 1);
      }
      if (e.key === "Home") {
        e.preventDefault();
        goToStep(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        goToStep(steps - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isTransitioning, steps, canNavigate]);

  /* ---------------- click toàn màn ------------------------- */
  useEffect(() => {
    const INTERACTIVE_SEL =
      "a,button,input,textarea,select,summary,[role='button'],[data-nav-ignore]";

    const handlePointerDown = (e) => {
      if (isTransitioning || !canNavigate) return;

      const t = e.target;
      if (t.closest("header") || t.closest(INTERACTIVE_SEL)) return;

      const sel = window.getSelection?.();
      if (sel && !sel.isCollapsed) return;

      if (scrollTargetRef.current === steps - 1) goToStep(0);
      else goToStep(scrollTargetRef.current + 1);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [isTransitioning, steps, canNavigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* ------------------------- Top hint ------------------------- */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-600">
        <div
          className={`px-3 py-1 rounded border border-white/10 bg-black/40 text-white/85
                      text-[12px] tracking-wide backdrop-blur transition-all duration-600
                      ${
                        showTopHint
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-1"
                      }`}
        >
          {topHintText}
        </div>
      </div>

      {/* -------------------- Background Layers --------------------- */}
      <div className="absolute inset-0">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
              i === step ? "opacity-100 scale-100" : "opacity-0 scale-102"
            }`}
            style={{ zIndex: i === step ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center animate-kenburns"
              style={{
                backgroundImage: `url(${section.backgroundImage})`,
                filter: "brightness(0.65) contrast(1.15) saturate(1.15)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/60" />
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0 bg-repeat"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm0-20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm20 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm0 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* --------------------- Content Sections --------------------- */}
      <div className="relative z-10 h-full">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1200 ease-out ${
              i === step
                ? "opacity-100 translate-y-0 scale-100"
                : i < step
                ? "opacity-0 -translate-y-16 scale-98"
                : "opacity-0 translate-y-16 scale-98"
            }`}
            style={{ zIndex: i === step ? 20 : 10 }}
          >
            <div className="text-center max-w-5xl mx-auto px-8 ">
              {/* header */}
              <div
                className={`mb-6 transition-all duration-1200 delay-100 ${
                  i === step
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
                <div className="text-amber-400 text-sm font-medium tracking-[0.25em] uppercase">
                  Phần {i + 1}
                </div>
              </div>

              {/* title */}
              <h1
                className={`text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-1200 delay-300 ${
                  i === step
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{
                  textShadow: "3px 3px 12px rgba(0,0,0,0.8)",
                  lineHeight: "1.1",
                }}
              >
                {section.title}
              </h1>

              {/* subtitle */}
              <h2
                className={`text-xl md:text-2xl text-amber-300 mb-7 font-light transition-all duration-1200 delay-500 ${
                  i === step
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                {section.subtitle}
              </h2>

              {/* divider */}
              <div
                className={`flex items-center justify-center mb-7 transition-all duration-1200 delay-700 ${
                  i === step
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <div className="w-8 h-px bg-amber-400"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full mx-4 animate-pulse"></div>
                <div className="w-8 h-px bg-amber-400"></div>
              </div>

              {/* description */}
              <p
                className={`text-lg md:text-xl text-gray-100 leading-relaxed max-w-4xl mx-auto mb-7 transition-all duration-1200 delay-900 ${
                  i === step
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                {section.description}
              </p>

              {/* quote */}
              <div
                className={`max-w-3xl mx-auto mb-7 transition-all duration-1200 delay-1100 ${
                  i === step
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
              >
                <blockquote className="relative">
                  <div className="text-6xl text-amber-400/30 absolute -top-4 -left-4 font-serif">
                    "
                  </div>
                  <p className="text-base md:text-lg text-amber-200 leading-relaxed pl-8 pr-8 italic">
                    {section.quote}
                  </p>
                  <footer className="mt-4 text-amber-300 text-sm font-medium">
                    — {section.author}
                  </footer>
                </blockquote>
              </div>

              {/* CTA ở slide cuối */}
              {step === steps - 1 && (
                <div
                  data-nav-ignore
                  className={`mt-12 md:mt-16 transition-all duration-1200 delay-1300 flex justify-center ${
                    i === step
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  }`}
                >
                  <Link to="/storybook">
                    <button className="group relative bg-gradient-to-r from-amber-600 to-amber-500 border-2 border-amber-400 text-white px-4 py-2 md:py-2 rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:from-amber-600/90 hover:to-amber-500/90">
                      <span className="relative z-10 inline-block transition-all duration-500 group-hover:pr-4">
                        Khám phá học thuyết sâu hơn
                        <span className="absolute opacity-0 group-hover:opacity-100 right-0 top-0 transform translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-white/90">
                          &raquo;
                        </span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full pointer-events-none"></div>
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"></div>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Chip “Tiếp theo …” (đáy giữa) ------------- */}
      <div
        data-nav-ignore
        onClick={(e) => e.stopPropagation()}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-700
        ${step >= 1 ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`flex items-center gap-3 px-4 py-1 rounded-full
                      border border-white/12 bg-black/55 backdrop-blur
                      shadow-[0_8px_24px_rgba(0,0,0,.35)]
                      transition-all duration-700
                      ${
                        showNextChip
                          ? "translate-y-0 opacity-100"
                          : "translate-y-2 opacity-0"
                      }`}
        >
          <span className="text-xs text-amber-200">{chipProgress}</span>
          <span className="text-white/40">•</span>
          <span className="text-sm text-white/90 line-clamp-1 max-w-[52vw] md:max-w-none">
            Tiếp theo: {chipNextTitle}
          </span>

          <button
            onClick={() => canNavigate && goToStep(nextIndex)}
            disabled={!canNavigate}
            className={`px-3 py-0.5 rounded-full border border-amber-400/50 text-amber-100 transition
                        ${
                          canNavigate
                            ? "hover:bg-amber-400/10"
                            : "opacity-60 cursor-not-allowed"
                        }`}
          >
            Tiếp
          </button>
        </div>
      </div>

      {/* -------------------- Dot nav (bên phải) -------------------- */}
      <div
        data-nav-ignore
        onClick={(e) => e.stopPropagation()}
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40"
      >
        <ul className="flex flex-col gap-3">
          {sections.map((s, idx) => (
            <li key={idx} className="relative group">
              <button
                onClick={() => canNavigate && goToStep(idx)}
                disabled={!canNavigate}
                aria-label={`Đi tới phần ${idx + 1}`}
                className={`w-3 h-3 rounded-full border transition-all
                  ${
                    idx === step
                      ? "scale-125 bg-amber-400 border-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,.2)]"
                      : "bg-white/30 border-white/40 hover:bg-white/60"
                  }
                  ${!canNavigate ? "opacity-60 cursor-not-allowed" : ""}`}
              />
              <span
                className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2
                           opacity-0 group-hover:opacity-100 transition
                           text-xs text-white/85 bg-black/60 border border-white/10
                           rounded px-2 py-1 whitespace-nowrap backdrop-blur"
              >
                {s.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* hint cuộn: chỉ hiện ở step === 0 */}
      <div
        className={`fixed bottom-16 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${
          step === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-white text-center">
          <div className="animate-bounce text-2xl mb-0">↓</div>
          <p className="text-sm opacity-80">Cuộn để khám phá</p>
        </div>
      </div>

      {/* watermark & depth overlay */}
      <div className="fixed bottom-3 left-3 z-30 opacity-60">
        <div className="text-white/60 text-xs">
          Phép Biện chứng Duy vật • Nam và Lựa chọn trước Bình minh Số
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
      </div>
    </div>
  );
}
