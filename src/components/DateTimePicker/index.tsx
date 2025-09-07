import { useCallback, useRef } from "react";
import dayjs from "dayjs";

import { Dates } from "components/Dates";
import { Hours } from "components/Hours";
import { Minutes } from "components/Minutes";
import { Meridiem } from "components/Meridiem";

import { CENTRAL_ITEM_COUNT, ITEM_HEIGHT } from "appConstants";
import { queryParams, updateQueryParams } from "utils/queryParams";

import "./styles.css";

export const DateTimePicker = () => {
  const selectedDateRef = useRef("");
  const selectedHoursRef = useRef("");
  const selectedMinutesRef = useRef("");
  const selectedMeridiemRef = useRef("AM");

  const setSelectedItemRef = (container: HTMLDivElement, items: string[]) => {
    const topItem = Math.floor(container.scrollTop / ITEM_HEIGHT);
    const centralItemIdx = topItem + CENTRAL_ITEM_COUNT;

    return items[centralItemIdx];
  };

  const setSelectedDateRef = useCallback(
    (container: HTMLDivElement, items: string[]) => {
      selectedDateRef.current = setSelectedItemRef(container, items);
    },
    []
  );

  const setSelectedHoursRef = useCallback(
    (container: HTMLDivElement, items: string[]) => {
      selectedHoursRef.current = setSelectedItemRef(container, items);
    },
    []
  );

  const setSelectedMinutesRef = useCallback(
    (container: HTMLDivElement, items: string[]) => {
      selectedMinutesRef.current = setSelectedItemRef(container, items);
    },
    []
  );

  const setSelectedMeridiemRef = (value: string) => {
    selectedMeridiemRef.current = value;
  };

  const setQueryParams = () => {
    queryParams.set("date", selectedDateRef.current);
    queryParams.set("hour", selectedHoursRef.current);
    queryParams.set("minute", selectedMinutesRef.current);
    queryParams.set("meridiem", selectedMeridiemRef.current);
    updateQueryParams();
  };

  const handleClick = () => {
    setQueryParams();

    console.log(
      `Selected date: ${dayjs(selectedDateRef.current).format(
        "ddd MMM D"
      )} at ${selectedHoursRef.current}:${selectedMinutesRef.current}`
    );
  };

  return (
    <div>
      <div
        className="wrapper"
        style={{ "--item-height": `${ITEM_HEIGHT}px` } as React.CSSProperties}
      >
        <Dates onSetSelectedDateRef={setSelectedDateRef} />
        <Hours onSetSelectedHoursRef={setSelectedHoursRef} />
        <Minutes onSetSelectedMinutesRef={setSelectedMinutesRef} />
        <Meridiem onSetSelectedMeridiemRef={setSelectedMeridiemRef} />
      </div>
      <button className="submit-btn" onClick={handleClick}>
        Submit
      </button>
    </div>
  );
};
