"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

type Props = {
  /** Re-measure when this changes (page turn) */
  pageKey: string | number;
  /**
   * When true, do not scale — allow normal vertical scroll
   * (forms / interactive pages need usable tap targets).
   */
  allowScroll?: boolean;
  children: ReactNode;
};

/**
 * Mobile-only: shrink the full page body to fit the available stage
 * so the reader never has to scroll to see an entire story page.
 */
export default function MobilePageFit({
  pageKey,
  allowScroll = false,
  children,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    if (allowScroll) {
      content.style.transform = "";
      content.style.width = "100%";
      content.style.marginTop = "0px";
      return;
    }

    // Natural size at scale 1 (no height:100% — that breaks measurement)
    content.style.transform = "none";
    content.style.width = "100%";
    content.style.marginTop = "0px";

    const available = viewport.clientHeight;
    const needed = content.scrollHeight;
    if (available <= 0 || needed <= 0) return;

    // Always fit the full page on screen — no vertical scroll for story pages
    const next = Math.min(1, available / needed);

    content.style.transformOrigin = "top center";
    if (next < 0.999) {
      content.style.transform = `scale(${next})`;
      // Widen before scale so the scaled width still fills the viewport
      content.style.width = `${(100 / next).toFixed(4)}%`;
      content.style.marginTop = "0px";
    } else {
      content.style.transform = "none";
      content.style.width = "100%";
      // Vertically center short pages
      const spare = available - needed;
      content.style.marginTop = spare > 0 ? `${spare / 2}px` : "0px";
    }
  }, [allowScroll]);

  useLayoutEffect(() => {
    measure();
  }, [measure, pageKey]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(measure);
    });
    ro.observe(viewport);
    ro.observe(content);

    const imgs = content.querySelectorAll("img");
    const onImg = () => measure();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImg);
    });

    window.addEventListener("orientationchange", measure);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", onImg));
      window.removeEventListener("orientationchange", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [measure, pageKey]);

  if (allowScroll) {
    return (
      <div
        ref={viewportRef}
        className="book-page-scroll min-h-0 flex-1 px-4 py-3"
      >
        <div ref={contentRef} className="w-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      className="relative min-h-0 flex-1 overflow-hidden px-4 py-3"
    >
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
