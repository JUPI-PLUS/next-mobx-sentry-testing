import React, { FC } from "react";
import { usePatientStore } from "../../../../store";
import { useMutation } from "react-query";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";
import { AxiosError } from "axios";
import { EditGeneralInfoFormPost } from "../../../GeneralInfo/models";
import { ID } from "../../../../../../shared/models/common";
import { editUserProfile } from "../../../../../../api/employee";
import { showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../../../pages/_app";
import { PATIENTS_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import MakeStaff from "./MakeStaff";
import RemoveFromStaff from "./RemoveFromStaff";
import { Sex } from "../../../../../../shared/models/business/user";
import { MakeStaffFormData, StaffManagementProps } from "./models";
import { observer } from "mobx-react";

const StaffManagement: FC<StaffManagementProps> = ({ id = "" }) => {
    const {
        patientStore: { patient, isStaff },
    } = usePatientStore();

    const { mutateAsync, isLoading } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>,
        { editProfileFormFields: EditGeneralInfoFormPost; id: ID }
    >(editUserProfile, {
        async onSuccess() {
            showSuccessToast({
                title: "Profile has been successfully updated",
            });
            await queryClient.refetchQueries(PATIENTS_QUERY_KEYS.PATIENT(id));
        },
    });

    const onMakeStaffSubmit = async (formData: MakeStaffFormData) => {
        try {
            await mutateAsync({
                id,
                editProfileFormFields: {
                    birth_date: patient!.birth_date!,
                    first_name: patient!.first_name!,
                    last_name: patient!.last_name!,
                    sex_id: patient!.sex_id || Sex.UNKNOWN,
                    organization_id: formData.organization.value,
                    position_id: formData.position.value,
                },
            });
        } catch (e) {}
    };

    const onRemoveFromStaff = async () => {
        try {
            await mutateAsync({
                id,
                editProfileFormFields: {
                    birth_date: patient!.birth_date!,
                    first_name: patient!.first_name!,
                    last_name: patient!.last_name!,
                    sex_id: patient!.sex_id || Sex.UNKNOWN,
                    organization_id: null,
                    position_id: null,
                },
            });
        } catch (e) {}
    };

    if (isStaff) {
        return <RemoveFromStaff onSubmit={onRemoveFromStaff} isLoading={isLoading} />;
    }

    return <MakeStaff onSubmit={onMakeStaffSubmit} />;
};

export default observer(StaffManagement);
