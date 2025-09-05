import { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";

const MAX_VISIBLE_ITEMS = 7;
const ITEM_HEIGHT = 53;
const CENTRAL_ITEM_COUNT = Math.floor(MAX_VISIBLE_ITEMS / 2);

const prevDates = Array.from({ length: 10 }, (_, i) =>
  dayjs().subtract(i, "day").format("ddd MMM D")
).reverse();

const nextDates = Array.from({ length: 10 }, (_, i) =>
  dayjs()
    .add(i + 1, "day")
    .format("ddd MMM D")
);

type PropsType = {
  onSetDateRef: (value: string) => void;
};

export const Dates = ({ onSetDateRef }: PropsType) => {
  const [dates] = useState([...prevDates, ...nextDates]);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = dayjs().format("ddd MMM D");

  const setSelectedItemRef = (container: HTMLDivElement) => {
    const topItem = Math.floor(container.scrollTop / ITEM_HEIGHT);
    const centralItemIdx = topItem + CENTRAL_ITEM_COUNT;

    onSetDateRef(dates[centralItemIdx]);
  };

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    setSelectedItemRef(container);

    if (container.scrollTop <= ITEM_HEIGHT) {
      console.log("need to add more prev dates");
    } else if (
      container.scrollTop >=
      (dates.length - MAX_VISIBLE_ITEMS - 1) * ITEM_HEIGHT
    ) {
      console.log("need to add more next dates");
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const todayIndex = dates.findIndex((date) => date === today);

      containerRef.current.scrollTop =
        (todayIndex - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT;

      onSetDateRef(today);
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
        {dates.map((date) => (
          <button
            key={date}
            className="date-picker-list__item"
            style={{ height: ITEM_HEIGHT }}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
};
