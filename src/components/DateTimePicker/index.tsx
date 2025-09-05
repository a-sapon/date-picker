import { useRef } from "react";

import { Dates } from "../Dates";
import { Hours } from "../Hours";
import { Minutes } from "../Minutes";

import "./styles.css";

const ITEM_HEIGHT = 53;

export const DateTimePicker = () => {
  const selectedDateRef = useRef("");
  const selectedHoursRef = useRef("");
  const selectedMinutesRef = useRef("");

  const handleSetDateRef = (value: string) => {
    selectedDateRef.current = value;
  };
  const handleSetHoursRef = (value: string) => {
    selectedHoursRef.current = value;
  };
  const handleSetMinutesRef = (value: string) => {
    selectedMinutesRef.current = value;
  };

  const handleClick = () => {
    console.log(
      `Selected date: ${selectedDateRef.current} at ${selectedHoursRef.current}:${selectedMinutesRef.current}`
    );
  };

  return (
    <div>
      <div
        className="wrapper"
        style={{ "--item-height": `${ITEM_HEIGHT}px` } as React.CSSProperties}
      >
        <Dates onSetDateRef={handleSetDateRef} />
        <Hours onSetHoursRef={handleSetHoursRef} />
        <Minutes onSetMinutesRef={handleSetMinutesRef} />
      </div>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
};
