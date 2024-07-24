import { UsersPermission } from "../../../shared/models/permissions";

export interface TabProps {
    label: string;
    isDisabled?: boolean;
    permissions?: UsersPermission[];
    tolerant?: boolean;
    icon?: JSX.Element;
}

export interface TabsProps {
    defaultActiveIndex?: number;
    containerClassname?: string;
    tabs: TabProps[];
    children: JSX.Element | JSX.Element[];
}

export interface RoutingTabProps extends TabProps {
    name: string;
}

export interface RoutingTabsProps extends Omit<TabsProps, "defaultActiveIndex" | "tabs"> {
    tabs: RoutingTabProps[];
}
