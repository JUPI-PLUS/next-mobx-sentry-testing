import { observer } from "mobx-react";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import PermissionsTableForm from "./components/PermissionsTableForm/PermissionsTableForm";
import { usePermissionsStore } from "../../store";
import { useMutation, useQuery } from "react-query";
import { addRolePermissions } from "../../../../api/roles";
import { ServerResponse } from "../../../../shared/models/axios";
import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../../../shared/models/axios";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { PERMISSIONS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { queryClient } from "../../../../../pages/_app";
import { object } from "yup";
import { getPermissionsList } from "../../../../api/permissions";
import groupBy from "lodash/groupBy";
import { Permission } from "../../../../shared/models/permissions";
import { getIdsFromObjectKeys, getPermissionsObjectFromArray } from "../../utils";
import { LinkPermissionsToRoleParameters, PermissionsFormValues } from "../../models";
import { rollbackErrorMessage } from "../../../../shared/errors/errorMessages";
import PermissionsTableHeader from "./components/PermissionsTableHeader";

const PermissionsTable = () => {
    const {
        permissionsStore: { activeRole, setupRecordOfPermissionsId, setupGroupedPermissions, recordOfPermissionsId },
    } = usePermissionsStore();

    const { mutateAsync } = useMutation<
        ServerResponse<void>,
        AxiosError<BaseFormServerValidation>,
        LinkPermissionsToRoleParameters
    >(addRolePermissions, {
        async onSuccess() {
            showSuccessToast({
                title: "Role has been updated",
            });
            await queryClient.refetchQueries({ queryKey: PERMISSIONS_QUERY_KEYS.BY_ROLE(activeRole!.id) });
        },
        async onError() {
            showErrorToast({
                title: rollbackErrorMessage,
            });
        },
    });

    const { isLoading } = useQuery(PERMISSIONS_QUERY_KEYS.LIST, getPermissionsList, {
        select: queryData => queryData.data.data,
        onSuccess: queryData => {
            const permissions = Object.entries<Permission[]>(groupBy(queryData, "group"));
            const selectedPermissions = getPermissionsObjectFromArray(queryData, false);
            setupRecordOfPermissionsId(selectedPermissions);
            setupGroupedPermissions(permissions);
        },
    });

    const onSubmit = async (values: PermissionsFormValues) => {
        await mutateAsync({ role: activeRole!.id, permissions: getIdsFromObjectKeys(values) });
    };

    return (
        <div className="pt-5 bg-white w-full shadow-card-shadow rounded-lg">
            {activeRole && <PermissionsTableHeader />}
            <div className="w-full h-full grid grid-rows-[1fr_auto_auto] overflow-hidden text-md">
                <div className="overflow-hidden">
                    <div className="block w-full h-full">
                        <h2 className="text-md font-bold mb-3 mt-4 px-6">Permissions</h2>
                        <div className="block w-full h-accordionsBody">
                            {!isLoading && (
                                <FormContainer
                                    schema={object()}
                                    defaultValues={recordOfPermissionsId}
                                    onSubmit={onSubmit}
                                    className="flex flex-col w-full h-full"
                                >
                                    <PermissionsTableForm />
                                </FormContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(PermissionsTable);
