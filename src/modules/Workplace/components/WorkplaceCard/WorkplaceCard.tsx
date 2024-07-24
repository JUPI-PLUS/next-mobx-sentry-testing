//  libs
import React, { useEffect, useMemo } from "react";
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";

//  stores
import { useWorkplaceStore } from "../../store";

// api
import {
    createWorkplace,
    editWorkplace,
    getExamTemplatesByWorkplaceUUID,
    getWorkplace,
} from "../../../../api/workplaces";
import { getExamTemplateStatuses, getGeneralStatuses } from "../../../../api/dictionaries";

//  helpers
import { schema } from "./schema";
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { getInvalidExamTemplates } from "../../helpers";

//  models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { Workplace } from "../../../../shared/models/business/workplace";
import { WorkplaceBody, WorkplaceFormFields } from "../../models";

// constants
import { DICTIONARIES_QUERY_KEYS, WORKPLACE_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { WORKPLACE_DEFAULT_VALUES } from "../../constants";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { ROUTES } from "../../../../shared/constants/routes";
import { DEFAULT_GENERAL_STATUS_ID } from "../../../../shared/constants/dictionaries";

//  components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import WorkplaceForm from "./WorkplaceForm";
import { WorkplaceSkeleton } from "../Skeletons";
import { queryClient } from "../../../../../pages/_app";

const WorkplaceCard = ({ uuid }: { uuid?: string }) => {
    const {
        workplaceStore: {
            setupExamTemplateErrors,
            setupSelectedExamTemplates,
            setupExamTemplateStatusesLookup,
            cleanup,
        },
    } = useWorkplaceStore();

    const { push } = useRouter();

    const isEditing = Boolean(uuid);

    const { data: generalStatusesLookup = [], isFetching: isGeneralStatusesLookupFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.GENERAL_STATUSES,
        getGeneralStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const { data: examTemplateStatusesLookup, isFetching: isExamTemplateStatusesLookupFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        getExamTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const { data: workplaceData, isFetching: isWorkplaceDataFetching } = useQuery(
        WORKPLACE_QUERY_KEYS.DETAILS(uuid!),
        getWorkplace(uuid!),
        {
            enabled: isEditing && !isGeneralStatusesLookupFetching,
            select: queryData => queryData.data.data,
        }
    );

    const { data: selectedExamTemplates = [], isFetching: isSelectedExamTemplatesFetching } = useQuery(
        WORKPLACE_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(uuid!),
        getExamTemplatesByWorkplaceUUID(uuid!),
        {
            enabled: isEditing,
            select: queryData => queryData.data.data,
            onSuccess: queryData => setupSelectedExamTemplates(queryData),
        }
    );

    const {
        mutateAsync: mutateAsyncCreate,
        error: createWorkplaceError,
        isError: isCreateWorkplaceError,
    } = useMutation<ServerResponse<Workplace>, AxiosError<BaseFormServerValidation>, WorkplaceBody>(createWorkplace, {
        onSuccess: queryData => {
            const workplace = queryData.data.data;
            showSuccessToast({ title: `Workplace ${workplace.name} has been created` });
            push(ROUTES.workplaces.route);
        },
        onError: error => {
            const errors = error?.response?.data.errors;
            if (errors) {
                setupExamTemplateErrors(getInvalidExamTemplates(errors));
            }
        },
    });

    const {
        mutateAsync: mutateAsyncEdit,
        error: editWorkplaceError,
        isError: isEditWorkplaceError,
    } = useMutation<ServerResponse<Workplace>, AxiosError<BaseFormServerValidation>, WorkplaceBody>(
        editWorkplace(uuid!),
        {
            onSuccess: queryData => {
                const workplace = queryData.data.data;
                showSuccessToast({ title: `Workplace ${workplace.name} has been updated` });
                push(ROUTES.workplaces.route);
            },
            onError: error => {
                const errors = error?.response?.data.errors;
                if (errors) {
                    setupExamTemplateErrors(getInvalidExamTemplates(errors));
                }
            },
        }
    );

    useEffect(() => {
        if (!isExamTemplateStatusesLookupFetching && examTemplateStatusesLookup) {
            setupExamTemplateStatusesLookup(examTemplateStatusesLookup);
        }
    }, [isExamTemplateStatusesLookupFetching, examTemplateStatusesLookup]);

    useEffect(() => () => cleanup(), []);

    const defaultValues = useMemo(() => {
        return workplaceData
            ? {
                  ...workplaceData,
                  status_id: getLookupItem(generalStatusesLookup, workplaceData.status_id),
                  exam_templates: selectedExamTemplates.map(template => template.uuid),
              }
            : {
                  ...WORKPLACE_DEFAULT_VALUES,
                  status_id: getLookupItem(generalStatusesLookup, DEFAULT_GENERAL_STATUS_ID),
              };
    }, [generalStatusesLookup, workplaceData, selectedExamTemplates]);

    const onSubmit = async (formFields: WorkplaceFormFields) => {
        try {
            const workplaceMutationData = {
                name: formFields.name,
                code: formFields.code,
                notes: formFields.notes,
                status_id: formFields.status_id!.value,
                exam_templates_uuids: formFields.exam_templates,
            };
            if (isEditing) {
                await mutateAsyncEdit(workplaceMutationData);
            } else {
                await mutateAsyncCreate(workplaceMutationData);
            }
            await queryClient.invalidateQueries(DICTIONARIES_QUERY_KEYS.WORKPLACES);
        } catch (e) {}
    };

    if (isGeneralStatusesLookupFetching || isWorkplaceDataFetching || isSelectedExamTemplatesFetching) {
        return <WorkplaceSkeleton />;
    }

    return (
        <div className="flex flex-col w-full h-full border border-inset border-gray-200 pt-10 bg-white rounded-md shadow-card-shadow overflow-hidden">
            <FormContainer<WorkplaceFormFields>
                defaultValues={defaultValues}
                schema={schema}
                onSubmit={onSubmit}
                className="max-w-3xl mx-auto w-full h-full"
            >
                <WorkplaceForm
                    errors={isEditing ? editWorkplaceError : createWorkplaceError}
                    isError={isEditing ? isEditWorkplaceError : isCreateWorkplaceError}
                    generalStatusesLookup={generalStatusesLookup}
                />
            </FormContainer>
        </div>
    );
};

export default observer(WorkplaceCard);
