// libs
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { MultiValue } from "react-select";
import debounce from "lodash/debounce";

// stores
import { useWorkplacesStore } from "../../../../store";

// models
import { Lookup } from "../../../../../../shared/models/form";
import { ID } from "../../../../../../shared/models/common";
import { WorkplacesFilters } from "../../../../models";

// components
import FormMultiSelect from "../../../../../../components/uiKit/forms/selects/MultiSelect/FormMultiSelect";
import FiltersSearchInput from "./components/FiltersSearchInput/FiltersSearchInput";

const Filters = () => {
    const {
        workplacesStore: { examTemplatesLookup, setupWorkplacesFilter },
    } = useWorkplacesStore();

    const debouncedMultiSelectFilterHandler = useMemo(
        () => debounce(setupWorkplacesFilter, 300),
        [setupWorkplacesFilter]
    );

    const onMultiSelectFilterChange = (name: keyof WorkplacesFilters) => (options: MultiValue<Lookup<ID>>) => {
        debouncedMultiSelectFilterHandler(
            name,
            options.map(({ value }) => value)
        );
    };

    return (
        <div className="flex justify-end items-start">
            <FiltersSearchInput
                name="search_string"
                placeholder="Search by name and code"
                onChange={value => setupWorkplacesFilter("search_string", value)}
                onReset={() => setupWorkplacesFilter("search_string", "")}
                data-testid="search-string-filter-input"
                className="max-w-xs w-full"
                autoFocus
            />
            <div className="w-px bg-dark-400 mx-4 mt-1 h-8" />
            <FormMultiSelect
                name="exam_template_id"
                placeholder="Exam type"
                className="max-w-xs w-full"
                options={examTemplatesLookup}
                onChange={onMultiSelectFilterChange("exam_template_id")}
                clearable
                isFilter
                isScrollable
            />
        </div>
    );
};

export default observer(Filters);
