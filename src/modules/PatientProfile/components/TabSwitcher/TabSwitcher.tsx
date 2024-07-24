// libs
import dynamic from "next/dynamic";
import { FC } from "react";

// constants
import { PatientProfileTabEnum } from "../../constants";

// components
import CircularProgressLoader from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { ContactsSkeleton } from "../Contacts/components/Skeletons";

const DynamicGeneralInfoFormContainer = dynamic(() => import("../GeneralInfo/GeneralInfoContainer"), {
    ssr: false,
    loading: () => <CircularProgressLoader containerClassName="h-full w-full flex items-center justify-center" />,
});

const DynamicRolesFormContainer = dynamic(() => import("../Roles/RolesContainer"), {
    ssr: false,
    loading: () => <CircularProgressLoader containerClassName="h-full w-full flex items-center justify-center" />,
});

const DynamicContactsContainer = dynamic(() => import("../Contacts/ContactsContainer"), {
    ssr: false,
    loading: () => <ContactsSkeleton />,
});

const TabSwitcher: FC<{ index: number; tab: { label: string }; patientUUIDFromQuery: string }> = ({
    tab,
    index,
    patientUUIDFromQuery,
}) => {
    switch (index) {
        case PatientProfileTabEnum.GENERAL_INFO:
            return <DynamicGeneralInfoFormContainer id={patientUUIDFromQuery} />;
        case PatientProfileTabEnum.ROLES:
            return <DynamicRolesFormContainer id={patientUUIDFromQuery} />;
        case PatientProfileTabEnum.CONTACTS:
            return <DynamicContactsContainer uuid={patientUUIDFromQuery} />;
        default:
            return (
                <span className="max-h-full h-full w-full flex flex-col bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg overflow-hidden p-6">
                    {tab.label}
                </span>
            );
    }
};

export default TabSwitcher;
