function daysUntil(timestamp: number) {
  const now = Date.now();
  const differenceInTime = timestamp - now;
  // Convert time difference from milliseconds to days
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return `${differenceInDays} ${differenceInDays === 1 ? "day" : "days"}`;
}

export default daysUntil;
