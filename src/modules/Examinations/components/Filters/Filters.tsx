// libs
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// store
import { useExaminationStore } from "../../store";

// api
import { getExamTemplates, getSampleTypes } from "../../../../api/dictionaries";

// helpers
import { toLookupList } from "../../../../shared/utils/lookups";
import schema from "./schema";

// constants
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import FiltersForm from "./FiltersForm";

const Filters = () => {
    const {
        examinationStore: { activeSampleFilters, setupSampleTypesLookup, setupExamTemplatesLookup },
    } = useExaminationStore();

    const { data: sampleTypes } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: examTemplates } = useQuery(DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATES, getExamTemplates, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    useEffect(() => sampleTypes && setupSampleTypesLookup(sampleTypes), [sampleTypes]);
    useEffect(() => examTemplates && setupExamTemplatesLookup(examTemplates), [examTemplates]);

    const onSubmit = () => {};

    return (
        <div className="mb-4">
            <FormContainer
                shouldShowConfirmationDialog={false}
                onSubmit={onSubmit}
                defaultValues={activeSampleFilters}
                schema={schema}
            >
                <FiltersForm />
            </FormContainer>
        </div>
    );
};

export default observer(Filters);
