// libs
import { FC } from "react";
import { observer } from "mobx-react";

// hooks
import { useFormValidation } from "../../../../../../shared/hooks/useFormValidation";
import { usePermissionsAccess } from "../../../../../../shared/hooks/useUserAccess";

// models
import { ProfilePermission } from "../../../../../../shared/models/permissions";
import { FormWithValidationProps } from "../../models";

// stores
import { usePatientStore } from "../../../../store";

// constants
import { CURRENT_YEAR } from "../../../../../../components/uiKit/DatePickers/constants";

// components
import FormDatePicker from "../../../../../../components/uiKit/DatePickers/DatePicker/FormDatePicker";
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormSelect from "../../../../../../components/uiKit/forms/selects/Select/FormSelect";

const MainInfo: FC<FormWithValidationProps> = ({ isError, errors }) => {
    const {
        patientStore: { sexTypes },
    } = usePatientStore();
    useFormValidation({ isError, errors });

    const isAllowedToEditProfile = usePermissionsAccess(ProfilePermission.EDIT_GENERAL_FIELDS);
    const isAllowedToEditProfileOrMyself = !isAllowedToEditProfile;

    return (
        <div className="flex flex-col flex-1 gap-4 pb-9">
            <div className="flex gap-3">
                <FormInput
                    label="First name"
                    containerClassName="flex-1"
                    name="first_name"
                    data-testid="patient-first-name"
                    disabled={isAllowedToEditProfileOrMyself}
                />
                <FormInput
                    label="Last name"
                    containerClassName="flex-1"
                    name="last_name"
                    data-testid="patient-last-name"
                    disabled={isAllowedToEditProfileOrMyself}
                />
            </div>
            <FormInput
                label="Middle name"
                name="middle_name"
                data-testid="patient-middle-name"
                // disabled={isAllowedToEditProfileOrMyself}
                disabled
            />
            <FormDatePicker
                name="birth_date"
                label="Birthdate"
                popperPlacement="right-end"
                offsetDistance={25}
                offsetSkidding={200}
                disabled={isAllowedToEditProfileOrMyself}
                disabledDate={{ after: new Date() }}
                maxYear={CURRENT_YEAR}
            />
            <FormSelect options={sexTypes} label="Sex" name="sex" disabled={isAllowedToEditProfileOrMyself} />
        </div>
    );
};

export default observer(MainInfo);
