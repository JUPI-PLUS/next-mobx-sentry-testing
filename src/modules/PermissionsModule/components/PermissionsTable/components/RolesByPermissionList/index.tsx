import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { getRolesListByPermission } from "../../../../../../api/roles";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";
import CircularProgressLoader from "../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { ROLES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { usePermissionsStore } from "../../../../store";

const RolesByPermissionList = ({ id }: { id: number }) => {
    const {
        permissionsStore: { setActiveRole },
    } = usePermissionsStore();
    const { data, isLoading } = useQuery(ROLES_QUERY_KEYS.BY_PERMISSION(id), getRolesListByPermission(id), {
        refetchOnWindowFocus: false,
        select: queryData => queryData.data.data,
    });

    return (
        <div className="border border-inset border-dark-400 rounded-md shadow-datepicker bg-white p-5 w-80">
            <h3 className="font-bold text-md mb-4">Roles with permission</h3>
            <ul className="flex flex-wrap gap-2">
                {isLoading ? (
                    <CircularProgressLoader />
                ) : (
                    data?.map(role => (
                        <li key={role.id}>
                            <TextButton
                                text={role.name}
                                variant="neutral"
                                size="sm"
                                className="inline-flex whitespace-nowrap bg-dark-300 hover:bg-dark-400 !no-underline font-normal rounded-md"
                                onClick={() => setActiveRole(role, false)}
                                data-testid={`role-${role.id}-by-permission`}
                            />
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default observer(RolesByPermissionList);
