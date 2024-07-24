// libs
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

type WindowSize = {
    width: number | null;
    height: number | null;
};

const useWindowResize = () => {
    const [isResizing, setIsResizing] = useState(false);
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: null,
        height: null,
    });

    const handleSetSize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        setIsResizing(false);
    };

    const handleResizeDebounced = debounce(handleSetSize, 100);

    const handleResize = () => {
        setIsResizing(true);
        handleResizeDebounced();
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleSetSize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { windowSize, isResizing };
};

export default useWindowResize;
