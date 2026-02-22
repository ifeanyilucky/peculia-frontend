"use client";

import { useEffect, useState, useRef } from "react";

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit,
) {
  const observer = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    if (elementRef.current) observer.current.observe(elementRef.current);

    return () => observer.current?.disconnect();
  }, [callback, options]);

  return { elementRef };
}
