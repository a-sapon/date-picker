import { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";

import {
  CENTRAL_ITEM_COUNT,
  ITEM_HEIGHT,
  MAX_VISIBLE_ITEMS,
} from "appConstants";
import { useWheelEvent } from "hooks/useWheelEvent";

// TODO: add query params

const getPrevDatesFrom = (base: dayjs.Dayjs, count = 10) =>
  Array.from({ length: count }, (_, i) =>
    base.subtract(i + 1, "day")
  ).reverse();

const getNextDatesFrom = (base: dayjs.Dayjs, count = 10) =>
  Array.from({ length: count }, (_, i) => base.add(i + 1, "day"));

const currentDate = dayjs();
const initialDatesState = [
  ...getPrevDatesFrom(currentDate),
  currentDate,
  ...getNextDatesFrom(currentDate),
];
const currentDateIndex = initialDatesState.findIndex((date) =>
  currentDate.isSame(dayjs(date), "day")
);

type PropsType = {
  onSetSelectedDateRef: (container: HTMLDivElement, items: string[]) => void;
};

export const Dates = ({ onSetSelectedDateRef }: PropsType) => {
  const [dates, setDates] = useState(initialDatesState);

  const containerRef = useRef<HTMLDivElement>(null);

  const addDatesOnEdgeReach = (container: HTMLDivElement) => {
    if (container.scrollTop <= ITEM_HEIGHT) {
      setDates((prev) => [...getPrevDatesFrom(prev[0]), ...prev]);
    } else if (
      container.scrollTop >=
      (dates.length - MAX_VISIBLE_ITEMS - 1) * ITEM_HEIGHT
    ) {
      setDates((next) => [...next, ...getNextDatesFrom(next[next.length - 1])]);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    addDatesOnEdgeReach(containerRef.current);
    onSetSelectedDateRef(
      containerRef.current,
      dates.map((date) => date.format("ddd MMM D"))
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        (currentDateIndex - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT;

      onSetSelectedDateRef(
        containerRef.current,
        initialDatesState.map((date) => date.format("ddd MMM D"))
      );
    }
  }, [onSetSelectedDateRef]);

  useWheelEvent(containerRef);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="container"
      style={{ height: ITEM_HEIGHT * MAX_VISIBLE_ITEMS }}
    >
      <div className="date-picker-list">
        {dates.map((date) => {
          const dateName = currentDate.isSame(dayjs(date), "day")
            ? "Today"
            : date.format("ddd MMM D");

          return (
            <button
              key={date.toString()}
              className="date-picker-list__item"
              style={{ height: ITEM_HEIGHT }}
            >
              {dateName}
            </button>
          );
        })}
      </div>
    </div>
  );
};
