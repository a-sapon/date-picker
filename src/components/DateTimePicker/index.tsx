import { useRef, useEffect } from "react";

import "./styles.css";

const MAX_VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 53;
const CENTRAL_ITEM_COUNT = Math.floor(MAX_VISIBLE_ITEMS / 2);
const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const MOCK_HOURS = [...HOURS, ...HOURS, ...HOURS].map((el, idx) => ({
  id: idx,
  value: el,
}));
const BLOCK_HEIGHT = HOURS.length * ITEM_HEIGHT;

export const DateTimePicker = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef("h-1");

  const setSelectedItemRef = (container: HTMLDivElement) => {
    const topItem = Math.floor(container.scrollTop / ITEM_HEIGHT);
    const centralItemIdx = topItem + CENTRAL_ITEM_COUNT;

    selectedItemRef.current = MOCK_HOURS[centralItemIdx].value;
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    setSelectedItemRef(container);

    if (container.scrollTop <= ITEM_HEIGHT) {
      container.scrollTop += BLOCK_HEIGHT;
    } else if (container.scrollTop >= BLOCK_HEIGHT * 2) {
      container.scrollTop -= BLOCK_HEIGHT;
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = HOURS.length * ITEM_HEIGHT;
      setSelectedItemRef(containerRef.current);
    }
  }, []);

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
  }, []);

  return (
    <div
      className="wrapper"
      style={{ "--item-height": `${ITEM_HEIGHT}px` } as React.CSSProperties}
    >
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="container"
        style={{ height: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
      >
        <div className="date-picker-list">
          {MOCK_HOURS.map(({ id, value }) => (
            <button
              key={id}
              className="date-picker-list__item"
              style={{ height: ITEM_HEIGHT }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
