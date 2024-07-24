// libs
import React, { FC, useEffect } from "react";
import { stringify } from "query-string";
import debounce from "lodash/debounce";
import { observer } from "mobx-react";
import { useFormContext, useWatch } from "react-hook-form";

// helpers
import { getParametersOptions, canCreateParameter } from "./helpers";

// api
import { getParameters } from "../../../../api/parameters";

// store
import { useDrawerStepperStore } from "../../../DrawerStepper/store";

// models
import { FindParameterStepProps, LoadParameterOption } from "./models";

// constants
import { MAX_PARAMETER_CODE_SEARCH_INPUT_LENGTH, MIN_PARAMETER_CODE_SEARCH_INPUT_LENGTH } from "./constants";

// components
import FormCreatableAutocomplete from "../../../uiKit/forms/selects/CreatableAutocomplete/FormCreatableAutocomplete";

const loadParameters =
    (pickedParamsUUID: string[] = []) =>
    (inputValue: string, callback: (options: LoadParameterOption[]) => void) => {
        if (
            inputValue.length < MIN_PARAMETER_CODE_SEARCH_INPUT_LENGTH ||
            inputValue.length > MAX_PARAMETER_CODE_SEARCH_INPUT_LENGTH
        ) {
            callback([]);
            return;
        }
        const queryParams = stringify({ code: inputValue }, { skipEmptyString: true });
        getParameters(queryParams)()
            .then(res => callback(getParametersOptions(res.data.data, pickedParamsUUID)))
            .catch(error => {});
        return;
    };

const FindParameterStep: FC<FindParameterStepProps> = ({ pickedParamsUUID }) => {
    const {
        drawerStepperStore: { disableSubmitButton },
    } = useDrawerStepperStore();
    const { control } = useFormContext();
    const parameter = useWatch({
        control,
        name: "parameterCodeAutocomplete",
    });

    useEffect(() => {
        disableSubmitButton(!parameter);
    }, [parameter]);

    return (
        <FormCreatableAutocomplete
            name="parameterCodeAutocomplete"
            placeholder="Search by name and code"
            loadOptions={debounce(loadParameters(pickedParamsUUID), 350)}
            hint="Minimum symbols to search is 2"
            isValidNewOption={canCreateParameter}
            isClearable
            autoFocus
        />
    );
};

export default observer(FindParameterStep);
