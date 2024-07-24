import { useEffect, useMemo, useState } from "react";
import { NumberRange } from "../models/common";
import { isValueReal } from "../utils/common";

const PERCENT_OF_ELEMENT_IN_VIEW_PORT = 0.6;

const useIsInViewport = (
    element: Element | null | undefined,
    percentOfElementInViewPort?: NumberRange<0, 100>,
    isDefaultIntersecting = false,
    isDisable = false
) => {
    const [isIntersecting, setIsIntersecting] = useState(isDefaultIntersecting);

    const observer = useMemo(() => {
        if (isDisable) return null;

        return new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), {
            threshold: isValueReal(percentOfElementInViewPort)
                ? percentOfElementInViewPort / 100
                : PERCENT_OF_ELEMENT_IN_VIEW_PORT,
        });
    }, [isDisable, percentOfElementInViewPort]);

    useEffect(() => {
        if (observer && element) observer.observe(element);

        return () => {
            if (observer) observer.disconnect();
        };
    }, [element, observer]);

    return isIntersecting;
};

export default useIsInViewport;
