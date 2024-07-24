// libs
import { AxiosError } from "axios";
import React, { FC } from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";

// helpers
import { queryClient } from "../../../../../pages/_app";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { patchUserRoles } from "../../../../api/users";
import { getUserRoles } from "../../../../api/users";
import { schema } from "./schema";
import { toLookupList } from "../../../../shared/utils/lookups";

// constants
import { DICTIONARIES_QUERY_KEYS, USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// models
import { UserRoleDictionaryItem } from "../../../../shared/models/dictionaries";
import { RolesFormProps, RolesFormFields, PatchUserRolesRequest } from "./models";

// components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import RolesForm from "./RolesForm";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const RolesContainer: FC<RolesFormProps> = ({ id = "" }) => {
    const { mutateAsync, isError, error } = useMutation<
        ServerResponse<UserRoleDictionaryItem[]>,
        AxiosError<BaseFormServerValidation>,
        PatchUserRolesRequest
    >(patchUserRoles, {
        onSuccess() {
            showSuccessToast({
                title: "Roles have been successfully updated",
            });
        },
        onError() {
            showErrorToast({
                title: "Incorrect role",
            });
        },
        onSettled() {
            queryClient.refetchQueries(USERS_QUERY_KEYS.ROLES(id));
            queryClient.refetchQueries(DICTIONARIES_QUERY_KEYS.USER_ROLES);
        },
    });

    const { data: userRoles = null, isFetching: isUserRolesFetching } = useQuery(
        USERS_QUERY_KEYS.ROLES(id),
        getUserRoles(id),
        {
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const defaultValues = {
        roles: userRoles,
    };

    const onSubmit = async (profileFormFields: RolesFormFields) => {
        const { roles: formRoles } = profileFormFields;
        try {
            await mutateAsync({ user_uuid: id, roles: (formRoles?.map(({ value }) => value) || []) as number[] });
        } catch (err) {}
    };

    if (isUserRolesFetching)
        return (
            <CircularProgressLoader containerClassName="flex w-full h-full items-center justify-center bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg" />
        );

    return (
        <FormContainer<RolesFormFields>
            onSubmit={onSubmit}
            schema={schema}
            defaultValues={defaultValues}
            className="max-h-full h-full w-full flex flex-col bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg divide-y divide-dark-400 overflow-hidden"
        >
            <RolesForm id={id} errors={error} isError={isError} />
        </FormContainer>
    );
};

export default observer(RolesContainer);
