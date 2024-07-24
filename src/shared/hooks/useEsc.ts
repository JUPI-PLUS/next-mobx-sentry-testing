import { useCallback, useEffect } from "react";

const useEsc = (cb: () => void) => {
    const eventCallback = useCallback(
        (event: KeyboardEvent) => {
            if (event.code === "Escape") {
                cb();
            }
        },
        [cb]
    );

    useEffect(() => {
        document.addEventListener("keydown", eventCallback);
        return () => {
            document.removeEventListener("keydown", eventCallback);
        };
    }, [eventCallback]);
};

export default useEsc;
