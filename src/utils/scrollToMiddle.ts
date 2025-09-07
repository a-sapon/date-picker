import { CENTRAL_ITEM_COUNT, ITEM_HEIGHT } from "appConstants";

type UtilType = (
  container: HTMLDivElement,
  itemLength: number,
  init?: number
) => void;

export const scrollToMiddle: UtilType = (
  container,
  itemLength,
  initItemIdx
) => {
  const blockHeight = itemLength * ITEM_HEIGHT;

  if (initItemIdx !== undefined) {
    container.scrollTop =
      (initItemIdx - CENTRAL_ITEM_COUNT) * ITEM_HEIGHT + blockHeight;
  }

  if (container.scrollTop <= ITEM_HEIGHT) {
    container.scrollTop += blockHeight;
  } else if (container.scrollTop >= blockHeight * 2) {
    container.scrollTop -= blockHeight;
  }
};
