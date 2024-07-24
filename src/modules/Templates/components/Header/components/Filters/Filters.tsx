// libs
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";
import { OnChangeValue } from "react-select";
import { useQuery } from "react-query";

// stores
import { useTemplatesStore } from "../../../../store";

// models
import { Lookup } from "../../../../../../shared/models/form";
import { ID } from "../../../../../../shared/models/common";
import { TemplateStatusEnum } from "../../../../../../shared/models/business/template";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";
import { getExamTemplateStatuses, getKitTemplateStatuses } from "../../../../../../api/dictionaries";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

// components
import FormSelect from "../../../../../../components/uiKit/forms/selects/Select/FormSelect";
import Actions from "../Actions/Actions";
import TemplatesSearchInput from "./components/TemplatesSearchInput/TemplatesSearchInput";

const Filters = () => {
    const {
        templatesStore: { templatesFilters, resetCounter, setTemplatesFilterValue },
    } = useTemplatesStore();
    const [selectedTemplatesStatus, setSelectedTemplatesStatus] = useState<Lookup<ID> | undefined>();
    const { setValue, reset } = useFormContext();

    const { data: examTemplateStatusesLookup = [], isFetching: isExamTemplateStatusesLookupLoading } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        getExamTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data.filter(({ id }) => id !== TemplateStatusEnum.DELETE)),
        }
    );
    // TODO: will be used in the future
    const { isFetching: isKitTemplateStatusesLookupLoading } = useQuery(
        DICTIONARIES_QUERY_KEYS.KIT_TEMPLATE_STATUSES,
        getKitTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const isLookupsLoading = isExamTemplateStatusesLookupLoading || isKitTemplateStatusesLookupLoading;

    useEffect(() => {
        if (examTemplateStatusesLookup.length && !isExamTemplateStatusesLookupLoading) {
            setValue("status", getLookupItem(examTemplateStatusesLookup, templatesFilters.status));
        }
    }, [examTemplateStatusesLookup, isExamTemplateStatusesLookupLoading, templatesFilters.status]);

    useEffect(() => {
        if (resetCounter) {
            reset();
        }
    }, [resetCounter]);

    const onTemplatesStatusChange = (value: OnChangeValue<Lookup<ID>, false>) => {
        setTemplatesFilterValue("status", value?.value ?? null);
        setSelectedTemplatesStatus(value || undefined);
    };

    return (
        <div className="justify-end items-center flex w-full">
            <TemplatesSearchInput
                name="name"
                placeholder="Search by name and code"
                data-testid="search-filter-input"
                containerClassName="max-w-xs w-full"
                autoFocus
            />
            <div className="w-px bg-dark-400 mx-3 h-8" />
            <FormSelect
                name="status"
                placeholder="Status"
                data-testid="status-filter-select"
                className="max-w-xs w-full"
                options={examTemplateStatusesLookup}
                value={selectedTemplatesStatus}
                onChange={onTemplatesStatusChange}
                disabled={isLookupsLoading}
                clearable
                isFilter
            />
            <div className="w-px bg-dark-400 mx-3 h-8" />
            <Actions />
        </div>
    );
};

export default observer(Filters);
