import React, { useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BookOpenCheck, Compass, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import endPoint from "@routes/routes";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const AccentGlow = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(251,191,36,0.10),rgba(255,255,255,0)_70%)]" />
    <div className="absolute -inset-x-20 top-1/3 h-40 blur-3xl opacity-20 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400" />
  </div>
);

const TrademarkFooter = () => (
  <div className="flex flex-col items-center gap-3 text-center">
    <div className="w-full max-w-3xl mx-auto">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
    </div>

    <div className="inline-flex items-center gap-3">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow"
      >
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="6"
          className="fill-slate-800 stroke-amber-300/60"
          strokeWidth="1"
        />
        <path
          d="M7 19V9l6 8 6-8v10"
          className="stroke-amber-300"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm md:text-base font-semibold text-amber-200">
        © 2026 Phép Biện Chứng Duy Vật • StoryBook
      </span>
    </div>
  </div>
);

const FinaleSection = ({ onPrimary, onSecondary, visibleSections }) => {
  const navigate = useNavigate();
  const isVisible = !visibleSections || visibleSections.has?.("finale");

  const goPrimary = () => {
    if (typeof onPrimary === "function") return onPrimary();
    // “Khám phá chi tiết giáo trình”
    navigate(
      endPoint.STORYBOOK ?? endPoint.BOOKS ?? endPoint.BOOK ?? "/storybook"
    );
  };

  const goSecondary = () => {
    if (typeof onSecondary === "function") return onSecondary();
    // “Xem toàn bộ chương trình”
    navigate(endPoint.QUIZ ?? "/quiz");
  };

  const header = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-amber-200 text-xs md:text-sm tracking-wide">
          <Sparkles className="h-4 w-4" /> Cảm ơn bạn đã đồng hành đến cuối hành
          trình!
        </div>

        <h2 className="pt-3 text-3xl md:text-4xl font-extrabold pb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 leading-snug">
          Kết thúc phần học – Nắm vững tư duy biện chứng
        </h2>

        <p className="text-lg md:text-xl text-slate-300/95 max-w-4xl mx-auto leading-relaxed">
          Hiểu đúng về{" "}
          <span className="text-amber-200 font-semibold">
            phép biện chứng duy vật
          </span>{" "}
          không dừng ở ghi nhớ khái niệm. Điều quan trọng là biết vận dụng
          tư duy toàn diện và phát triển, nhận diện đúng mâu thuẫn, tích lũy
          lượng đủ để tạo bước nhảy chất trong học tập và thực tiễn.
        </p>
      </motion.div>
    ),
    [isVisible]
  );

  return (
    <section
      id="finale"
      data-section
      className="relative pb-4 pt-12 md:pt-20 px-6 md:px-8 bg-slate-900/40 overflow-hidden"
    >
      <AccentGlow />

      <div className="max-w-7xl mx-auto">
        {header}

        <motion.div
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
        >
          <motion.button
            variants={item}
            onClick={goPrimary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 md:px-6 md:py-3.5 font-semibold text-slate-900 bg-amber-300 hover:bg-amber-200 active:bg-amber-300/90 transition-colors"
          >
            <Compass className="h-5 w-5" />
            Mở sách tóm tắt
            <ArrowRight className="h-5 w-5" />
          </motion.button>

          <motion.button
            variants={item}
            onClick={goSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 md:px-6 md:py-3.5 font-semibold text-amber-200/90 ring-1 ring-amber-300/30 hover:bg-amber-400/10 transition-colors"
          >
            <BookOpenCheck className="h-5 w-5" />
            Luyện câu hỏi
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-16"
        >
          <TrademarkFooter />
        </motion.div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-slate-950/90"
      />
    </section>
  );
};

export default FinaleSection;
