import { useState, useEffect, useCallback } from 'react';

export default function useCountdown(targetDate) {
  const calculate = useCallback(() => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      ended: false,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculate());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(id);
  }, [calculate]);

  return timeLeft;
}
