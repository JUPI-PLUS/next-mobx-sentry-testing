// libs
import React from "react";

// models
import { AdministratorPermission, ExaminationsPermission, OrdersPermission } from "../../../shared/models/permissions";
import { MenuMainItem } from "./models";

// constants
import { ROUTES } from "../../../shared/constants/routes";

// components
import { HomeIcon, ExamIcon, ConstructorIcon, RolesIcon, CalendarIcon, OrganizationIcon } from "../../uiKit/Icons";

export const menuItems: MenuMainItem[] = [
    {
        route: ROUTES.dashboard.route,
        label: "Dashboard",
        icon: <HomeIcon />,
    },
    {
        route: ROUTES.orders.list.route,
        label: "Orders",
        icon: <CalendarIcon />,
        permissions: {
            list: [OrdersPermission.VIEW_LIST, OrdersPermission.VIEW_LIST_SELF_CREATED],
            tolerant: true,
        },
    },
    {
        route: ROUTES.examinations.route,
        label: "Examinations",
        icon: <ExamIcon />,
        permissions: ROUTES.examinations.permissions,
    },
    {
        label: "Constructor",
        icon: <ConstructorIcon />,
        permissions: {
            list: [ExaminationsPermission.CONSTRUCTOR],
        },
        child: [
            {
                route: ROUTES.templates.route,
                label: "Examination templates",
            },
            {
                route: ROUTES.parameters.route,
                label: "Examination parameters",
            },
            {
                route: ROUTES.parameterOptions.route,
                label: "Parameter options",
            },
            {
                route: ROUTES.sampleTypes.route,
                label: "Sample types",
            },
            {
                route: ROUTES.measureUnits.route,
                label: "Measure units",
            },
        ],
    },
    {
        label: "Organization",
        icon: <OrganizationIcon />,
        permissions: {
            list: [AdministratorPermission.WORKPLACES],
        },
        child: [
            {
                route: ROUTES.workplaces.route,
                label: "Workplaces",
                permissions: {
                    list: [AdministratorPermission.WORKPLACES],
                },
            },
        ],
    },
    {
        route: ROUTES.permissions.route,
        label: "Roles",
        icon: <RolesIcon />,
        permissions: ROUTES.permissions.permissions,
    },
];
