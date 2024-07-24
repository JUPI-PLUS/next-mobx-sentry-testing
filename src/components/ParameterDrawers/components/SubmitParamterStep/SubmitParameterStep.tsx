// libs
import React, { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { observer } from "mobx-react";
import { useFormContext, useWatch } from "react-hook-form";

// constants
import { DICTIONARIES_QUERY_KEYS, PARAMETER_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// api
import { getMeasurementUnits, getParameterViewTypes } from "../../../../api/dictionaries";
import { getParameter } from "../../../../api/parameters";

// helpers
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// models
import { ServerResponse } from "../../../../shared/models/axios";
import { MeasurementUnitItem, ParameterViewTypeDictionaryItem } from "../../../../shared/models/dictionaries";
import { Lookup } from "../../../../shared/models/form";
import { ParameterViewTypeEnum } from "../../../../shared/models/business/enums";
import { Option, SubmitParameterStepProps } from "./models";

// components
import FormInput from "../../../uiKit/forms/Inputs/CommonInput/FormInput";
import FormSelect from "../../../uiKit/forms/selects/Select/FormSelect";
import FormTextArea from "../../../uiKit/forms/TextArea/FormTextArea";
import FormCheckbox from "../../../uiKit/forms/Checkbox/FormCheckbox";
import DropdownOptionsContainer from "./components/DropdownOptionsContainer/DropdownOptionsContainer";
import { useDrawerStepperStore } from "../../../DrawerStepper/store";
import FormRichText from "../../../uiKit/RichText/FormRichText";

const executeRequestLookups = async (): Promise<
    [ServerResponse<MeasurementUnitItem[]>, ServerResponse<ParameterViewTypeDictionaryItem[]>]
> => {
    const [measurementUnits, parameterViewTypes] = await Promise.all([getMeasurementUnits(), getParameterViewTypes()]);

    return [measurementUnits, parameterViewTypes];
};

const SubmitParameterStep: FC<SubmitParameterStepProps> = ({
    isDisabled = false,
    options: originalOptions,
    uuid,
    onFetchingChange,
    error,
}) => {
    const [options, setOptions] = useState<Option[]>(originalOptions || []);
    const [isOptionsListVisible, setIsOptionsListVisible] = useState(false);
    const { control, setValue, reset } = useFormContext();
    const {
        drawerStepperStore: { setupSubmitButtonText },
    } = useDrawerStepperStore();
    useFormValidation({ isError: Boolean(error), errors: error! });

    const resultViewType = useWatch({
        control,
        name: "type_view_id",
    });

    const { data: lookups = [], isFetching: isFetchingLookups } = useQuery(
        [DICTIONARIES_QUERY_KEYS.MEASUREMENT_UNITS, DICTIONARIES_QUERY_KEYS.PARAMETER_TYPES],
        executeRequestLookups,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => queryData.map(lookup => toLookupList(lookup.data.data)),
        }
    );

    const { isFetching } = useQuery(PARAMETER_QUERY_KEYS.DETAILS(uuid!), getParameter(uuid!), {
        enabled: Boolean(uuid && lookups.length),
        select: queryData => queryData.data.data,
        onSuccess: queryData => {
            const [measurementUnits, parameterViewTypes] = lookups;
            const pickedOptions = toLookupList<Option>(queryData.options, true);
            reset({
                ...queryData,
                notes: queryData.notes || "",
                biological_reference_intervals: queryData.biological_reference_intervals || "",
                type_view_id: getLookupItem(parameterViewTypes, queryData.type_view_id),
                si_measurement_units_id: getLookupItem(measurementUnits, queryData.si_measurement_units_id),
                options: pickedOptions,
            });
            setOptions(pickedOptions);
            setIsOptionsListVisible(Boolean(pickedOptions.length));
        },
    });

    useEffect(() => {
        onFetchingChange?.(isFetchingLookups);
    }, [isFetchingLookups]);

    useEffect(() => {
        setValue("options", options);
    }, [options]);

    useEffect(() => {
        if (isDisabled) return;
        switch ((resultViewType as Lookup<ParameterViewTypeEnum>)?.value) {
            case ParameterViewTypeEnum.DROPDOWN_MULTISELECT:
            case ParameterViewTypeEnum.DROPDOWN_STRICT:
            case ParameterViewTypeEnum.DROPDOWN_UNSTRICT:
                setIsOptionsListVisible(true);
                setupSubmitButtonText("Save");
                break;
            case ParameterViewTypeEnum.NUMBER:
                setIsOptionsListVisible(false);
                setOptions([]);
                setupSubmitButtonText("Continue");
                break;
            case ParameterViewTypeEnum.STRING:
            default:
                setIsOptionsListVisible(false);
                setOptions([]);
                setupSubmitButtonText("Save");
                break;
        }
    }, [isDisabled, resultViewType]);

    const [measurementUnits = [], parameterViewTypes = []] = lookups;

    const isDataLoading = isFetchingLookups || isFetching;

    return (
        <div className="flex flex-col gap-y-3">
            <FormInput
                name="code"
                label="Parameter code"
                data-testid="parameter-code"
                disabled={isDisabled || isDataLoading}
            />
            <FormInput
                name="name"
                label="Parameter name"
                data-testid="parameter-name"
                disabled={isDisabled || isDataLoading}
            />
            <FormSelect
                name="si_measurement_units_id"
                options={measurementUnits}
                label="Measure unit"
                disabled={isDisabled || isDataLoading}
            />
            <FormTextArea
                name="biological_reference_intervals"
                label="Biological reference intervals"
                data-testid="parameter-biological-reference-intervals"
                disabled={isDisabled || isDataLoading}
            />
            <FormSelect
                name="type_view_id"
                options={parameterViewTypes}
                label="Result type"
                disabled={isDisabled || isDataLoading}
            />
            {isOptionsListVisible && (
                <DropdownOptionsContainer
                    isDisabled={isDisabled || isDataLoading}
                    items={options}
                    setItems={setOptions}
                />
            )}
            <FormRichText
                name="notes"
                label="Notes"
                data-testid="parameter-notes"
                disabled={isDisabled || isDataLoading}
            />
            <div className="flex gap-x-8">
                <FormCheckbox
                    name="is_printable"
                    label="Printable"
                    data-testid="parameter-is-printable"
                    disabled={isDisabled || isDataLoading}
                />
                <FormCheckbox
                    name="is_required"
                    label="Required"
                    data-testid="parameter-is-required"
                    disabled={isDisabled || isDataLoading}
                />
            </div>
        </div>
    );
};

export default observer(SubmitParameterStep);
