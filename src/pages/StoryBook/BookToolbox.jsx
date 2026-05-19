import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RefreshCcw,
  Maximize2,
  Minimize2,
  GripVertical,
} from "lucide-react";
import { createPortal } from "react-dom";
import Tooltip from "@mui/material/Tooltip";

/** Zoom tổng (Unified) hiển thị cho người dùng */
const ZMIN = 0.8,
  ZMAX = 1.6,
  ZSTEP = 0.1;
const SCROLL_THRESHOLD = 1.1; // kéo dọc nếu zoom tổng > 110% HOẶC thực sự vượt viewport

/** Nút & khoảng cách cơ sở (scale theo "zoom tổng") */
const BTN_BASE = 48;
const GAP_BASE = 24;
const IND_GAP_BASE = 12;

const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
const pct = (n) => Math.round(n * 100);

export default function BookToolbox() {
  /** zoomModel = "zoom TỔNG" (đồng bộ với desktop). Mặc định 100% */
  const [zoomModel, setZoomModel] = useState(1);

  /** browserRel = mức zoom của trình duyệt so với baseline lúc load */
  const [browserRel, setBrowserRel] = useState(1);

  // Portal để toolbox không biến mất khi fullscreen
  const [portalTarget, setPortalTarget] = useState(
    () => document.fullscreenElement || document.body
  );

  // vị trí toolbox (lưu lại)
  const [pos, setPos] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem("book:pos"));
      if (p && typeof p.left === "number" && typeof p.top === "number")
        return p;
    } catch {}
    const left = 16;
    const top = Math.max(16, Math.round((window.innerHeight - 200) / 2));
    return { left, top };
  });

  const toolRef = useRef(null);
  const containerRef = useRef(null); // .book-container
  const bookRef = useRef(null); // .html-flip-book
  const sceneRef = useRef(null); // .book-scene

  // Baseline để đo zoom desktop tương đối
  const baseRef = useRef({
    dpr: window.devicePixelRatio || 1,
    vv: window.visualViewport?.scale || 1,
    iw: window.innerWidth || 1,
  });

  // anchors
  useEffect(() => {
    containerRef.current = document.querySelector(
      ".philo-book .book-container"
    );
    bookRef.current = document.querySelector(".philo-book .html-flip-book");
    sceneRef.current = document.querySelector(".philo-book .book-scene");
  }, []);

  // lưu vị trí
  useEffect(() => localStorage.setItem("book:pos", JSON.stringify(pos)), [pos]);

  /** Tính browserRel: ưu tiên visualViewport, sau đó DPR, cuối cùng innerWidth */
  const computeBrowserRel = useCallback(() => {
    const { dpr: dpr0, vv: vv0, iw: iw0 } = baseRef.current;

    const vv = window.visualViewport?.scale;
    if (typeof vv === "number" && vv0 > 0) return vv / vv0;

    const dpr = window.devicePixelRatio || 1;
    if (dpr0 > 0 && dpr) return dpr / dpr0;

    const iw = window.innerWidth || 1;
    return iw0 / iw; // zoom up -> innerWidth giảm -> tỉ lệ tăng
  }, []);

  // Theo dõi zoom desktop
  useEffect(() => {
    const updateBrowserRel = () => setBrowserRel(computeBrowserRel());
    updateBrowserRel();

    window.addEventListener("resize", updateBrowserRel);
    window.visualViewport?.addEventListener("resize", updateBrowserRel);
    window.visualViewport?.addEventListener("scroll", updateBrowserRel); // đề phòng pinch-zoom

    return () => {
      window.removeEventListener("resize", updateBrowserRel);
      window.visualViewport?.removeEventListener("resize", updateBrowserRel);
      window.visualViewport?.removeEventListener("scroll", updateBrowserRel);
    };
  }, [computeBrowserRel]);

  /** scale thực sự áp lên SÁCH để đạt zoom tổng mong muốn */
  const bookScale = zoomModel / (browserRel || 1);

  // Áp scale lên sách
  const applyZoom = useCallback(() => {
    const book = bookRef.current;
    if (!book) return;
    book.style.transform = `scale(${bookScale})`;
    book.style.transformOrigin = "center center";
    book.style.transition = "transform .18s ease";
  }, [bookScale]);

  // Bố trí prev/next + indicator theo mép sách, scale theo "zoom tổng"
  const layoutNav = useCallback(() => {
    const container = containerRef.current;
    const book = bookRef.current;
    if (!container || !book) return;

    const navPrev = container.querySelector(".navigation.nav-prev");
    const navNext = container.querySelector(".navigation.nav-next");
    const indicator = container.querySelector(".page-indicator");
    if (!navPrev || !navNext || !indicator) return;

    const crect = container.getBoundingClientRect();
    const brect = book.getBoundingClientRect(); // đã gồm cả scale

    const btnSize = Math.max(36, Math.round(BTN_BASE * zoomModel));
    const gap = Math.max(10, Math.round(GAP_BASE * zoomModel));
    const indGap = Math.max(8, Math.round(IND_GAP_BASE * zoomModel));

    const btnPrev = navPrev.querySelector(".nav-button");
    const btnNext = navNext.querySelector(".nav-button");
    if (btnPrev) {
      btnPrev.style.width = `${btnSize}px`;
      btnPrev.style.height = `${btnSize}px`;
    }
    if (btnNext) {
      btnNext.style.width = `${btnSize}px`;
      btnNext.style.height = `${btnSize}px`;
    }

    const prevLeft = brect.left - crect.left - gap - btnSize;
    const nextLeft = brect.right - crect.left + gap;

    Object.assign(navPrev.style, {
      left: `${Math.round(prevLeft)}px`,
      right: "auto",
      top: "50%",
      transform: "translateY(-50%)",
    });
    Object.assign(navNext.style, {
      left: `${Math.round(nextLeft)}px`,
      right: "auto",
      top: "50%",
      transform: "translateY(-50%)",
    });

    const indLeft = brect.left - crect.left + brect.width / 2;
    Object.assign(indicator.style, {
      left: `${Math.round(indLeft)}px`,
      right: "auto",
      bottom: "auto",
      top: `${Math.round(brect.bottom - crect.top + indGap)}px`,
      transform: "translateX(-50%)",
      fontSize: `${Math.max(12, Math.round(13 * zoomModel))}px`,
    });
  }, [zoomModel]);

  // === CHÍNH SÁCH SCROLL (mới): dựa trên kích thước THỰC của sách sau transform ===
  const applyScrollPolicy = useCallback(() => {
    const body = document.body;
    const scene = sceneRef.current;
    const book = bookRef.current;
    if (!scene || !book) return;

    // reset class trước
    body.classList.remove("philo-scroll", "philo-hscroll");

    // đo kích thước hiển thị THỰC tế của sách (đã tính transform & zoom desktop)
    const brect = book.getBoundingClientRect();

    // chiều cao khả dụng (trừ header)
    const headerH =
      document.querySelector(".philo-book header")?.offsetHeight || 0;
    const baseEl =
      document.fullscreenElement === scene ? scene : document.documentElement;
    const availH =
      (document.fullscreenElement === scene
        ? scene.clientHeight
        : window.innerHeight) - headerH;
    const availW = baseEl.clientWidth;

    // Khi nào mở scroll?
    const pad = 80; // thở dưới
    const needY =
      zoomModel > SCROLL_THRESHOLD || Math.round(brect.height) + pad > availH;
    const needX = Math.round(brect.width) > availW - 32;

    // Áp dụng
    if (needY) {
      body.classList.add("philo-scroll");
      const minH = Math.max(Math.round(brect.height) + pad, availH);
      scene.style.minHeight = `${minH}px`;
    } else {
      scene.style.minHeight = "";
    }

    if (needX) {
      body.classList.add("philo-hscroll");
    }

    if (document.fullscreenElement === scene) {
      scene.style.overflowY = needY ? "auto" : "hidden";
      scene.style.overflowX = needX ? "auto" : "hidden";
    } else {
      scene.style.overflow = "visible";
    }
  }, [zoomModel]);

  // Re-apply khi zoom/resize
  useEffect(() => {
    const runAll = () => {
      applyZoom();
      layoutNav();
      applyScrollPolicy();
    };
    runAll();

    const onResize = () => runAll(); // zoom desktop -> resize -> chạy
    const onScroll = () => layoutNav(); // cuộn trang -> cập nhật nav
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const book = bookRef.current;
    const onEnd = (e) => e.propertyName === "transform" && layoutNav();
    book?.addEventListener("transitionend", onEnd);

    const raf = requestAnimationFrame(runAll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      book?.removeEventListener("transitionend", onEnd);
      cancelAnimationFrame(raf);
    };
  }, [applyZoom, layoutNav, applyScrollPolicy]);

  // Fullscreen: giữ toolbox + re-apply
  useEffect(() => {
    const onFS = () => {
      setPortalTarget(document.fullscreenElement || document.body);
      setTimeout(() => {
        const el = toolRef.current;
        if (!el) return;
        const base = document.fullscreenElement || document.documentElement;
        const vw = base.clientWidth,
          vh = base.clientHeight;
        const rect = el.getBoundingClientRect();
        const left = Math.max(8, Math.min(rect.left, vw - rect.width - 8));
        const top = Math.max(8, Math.min(rect.top, vh - rect.height - 8));
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      }, 0);
      applyZoom();
      layoutNav();
      applyScrollPolicy();
    };
    document.addEventListener("fullscreenchange", onFS);
    return () => document.removeEventListener("fullscreenchange", onFS);
  }, [applyZoom, layoutNav, applyScrollPolicy]);

  // Kéo chỉ khi giữ grip
  useEffect(() => {
    const el = toolRef.current;
    if (!el) return;
    const grip = el.querySelector(".booktools-grip");
    if (!grip) return;

    let startX = 0,
      startY = 0;
    let startLeft = 0,
      startTop = 0;

    const baseEl = () => document.fullscreenElement || document.documentElement;
    const clampInto = (left, top) => {
      const vw = baseEl().clientWidth;
      const vh = baseEl().clientHeight;
      const rect = el.getBoundingClientRect();
      return {
        left: Math.max(8, Math.min(left, vw - rect.width - 8)),
        top: Math.max(8, Math.min(top, vh - rect.height - 8)),
      };
    };

    const onPointerDown = (e) => {
      if (e.target !== grip && !grip.contains(e.target)) return;
      grip.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      startX = e.clientX;
      startY = e.clientY;
      el.classList.add("dragging");
    };

    const onPointerMove = (e) => {
      if (!grip.hasPointerCapture?.(e.pointerId)) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const { left, top } = clampInto(startLeft + dx, startTop + dy);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      e.preventDefault();
    };

    const onPointerUp = (e) => {
      if (!grip.hasPointerCapture?.(e.pointerId)) return;
      grip.releasePointerCapture(e.pointerId);
      el.classList.remove("dragging");
      const rect = el.getBoundingClientRect();
      const { left, top } = clampInto(rect.left, rect.top);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      setPos({ left, top });
    };

    const init = () => {
      const { left, top } = clampInto(pos.left, pos.top);
      el.style.position = "fixed";
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
      el.style.touchAction = "none";
      setPos({ left, top });
    };

    grip.addEventListener("pointerdown", onPointerDown);
    grip.addEventListener("pointermove", onPointerMove);
    grip.addEventListener("pointerup", onPointerUp);
    grip.addEventListener("pointercancel", onPointerUp);
    init();

    return () => {
      grip.removeEventListener("pointerdown", onPointerDown);
      grip.removeEventListener("pointermove", onPointerMove);
      grip.removeEventListener("pointerup", onPointerUp);
      grip.removeEventListener("pointercancel", onPointerUp);
    };
  }, [portalTarget, pos.left, pos.top]);

  // Tooltip chung
  const tipCommon = {
    arrow: true,
    placement: "right",
    componentsProps: {
      tooltip: { sx: { whiteSpace: "nowrap", zIndex: 99999 } },
      arrow: { sx: { color: "rgba(15,23,42,.95)" } },
    },
  };

  /** Thao tác trên "zoom tổng" */
  const inc = () =>
    setZoomModel((z) => clamp(Number((z + ZSTEP).toFixed(2)), ZMIN, ZMAX));
  const dec = () =>
    setZoomModel((z) => clamp(Number((z - ZSTEP).toFixed(2)), ZMIN, ZMAX));
  const reset = () => setZoomModel(1);

  const ringProgress = Math.max(
    0,
    Math.min(1, (zoomModel - ZMIN) / (ZMAX - ZMIN))
  );

  const content = (
    <>
      <div
        ref={toolRef}
        className="booktools"
        role="toolbar"
        aria-label="Công cụ sách"
        style={{ zIndex: 99999 }}
      >
        <Tooltip {...tipCommon} title="Giữ để kéo di chuyển" arrow>
          <button
            className="booktools-grip"
            aria-label="Di chuyển (giữ và kéo)"
          >
            <GripVertical size={18} />
          </button>
        </Tooltip>

        <Tooltip {...tipCommon} title="Thu nhỏ (Ctrl -)" arrow>
          <button className="booktools-btn" onClick={dec} aria-label="Thu nhỏ">
            <ZoomOut size={18} />
          </button>
        </Tooltip>

        <Tooltip {...tipCommon} title={`Tỷ lệ phóng ${pct(zoomModel)}%`} arrow>
          <div
            className="booktools-zoom-ring"
            style={{ ["--zoom-p"]: `${ringProgress}` }}
            aria-live="polite"
          >
            <div className="booktools-zoom-text">{pct(zoomModel)}%</div>
          </div>
        </Tooltip>

        <Tooltip {...tipCommon} title="Phóng to (Ctrl +)" arrow>
          <button className="booktools-btn" onClick={inc} aria-label="Phóng to">
            <ZoomIn size={18} />
          </button>
        </Tooltip>

        <Tooltip {...tipCommon} title="Về 100%" arrow>
          <button
            className="booktools-btn"
            onClick={reset}
            aria-label="Về 100%"
          >
            <RefreshCcw size={18} />
          </button>
        </Tooltip>

        <div className="booktools-sep" aria-hidden="true" />

        <Tooltip
          {...tipCommon}
          title={
            document.fullscreenElement ? "Thoát toàn màn hình" : "Toàn màn hình"
          }
          arrow
        >
          <button
            className="booktools-btn"
            onClick={async () => {
              const scene = document.querySelector(".philo-book .book-scene");
              try {
                if (!document.fullscreenElement)
                  await scene?.requestFullscreen();
                else await document.exitFullscreen();
              } catch {}
            }}
            aria-label={
              document.fullscreenElement
                ? "Thoát toàn màn hình"
                : "Toàn màn hình"
            }
          >
            {document.fullscreenElement ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </button>
        </Tooltip>
      </div>

      {/* styles riêng cho toolbox */}
      <style>{`
        .booktools{
          --s:44px;
          position: fixed;
          display:flex; flex-direction:column; gap:10px;
          padding:10px; border-radius:18px;
          border:1px solid rgba(255,255,255,.12);
          background:linear-gradient(180deg, rgba(15,23,42,.72), rgba(15,23,42,.55));
          color:#e6edf3; box-shadow:0 10px 30px rgba(0,0,0,.35);
          backdrop-filter: blur(10px) saturate(1.05);
        }
        .booktools .booktools-grip,
        .booktools .booktools-btn,
        .booktools .booktools-zoom-ring{
          display:grid; place-items:center;
          width:var(--s); height:var(--s); border-radius:12px;
        }
        .booktools .booktools-grip{
          cursor: grab;
          border:1px dashed rgba(255,255,255,.16);
          background:rgba(255,255,255,.04);
        }
        .booktools .booktools-grip:active{ cursor:grabbing; }
        .booktools .booktools-grip:hover{ background:rgba(255,255,255,.08) }

        .booktools .booktools-btn{
          border:1px solid rgba(255,255,255,.12);
          background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
          color:inherit; transition:transform .12s ease, background .2s ease, box-shadow .2s ease;
        }
        .booktools .booktools-btn:hover{ background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05)); box-shadow:0 4px 16px rgba(0,0,0,.25) }
        .booktools .booktools-btn:active{ transform:scale(.96) }

        .booktools .booktools-sep{ height:1px; width:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent); margin:2px 0 }

        .booktools .booktools-zoom-ring{
          --p: var(--zoom-p, 0);
          position:relative; color:#e5e7eb;
          background:conic-gradient(#22d3ee calc(var(--p) * 360deg), rgba(255,255,255,.12) 0);
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.08), 0 8px 20px rgba(0,0,0,.25)
        }
        .booktools .booktools-zoom-ring::before{ content:""; position:absolute; inset:6px; border-radius:inherit; background:rgba(0,0,0,.35); }
        .booktools .booktools-zoom-text{ position:relative; font-size:11px; font-weight:800; letter-spacing:.2px }

        @media (max-width: 768px){
          .booktools{ flex-direction:row; align-items:center; padding:8px 10px; border-radius:12px }
          .booktools .booktools-sep{ height:24px; width:1px }
        }
      `}</style>
    </>
  );

  return createPortal(content, portalTarget);
}
