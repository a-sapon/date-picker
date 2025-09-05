import { useRef, useEffect } from "react";

const MAX_VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 53;
const CENTRAL_ITEM_COUNT = Math.floor(MAX_VISIBLE_ITEMS / 2);
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  `${i * 5}`.padStart(2, "0")
);
const MOCK_MINUTES = [...MINUTES, ...MINUTES, ...MINUTES].map((el, idx) => ({
  id: idx,
  value: el,
}));
const BLOCK_HEIGHT = MINUTES.length * ITEM_HEIGHT;

type PropsType = {
  onSetMinutesRef: (value: string) => void;
};

export const Minutes = ({ onSetMinutesRef }: PropsType) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const setSelectedItemRef = (container: HTMLDivElement) => {
    const topItem = Math.floor(container.scrollTop / ITEM_HEIGHT);
    const centralItemIdx = topItem + CENTRAL_ITEM_COUNT;

    onSetMinutesRef(MOCK_MINUTES[centralItemIdx].value);
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
      containerRef.current.scrollTop = MINUTES.length * ITEM_HEIGHT;
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
      ref={containerRef}
      onScroll={handleScroll}
      className="container"
      style={{ height: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
    >
      <div className="date-picker-list">
        {MOCK_MINUTES.map(({ id, value }) => (
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
  );
};
