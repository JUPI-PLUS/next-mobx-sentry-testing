// libs
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

// helpers
import { setParamsRelations } from "../../../../api/examTemplates";
import { queryClient } from "../../../../../pages/_app";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";

// store
import { ActionDialogType, useExamTemplateStore } from "../../store";
import { useTemplatesStore } from "../../../Templates/store";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { ParamsRelationsData } from "./models";

// constants
import { EXAM_TEMPLATE_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { ROUTES } from "../../../../shared/constants/routes";
import { TEMPLATES_MESSAGES } from "../../../../shared/constants/templates";

// components
import ExamTemplateFooter from "../ExamTemplateFooter/ExamTemplateFooter";
import ParametersButtons from "./components/ParametersButtons/ParametersButtons";
import ExamTemplateList from "./components/ExamTemplateList/ExamTemplateList";
import ExamTemplateActionDialogs from "./components/ExamTemplateActionDialogs/ExamTemplateActionDialogs";

const ExamTemplateParameters = () => {
    const {
        examTemplateStore: {
            examTemplateInfo,
            goToPrevStep,
            examTemplateParameters,
            setActionType,
            examTemplateUUID,
            examTemplateParamsRelations,
            examTemplateParamsUUIDFromMap,
        },
    } = useExamTemplateStore();

    const {
        templatesStore: { templatesFolderQueryString },
    } = useTemplatesStore();

    const { push } = useRouter();

    const isEmptyParameters = useMemo(() => !Boolean(examTemplateParameters.length), [examTemplateParameters.length]);

    const { mutateAsync, isLoading } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>,
        ParamsRelationsData
    >(setParamsRelations(examTemplateUUID), {
        onSuccess: () => {
            push({
                pathname: ROUTES.templates.route,
                query: templatesFolderQueryString,
            });
            showSuccessToast({ title: TEMPLATES_MESSAGES.EXAM_PARAMETERS_UPDATED(examTemplateInfo!.name) });
        },
        onError: errorData => {
            showErrorToast({ title: errorData.response?.data.message });
            queryClient.refetchQueries(EXAM_TEMPLATE_QUERY_KEYS.PARAMS(examTemplateUUID));
        },
    });

    const onAddParameter = () => setActionType(ActionDialogType.ADD_PARAMETER);
    const onAddGroup = () => setActionType(ActionDialogType.ADD_GROUP);

    const onSubmit = async () => {
        try {
            await mutateAsync(examTemplateParamsRelations);
        } catch {}
    };

    return (
        <>
            <div className="grid grid-rows-frAuto overflow-hidden h-full">
                {!isEmptyParameters && <ExamTemplateList parameters={examTemplateParameters} />}
                <div
                    className={`${
                        isEmptyParameters ? "mb-24" : "mb-8 pt-10"
                    } flex flex-col justify-center max-w-3xl mx-auto w-full`}
                >
                    {isEmptyParameters && (
                        <p className=" mb-10 text-md font-bold text-center">Choose option to continue</p>
                    )}
                    <ParametersButtons
                        onAddParameter={onAddParameter}
                        onAddGroup={onAddGroup}
                        containerClass="max-w-3xl mx-auto w-full"
                    />
                </div>
            </div>
            <ExamTemplateFooter
                containerClass="border-t pt-6 w-full max-w-3xl mx-auto"
                cancelButtonVariant="neutral"
                cancelText="Back"
                submitText="Save template"
                onCancel={goToPrevStep}
                onSubmit={onSubmit}
                isCancelButtonDisabled={isLoading}
                isSubmitButtonDisabled={!examTemplateParamsUUIDFromMap.length || isLoading}
            />
            <ExamTemplateActionDialogs />
        </>
    );
};

export default observer(ExamTemplateParameters);
