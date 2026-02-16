import { useEffect, useRef, useState } from "react";

function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll("img"));
  if (imgs.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let remaining = imgs.filter((img) => !img.complete).length;
    if (remaining === 0) return resolve();

    const done = () => {
      remaining -= 1;
      if (remaining === 0) resolve();
    };
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  });
}

export default function useHashScroll(
  rootRef,
  { offset = 0, behavior = "smooth" } = {}
) {
  const [loading, setLoading] = useState(true);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const rootEl = rootRef?.current ?? document;

    const scrollToHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior });
      hasScrolled.current = true;
    };

    const runSequence = async () => {
      await waitForImages(rootEl);
      requestAnimationFrame(() => {
        scrollToHash();
        // Gasimo spinner TEK posle pomeranja.
        setLoading(false);
      });
    };

    runSequence();

    const onHashChange = () => {
      setLoading(true);
      hasScrolled.current = false;
      runSequence();
    };

    const cancel = () => setLoading(false);

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchmove", cancel, { passive: true, once: true });
    window.addEventListener("keydown", cancel, { once: true });

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [rootRef, offset, behavior]);

  return loading;
}