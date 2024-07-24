import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";
import FormSearchField from "../../../../../components/uiKit/SearchField/FormSearchField";
import { usePermissionsStore } from "../../../store";
import { MIN_SEARCH_STRING_LENGTH } from "../../../../../shared/constants/filters";

const RolesFiltersForm = () => {
    const {
        permissionsStore: { rolesFilters, resetRolesFilter, setupRolesFilter },
    } = usePermissionsStore();
    const { reset } = useFormContext();

    const onRolesSearchChange = (value: string) => {
        if (value.length >= MIN_SEARCH_STRING_LENGTH) {
            setupRolesFilter("name", value);
        } else {
            setupRolesFilter("name", "");
        }
    };

    const onFullFormReset = () => {
        reset();
        resetRolesFilter();
    };

    return (
        <div className="bg-dark-200 rounded-md py-5 px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md font-bold">Find role</h2>
                {rolesFilters && (
                    <span
                        className="text-sm cursor-pointer"
                        data-testid="reset-roles-filters"
                        onClick={onFullFormReset}
                    >
                        Reset
                    </span>
                )}
            </div>
            <div className="mb-3">
                <FormSearchField
                    data-testid="roles-search"
                    name="name"
                    placeholder="Role name"
                    onChange={onRolesSearchChange}
                    onReset={() => setupRolesFilter("name", "")}
                    autoFocus
                />
            </div>
        </div>
    );
};

export default observer(RolesFiltersForm);
