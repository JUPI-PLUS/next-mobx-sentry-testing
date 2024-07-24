// libs
import { observer } from "mobx-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

// helpers
import { showWarningToast } from "../../../../../../components/uiKit/Toast/helpers";

// stores
import { useSampleTypesStore } from "../../../../store";

// components
import FiltersSearchInput from "./components/FiltersSearchInput/FiltersSearchInput";

const Filters: FC = () => {
    const {
        sampleTypesStore: { setupSampleTypesFilter },
    } = useSampleTypesStore();
    const { trigger, getFieldState, clearErrors } = useFormContext();

    const onChange = async (value: string) => {
        if (value.length === 0) {
            setupSampleTypesFilter("name", "");
            return;
        }
        const result = await trigger("name");
        if (result) {
            setupSampleTypesFilter("name", value);
        } else {
            const { error } = getFieldState("name");
            const message = error!.message;
            showWarningToast({ title: "Validation", message });
            clearErrors("name");
        }
    };

    const onReset = () => setupSampleTypesFilter("name", "");

    return (
        <FiltersSearchInput
            name="name"
            placeholder="Search by name and code"
            onChange={onChange}
            onReset={onReset}
            autoFocus
        />
    );
};

export default observer(Filters);
