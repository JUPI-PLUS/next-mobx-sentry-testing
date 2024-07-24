import { KeyboardEvent, useCallback } from "react";

const useKeyEvent = <T>(keys: string[], cb?: () => void) => {
    const eventCallback = useCallback(
        (event: KeyboardEvent<T>) => {
            if (keys.includes(event.code)) {
                event.preventDefault();
                cb?.();
            }
        },
        [cb]
    );

    return { eventCallback };
};

export default useKeyEvent;
