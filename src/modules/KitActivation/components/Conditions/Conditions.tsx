// libs
import { observer } from "mobx-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

// models
import { ConditionsProps } from "./models";

// helpers
import { toLookupList } from "../../../../shared/utils/lookups";

// stores
import { useKitActivationStore } from "../../store";

// components
import CircularProgressLoader from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import FormSelect from "../../../../components/uiKit/forms/selects/Select/FormSelect";

const Conditions: FC<ConditionsProps> = ({ isLoading, isDisabled }) => {
    const {
        formState: { isSubmitting },
    } = useFormContext();

    const {
        kitActivationStore: { filteredConditions },
    } = useKitActivationStore();

    if (isLoading) {
        return (
            <div className="flex justify-center" data-testid="circular-progress-wrapper">
                <CircularProgressLoader />
            </div>
        );
    }

    if (filteredConditions.length === 0 || isDisabled) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mb-5">
            <p className="font-bold mb-5">Conditions</p>
            <div className="flex flex-col gap-3">
                {filteredConditions.map(condition => (
                    <FormSelect
                        key={condition.name}
                        label={condition.name}
                        name={condition.name}
                        options={toLookupList(condition.options) || []}
                        disabled={isSubmitting}
                    />
                ))}
            </div>
        </div>
    );
};

export default observer(Conditions);
