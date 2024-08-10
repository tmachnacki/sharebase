import { useEffect, useState } from "react";

export const useProgressiveImage = (src: string) => {
  const [sourceLoaded, setSourceLoaded] = useState<string | null>(null);
  const [sourceHeight, setSourceHeight] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    setSourceHeight(img.naturalHeight);
    img.onload = () => setSourceLoaded(src);
  }, [src]);

  return { sourceLoaded, sourceHeight };
};
