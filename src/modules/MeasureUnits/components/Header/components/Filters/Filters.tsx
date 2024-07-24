// libs
import { observer } from "mobx-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

// helpers
import { showWarningToast } from "../../../../../../components/uiKit/Toast/helpers";

// stores
import { useMeasureUnitsStore } from "../../../../store";

// components
import FormSearchField from "../../../../../../components/uiKit/SearchField/FormSearchField";

const Filters: FC = () => {
    const {
        measureUnitsStore: { setupMeasureUnitsFilter },
    } = useMeasureUnitsStore();
    const { trigger, getFieldState, clearErrors } = useFormContext();

    const onChange = async (value: string) => {
        if (value.length === 0) {
            setupMeasureUnitsFilter("search_string", "");
            return;
        }
        const result = await trigger("search_string");
        if (result) {
            setupMeasureUnitsFilter("search_string", value);
        } else {
            const { error } = getFieldState("search_string");
            const message = error!.message;
            showWarningToast({ title: "Validation", message });
            clearErrors("search_string");
        }
    };

    const onReset = () => setupMeasureUnitsFilter("search_string", "");

    return (
        <FormSearchField
            name="search_string"
            onChange={onChange}
            onReset={onReset}
            placeholder="Search by name"
            data-testid="name-filter-input"
            containerClassName="max-w-xs w-full ml-auto"
            isFilter
            autoFocus
        />
    );
};

export default observer(Filters);
