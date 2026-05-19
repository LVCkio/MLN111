import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  forwardRef,
} from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { timelineEvents } from "./data";

/**
 * TimelineSection (Stable, JSX)
 * - Freeze animations during resize (debounce)
 * - Pause IO + "revealAll at bottom" while resizing
 * - Lock spine height after resize to reduce reflow
 * - Keep spring smooth otherwise
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const itemReduce = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
};

const YearBadge = ({ year }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-amber-200 shadow-[inset_0_0_20px_rgba(251,191,36,0.08)]">
    <span className="inline-block size-1.5 rounded-full bg-amber-400" />
    <span className="font-semibold tracking-wide">{year}</span>
  </div>
);

const QuoteBlock = ({ quote, author }) => (
  <div className="p-5 md:p-6 rounded-xl bg-slate-900/70 border border-white/10">
    <Quote className="w-5 h-5 md:w-6 md:h-6 text-amber-400 mb-3" />
    {quote && (
      <blockquote className="text-slate-300 italic leading-relaxed">“{quote}”</blockquote>
    )}
    {author && (
      <cite className="mt-3 block text-amber-300/90 text-sm font-medium">— {author}</cite>
    )}
  </div>
);

const Card = forwardRef(({ e, index, isVisible, isResizing }, ref) => {
  const prefersReduced = useReducedMotion();
  const alignRight = index % 2 === 1;
  const sidePad = alignRight ? "lg:pl-14" : "lg:pr-14";

  return (
    <motion.li
      variants={prefersReduced ? itemReduce : itemFade}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
      className="relative z-10 list-none"
      ref={ref}
      data-card
      style={{ willChange: isResizing ? "auto" : "transform, opacity" }}
    >
      {/* Marker (desktop) */}
      <div
        className="hidden lg:block absolute top-3 left-1/2 -translate-x-1/2 size-5 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(2,6,23,1)] ring-4 ring-amber-400/30"
        aria-hidden
      />

      <div className={`grid grid-cols-1 lg:grid-cols-2 items-stretch ${sidePad}`}>
        {alignRight ? <div className="hidden lg:block" /> : null}

        <div className="w-full text-left">
          <div
            className={[
              "group relative rounded-2xl border border-white/10 bg-slate-800/60 p-6 md:p-8 transition-colors duration-300",
              isResizing ? "" : "backdrop-blur-md",
              "hover:border-amber-300/25",
            ].join(" ")}
          >
            {/* Accent gradient */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-amber-400/10 to-transparent" />

            <div className="flex justify-start mb-3">
              <YearBadge year={e.year} />
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{e.title}</h3>
            {e.subtitle && <p className="mt-1 text-amber-300/90 font-medium">{e.subtitle}</p>}

            {e.description && <p className="mt-4 text-slate-300 leading-relaxed">{e.description}</p>}
            {e.details && <p className="mt-3 text-sm text-slate-400">{e.details}</p>}

            {(e.quote || e.author) && (
              <div className="mt-6">
                <QuoteBlock quote={e.quote} author={e.author} />
              </div>
            )}
          </div>
        </div>

        {!alignRight ? <div className="hidden lg:block" /> : null}
      </div>
    </motion.li>
  );
});
Card.displayName = "Card";

// Dùng inset (px) để rút ngắn thanh: mặc định 32px = 2rem
const Spine = ({ progress, inset = 34 }) => (
  <div
    aria-hidden
    className="pointer-events-none hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px"
  >
    {/* Base line (đường nền) - rút ngắn bằng top/bottom */}
    <div
      className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent"
      style={{ top: inset, bottom: inset }}
    />

    {/* Progress overlay (phần vàng chạy theo scroll) */}
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-px origin-top rounded bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_12px_1px_rgba(251,191,36,0.35)]"
      style={{ top: inset, bottom: inset, scaleY: progress }}
    />
  </div>
);


