import React, { useEffect, useState } from "react";
import CountDown from "./CountDown";
import { useDealDailyStore } from "@/lib/zustand/useDealDailyStore";

const CountdownTimer = ({ duration, onExpire }) => {
  const { endTime, setDealDaily, dealDaily } = useDealDailyStore();
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    let finalEndTime = endTime;

    // Nếu chưa có endTime trong store => tạo mới (tức lần đầu tiên có deal)
    if (!finalEndTime) {
      finalEndTime = Date.now() + duration * 1000;
      setDealDaily(dealDaily, finalEndTime);
    }

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((finalEndTime - Date.now()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.(); // Hết hạn thì gọi callback
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onExpire, endTime]);

  // Định dạng giờ/phút/giây
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

export default CountdownTimer;
