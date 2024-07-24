// libs
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// hooks
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// helpers
import { getUserRoles as getUserRolesDictionaries } from "../../../../api/dictionaries";
import { toLookupList } from "../../../../shared/utils/lookups";

// stores
import { useRootStore } from "../../../../shared/store";

// models
import { RolesFormWithValidationProps } from "./models";
import { ProfilePermission } from "../../../../shared/models/permissions";

// constants
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import FormMultiSelect from "../../../../components/uiKit/forms/selects/MultiSelect/FormMultiSelect";
import { usePatientStore } from "../../store";

const RolesForm: FC<RolesFormWithValidationProps> = ({ id = "", isError, errors }) => {
    const {
        user: { user },
    } = useRootStore();
    const {
        formState: { isSubmitting, errors: formErrors, isDirty },
    } = useFormContext();

    const {
        patientStore: { patient },
    } = usePatientStore();

    useFormValidation({ isError, errors });

    const { data: userRolesLookup = [], isFetching: isUserRolesDictionariesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.USER_ROLES,
        getUserRolesDictionaries,
        {
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const isMe = id === user?.uuid;

    const isAllowedToEditProfile = usePermissionsAccess(ProfilePermission.EDIT_GENERAL_FIELDS);
    const isAllowedToMakeAStaff = usePermissionsAccess(ProfilePermission.MAKE_STAFF);
    const isSaveButtonVisible = isAllowedToEditProfile || (isAllowedToMakeAStaff && !isMe);
    const isMakeAStaff = patient ? Boolean(patient.organization_id || patient.position_id) : false;
    const rolesSelectDisable = !isMakeAStaff || isUserRolesDictionariesFetching || isMe;

    return (
        <>
            <FormMultiSelect
                options={userRolesLookup}
                label="User roles"
                name="roles"
                disabled={rolesSelectDisable}
                className="p-6 flex-1"
            />
            {isSaveButtonVisible && (
                <div className="flex justify-end p-6">
                    <SolidButton
                        data-testid="submit-dialog-button"
                        variant="primary"
                        text="Save"
                        type="submit"
                        className="py-3 px-8"
                        disabled={isSubmitting || !isEmpty(formErrors) || rolesSelectDisable || !isDirty}
                    />
                </div>
            )}
        </>
    );
};

export default observer(RolesForm);
