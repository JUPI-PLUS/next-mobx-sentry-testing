import React, { MouseEvent, useMemo } from "react";
import TemplatesAccordions from "../../../../components/TemplatesAccordions/TemplatesAccordions";
import { UrgencyStatus } from "../../../../shared/models/business/enums";
import { useCreateOrderStore } from "../../store";
import { observer } from "mobx-react";
import { SetUrgencyStatusEnum } from "../../enums";
import SelectedExaminationsListPlaceholder from "./SelectedExaminationsListPlaceholder";
import { OnTemplateStatusChange } from "../../models";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { useQuery } from "react-query";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { getSampleTypes } from "../../../../api/dictionaries";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

const SelectedExaminations = () => {
    const {
        createOrderStore: {
            selectedKitTemplates,
            selectedKitExamTemplates,
            selectedExamTemplates,
            isKitOrExamSelected,
            updateKitTemplate,
            updateKitExamTemplate,
            updateExamTemplate,
            updateExamTemplates,
            changeOrderUrgencyStatus,
        },
    } = useCreateOrderStore();

    const { data: sampleTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const onAllStatusesChange = (event: MouseEvent, status: UrgencyStatus) => {
        event.preventDefault();
        event.stopPropagation();
        changeOrderUrgencyStatus(status);
    };

    const getExamTemplatesByKitUUID = (uuid: string) => {
        return selectedKitExamTemplates.get(uuid);
    };

    const onStatusChange =
        ({ kitUUID = "", examUUID = "", type }: OnTemplateStatusChange) =>
        (event: MouseEvent, status: UrgencyStatus) => {
            event.preventDefault();
            event.stopPropagation();
            switch (type) {
                case SetUrgencyStatusEnum.KIT_TEMPLATE:
                    updateKitTemplate(kitUUID, status);
                    break;
                case SetUrgencyStatusEnum.KIT_EXAM_TEMPLATE:
                    updateKitExamTemplate(kitUUID, examUUID, status);
                    break;
                case SetUrgencyStatusEnum.EXAM_TEMPLATE:
                    updateExamTemplate(examUUID, status);
                    break;
                case SetUrgencyStatusEnum.EXAM_TEMPLATES:
                    updateExamTemplates(status);
                    break;
            }
        };

    const kitTemplates = useMemo(() => Array.from(selectedKitTemplates.values()), [selectedKitTemplates.values()]);
    const examTemplates = useMemo(
        () =>
            Array.from(selectedExamTemplates.values()).map(temp => ({
                ...temp,
                sample_types_name: getLookupItem(sampleTypesLookup, temp.sample_types_id)?.label,
            })),
        [sampleTypesLookup, selectedExamTemplates.values()]
    );

    if (!isKitOrExamSelected) return <SelectedExaminationsListPlaceholder />;

    return (
        <TemplatesAccordions
            title="Examinations list"
            kitTemplates={kitTemplates}
            examTemplates={examTemplates}
            getExamTemplatesByKitUUID={getExamTemplatesByKitUUID}
            onStatusChange={onStatusChange}
            onAllStatusesChange={onAllStatusesChange}
        />
    );
};

export default observer(SelectedExaminations);
