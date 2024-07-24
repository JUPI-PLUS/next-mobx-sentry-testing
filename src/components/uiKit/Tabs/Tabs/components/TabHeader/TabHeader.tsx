// libs
import { FC, useRef } from "react";

// models
import { TabHeaderProps } from "./models";

// hooks
import useDragScroll from "../../../../../../shared/hooks/useDragScroll";

// components
import { IconButton } from "../../../../Button/Button";
import TabHeaderItem from "../../../components/TabHeaderItem/TabHeaderItem";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../../Icons";

const TabHeader: FC<TabHeaderProps> = ({ tabs, activeIndex }) => {
    const tabsListRef = useRef<HTMLUListElement>(null);

    const {
        isFirstElementInView,
        isLastElementInView,
        isScrollable: isTabsScrollable,
        onMouseDown,
        onMouseUp,
        onMouseMove,
        onMouseLeave,
    } = useDragScroll(tabsListRef);

    const scrollToStart = () => {
        if (isTabsScrollable && !isFirstElementInView) {
            tabsListRef.current?.firstElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    const scrollToEnd = () => {
        if (isTabsScrollable && !isLastElementInView) {
            tabsListRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    return (
        <div className="bg-white shadow-card-shadow mb-2 rounded-lg border border-inset border-dark-200 flex">
            <IconButton
                onClick={scrollToStart}
                className={!isTabsScrollable || isFirstElementInView ? "opacity-0 cursor-default" : ""}
            >
                <ChevronLeftIcon className="w-8 h-8 stroke-black stroke-2" />
            </IconButton>
            <ul
                className="flex gap-x-6 overflow-y-auto hide-scrollbar select-none"
                ref={tabsListRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
            >
                {tabs.map(({ label, isDisabled }, index) => (
                    <TabHeaderItem
                        name={index}
                        key={label}
                        label={label}
                        isActive={activeIndex === index}
                        isDisabled={isDisabled}
                        isParentScrollable={isTabsScrollable}
                    />
                ))}
            </ul>
            <IconButton
                onClick={scrollToEnd}
                className={!isTabsScrollable || isLastElementInView ? "opacity-0 cursor-default" : ""}
            >
                <ChevronRightIcon className="w-8 h-8 stroke-black stroke-2" />
            </IconButton>
        </div>
    );
};

export default TabHeader;
