import { useEffect, type RefObject } from "react";

import { ITEM_HEIGHT } from "appConstants";

export const useWheelEvent = (
  containerRef: RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handler = (e: WheelEvent) => {
      e.preventDefault();

      const direction = e.deltaY > 0 ? 1 : -1;
      const newScrollTop = container.scrollTop + direction * ITEM_HEIGHT;

      container.scrollTo({
        top: newScrollTop,
        behavior: "smooth",
      });
    };

    container.addEventListener("wheel", handler);

    return () => container.removeEventListener("wheel", handler);
  }, [containerRef]);
};
