// StickyWrapper.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

interface StickyWrapperProps {
  children: React.ReactNode;
}

const StickyWrapper: React.FC<StickyWrapperProps> = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (ref.current) {
      setIsSticky(ref.current.getBoundingClientRect().top <= 0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        className={`transition-all duration-1000 ${
          isSticky ? "fixed left-0 top-14 z-50 w-full shadow-md" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default StickyWrapper;
