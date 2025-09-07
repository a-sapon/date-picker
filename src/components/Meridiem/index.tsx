import { useRef } from "react";

import {
  CENTRAL_ITEM_COUNT,
  ITEM_HEIGHT,
  MAX_VISIBLE_ITEMS,
} from "appConstants";

const MERIDIEM = ["AM", "PM"];
const FAKE_ITEMS = [
  ...Array(CENTRAL_ITEM_COUNT),
  ...MERIDIEM,
  ...Array(CENTRAL_ITEM_COUNT),
];

type PropsType = {
  onSetSelectedMeridiemRef: (value: string) => void;
};

export const Meridiem = ({ onSetSelectedMeridiemRef }: PropsType) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const topItem = Math.floor(containerRef.current.scrollTop / ITEM_HEIGHT);

    onSetSelectedMeridiemRef(MERIDIEM[topItem]);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="container"
      style={{ height: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
    >
      <div className="date-picker-list">
        {FAKE_ITEMS.map((value, idx) => (
          <button
            key={idx}
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
