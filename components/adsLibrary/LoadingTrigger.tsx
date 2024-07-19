// components/adsLibrary/LoadingTrigger.tsx
import React, { useEffect, useRef } from 'react';

interface LoadingTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
}

const LoadingTrigger: React.FC<LoadingTriggerProps> = ({ onIntersect, isLoading }) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [onIntersect, isLoading]);

  return <div ref={triggerRef} className="h-10" />;
};

export default LoadingTrigger;