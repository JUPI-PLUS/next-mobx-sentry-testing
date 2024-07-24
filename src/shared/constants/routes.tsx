import {
    AdministratorPermission,
    ExaminationResultsPermission,
    ExaminationsPermission,
    OrdersPermission,
    ProfilePermission,
} from "../models/permissions";

export const ROUTES = {
    entry: {
        route: "/",
    },
    dashboard: {
        route: "/dashboard",
    },
    login: {
        route: "/login",
    },
    signUp: {
        route: "/sign-up",
    },
    orders: {
        list: {
            route: "/orders",
        },
        details: {
            route: "/orders/[uuid]",
        },
    },
    permissions: {
        route: "/permissions",
        permissions: {
            list: [AdministratorPermission.ROLE_ACTIONS],
            tolerant: false,
        },
    },
    printBarcode: {
        route: "/print-barcode",
    },
    createOrder: {
        route: "/create-order/[userId]",
        activation: {
            route: "/create-order/[userId]/activation",
        },
        permissions: {
            list: [OrdersPermission.CREATE],
            tolerant: false,
        },
    },
    patientProfile: {
        route: "/patient-profile/[patientUUID]",
        permissions: {
            list: [ProfilePermission.VIEW_ONE],
            tolerant: false,
        },
    },
    examinations: {
        route: "/examinations",
        preview: {
            route: "/examinations/[uuid]/preview",
        },
        permissions: {
            list: [ExaminationResultsPermission.VIEW_LIST],
            tolerant: false,
        },
    },
    printSamplesTodoList: {
        route: "/print-todo-list",
    },
    parameters: {
        route: "/parameters",
        permissions: {
            list: [ExaminationsPermission.CONSTRUCTOR],
            tolerant: false,
        },
    },
    workplaces: {
        route: "/workplaces",
        create: {
            route: "/workplaces/create",
        },
        edit: {
            route: "/workplaces/[uuid]/edit",
        },
    },
    parameterOptions: {
        route: "/parameter-options",
        permissions: {
            list: [ExaminationsPermission.CONSTRUCTOR],
            tolerant: false,
        },
    },
    sampleTypes: {
        route: "/sample-types",
        permissions: {
            list: [ExaminationsPermission.CONSTRUCTOR],
            tolerant: false,
        },
    },
    measureUnits: {
        route: "/measure-units",
        permissions: {
            list: [ExaminationsPermission.CONSTRUCTOR],
            tolerant: false,
        },
    },
    templates: {
        route: "/templates",
        permissions: {
            list: [],
            tolerant: false,
        },
    },
    createKitTemplate: {
        route: "/templates/kit-template/create",
        permissions: {
            list: [],
            tolerant: false,
        },
    },
    editKitTemplate: {
        route: "/templates/kit-template/[uuid]/edit",
        permissions: {
            list: [],
            tolerant: false,
        },
    },
    examTemplate: {
        route: "/templates/exam-template",
        create: {
            route: "/templates/exam-template/create",
        },
        edit: {
            route: "/templates/exam-template/[uuid]/edit",
        },
    },
    errors: {
        notFound: {
            route: "/errors/not-found",
        },
        forbidden: {
            route: "/errors/forbidden",
        },
    },
};
