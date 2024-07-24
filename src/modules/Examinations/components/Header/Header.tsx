// libs
import React from "react";
import { useQuery } from "react-query";
import { observer } from "mobx-react";
import { OnChangeValue } from "react-select";

// stores
import { useExaminationStore } from "../../store";

// api
import { getExamTemplatesByWorkplaceUUID } from "../../../../api/workplaces";
import { getWorkplacesLookup } from "../../../../api/lookups";

// helpers
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import schema from "../Filters/schema";
import { queryClient } from "../../../../../pages/_app";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS, WORKPLACE_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// models
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { WorkplaceDictionaryItem } from "../../../../shared/models/dictionaries";

// components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import FormSelect from "../../../../components/uiKit/forms/selects/Select/FormSelect";

const Header = () => {
    const {
        examinationStore: { selectedWorkplace, setupPickedWorkplaceUUID, setupExamTemplatesByWorkplaceLookup },
    } = useExaminationStore();

    const { data: workplacesLookup = [], isFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.WORKPLACES,
        getWorkplacesLookup,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data, true),
        }
    );

    useQuery(
        WORKPLACE_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(selectedWorkplace?.uuid ?? ""),
        getExamTemplatesByWorkplaceUUID(selectedWorkplace?.uuid ?? ""),
        {
            enabled: Boolean(selectedWorkplace?.uuid),
            onSuccess: queryData => {
                const examTemplatesLookupByWorkplace = toLookupList(queryData.data.data);
                setupExamTemplatesByWorkplaceLookup(examTemplatesLookupByWorkplace);
            },
        }
    );

    const onWorkplaceChange = async (newValue: OnChangeValue<Lookup<ID> & Partial<WorkplaceDictionaryItem>, false>) => {
        if (newValue?.uuid) {
            await queryClient.resetQueries(WORKPLACE_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(newValue?.uuid ?? ""));
            setupPickedWorkplaceUUID(newValue?.uuid ?? null, newValue?.name ?? null);
            return;
        }

        setupPickedWorkplaceUUID(null);
        setupExamTemplatesByWorkplaceLookup([]);
    };

    const onSubmit = () => {};

    return (
        <div className="mb-4 px-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Examinations</h2>
            <FormContainer
                shouldShowConfirmationDialog={false}
                onSubmit={onSubmit}
                defaultValues={{
                    workplace: getLookupItem(workplacesLookup, selectedWorkplace?.uuid, "uuid"),
                }}
                schema={schema}
            >
                <div className="w-72">
                    <FormSelect
                        name="workplace"
                        options={workplacesLookup}
                        placeholder="Select workplace"
                        isLoading={isFetching}
                        maxWidth="200px"
                        clearable
                        onChange={onWorkplaceChange}
                        autoFocus
                    />
                </div>
            </FormContainer>
        </div>
    );
};

export default observer(Header);
