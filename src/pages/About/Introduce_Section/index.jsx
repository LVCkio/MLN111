import React, { useEffect, useState } from "react";
import { Quote, BookOpen, Layers } from "lucide-react";
import { introSlides, concepts } from "./data";

const IntroduceSection = ({ visibleSections }) => {
  const [isVisible, setIsVisible] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoplayMs = 5000;

  const total = introSlides?.length ?? 0;
  const clampIndex = (i) => (i + total) % total;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    let start = performance.now();
    let rafId;

    const tick = (now) => {
      if (isHover) {
        start = now - (progress / 100) * autoplayMs;
      } else {
        const elapsed = now - start;
        const pct = Math.min(100, (elapsed / autoplayMs) * 100);
        setProgress(pct);
        if (pct >= 100) {
          setCurrentIndex((p) => clampIndex(p + 1));
          start = now;
          setProgress(0);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isHover, total, currentIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        setCurrentIndex((p) => clampIndex(p + 1));
        setProgress(0);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((p) => clampIndex(p - 1));
        setProgress(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const goTo = (i) => {
    setCurrentIndex(clampIndex(i));
    setProgress(0);
  };
  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const slide = introSlides[currentIndex];

  return (
    <section
      id="introduction"
      data-section
      className={`pt-16 pb-8 md:py-18 lg:pt-26 lg:pb-12 px-6 md:px-8 transition-all duration-700 ${
        visibleSections?.has?.("introduction")
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Title */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-amber-400 text-sm font-medium tracking-wider border border-amber-400/25 bg-amber-400/10">
            <BookOpen className="w-5 h-5 mr-2" />
            Khám phá phép biện chứng duy vật
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400">
            Những khái niệm, nguyên lý và quy luật cốt lõi
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[1.25fr_1.75fr] gap-10 lg:gap-14 items-center">
          {/* Left: Slideshow */}
          <div
            data-animate
            id="intro-visual"
            className={`relative transition-all duration-700 ${
              isVisible["intro-visual"] ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/10 via-purple-400/10 to-blue-400/10 rounded-3xl transform rotate-6 pointer-events-none" />

            <div className="relative group rounded-3xl overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500 border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <div className="relative">
                <img
                  src={slide?.image}
                  alt={slide?.title}
                  key={currentIndex}
                  className="w-full h-[18rem] sm:h-[22rem] lg:h-[27rem] object-cover will-change-transform transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>

              <div className="absolute left-0 right-0 bottom-0 p-2 md:p-3 lg:p-4 text-white">
                <h3 className="text-xl md:text-2xl font-bold text-amber-300 drop-shadow">
                  {slide?.title}
                </h3>
                <p className="mt-1.5 text-slate-100/90 text-sm md:text-base leading-relaxed">
                  {slide?.text}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {introSlides.map((_, i) => {
                      const active = i === currentIndex;
                      return (
                        <button
                          key={i}
                          aria-label={`Tới slide ${i + 1}`}
                          onClick={() => goTo(i)}
                          className={`relative h-2 rounded-full transition-all duration-300 ${
                            active ? "w-2 bg-white/80" : "w-2 bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm"
                      aria-label="Slide trước"
                    >
                      ←
                    </button>
                    <button
                      onClick={next}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm"
                      aria-label="Slide kế"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div
            data-animate
            id="intro-text"
            className={`transition-all duration-700 ${
              isVisible["intro-text"] ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            <div className="space-y-6">
              <p className="text-[1.05rem] md:text-lg leading-7 md:leading-8 text-slate-200">
                <span className="text-amber-400 font-semibold">Phép biện chứng duy vật</span>{" "}
                là sự thống nhất giữa thế giới quan duy vật và phương pháp luận
                biện chứng, giữa lý luận nhận thức và logic. Nó phản ánh{" "}
                <span className="text-amber-400 font-semibold">biện chứng khách quan</span>{" "}
                — sự vận động, liên hệ, mâu thuẫn và phát triển của thế giới vật chất.
              </p>

              <p className="text-[1.05rem] md:text-lg leading-7 md:leading-8 text-slate-200">
                Hệ thống gồm{" "}
                <span className="text-amber-400 font-semibold">
                  2 nguyên lý, 6 cặp phạm trù và 3 quy luật cơ bản
                </span>{" "}
                củng cố nền tảng tư duy biện chứng: nhìn nhận sự vật toàn diện,
                phát triển, trong mối liên hệ phổ biến và mâu thuẫn nội tại của chính nó.
              </p>

              <p className="text-[1.05rem] md:text-lg leading-7 md:leading-8 text-slate-300">
                Theo dõi các nội dung dưới đây để hiểu rõ từng bộ phận cấu thành,
                từ nguyên lý tổng quát đến các cặp phạm trù và quy luật cụ thể,
                gắn liền với ý nghĩa thực tiễn trong nhận thức và hoạt động.
              </p>

              <div className="py-4 px-4 bg-slate-800 rounded-xl border-l-4 border-amber-400 shadow-lg">
                <Quote className="w-6 h-6 text-amber-400 mb-4" />
                <blockquote className="text-lg italic text-slate-300 mb-4">
                  "Phép biện chứng là học thuyết về sự thống nhất của các mặt đối lập — hạt nhân của phép biện chứng duy vật."
                </blockquote>
                <cite className="text-amber-400 font-medium">— V.I. Lênin</cite>
              </div>
            </div>
          </div>
        </div>

        {/* ==== DÒNG CHẢY LỊCH SỬ (grid concepts) ==== */}
        <style>{`@keyframes shineSweep{0%{transform:translateX(-160%) skewX(-18deg)}100%{transform:translateX(160%) skewX(-18deg)}}
          .card-tilt{transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--sc,1));
          transition:transform .35s cubic-bezier(.22,.77,.36,1),box-shadow .35s ease,background-color .35s ease;
          backface-visibility:hidden;will-change:transform}
          .card-tilt:hover{--sc:1.03}
          .card-tilt:hover .shine{animation:shineSweep 1.1s ease-out}
        `}</style>

        <div
          data-animate
          id="intro-concepts"
          className={`mt-10 md:mt-12 ${
            isVisible["intro-concepts"] ? "reveal-up" : "pre-hide"
          }`}
        >
          <div className="flex items-center gap-2 text-slate-200 mb-4">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg md:text-xl font-semibold">Những ý chính cần nắm vững</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {concepts.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="relative group rounded-xl border border-white/10 bg-slate-800/50 p-4
                  shadow-[0_6px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                  transition-all duration-300 ease-out card-tilt"
                style={{ animationDelay: isVisible["intro-concepts"] ? `${i * 90}ms` : "0ms" }}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const r = el.getBoundingClientRect();
                  const x = e.clientX - r.left;
                  const y = e.clientY - r.top;
                  const px = (x / r.width) * 100;
                  const py = (y / r.height) * 100;
                  const rx = (py - 50) / 10;
                  const ry = (50 - px) / 10;
                  el.style.setProperty("--rx", `${rx}deg`);
                  el.style.setProperty("--ry", `${ry}deg`);
                  el.style.setProperty("--mx", `${px}%`);
                  el.style.setProperty("--my", `${py}%`);
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.setProperty("--rx", "0deg");
                  el.style.setProperty("--ry", "0deg");
                  el.style.setProperty("--mx", "50%");
                  el.style.setProperty("--my", "50%");
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(251,191,36,0.14), rgba(251,191,36,0) 60%)",
                  }}
                />

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg border text-amber-400 bg-amber-400/15 border-amber-400/25 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:bg-amber-400/20 group-hover:border-amber-300/40">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-100 font-semibold leading-6 transition-transform duration-300 group-hover:translate-y-[-1px]">
                      {title}
                    </div>
                    <p className="text-slate-300 text-sm mt-1.5 leading-6">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroduceSection;
