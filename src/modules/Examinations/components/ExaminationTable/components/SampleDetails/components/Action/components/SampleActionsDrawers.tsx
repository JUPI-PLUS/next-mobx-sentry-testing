//  libs
import React from "react";
import { getUnixTime } from "date-fns";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

//  stores
import { useExaminationStore } from "../../../../../../../store";

//  helpers
import { queryClient } from "../../../../../../../../../../pages/_app";
import { removeOffsetFromDate } from "../../../../../../../../../shared/utils/date";
import { patchSampleMarkAsDamaged } from "../../../../../../../../../api/samples";

//  models
import { BaseFormServerValidation, ServerResponse } from "../../../../../../../../../shared/models/axios";
import {
    SampleChangeStatusFormFields,
    SampleChangeStatusPatchFields,
    SampleMarkAsDamagedPatch,
} from "../../../../../../../../Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";
import { SampleStatuses } from "../../../../../../../../../shared/models/business/enums";
import { SampleActionType } from "../../../../../../../../../shared/models/business/sample";

//  constants
import { SAMPLES_QUERY_KEYS } from "../../../../../../../../../shared/constants/queryKeys";

//  components
import { showSuccessToast } from "../../../../../../../../../components/uiKit/Toast/helpers";
import SampleChangeStatusDrawer from "../../../../../../../../../components/SamplingDrawers/SampleChangeStatusDrawer/SampleChangeStatusDrawer";
import SampleDetailsDrawer from "../../../../../../../../../components/SamplingDrawers/SampleDetailsDrawer/SampleDetailsDrawer";
import SampleEditMarkAsDamagedNoteDrawer from "../../../../../../../../../components/SamplingDrawers/SampleEditMarkAsDamagedNoteDrawer/SampleEditMarkAsDamagedNoteDrawer";

const SampleActionsDrawers = () => {
    const {
        examinationStore: {
            activeSample,
            failedExams,
            sampleActionType,
            samplesFiltersQueryString,
            availableMarkAsDamageExams,
            resetSampleActionType,
            resetActiveSample,
        },
    } = useExaminationStore();

    const { mutateAsync: mutateChangeStatus } = useMutation<
        ServerResponse<SampleMarkAsDamagedPatch>,
        AxiosError<BaseFormServerValidation>,
        SampleMarkAsDamagedPatch
    >(patchSampleMarkAsDamaged, {
        async onSuccess() {
            await queryClient.refetchQueries(SAMPLES_QUERY_KEYS.FILTER_SAMPLES_LIST(samplesFiltersQueryString));
            resetSampleActionType();
            resetActiveSample();
            showSuccessToast({ title: "Sample has been successfully marked as damaged" });
        },
    });

    const onChangeStatusSubmit = async (sampleChangeStatusFormFields: SampleChangeStatusFormFields) => {
        const { updated_at: sampleDate, damage_reason: sampleDamageReason } = sampleChangeStatusFormFields;
        const sampleChangeStatusPatchFields: SampleChangeStatusPatchFields = {
            sample_statuses_id: SampleStatuses.FAILED_ON_VALIDATION,
            updated_at: getUnixTime(removeOffsetFromDate(sampleDate.from)),
            damage_reason: sampleDamageReason!.value,
        };
        await mutateChangeStatus({ sampleChangeStatusPatchFields, uuid: activeSample?.uuid as string });
    };

    const onCloseDrawer = () => {
        resetSampleActionType();
    };

    return (
        <>
            <SampleDetailsDrawer
                isOpen={sampleActionType === SampleActionType.Details}
                onClose={onCloseDrawer}
                sampleUUID={activeSample?.uuid}
            />
            <SampleChangeStatusDrawer
                exams={availableMarkAsDamageExams}
                isOpen={sampleActionType === SampleActionType.ChangeStatus}
                onClose={onCloseDrawer}
                onSubmit={onChangeStatusSubmit}
            />
            <SampleEditMarkAsDamagedNoteDrawer
                exams={failedExams}
                isOpen={sampleActionType === SampleActionType.EditMarkAsDamagedNote}
                onClose={onCloseDrawer}
                onSubmit={() => {}}
            />
        </>
    );
};

export default observer(SampleActionsDrawers);
