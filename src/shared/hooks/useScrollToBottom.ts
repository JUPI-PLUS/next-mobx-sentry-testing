import { useEffect } from "react";

const useScrollToBottom = (scrollElementId: string, shouldScroll = true) => {
    useEffect(() => {
        const scrollElement = document.getElementById(scrollElementId);
        if (!scrollElement || !shouldScroll) return;
        scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
    }, [shouldScroll]);
};

export default useScrollToBottom;
