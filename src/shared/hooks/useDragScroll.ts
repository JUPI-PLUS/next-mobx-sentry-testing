import { MouseEvent, RefObject, useMemo, useState } from "react";
import useIsInViewport from "./useIsInViewport";
import useMount from "./useMount";

const useDragScroll = (parentRef: RefObject<Element | null>) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [clientX, setClientX] = useState(0);
    const parentElement = parentRef.current;

    useMount();

    const isFirstElementFullInView = useIsInViewport(parentElement?.firstElementChild, 100, true);
    const isLastElementFullInView = useIsInViewport(parentElement?.lastElementChild, 100, true);
    const isFirstElementInView = useIsInViewport(parentElement?.firstElementChild, 60, true);
    const isLastElementInView = useIsInViewport(parentElement?.lastElementChild, 60, true);

    const isScrollable = useMemo(() => {
        if (isFirstElementFullInView && isLastElementFullInView) return false;

        return true;
    }, [isFirstElementFullInView, isLastElementFullInView]);

    if (!isScrollable) {
        return { isFirstElementInView, isLastElementInView, isScrollable, isScrolling };
    }

    const onMouseDown = (event: MouseEvent<Element>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!event.shiftKey) return;
        setIsScrolling(true);
        setClientX(event.clientX);
    };

    const onMouseUp = (event: MouseEvent<Element>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsScrolling(false);
    };

    const onMouseMove = (event: MouseEvent<Element>) => {
        event.preventDefault();
        event.stopPropagation();
        if (isScrolling && parentElement) {
            parentElement.scrollLeft -= event.clientX - clientX;
            setClientX(event.clientX);
        }
    };

    const onMouseLeave = () => {
        if (!isScrolling) return;

        setIsScrolling(false);
    };

    return {
        isFirstElementInView,
        isLastElementInView,
        isScrollable,
        isScrolling,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
    };
};

export default useDragScroll;
