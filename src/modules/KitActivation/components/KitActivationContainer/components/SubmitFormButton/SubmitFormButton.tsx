// libs
import { FC } from "react";
import { useFormContext } from "react-hook-form";

// components
import { SolidButton } from "../../../../../../components/uiKit/Button/Button";

const SubmitFormButton: FC<{ isDisabled: boolean }> = ({ isDisabled }) => {
    const {
        formState: { isSubmitting },
    } = useFormContext();

    return (
        <SolidButton
            data-testid="activate-order-btn"
            text="Activate order"
            disabled={isDisabled || isSubmitting}
            size="sm"
        />
    );
};

export default SubmitFormButton;
