export const formattedDate = (deadline) => {
  let date = `${deadline.getFullYear()}-`;

  if (deadline.getMonth() < 10) date += `0${deadline.getMonth()}-`;
  else date += `${deadline.getMonth()}-`;

  if (deadline.getDate() < 10) date += `0${deadline.getDate()}`;
  else date += `${deadline.getDate()}`;

  return date;
};