const TimelineSection = ({ visibleSections }) => {
  const isVisible = !visibleSections || visibleSections.has?.("timeline");

  // Progressive reveal
  const [headerDone, setHeaderDone] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => {
    const arr = new Array(timelineEvents.length).fill(false);
    if (arr.length > 0) arr[0] = true; // ưu tiên chữ: card đầu tiên
    return arr;
  });

  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  // Freeze during resize
  const [isResizing, setIsResizing] = useState(false);
  const lastProgressRef = useRef(0);
  const [spineHeight, setSpineHeight] = useState(null);

  // Scroll progress (spring)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });

  const [maxProgress, setMaxProgress] = useState(0);
  useEffect(() => {
    const unsub = smoothProgress.on("change", (v) => {
      lastProgressRef.current = v;
      setMaxProgress((prev) => (v > prev ? v : prev));
    });
    return () => unsub();
  }, [smoothProgress]);

  // Debounced resize handler
  useEffect(() => {
    let t;
    const onResize = () => {
      setIsResizing(true);
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        setIsResizing(false);
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (t) window.clearTimeout(t);
    };
  }, []);

  // Lock spine height after resize settles
  useLayoutEffect(() => {
    if (sectionRef.current && !isResizing) {
      const rect = sectionRef.current.getBoundingClientRect();
      setSpineHeight(Math.max(0, rect.height - 48)); // 100% - 3rem
    }
  }, [isResizing]);

  // Reveal all if at bottom (but not during resize)
  useEffect(() => {
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 16;

    const onScroll = () => {
      if (!isResizing && atBottom()) setRevealAll(true);
    };

    if (!isResizing && atBottom()) setRevealAll(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isResizing]);

  // IntersectionObserver (pause while resizing)
  useEffect(() => {
    if (!headerDone || revealAll || isResizing) return;

    const opts = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.35,
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const idxAttr = entry.target.getAttribute("data-index");
        const idx = idxAttr ? Number(idxAttr) : NaN;
        if (Number.isNaN(idx)) return;

        if (entry.isIntersecting) {
          setVisibleCards((prev) => {
            if (prev[idx]) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }
      });
    }, opts);

    cardRefs.current.forEach((node) => node && io.observe(node));
    return () => io.disconnect();
  }, [headerDone, revealAll, isResizing]);

  // If revealAll toggles, mark all visible
  useEffect(() => {
    if (revealAll) setVisibleCards(new Array(timelineEvents.length).fill(true));
  }, [revealAll]);

  const progressForUI = headerDone
    ? (isResizing ? lastProgressRef.current : Math.max(0.12, maxProgress))
    : 0;

  const header = useMemo(
    () => (
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 md:mb-12"
        onAnimationComplete={() => {
          setHeaderDone(true);
          setVisibleCards((prev) => {
            if (!prev[0]) {
              const next = [...prev];
              next[0] = true;
              return next;
            }
            return prev;
          });
        }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold pb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 leading-snug">
          Dòng Chảy Nội Dung
        </h2>
        <p className="text-lg md:text-xl text-slate-300/95 max-w-3xl mx-auto leading-relaxed">
          Theo dõi từng lớp nội dung để thấy rõ đặc điểm tôn giáo ở Việt Nam và
          những nguyên tắc chính trong công tác tôn giáo hiện nay
        </p>
      </motion.header>
    ),
    [isVisible]
  );

  return (
    <section
      id="timeline"
      data-section
      ref={sectionRef}
      className="relative py-6 md:py-16 lg:py-18 px-6 md:px-8 bg-slate-900/40"
    >
      {/* Background glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(251,191,36,0.10),rgba(255,255,255,0)_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {header}

        <div className="relative">
          {/* Spine */}
          <Spine progress={progressForUI}  />

          {/* Mobile side bar */}
          <div
            aria-hidden
            className="lg:hidden absolute left-2 top-0 bottom-0 w-px bg-amber-400/50 -z-10"
          />

          <motion.ul
            variants={container}
            initial="hidden"
            animate={isVisible ? "show" : "hidden"}
            role="list"
            aria-label="Mốc thời gian lịch sử"
            className="relative space-y-8 md:space-y-10 lg:space-y-16"
          >
            {timelineEvents.map((e, i) => (
              <Card
                key={`${e.year}-${i}`}
                e={e}
                index={i}
                isVisible={visibleCards[i]}
                isResizing={isResizing}
                ref={(el) => {
                  cardRefs.current[i] = el;
                  if (el) el.setAttribute("data-index", String(i));
                }}
              />
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-slate-950/90"
      />
    </section>
  );
};

export default TimelineSection;
