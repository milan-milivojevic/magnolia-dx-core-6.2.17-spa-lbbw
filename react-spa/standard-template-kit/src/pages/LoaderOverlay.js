import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useRef, useState } from "react";

export function LoaderOverlay({ loading }) {
  if (!loading) return null;
  return (
    <div className="loader-overlay">
      <ClipLoader loading size={80} color="#7091a7" cssOverride={{ borderWidth: "10px" }} />
    </div>
  );
}


export function useImagesLoaded(rootRef) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const root = rootRef?.current ?? document;
    const imgs = Array.from(root.querySelectorAll("img"));
    if (imgs.length === 0) {
      setLoading(false);
      return;
    }
    let remaining = imgs.filter((img) => !img.complete).length;
    if (remaining === 0) {
      setLoading(false);
    }
    const done = () => {
      remaining -= 1;
      if (remaining === 0) setLoading(false);
    };
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }, [rootRef]);

  return loading;
}
