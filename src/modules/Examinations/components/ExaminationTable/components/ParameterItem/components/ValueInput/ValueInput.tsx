// libs
import React, { ChangeEvent, useMemo, useState } from "react";
import { MultiValue } from "react-select";
import { observer } from "mobx-react";
import debounce from "lodash/debounce";
import { useFormContext } from "react-hook-form";

// stores
import { useExaminationStore } from "../../../../../../store";

// helpers
import { transformPathToSchemaPath } from "../../../../../../utils";
import { usePermissionsAccess } from "../../../../../../../../shared/hooks/useUserAccess";

// models
import { ExamStatusesEnum } from "../../../../../../../../shared/models/business/exam";
import { ExaminationResultsPermission } from "../../../../../../../../shared/models/permissions";
import { ParameterViewTypeEnum } from "../../../../../../../../shared/models/business/enums";
import { ID } from "../../../../../../../../shared/models/common";
import { Lookup } from "../../../../../../../../shared/models/form";
import { MaybeDisabledOption } from "../../../../../../../../components/uiKit/forms/selects/Select/models";
import { ValueInputProps } from "./models";

// constants
import { INTERVAL_VALUE_MAX_SAVE_INTEGER } from "../../../../../../../../components/ParameterDrawers/components/ParameterConditions/constants";
import { FORM_PROPERTY_PATH_SEPARATOR, PROPERTY_PATH_SEPARATOR } from "../../../../../../constants";

// components
import FormInput from "../../../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormMaskedNumberInput from "../../../../../../../../components/uiKit/forms/Inputs/MaskedInputs/FormMaskedNumberInput/FormMaskedNumberInput";
import FormSelect from "../../../../../../../../components/uiKit/forms/selects/Select/FormSelect";
import FormMultiSelect from "../../../../../../../../components/uiKit/forms/selects/MultiSelect/FormMultiSelect";
import FormUnstrictDropdownSelect from "./components/UnstrictDropdownSelect/FormUnstrictDropdownSelect";

const ValueInput = ({ path, value = "", examStatus, disabled, typeViewId, options }: ValueInputProps) => {
    const {
        examinationStore: {
            setupExaminationValue,
            setupExaminationParameterDirty,
            setupExaminationsCanBeValidated,
            setupParameterNotesOnResultValueChange,
        },
    } = useExaminationStore();
    const { setValue } = useFormContext();
    const [inputValue, setInputValue] = useState(value as string);
    const isAllowedToEdit = usePermissionsAccess([ExaminationResultsPermission.SAVE_RESULTS]);
    const isInputDisabled = disabled || !isAllowedToEdit;

    const setupParameterResultNotesOnNumericValueChange = (resultValue: string) => {
        const paramPath = path.split(PROPERTY_PATH_SEPARATOR).slice(0, -1).join(PROPERTY_PATH_SEPARATOR); // I need only parameter path, so i cut last section of value path.
        const notes = setupParameterNotesOnResultValueChange(paramPath, resultValue);

        // Update form value too;
        setValue([transformPathToSchemaPath(paramPath), "result_notes"].join(FORM_PROPERTY_PATH_SEPARATOR), notes, {
            shouldDirty: true,
        });
    };

    const onValueChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const resultValue = target.value;
        if (examStatus === ExamStatusesEnum.ON_VALIDATION) {
            setupExaminationsCanBeValidated(Boolean(value?.length && !resultValue.length));
        }

        setupExaminationParameterDirty();
        setInputValue(resultValue);
        setupExaminationValue(path, resultValue);
        if (typeViewId === ParameterViewTypeEnum.NUMBER) {
            setupParameterResultNotesOnNumericValueChange(resultValue);
        }
    };

    const onSelectValueChange = (selectValue: Lookup<ID> | null) => {
        if (examStatus === ExamStatusesEnum.ON_VALIDATION) {
            setupExaminationsCanBeValidated(Boolean(value && !selectValue));
        }

        setupExaminationParameterDirty();
        setupExaminationValue(path, selectValue?.label || "");
    };

    const onMultiSelectValueChange = (selectValue: MultiValue<MaybeDisabledOption> | null) => {
        if (examStatus === ExamStatusesEnum.ON_VALIDATION) {
            setupExaminationsCanBeValidated(Boolean(value?.length && !selectValue));
        }
        setupExaminationParameterDirty();
        setupExaminationValue(path, selectValue?.length ? selectValue.map(({ label }) => label).join(";") : "");
    };

    const inputName = useMemo(() => transformPathToSchemaPath(path), [path]);

    switch (typeViewId) {
        case ParameterViewTypeEnum.STRING:
            return (
                <FormInput
                    name={inputName}
                    placeholder="Add value"
                    disabled={isInputDisabled}
                    onChange={onValueChange}
                    value={inputValue}
                    defaultValue={value as string}
                    data-testid={inputName}
                />
            );
        case ParameterViewTypeEnum.NUMBER:
            return (
                <FormMaskedNumberInput
                    name={inputName}
                    placeholder="Add value"
                    disabled={isInputDisabled}
                    onChange={debounce(onValueChange, 350)}
                    value={inputValue}
                    defaultValue={value as string}
                    data-testid={inputName}
                    mask={Number}
                    scale={4}
                    max={INTERVAL_VALUE_MAX_SAVE_INTEGER}
                    normalizeZeros={false}
                />
            );
        case ParameterViewTypeEnum.DROPDOWN_STRICT:
            return (
                <FormSelect<Lookup<ID>>
                    name={inputName}
                    data-testid={inputName}
                    onChange={onSelectValueChange}
                    placeholder="Add value"
                    options={options}
                    disabled={isInputDisabled}
                />
            );
        case ParameterViewTypeEnum.DROPDOWN_UNSTRICT:
            return (
                <FormUnstrictDropdownSelect<Lookup<ID>>
                    name={inputName}
                    data-testid={inputName}
                    placeholder="Add value"
                    onChange={onSelectValueChange}
                    options={options}
                    disabled={isInputDisabled}
                />
            );
        case ParameterViewTypeEnum.DROPDOWN_MULTISELECT:
            return (
                <FormMultiSelect
                    name={inputName}
                    data-testid={inputName}
                    onChange={onMultiSelectValueChange}
                    placeholder="Add value"
                    options={options}
                    disabled={isInputDisabled}
                />
            );
        default:
            return null;
    }
};

export default observer(ValueInput);
