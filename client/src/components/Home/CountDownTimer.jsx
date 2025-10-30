import React, { useEffect, useState } from "react";
import CountDown from "./CountDown";

const CountdownTimer = ({ duration, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const endTime = Date.now() + duration * 1000;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.(); // Gọi callback khi hết thời gian
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onExpire]);

  // Chuyển giây thành h:m:s
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex justify-center gap-2 items-center my-4">
      <CountDown unit="Hours" number={hours} />
      <CountDown unit="Minutes" number={minutes} />
      <CountDown unit="Seconds" number={seconds} />
    </div>
  );
};

const TimeBox = ({ unit, number }) => (
  <div className="bg-gray-800 text-white rounded-md px-3 py-2 text-center">
    <div className="text-lg font-bold">
      {number.toString().padStart(2, "0")}
    </div>
    <div className="text-xs">{unit}</div>
  </div>
);

export default CountdownTimer;
