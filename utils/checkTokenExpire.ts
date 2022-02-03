import differenceInMilliseconds from "date-fns/differenceInMilliseconds";

export function checkTokenExpire(expiresAt: number) {
  console.log(expiresAt);
  const expiresAtDate = new Date(expiresAt * 1000);
  const dateNow = new Date();

  console.log(expiresAtDate);
  console.log(dateNow);

  const diffTime = differenceInMilliseconds(expiresAtDate, dateNow);

  console.log(diffTime);

  return diffTime < 0 ? true : false;
}
