import React, { useLayoutEffect, useRef } from "react";

/** Tự co nội dung để vừa chiều cao trang, tắt cuộn */
export default function AutoFitPage({ className = "", children }) {
  const outerRef = useRef(null); // khung .page-content (cao = 100%)
  const innerRef = useRef(null); // bọc nội dung thực

  useLayoutEffect(() => {
    const fit = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      // reset để đo đúng
      inner.style.transform = "scale(1)";
      inner.style.width = "100%";

      const availH = outer.clientHeight;
      const needH  = inner.scrollHeight;
      const s = Math.min(1, availH / needH);   // scale <= 1

      inner.style.transform = `scale(${s})`;
      // giữ bề ngang phủ 100% sau khi scale
      inner.style.width = `${100 / s}%`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outerRef}
      className={`page-content ${className}`}
      style={{ overflow: "hidden" }}   // tắt cuộn trong trang
    >
      <div
        ref={innerRef}
        style={{ transformOrigin: "top left", willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
