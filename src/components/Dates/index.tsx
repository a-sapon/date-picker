import { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";

// TODO: add am/pm
// TODO: refactor, remove duplicate code
// TODO: add query params

const MAX_VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 53;
const CENTRAL_ITEM_COUNT = Math.floor(MAX_VISIBLE_ITEMS / 2);

const getPrevDatesFrom = (base: dayjs.Dayjs, count = 10) =>
  Array.from({ length: count }, (_, i) =>
    base.subtract(i + 1, "day")
  ).reverse();

const getNextDatesFrom = (base: dayjs.Dayjs, count = 10) =>
  Array.from({ length: count }, (_, i) => base.add(i + 1, "day"));

type PropsType = {
  onSetDateRef: (value: string) => void;
};

export const Dates = ({ onSetDateRef }: PropsType) => {
  const today = dayjs();

  const [dates, setDates] = useState([
    ...getPrevDatesFrom(today),
    today,
    ...getNextDatesFrom(today),
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const setSelectedItemRef = (container: HTMLDivElement) => {
    const topItem = Math.floor(container.scrollTop / ITEM_HEIGHT);
    const centralItemIdx = topItem + CENTRAL_ITEM_COUNT;

    onSetDateRef(dates[centralItemIdx].format("ddd MMM D"));
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    setSelectedItemRef(container);

    if (container.scrollTop <= ITEM_HEIGHT) {
      setDates((prev) => [...getPrevDatesFrom(prev[0]), ...prev]);
    } else if (
      container.scrollTop >=
      (dates.length - MAX_VISIBLE_ITEMS - 1) * ITEM_HEIGHT
    ) {
      setDates((next) => [...next, ...getNextDatesFrom(next[next.length - 1])]);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const todayIndex = dates.findIndex((date) =>
        today.isSame(dayjs(date), "day")
      );

      containerRef.current.scrollTop =
        (todayIndex - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT;

      onSetDateRef(today.format("ddd MMM D"));
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
        {dates.map((date) => {
          const dateName = today.isSame(dayjs(date), "day")
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
