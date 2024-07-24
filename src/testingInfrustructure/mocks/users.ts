import { faker } from "@faker-js/faker";
import { Me, Patient, Sex, UserStatus } from "../../shared/models/business/user";
import {
    AdministratorPermission,
    ExaminationsPermission,
    ExaminationResultsPermission,
    OrdersPermission,
    Permissions,
    ProfilePermission,
    SamplingPermission,
    UsersPermission,
} from "../../shared/models/permissions";

const randomBarcode = () => faker.datatype.number({ min: 1000000 }).toString();
const randomUuid = () => faker.datatype.uuid();
const randomFirstName = () => faker.name.firstName();
const randomLastName = () => faker.name.lastName();
const randomEmail = () => faker.internet.email();
const randomBirthDate = () => faker.date.birthdate({ min: 18, max: 65, mode: "age" }).getMilliseconds();

export const MOCK_USER = ({
    status = UserStatus.ACTIVE,
    hasImage = true,
    organization_id = 1,
    position_id = 1,
}: {
    hasImage?: boolean;
    status?: UserStatus;
    isOwner?: boolean;
    organization_id?: number | null;
    position_id?: number | null;
}): Me => {
    return {
        id: 1,
        email: randomEmail(),
        first_name: randomFirstName(),
        last_name: randomLastName(),
        uuid: randomUuid(),
        sex_id: Sex.FEMALE,
        profile_photo: hasImage ? faker.internet.avatar() : null,
        birth_date: randomBirthDate(),
        status: status,
        organization_id,
        position_id,
        barcode: randomBarcode(),
    };
};

export const MOCK_PATIENT: Patient = {
    id: 1,
    email: randomEmail(),
    first_name: randomFirstName(),
    last_name: randomLastName(),
    uuid: randomUuid(),
    sex_id: Sex.UNKNOWN,
    birth_date: Date.now() / 1000,
    organization_id: 1,
    position_id: 1,
    barcode: randomBarcode(),
};

export const MOCK_DELETED_PATIENT: Patient = {
    ...MOCK_PATIENT,
    first_name: null,
    last_name: null,
    sex_id: null,
    birth_date: null,
};

export const MOCKED_TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4wLjgwOjU5L2FwaS92MS91c2VyL2xvZ2luIiwiaWF0IjoxNjc1MjQ0NTIwLCJleHAiOjE2Nzg4NDQ1MjAsIm5iZiI6MTY3NTI0NDUyMCwianRpIjoiUmZ5MkxtTkVDN1lFTUNIQyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwicGVybWlzc2lvbnMiOlsxMDAwLDEwMDEsMTAwMiwxMDAzLDEwMDQsMTAwNSwxMDA2LDEwMDgsMjAwMCwzMDAwLDMwMDEsMzAwMiwzMDAzLDMwMDQsMzAwNiw0MDAwLDQwMDEsNDAwMiw1MDAwLDUwMDEsNTAwMl19.MztWaWsY1BddH0UF2Pvgdzdlb6WwctFDgSLnWaV7Tnc";

const getPermissions = (obj: Permissions): Array<number> => {
    return Object.values(obj).filter(v => Number(v));
};

export const MOCKED_PERMISSIONS_IDS = [
    ...getPermissions(OrdersPermission),
    ...getPermissions(SamplingPermission),
    ...getPermissions(ProfilePermission),
    ...getPermissions(ExaminationResultsPermission),
    ...getPermissions(ExaminationsPermission),
    ...getPermissions(AdministratorPermission),
    ...getPermissions(UsersPermission),
];

export const MOCKED_PERMISSIONS_DATA = [
    {
        id: 1,
        name: "orders_page_view",
        group: "Orders",
        description:
            "Ability to view “Orders” page, Search patients, select Patient to view orders of this patient. Without permission “Add order”, “View/Edit Patient profile“, “Sampling“, etc",
    },
    {
        id: 2,
        name: "order_create",
        group: "Orders",
        description: "Ability to create a new order for Patient from “Orders” page by clicking on button.",
    },
    {
        id: 3,
        name: "download_order",
        group: "Orders",
        description: "Ability to download order result as PDF for patient",
    },
    {
        id: 4,
        name: "show_order",
        group: "Orders",
        description: "Ability to view order info or results for this order",
    },
    {
        id: 5,
        name: "sampling",
        group: "Sampling",
        description:
            "Ability of sampling management (add new sample to exam, mark sample as damaged, remove sample, make resampling, print barcode). Without permission sampling buttons are blocked.",
    },
    {
        id: 6,
        name: "user_profile_page_view",
        group: "User profile",
        description: "Ability to view Patient profile page without editing",
    },
    {
        id: 7,
        name: "user_profile_general",
        group: "User profile",
        description: "Ability to edit Patient profile general tab",
    },
    {
        id: 8,
        name: "user_make_staff",
        group: "User profile",
        description: "Ability to make Patient as Staff",
    },
    {
        id: 9,
        name: "examination_page_view",
        group: "Examinations",
        description:
            "Ability to view “Examination” page, view samples list and results for samples without possibility to save or validate results",
    },
    {
        id: 10,
        name: "save_results",
        group: "Examinations",
        description: "Ability save results on “Examination” page",
    },
    {
        id: 11,
        name: "validate_results",
        group: "Examinations",
        description: "Ability validate results on “Examination” page",
    },
    {
        id: 12,
        name: "constructor",
        group: "Administrator",
        description: "Ability to create/edit/delete exam templates/kit templates/params.",
    },
    {
        id: 13,
        name: "roles_permissions",
        group: "Administrator",
        description: "Ability to create Roles, select permissions for Roles and give Roles to LIMS Users",
    },
    {
        id: 14,
        name: "user_set_roles",
        group: "User profile",
        description: "Ability to assign or edit user role",
    },
];
