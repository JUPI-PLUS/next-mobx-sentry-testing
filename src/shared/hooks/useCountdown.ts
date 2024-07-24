// libs
import { useEffect, useState } from "react";
import { millisecondsToSeconds } from "date-fns";

export const useCountdown = (initialTime: number, autoStart = false) => {
    const [targetTime, setTargetTime] = useState(initialTime);
    const [countDown, setCountDown] = useState(0);

    const start = (time?: number) => {
        const timeDifference = (time || targetTime) - Date.now();
        if (timeDifference > 0) {
            setCountDown(timeDifference);
        }
    };

    const stop = () => {
        setCountDown(0);
    };

    useEffect(() => {
        if (autoStart) {
            setTargetTime(initialTime);
            start(initialTime);
        }
    }, [initialTime, autoStart]);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextDate = targetTime - Date.now();
            if (nextDate <= 0) {
                clearInterval(interval);
                setCountDown(0);
                return;
            }
            setCountDown(nextDate);
        }, 1000);

        if (countDown === 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [countDown]);

    return { start, stop, milliseconds: countDown, isCountDone: millisecondsToSeconds(countDown) === 0 };
};
