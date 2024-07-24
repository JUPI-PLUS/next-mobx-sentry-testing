// libs
import React from "react";
import { useFormContext } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { observer } from "mobx-react";

// stores
import { useExaminationStore } from "../../../../store";

// models
import { TableSummaryProps } from "./models";
import { ExaminationResultsPermission } from "../../../../../../shared/models/permissions";

// components
import PermissionAccessElement from "../../../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { OutlineButton, SolidButton } from "../../../../../../components/uiKit/Button/Button";

const TableSummary = ({ onValidate, isValidateMutationLoading = false }: TableSummaryProps) => {
    const {
        formState: { isSubmitting, dirtyFields },
    } = useFormContext();
    const {
        examinationStore: { isExaminationsCanBeValidated, isValidatedButtonDisabled },
    } = useExaminationStore();

    const isValidateButtonDisabled =
        !isExaminationsCanBeValidated || isValidateMutationLoading || isValidatedButtonDisabled;

    return (
        <div className="w-full rounded-b-lg flex items-center justify-end shadow-card-shadow p-6 gap-3 border-t border-inset border-dark-400">
            <PermissionAccessElement required={ExaminationResultsPermission.SAVE_RESULTS}>
                <OutlineButton
                    text="Save"
                    type="submit"
                    size="sm"
                    disabled={isEmpty(dirtyFields) || isSubmitting}
                    data-testid="save-examination-order"
                />
            </PermissionAccessElement>
            <PermissionAccessElement required={ExaminationResultsPermission.VALIDATE_RESULTS}>
                <SolidButton
                    text="Validate"
                    size="sm"
                    disabled={!isEmpty(dirtyFields) || isValidateButtonDisabled}
                    onClick={onValidate}
                    data-testid="validate-examination-order"
                />
            </PermissionAccessElement>
        </div>
    );
};

export default observer(TableSummary);
