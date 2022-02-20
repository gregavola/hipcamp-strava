export const prettyTime = (value: number): string => {
  return new Date(value * 1000).toISOString().substr(11, 8);
};
