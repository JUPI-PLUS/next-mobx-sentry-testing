// libs
import React, { useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { observer } from "mobx-react";
import { endOfDay, getUnixTime, startOfDay } from "date-fns";
import { MultiValue } from "react-select";
import debounce from "lodash/debounce";
import { useFormContext } from "react-hook-form";

// store
import { useExaminationStore } from "../../store";

// helpers
import { removeOffsetFromDate } from "../../../../shared/utils/date";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";

// models
import { SampleFilters } from "../../models";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";

// constants
import { DEFAULT_DEBOUNCE_TIME, DEFAULT_SAMPLES_FILTER_VALUES } from "../../constants";

//components
import FormFilterDatePicker from "../../../../components/uiKit/DatePickers/FilterDatePicker/FormFilterDatePicker";
import FormMultiSelect from "../../../../components/uiKit/forms/selects/MultiSelect/FormMultiSelect";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import ExaminationSearchInput from "./components/ExaminationSearchInput";
import OrderNumberSearchInput from "./components/OrderNumberSearchInput";
import { TextButton } from "../../../../components/uiKit/Button/Button";

const FiltersForm = () => {
    const {
        examinationStore: {
            isSampleHiddenFiltersFilled,
            samplesFiltersQueryString,
            setSampleFilterValue,
            resetSampleFilter,
            resetSampleSorting,
            sampleTypesLookup,
            examTemplatesLookup,
            examTemplatesByWorkplaceLookup,
            selectedWorkplace,
        },
    } = useExaminationStore();
    const { isOpen, onOpen, toggle } = useDisclosure(isSampleHiddenFiltersFilled);
    const { reset, setValue } = useFormContext();

    const filtersContainerClassName = useMemo(() => (isOpen ? "h-full" : "h-auto"), [isOpen]);
    const hiddenInputsContainerClassName = useMemo(() => (isOpen ? "h-full" : "h-0 overflow-hidden"), [isOpen]);
    const debouncedMultiSelectFilterHandler = useMemo(
        () => debounce(setSampleFilterValue, DEFAULT_DEBOUNCE_TIME),
        [setSampleFilterValue]
    );

    const onFullFormReset = () => {
        reset(DEFAULT_SAMPLES_FILTER_VALUES);
        resetSampleFilter();
        resetSampleSorting();
    };

    const onExpiredDateChangeHandler = (value?: DateRange) => {
        if (!value || !value.from) {
            setSampleFilterValue("expire_date_from", null);
            setSampleFilterValue("expire_date_to", null);
            return;
        }

        setSampleFilterValue("expire_date_from", getUnixTime(removeOffsetFromDate(startOfDay(value.from))));
        setSampleFilterValue("expire_date_to", getUnixTime(removeOffsetFromDate(endOfDay(value.to || value.from))));
    };

    const onMultiSelectFilterChange = (name: keyof SampleFilters) => (options: MultiValue<Lookup<ID>>) => {
        debouncedMultiSelectFilterHandler(
            name,
            options.map(({ value }) => value)
        );
    };

    useEffect(() => {
        if (examTemplatesByWorkplaceLookup.length) {
            if (!isOpen) onOpen();
            setValue("exam_template_id", examTemplatesByWorkplaceLookup);
            onMultiSelectFilterChange("exam_template_id")(examTemplatesByWorkplaceLookup);
        } else {
            setValue("exam_template_id", []);
            onMultiSelectFilterChange("exam_template_id")([]);
        }
    }, [examTemplatesByWorkplaceLookup]);

    return (
        <div className="bg-dark-200 shadow-card-shadow rounded-md py-5 px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md font-bold">Find examination</h2>
                {samplesFiltersQueryString && (
                    <TextButton
                        text="Reset"
                        onClick={onFullFormReset}
                        variant="transparent"
                        size="thin"
                        className="font-medium px-1"
                        data-testid="reset-filters"
                        type="button"
                    />
                )}
            </div>
            <div className={`${filtersContainerClassName} flex flex-col gap-3`}>
                <ExaminationSearchInput fieldName="barcode" placeholder="Sample" onFieldChange={setSampleFilterValue} />
                <OrderNumberSearchInput onFieldChange={setSampleFilterValue} />
                <div className={`${hiddenInputsContainerClassName} flex flex-col gap-3`}>
                    <FormFilterDatePicker
                        name="expired"
                        onChange={onExpiredDateChangeHandler}
                        placeholder="Date"
                        popperPlacement="bottom-start"
                        isFilter
                        disabledDate={{ after: new Date() }}
                        disabled={!isOpen}
                    />
                    <FormMultiSelect
                        name="type_id"
                        placeholder="Sample type"
                        options={sampleTypesLookup}
                        onChange={onMultiSelectFilterChange("type_id")}
                        isFilter
                        isScrollable
                        disabled={!isOpen}
                    />
                    <FormMultiSelect
                        name="exam_template_id"
                        placeholder="Exam type"
                        options={examTemplatesLookup}
                        onChange={onMultiSelectFilterChange("exam_template_id")}
                        isFilter
                        isScrollable
                        disabled={!isOpen || Boolean(selectedWorkplace?.uuid)}
                    />
                </div>
            </div>
            <div className={isOpen ? "mt-5" : "mt-2"}>
                <TextButton
                    type="button"
                    text={!isOpen ? "Show more" : ""}
                    onClick={toggle}
                    variant="transparent"
                    size="thin"
                    endIcon={
                        isOpen ? <ChevronUpIcon className="w-4 h-4 -ml-2" /> : <ChevronDownIcon className="w-4 h-4" />
                    }
                    className="m-auto font-medium"
                    data-testid="show-more-link"
                />
            </div>
            <button type="submit" className="hidden" />
        </div>
    );
};

export default observer(FiltersForm);
