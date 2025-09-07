import { useRef, useEffect } from "react";
import dayjs from "dayjs";

import { ITEM_HEIGHT, MAX_VISIBLE_ITEMS } from "appConstants";
import { scrollToMiddle } from "utils/scrollToMiddle";
import { useWheelEvent } from "hooks/useWheelEvent";
import { queryParams } from "utils/queryParams";

const HOURS = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const MOCK_HOURS = [...HOURS, ...HOURS, ...HOURS];

const initialHour = queryParams.get("hour") || dayjs().format("h");
const initialHourIndex = HOURS.findIndex((hour) => initialHour === hour);

type PropsType = {
  onSetSelectedHoursRef: (container: HTMLDivElement, items: string[]) => void;
};

export const Hours = ({ onSetSelectedHoursRef }: PropsType) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    scrollToMiddle(containerRef.current, HOURS.length);
    onSetSelectedHoursRef(containerRef.current, MOCK_HOURS);
  };

  useEffect(() => {
    if (containerRef.current) {
      scrollToMiddle(containerRef.current, HOURS.length, initialHourIndex);
      onSetSelectedHoursRef(containerRef.current, MOCK_HOURS);
    }
  }, [onSetSelectedHoursRef]);

  useWheelEvent(containerRef);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="container"
      style={{ height: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
    >
      <div className="date-picker-list">
        {MOCK_HOURS.map((hour, idx) => (
          <button
            key={idx}
            className="date-picker-list__item"
            style={{ height: ITEM_HEIGHT }}
          >
            {hour}
          </button>
        ))}
      </div>
    </div>
  );
};
