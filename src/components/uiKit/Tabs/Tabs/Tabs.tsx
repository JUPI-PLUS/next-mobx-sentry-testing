// libs
import React, { FC, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

// models
import { TabsProps } from "../models";

// constants
import { ROUTES } from "../../../../shared/constants/routes";

// components
import TabPanels from "../components/TabPanels/TabPanels";
import TabHeader from "./components/TabHeader/TabHeader";

const Tabs: FC<TabsProps> = ({ containerClassname = "", defaultActiveIndex = 0, tabs, children }) => {
    const {
        query: { tab: queryTab },
        replace,
    } = useRouter();

    const validQueryTab = useMemo(() => {
        if (!queryTab) return defaultActiveIndex;
        const numericQueryTab = Number(queryTab);
        if (numericQueryTab >= 0 && numericQueryTab < tabs.length) return numericQueryTab;
        return -1;
    }, [defaultActiveIndex, queryTab, tabs.length]);

    useEffect(() => {
        if (validQueryTab === -1) {
            replace(ROUTES.errors.notFound.route);
        }
    }, [validQueryTab]);

    return (
        <div className={`w-full ${containerClassname}`}>
            <TabHeader tabs={tabs} activeIndex={validQueryTab} />
            <TabPanels activeIndex={validQueryTab}>{children}</TabPanels>
        </div>
    );
};

export default Tabs;
