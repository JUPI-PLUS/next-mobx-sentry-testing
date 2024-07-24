// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useParametersStore } from "../../../../store";

// components
import FormSearchField from "../../../../../../components/uiKit/SearchField/FormSearchField";

const Filters = () => {
    const {
        parametersStore: { setupParameterFilter },
    } = useParametersStore();

    return (
        <FormSearchField
            name="searchCode"
            onChange={value => setupParameterFilter("code", value)}
            onReset={() => setupParameterFilter("code", "")}
            placeholder="Search by name and code"
            data-testid="code-filter-input"
            containerClassName="max-w-xs w-full ml-auto"
            isFilter
            autoFocus
        />
    );
};

export default observer(Filters);
