export const distanceConverter = (distance: number): number => {
  const kmValue = distance / 1000;
  return parseFloat((kmValue * 0.621371).toFixed(2));
};
