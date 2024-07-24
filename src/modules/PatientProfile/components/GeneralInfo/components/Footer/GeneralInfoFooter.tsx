// libs
import isEmpty from "lodash/isEmpty";
import { observer } from "mobx-react";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

// models
import { GeneralInfoFooterProps } from "../../models";

// components
import { SolidButton } from "../../../../../../components/uiKit/Button/Button";

const GeneralInfoFooter: FC<GeneralInfoFooterProps> = ({ isSaveButtonDisable }) => {
    const {
        formState: { isDirty, isSubmitting, errors: formErrors },
    } = useFormContext();

    const isDisabled = isSaveButtonDisable || isSubmitting || !isEmpty(formErrors) || !isDirty;

    return (
        <div className="p-4 flex justify-end">
            <SolidButton text="Save" size="sm" data-testid="edit-user-info-button" disabled={isDisabled} />
        </div>
    );
};

export default observer(GeneralInfoFooter);
