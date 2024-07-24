import { MutableRefObject, useEffect } from "react";

export const useClickAway = (
    ref: MutableRefObject<HTMLElement | null>,
    callback: () => void,
    sourceRef?: MutableRefObject<HTMLElement | SVGSVGElement | null> | null
) => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sourceRef?.current && sourceRef.current?.contains?.(event.target as Node)) {
                return;
            }
            if (ref.current && !event.composedPath().includes(ref.current)) {
                callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback, sourceRef]);
};
