export function getTouch(touchList: TouchList | React.TouchList, identifier: number): Touch | null {
  for (let i = 0; i < touchList.length; i++) {
    const touch = touchList.item(i) as Touch;

    if (touch.identifier === identifier) {
      return touch;
    }
  }

  return null;
}
