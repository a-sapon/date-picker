import { useRef, useEffect } from "react";

import { ITEM_HEIGHT, MAX_VISIBLE_ITEMS } from "appConstants";
import { scrollToCenter } from "utils/scrollToCenter";
import { useWheelEvent } from "hooks/useWheelEvent";

const MINUTES = Array.from({ length: 12 }, (_, i) =>
  `${i * 5}`.padStart(2, "0")
);
const MOCK_MINUTES = [...MINUTES, ...MINUTES, ...MINUTES];

type PropsType = {
  onSetSelectedMinutesRef: (container: HTMLDivElement, items: string[]) => void;
};

export const Minutes = ({ onSetSelectedMinutesRef }: PropsType) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    scrollToCenter(containerRef.current, MINUTES.length);
    onSetSelectedMinutesRef(containerRef.current, MOCK_MINUTES);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = MINUTES.length * ITEM_HEIGHT;
      onSetSelectedMinutesRef(containerRef.current, MOCK_MINUTES);
    }
  }, [onSetSelectedMinutesRef]);

  useWheelEvent(containerRef);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="container"
      style={{ height: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
    >
      <div className="date-picker-list">
        {MOCK_MINUTES.map((min, idx) => (
          <button
            key={idx}
            className="date-picker-list__item"
            style={{ height: ITEM_HEIGHT }}
          >
            {min}
          </button>
        ))}
      </div>
    </div>
  );
};
