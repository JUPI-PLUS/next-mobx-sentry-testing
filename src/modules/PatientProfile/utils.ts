import { TabProps } from "../../components/uiKit/Tabs/models";
import { UsersPermission } from "../../shared/models/permissions";

export const tabsArr: TabProps[] = [
    { label: "General info" },
    { label: "Roles", permissions: [UsersPermission.ASSIGN_ROLE] },
    { label: "Deprecated_Orders & exams" },
    { label: "Emergency contacts" },
    { label: "Address" },
    { label: "Contacts", permissions: [UsersPermission.USER_CONTACTS] },
    { label: "Documents" },
    { label: "Insure" },
    { label: "Family ties" },
    { label: "Attending doctors" },
];
