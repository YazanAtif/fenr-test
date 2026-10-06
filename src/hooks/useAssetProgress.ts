import { useEffect, useState } from "react";

export function useAssetProgress(urls: string[] = []): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!urls.length) return;
    let done = 0;
    const bump = () => setProgress(Math.round((++done / urls.length) * 100));

    urls.forEach((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump; // never hang on a broken image
      img.src = src;
    });
  }, [urls]);

  return progress;
}

export default useAssetProgress;
