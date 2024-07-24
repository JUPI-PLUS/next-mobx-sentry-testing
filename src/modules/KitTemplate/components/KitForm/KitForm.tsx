//  libs
import React, { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";

//  stores
import { useTemplatesStore } from "../../../Templates/store";
import { useKitTemplateStore } from "../../store";

// api
import {
    createKitTemplate,
    editKitTemplate,
    getExamTemplatesByKitUUID,
    getKitTemplate,
    moveKitTemplatesToGroup,
} from "../../../../api/kits";
import { getExamTemplateStatuses, getKitTemplateStatuses } from "../../../../api/dictionaries";

//  helpers
import { schema } from "./schema";
import { getInvalidExamTemplates, getTemplatesUUIDsLookup } from "../../utils";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";

//  models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { KitTemplateFormFields, KitTemplate, KitTemplateBody } from "./models";
import { MoveExamKitRequest } from "../../../Templates/models";

//  constants
import { DICTIONARIES_QUERY_KEYS, KITS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { ROUTES } from "../../../../shared/constants/routes";
import { DEFAULT_CONFIRMATION_DIALOG_TEXT } from "../../../../components/uiKit/forms/FormContainer/constants";
import { TEMPLATES_MESSAGES } from "../../../../shared/constants/templates";
import { DEFAULT_KIT_TEMPLATE_STATUS_ID } from "../../constants";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

//  components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import KitFormContent from "./KitFormContent/KitFormContent";
import { FormSkeleton } from "../Skeletons";

const KIT_TEMPLATE_DEFAULT_VALUES: KitTemplateFormFields = {
    name: "", // name of kit template
    code: "", // code of kit template
    status_id: null, // status lookup
    exam_templates: [],
};

const KitForm = () => {
    const {
        kitTemplateStore: {
            setupExamTemplateErrors,
            isEditPage,
            currentKitTemplateUUID,
            setupSelectedExamTemplates,
            setupExamTemplateStatusesLookup,
            setupKitTemplateStatusesLookup,
        },
    } = useKitTemplateStore();
    const {
        templatesStore: {
            copiedKitTemplateUUID,
            parentGroupUUID,
            templatesFolderQueryString,
            setupCopiedKitTemplateUUID,
        },
    } = useTemplatesStore();
    const { push } = useRouter();

    const [kitTemplateName, setKitTemplateName] = useState("");

    const kitTemplateUUID = currentKitTemplateUUID || copiedKitTemplateUUID;
    const isEditing = Boolean(kitTemplateUUID);

    const { data: kitTemplateStatusesLookup, isFetching: isKitTemplateStatusesLookupFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.KIT_TEMPLATE_STATUSES,
        getKitTemplateStatuses,
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

    const { data: kitTemplateData, isFetching: isKitTemplateDataFetching } = useQuery(
        KITS_QUERY_KEYS.DETAILS(kitTemplateUUID),
        getKitTemplate(kitTemplateUUID),
        {
            enabled: isEditing && !isKitTemplateStatusesLookupFetching,
            select: queryData => queryData.data.data,
        }
    );

    const { data: selectedExamTemplates = [], isFetching: isSelectedExamTemplatesFetching } = useQuery(
        KITS_QUERY_KEYS.KIT_EXAM_TEMPLATES(kitTemplateUUID),
        getExamTemplatesByKitUUID(kitTemplateUUID),
        {
            enabled: isEditing,
            select: queryData => queryData.data.data,
            onSuccess: queryData => setupSelectedExamTemplates(queryData),
        }
    );

    const { mutateAsync: moveKit } = useMutation<
        ServerResponse<KitTemplate>,
        AxiosError<BaseFormServerValidation>,
        MoveExamKitRequest
    >(moveKitTemplatesToGroup, {
        onSuccess({ data }) {
            showSuccessToast({ title: TEMPLATES_MESSAGES.KIT_WAS_MOVED(data.data.name) });
        },
        onError() {
            showErrorToast({
                title: TEMPLATES_MESSAGES.KIT_CANNOT_MOVE(kitTemplateName),
                message: TEMPLATES_MESSAGES.MAYBE_GROUP_WAS_DELETED,
            });
        },
    });

    const { mutateAsync: mutateAsyncCreate, error: errorOnCreate } = useMutation<
        ServerResponse<KitTemplate>,
        AxiosError<BaseFormServerValidation>,
        KitTemplateBody
    >(createKitTemplate, {
        onSuccess: async queryData => {
            const { uuid, name } = queryData.data.data;
            setKitTemplateName(name);
            showSuccessToast({ title: TEMPLATES_MESSAGES.KIT_CREATED(name) });

            if (parentGroupUUID) {
                await moveKit({ body: { group_uuid: parentGroupUUID }, uuid });
            }
            setupCopiedKitTemplateUUID(uuid);

            push({
                pathname: ROUTES.templates.route,
                query: templatesFolderQueryString,
            });
        },
        onError: error => {
            const errors = error?.response?.data.errors;
            if (errors) {
                setupExamTemplateErrors(getInvalidExamTemplates(errors));
            }
        },
    });

    const { mutateAsync: mutateAsyncEdit, error: errorOnEdit } = useMutation<
        ServerResponse<KitTemplate>,
        AxiosError<BaseFormServerValidation>,
        KitTemplateBody
    >(editKitTemplate(currentKitTemplateUUID), {
        onSuccess: ({ data }) => {
            showSuccessToast({ title: TEMPLATES_MESSAGES.KIT_UPDATED(data.data.name) });
            push({
                pathname: ROUTES.templates.route,
                query: templatesFolderQueryString,
            });
        },
        onError: error => {
            const errors = error?.response?.data.errors;
            if (errors) {
                setupExamTemplateErrors(getInvalidExamTemplates(errors));
            }
        },
    });

    useEffect(() => {
        if (!isKitTemplateStatusesLookupFetching && kitTemplateStatusesLookup) {
            setupKitTemplateStatusesLookup(kitTemplateStatusesLookup);
        }
    }, [isKitTemplateStatusesLookupFetching, kitTemplateStatusesLookup]);

    useEffect(() => {
        if (!isExamTemplateStatusesLookupFetching && examTemplateStatusesLookup) {
            setupExamTemplateStatusesLookup(examTemplateStatusesLookup);
        }
    }, [isExamTemplateStatusesLookupFetching, examTemplateStatusesLookup]);

    const defaultValues = useMemo(() => {
        return kitTemplateData
            ? {
                  ...kitTemplateData,
                  status_id: getLookupItem(kitTemplateStatusesLookup, kitTemplateData.status_id),
                  exam_templates: selectedExamTemplates.map(template => template.uuid),
              }
            : {
                  ...KIT_TEMPLATE_DEFAULT_VALUES,
                  status_id: getLookupItem(kitTemplateStatusesLookup, DEFAULT_KIT_TEMPLATE_STATUS_ID),
              };
    }, [kitTemplateStatusesLookup, kitTemplateData, selectedExamTemplates]);

    const onSubmit = async (values: KitTemplateFormFields) => {
        try {
            const kitData = {
                name: values.name,
                code: values.code,
                status_id: values.status_id!.value,
                exam_templates: getTemplatesUUIDsLookup(values.exam_templates),
            };

            if (isEditPage) {
                await mutateAsyncEdit(kitData);
            } else {
                await mutateAsyncCreate(kitData);
            }
        } catch (err) {}
    };

    if (isKitTemplateStatusesLookupFetching || isKitTemplateDataFetching || isSelectedExamTemplatesFetching) {
        return <FormSkeleton />;
    }

    return (
        <div className="flex flex-col w-full h-full border border-inset border-gray-200 pt-10 bg-white rounded-md shadow-card-shadow overflow-hidden">
            <FormContainer
                defaultValues={defaultValues}
                schema={schema}
                onSubmit={onSubmit}
                className="max-w-3xl mx-auto w-full h-full"
                confirmationDialogText={
                    Boolean(parentGroupUUID)
                        ? "Changes you made may not be saved and kit template won't be attached."
                        : DEFAULT_CONFIRMATION_DIALOG_TEXT
                }
                toObserveFormValue={Boolean(parentGroupUUID)}
            >
                <div className="block w-full h-full">
                    <div className="flex flex-col w-full h-full">
                        <KitFormContent error={isEditPage ? errorOnEdit : errorOnCreate} />
                    </div>
                </div>
            </FormContainer>
        </div>
    );
};

export default observer(KitForm);
