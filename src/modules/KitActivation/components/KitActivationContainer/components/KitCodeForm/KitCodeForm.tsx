// libs
import { FC } from "react";
import { observer } from "mobx-react";

// hooks
import { useFormValidation } from "../../../../../../shared/hooks/useFormValidation";

// models
import { KitCodeFormProps } from "./models";

// store
import { useKitActivationStore } from "../../../../store";

// components
import { SolidButton } from "../../../../../../components/uiKit/Button/Button";
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";

const KitCodeForm: FC<KitCodeFormProps> = ({ errors, isError, isLoading }) => {
    const {
        kitActivationStore: { kitCode, resetConditions, setupKitCode },
    } = useKitActivationStore();

    useFormValidation({ isError, errors });

    const onKitCodeChange = () => {
        if (kitCode) {
            resetConditions();
            setupKitCode("");
        }
    };

    return (
        <>
            <FormInput
                name="kit_number"
                placeholder="Scan or type kit code"
                containerClassName="w-full"
                data-testid="kit-number-input"
                onChange={onKitCodeChange}
                disabled={isLoading}
            />
            <div>
                <SolidButton text="Ok" size="sm" data-testid="kit-number-btn" disabled={isLoading} />
            </div>
        </>
    );
};

export default observer(KitCodeForm);
