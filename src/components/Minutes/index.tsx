import { useRef, useEffect } from "react";
import dayjs from "dayjs";

import { ITEM_HEIGHT, MAX_VISIBLE_ITEMS } from "appConstants";
import { scrollToMiddle } from "utils/scrollToMiddle";
import { useWheelEvent } from "hooks/useWheelEvent";
import { queryParams } from "utils/queryParams";

const MINUTES = Array.from({ length: 12 }, (_, i) =>
  `${i * 5}`.padStart(2, "0")
);
const MOCK_MINUTES = [...MINUTES, ...MINUTES, ...MINUTES];
const initialMinute = Number(queryParams.get("minute") || dayjs().format("mm"));

const roundedMinute = Math.round(initialMinute / 5) * 5;
const paddedMinute = String(roundedMinute).padStart(2, "0");
const initialMinuteIndex = MINUTES.indexOf(paddedMinute);

type PropsType = {
  onSetSelectedMinutesRef: (container: HTMLDivElement, items: string[]) => void;
};

export const Minutes = ({ onSetSelectedMinutesRef }: PropsType) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    scrollToMiddle(containerRef.current, MINUTES.length);
    onSetSelectedMinutesRef(containerRef.current, MOCK_MINUTES);
  };

  useEffect(() => {
    if (containerRef.current) {
      scrollToMiddle(containerRef.current, MINUTES.length, initialMinuteIndex);
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
