// libs
import React, { FC, useState } from "react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import isEqual from "lodash/isEqual";

// helpers
import { schema } from "./schema";
import { createExamTemplate, editExamTemplate } from "../../../../api/examTemplates";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { moveExamTemplatesToGroup } from "../../../../api/exams";

// stores
import { useExamTemplateStore } from "../../store";
import { useTemplatesStore } from "../../../Templates/store";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { ExaminationTemplate } from "../../../../shared/models/business/examTemplate";
import { ExamInfoFormFields, ExamInfoFormMutation } from "./models";
import { ExamTemplate } from "../../../../shared/models/business/exam";
import { MoveExamKitRequest } from "../../../Templates/models";

// constants
import { DEFAULT_CONFIRMATION_DIALOG_TEXT } from "../../../../components/uiKit/forms/FormContainer/constants";
import { TEMPLATES_MESSAGES } from "../../../../shared/constants/templates";

// components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import ExamGeneralInfoForm from "./ExamTemplateInfoForm";

const ExamTemplateInfo: FC = () => {
    const {
        examTemplateStore: {
            goToNextStep,
            setupExamTemplateInfo,
            examTemplateInfo,
            setupExamTemplateUUID,
            examTemplateUUID,
        },
    } = useExamTemplateStore();

    const {
        templatesStore: { parentGroupUUID },
    } = useTemplatesStore();

    const [examTemplateName, setExamTemplateName] = useState("");

    const { mutateAsync: moveExam } = useMutation<
        ServerResponse<ExamTemplate>,
        AxiosError<BaseFormServerValidation>,
        MoveExamKitRequest
    >(moveExamTemplatesToGroup, {
        onSuccess({ data }) {
            showSuccessToast({ title: TEMPLATES_MESSAGES.EXAM_WAS_MOVED(data.data.name) });
        },
        onError() {
            showErrorToast({
                title: TEMPLATES_MESSAGES.EXAM_CANNOT_MOVE(examTemplateName),
                message: TEMPLATES_MESSAGES.MAYBE_GROUP_WAS_DELETED,
            });
        },
    });

    const {
        mutateAsync: mutateAsyncCreate,
        isError: isErrorCreate,
        error: errorCreate,
    } = useMutation<ServerResponse<ExaminationTemplate>, AxiosError<BaseFormServerValidation>, ExamInfoFormMutation>(
        createExamTemplate,
        {
            onSuccess: async examTemplate => {
                const { uuid, name } = examTemplate.data.data;
                setExamTemplateName(name);
                showSuccessToast({ title: TEMPLATES_MESSAGES.EXAM_CREATED(name) });

                if (parentGroupUUID) {
                    await moveExam({ body: { group_uuid: parentGroupUUID }, uuid });
                }
                setupExamTemplateUUID(uuid);
            },
        }
    );

    const {
        mutateAsync: mutateAsyncEdit,
        isError: isErrorEdit,
        error: errorEdit,
    } = useMutation<ServerResponse<ExaminationTemplate>, AxiosError<BaseFormServerValidation>, ExamInfoFormMutation>(
        editExamTemplate(examTemplateUUID),
        {
            onSuccess: ({ data }) => {
                showSuccessToast({ title: TEMPLATES_MESSAGES.EXAM_UPDATED(data.data.name) });
            },
        }
    );

    const onSubmit = async (examInfoFormFields: ExamInfoFormFields) => {
        try {
            const examInfo = {
                ...examInfoFormFields,
                term: parseInt(examInfoFormFields.term) ? parseInt(examInfoFormFields.term) : null,
                sample_types_id: examInfoFormFields.sample_types_id?.value || null,
                si_measurement_units_id: examInfoFormFields.si_measurement_units_id?.value || null,
                volume: parseFloat(examInfoFormFields.volume) ? parseFloat(examInfoFormFields.volume) : null,
                status_id: examInfoFormFields.status_id!.value,
                sample_prefix: examInfoFormFields.sample_prefix.length
                    ? Number(examInfoFormFields.sample_prefix)
                    : null,
            };

            if (examTemplateUUID) {
                if (!isEqual(examTemplateInfo, examInfoFormFields)) {
                    await mutateAsyncEdit(examInfo);
                }
            } else {
                await mutateAsyncCreate(examInfo);
            }

            setupExamTemplateInfo(examInfoFormFields);
            goToNextStep();
        } catch (e) {}
    };

    return (
        <FormContainer
            onSubmit={onSubmit}
            defaultValues={examTemplateInfo!}
            schema={schema}
            className="w-full grid grid-rows-frAuto overflow-hidden h-full"
            confirmationDialogText={
                Boolean(parentGroupUUID)
                    ? "Changes you made may not be saved and exam template won't be attached."
                    : DEFAULT_CONFIRMATION_DIALOG_TEXT
            }
            toObserveFormValue={Boolean(parentGroupUUID)}
        >
            <ExamGeneralInfoForm errors={errorCreate || errorEdit} isError={isErrorCreate || isErrorEdit} />
        </FormContainer>
    );
};

export default observer(ExamTemplateInfo);
