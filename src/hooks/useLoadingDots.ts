// hooks/useLoadingDots.ts
import { useState, useEffect } from 'react';

export const useLoadingDots = (interval: number = 500): string => {
  const [dots, setDots] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return dots;
};
