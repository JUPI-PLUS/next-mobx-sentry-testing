// libs
import React, { FC, useState } from "react";
import debounce from "lodash/debounce";
import { stringify } from "query-string";
import differenceBy from "lodash/differenceBy";
import { useFormContext } from "react-hook-form";

// helpers
import { toLookupList } from "../../../../../../shared/utils/lookups";
import { useFormValidation } from "../../../../../../shared/hooks/useFormValidation";

// models
import { Option } from "../../models";
import { OptionFormProps } from "./models";
import { CommonServerValidationProps } from "../../../../../../shared/models/serverValidation";

// api
import { autocompleteParameterOptions } from "../../../../../../api/parameterOptions";

// components
import { SolidButton, TextButton } from "../../../../../uiKit/Button/Button";
import FormCreatableAutocomplete from "../../../../../uiKit/forms/selects/CreatableAutocomplete/FormCreatableAutocomplete";
import { canCreateOption } from "../../helpers";

const loadOptions =
    (pickedOptions: Option[], setIsNewOptionSelected: (value: boolean) => void) =>
    (inputValue: string, callback: (options: Option[]) => void) => {
        const queryParams = stringify({ name: inputValue }, { skipEmptyString: true });

        if (inputValue.length < 2 || inputValue.length > 45) {
            return callback([]);
        }

        autocompleteParameterOptions(queryParams)
            .then(res => {
                const responseLookup = toLookupList<Option>(res.data.data ?? [], true);
                const isOptionAlreadyPicked = pickedOptions.some(item => item.label === inputValue.trim());
                setIsNewOptionSelected(isOptionAlreadyPicked);

                callback(differenceBy(responseLookup, pickedOptions, "value"));
            })
            .catch(error => {});
    };

const OptionForm: FC<OptionFormProps & CommonServerValidationProps> = ({
    pickedOptions,
    onClose,
    onSubmit,
    isError,
    errors,
}) => {
    const [isNewOptionSelected, setIsNewOptionSelected] = useState(false);

    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();

    useFormValidation({ isError, errors });

    return (
        <div className="bg-white p-6 border border-inset border-dark-400 rounded-md shadow-dropdown">
            <FormCreatableAutocomplete
                label="Option name"
                name="name"
                autoFocus
                loadOptions={debounce(loadOptions(pickedOptions, setIsNewOptionSelected), 350)}
                menuPlacement="top"
                isValidNewOption={canCreateOption(!isNewOptionSelected)}
                hint={isNewOptionSelected ? "Option has already been picked" : ""}
            />
            <div className="flex justify-between mt-4">
                <TextButton
                    type="button"
                    text="Cancel"
                    onClick={onClose}
                    size="thin"
                    variant="neutral"
                    className="font-normal hover:bg-transparent"
                    disabled={isSubmitting}
                />
                <SolidButton
                    type="button"
                    text="Save"
                    size="sm"
                    disabled={isSubmitting || !isDirty}
                    onClick={onSubmit}
                />
            </div>
        </div>
    );
};

export default OptionForm;
