import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  type RefObject,
} from "react";
import dayjs from "dayjs";
import debounce from "lodash/debounce";

import {
  CENTRAL_ITEM_COUNT,
  ITEM_HEIGHT,
  MAX_VISIBLE_ITEMS,
} from "appConstants";
import { useWheelEvent } from "hooks/useWheelEvent";
import { queryParams } from "utils/queryParams";

const getPrevDatesFrom = (base: dayjs.Dayjs, count = 20) =>
  Array.from({ length: count }, (_, i) =>
    base.subtract(i + 1, "day")
  ).reverse();

const getNextDatesFrom = (base: dayjs.Dayjs, count = 20) =>
  Array.from({ length: count }, (_, i) => base.add(i + 1, "day"));

const initialDate = dayjs(queryParams.get("date") ?? undefined);

const initialDatesState = [
  ...getPrevDatesFrom(initialDate),
  initialDate,
  ...getNextDatesFrom(initialDate),
];
const initialDateIndex = initialDatesState.findIndex((date) =>
  initialDate.isSame(date, "day")
);

type PropsType = {
  selectedDateRef: RefObject<string>;
  onSetSelectedDateRef: (container: HTMLDivElement, items: string[]) => void;
};

export const Dates = ({ selectedDateRef, onSetSelectedDateRef }: PropsType) => {
  const [dates, setDates] = useState(initialDatesState);

  const containerRef = useRef<HTMLDivElement>(null);
  const isPrependingRef = useRef(false);
  const scrollTopAdjustmentRef = useRef(0);

  const addDatesOnEdgeReach = (container: HTMLDivElement) => {
    if (isPrependingRef.current) return;

    isPrependingRef.current = true;

    if (container.scrollTop <= ITEM_HEIGHT) {
      setDates((prev) => {
        const newDates = [...getPrevDatesFrom(prev[0]), ...prev];

        const centralDateIndex = newDates.findIndex((date) =>
          dayjs(selectedDateRef.current).isSame(date, "day")
        );

        scrollTopAdjustmentRef.current =
          (centralDateIndex - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT;

        return newDates;
      });
    } else if (
      container.scrollTop >=
      (dates.length - MAX_VISIBLE_ITEMS - 1) * ITEM_HEIGHT
    ) {
      setDates((next) => {
        const newDates = [...next, ...getNextDatesFrom(next[next.length - 1])];

        const centralDateIndex = newDates.findIndex((date) =>
          dayjs(selectedDateRef.current).isSame(date, "day")
        );

        scrollTopAdjustmentRef.current =
          (centralDateIndex - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT;

        return newDates;
      });
    }

    setTimeout(() => {
      isPrependingRef.current = false;
    }, 300);
  };

  const handleScroll = debounce(() => {
    if (!containerRef.current) return;

    addDatesOnEdgeReach(containerRef.current);
    onSetSelectedDateRef(
      containerRef.current,
      dates.map((date) => date.format("YYYY-MM-DD"))
    );
  }, 100);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        (initialDateIndex - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT;

      onSetSelectedDateRef(
        containerRef.current,
        initialDatesState.map((date) => date.format("YYYY-MM-DD"))
      );
    }
  }, [onSetSelectedDateRef]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollTop = scrollTopAdjustmentRef.current;
    scrollTopAdjustmentRef.current = 0;
  }, [dates.length]);

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
          const dateName = dayjs().isSame(date, "day")
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
