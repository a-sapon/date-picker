import { ITEM_HEIGHT } from "appConstants";

type UtilType = (container: HTMLDivElement, itemLength: number) => void;

export const scrollToCenter: UtilType = (container, itemLength) => {
  const blockHeight = itemLength * ITEM_HEIGHT;

  if (container.scrollTop <= ITEM_HEIGHT) {
    container.scrollTop += blockHeight;
  } else if (container.scrollTop >= blockHeight * 2) {
    container.scrollTop -= blockHeight;
  }
};
