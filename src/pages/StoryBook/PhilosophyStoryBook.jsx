import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookToolbox from "../StoryBook/BookToolbox";

import {
  spreads as PHILO_SPREADS,
  spreadsToPages,
} from "./philosophySpreads.jsx";

import "@styles/BookTheme.css";
import "@styles/BookAnimations.css";
import "@styles/PhilosophyStoryBook.css";

export default function PhilosophyStoryBook() {
  const flipRef = useRef(null);

  const [pageSize, setPageSize] = useState({ w: 520, h: 700 });
  const onTocClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const idx = Number.parseInt(e.currentTarget.dataset.goto, 10);
    const api = flipRef.current?.pageFlip?.();
    if (!Number.isNaN(idx) && api) api.flip(idx); // hoặc api.turnToPage(idx)
  }, []);

  const pages = useMemo(
    () => spreadsToPages(PHILO_SPREADS, { onTocClick }),
    [onTocClick]
  );

  const [currentPage, setCurrentPage] = useState(0);

  // --- Stage để “trượt phải khi đọc / về giữa khi đóng” ---
  const totalPages = pages.length;
  const isFrontClosed = currentPage === 0; // bìa trước
  const isBackClosed = currentPage === totalPages - 1; // bìa sau
  const stage = isFrontClosed || isBackClosed ? "closed" : "reading";

  // khoảng trượt sang phải (px) – responsive, không trượt trên mobile hẹp
  const [shiftPx, setShiftPx] = useState(0);
  useEffect(() => {
    const calcShift = () => {
      const vw = window.innerWidth;
      const base = Math.min(180, Math.max(0, Math.round(vw * 0.12)));
      // nếu khung hẹp thì không trượt để khỏi văng UI
      setShiftPx(vw < 980 ? 0 : base);
    };
    calcShift();
    window.addEventListener("resize", calcShift);
    return () => window.removeEventListener("resize", calcShift);
  }, []);

  // nền riêng cho trang này
  useEffect(() => {
    document.body.classList.add("philo-bg");
    return () => document.body.classList.remove("philo-bg");
  }, []);

  // size cơ sở của flipbook (trước khi scale)
  useEffect(() => {
    const calc = () => {
      const vw = Math.min(window.innerWidth, 1400);
      const vh = window.innerHeight;
      const targetBookH = Math.min(Math.round(vh * 0.8), 900);
      const pageWFromH = Math.round(targetBookH * 0.74);
      const pageWFromW = Math.round(vw * 0.4);
      const w = Math.min(680, Math.max(360, Math.min(pageWFromH, pageWFromW)));
      const h = Math.round(w / 0.74);
      setPageSize({ w, h });
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const onFlip = (e) => setCurrentPage(e.data);

  // lật bằng phím
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") flipRef.current?.pageFlip().flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.pageFlip().flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  // spread indicator
  const currentSpread = Math.min(
    PHILO_SPREADS.length - 1,
    Math.ceil(currentPage / 2)
  );

  return (
    <div className="philo-book" lang="vi">
      {/* Toolbox hợp nhất zoom với desktop */}
      <BookToolbox />

      <main className="page-with-header">
        <section className="book-scene">
          <div
            className="book-container book-dark theme-amber"
            data-stage={stage}
            style={{ ["--book-shift"]: `${shiftPx}px` }}
          >
            <HTMLFlipBook
              ref={flipRef}
              className="html-flip-book"
              width={pageSize.w}
              height={pageSize.h}
              showCover
              maxShadowOpacity={0.5}
              drawShadow
              mobileScrollSupport
              onFlip={onFlip}
            >
              {pages}
            </HTMLFlipBook>

            {/* Prev/Next bám mép sách và scale theo zoom hợp nhất */}
            <div className="navigation nav-prev">
              <button
                className="nav-button"
                onClick={() => flipRef.current?.pageFlip().flipPrev()}
                disabled={!canPrev}
                aria-label="Trang trước"
                title="Trang trước"
              >
                <ChevronLeft />
              </button>
            </div>

            <div className="navigation nav-next">
              <button
                className="nav-button"
                onClick={() => flipRef.current?.pageFlip().flipNext()}
                disabled={!canNext}
                aria-label="Trang sau"
                title="Trang sau"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="page-indicator">
              Trang {Math.min(currentSpread + 1, PHILO_SPREADS.length)} /{" "}
              {PHILO_SPREADS.length}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
