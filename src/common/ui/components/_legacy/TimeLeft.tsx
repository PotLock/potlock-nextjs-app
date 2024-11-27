import { useEffect, useState } from "react";

export const TimeLeft = ({ daysLeft }: { daysLeft: number }) => {
  const [timeLeft, setTimeLeft] = useState("-");

  function formatTimeLeft(targetTimestamp: number) {
    const now = new Date().getTime();

    // Calculate time remaining
    const timeRemaining = targetTimestamp - now;

    // Check if time remaining is negative (target time already passed)
    if (timeRemaining <= 0) {
      return "Time's up!";
    }

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Construct formatted time string
    const formattedTime = `${days ? days + "d" : ""} ${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""} ${
      seconds ? seconds + "s" : ""
    }`;

    return formattedTime.trim(); // Remove trailing space
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = formatTimeLeft(daysLeft);
      setTimeLeft(time);
      const now = new Date().getTime();

      if (now > daysLeft) {
        clearInterval(intervalId);
      }
    }, 1000);
  }, [daysLeft]);

  return timeLeft;
};

