// libs
import { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";

// hooks
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";

// models
import { GeneralInfoFormProps } from "./models";
import { ProfilePermission } from "../../../../shared/models/permissions";

// components
import GeneralInfoHeader from "./components/Header/GeneralInfoHeader";
import GeneralInfoFooter from "./components/Footer/GeneralInfoFooter";
import GeneralInfoContent from "./components/GeneralInfoContent/GeneralInfoContent";

const GeneralInfoForm: FC<GeneralInfoFormProps> = ({ errors, isError, defaultValues }) => {
    const { reset } = useFormContext();

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues]);

    const isAllowedToEditProfile = usePermissionsAccess(ProfilePermission.EDIT_GENERAL_FIELDS);
    const isSaveButtonDisable = !isAllowedToEditProfile;

    return (
        <>
            <GeneralInfoHeader />
            <GeneralInfoContent errors={errors} isError={isError} />
            <GeneralInfoFooter isSaveButtonDisable={isSaveButtonDisable} />
        </>
    );
};

export default GeneralInfoForm;
