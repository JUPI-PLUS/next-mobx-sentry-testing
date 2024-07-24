import React, { FC, MouseEvent, useEffect, useId, useMemo } from "react";
import { TabHeaderItemProps } from "./models";
import { useRouter } from "next/router";

const TabHeaderItem: FC<TabHeaderItemProps> = ({
    icon,
    label,
    name,
    isActive,
    isDisabled = false,
    isParentScrollable = false,
}) => {
    const { query, replace } = useRouter();
    const classNames = useMemo(() => `tab ${isActive ? "activeTab" : "text-gray-100"}`, [isActive]);
    const customId = useId();

    useEffect(() => {
        const element = document.getElementById(customId);
        if (isActive && element) {
            element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [isActive]);

    if (isDisabled) {
        return (
            <li className="tab text-gray-200" data-testid={`tab-${label}-name`}>
                <div>{icon}</div>
                {label}
            </li>
        );
    }

    const onTabClick = (event: MouseEvent<Element>) => {
        if (isParentScrollable && event.shiftKey) return;

        replace({
            query: { ...query, tab: name },
        });
    };

    return (
        <li className={classNames} onClick={onTabClick} id={customId} data-testid={`tab-${label}-name`}>
            <div>{icon}</div>
            {label}
        </li>
    );
};

export default React.memo(TabHeaderItem);
