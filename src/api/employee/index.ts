import { limsClient } from "../config";
import { EMPLOYEE_ENDPOINTS } from "./endpoints";
import { EditGeneralInfoFormPost } from "../../modules/PatientProfile/components/GeneralInfo/models";
import { ID } from "../../shared/models/common";
import { PromisedServerResponse } from "../../shared/models/axios";

export const editUserProfile = ({
    editProfileFormFields,
    id,
}: {
    editProfileFormFields: EditGeneralInfoFormPost;
    id: ID;
}): PromisedServerResponse<null> => limsClient.patch(EMPLOYEE_ENDPOINTS.editUserProfile(id), editProfileFormFields);
