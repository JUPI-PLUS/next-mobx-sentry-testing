import React, { FC, useEffect, useState } from "react";
import TabPanels from "../components/TabPanels/TabPanels";
import { RoutingTabProps, RoutingTabsProps } from "../models";
import { useRouter } from "next/router";
import TabHeaderItem from "../components/TabHeaderItem/TabHeaderItem";

const getActiveTabIndex = (tabs: RoutingTabProps[], tab: string) => {
    const index = tabs.findIndex(it => it.name === tab);
    return index >= 0 ? index : 0;
};

const RoutingTabs: FC<RoutingTabsProps> = ({ containerClassname, tabs, children }) => {
    const {
        isReady,
        query: { tab },
    } = useRouter();

    const [activeTabIndex, setActiveTabIndex] = useState(-1);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        if (!isReady) return;
        const index = getActiveTabIndex(tabs, activeTab ? activeTab : (tab as string));

        if (index === activeTabIndex) return;
        if (tab === activeTab) return;

        setActiveTabIndex(tab ? index : 0);
        setActiveTab(tabs[index].name);
    }, [isReady, tab, activeTabIndex, activeTab, tabs]);

    if (!isReady) return null;

    return (
        <div className="w-full max-w-full h-full grid grid-rows-[50px_1fr]">
            <div className="mb-4 h-full">
                <ul className={`flex flex-row ${containerClassname}`}>
                    {tabs.map((it, index) => {
                        return (
                            <TabHeaderItem
                                label={it.label}
                                name={it.name}
                                isActive={activeTabIndex === index}
                                icon={it.icon}
                            />
                        );
                    })}
                </ul>
            </div>
            <TabPanels activeIndex={activeTabIndex}>{children}</TabPanels>
        </div>
    );
};

export default RoutingTabs;
