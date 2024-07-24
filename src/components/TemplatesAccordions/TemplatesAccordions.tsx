import { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { EXAMS_ACCORDION_UUID } from "../../modules/CreateOrder/constants";
import { SetUrgencyStatusEnum } from "../../modules/CreateOrder/enums";
import { DICTIONARIES_QUERY_KEYS } from "../../shared/constants/queryKeys";
import { getUrgencyTypesLookup } from "../../api/lookups";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../shared/constants/queries";
import { toLookupList } from "../../shared/utils/lookups";
import { TemplatesAccordionsProps } from "../../modules/CreateOrder/models";
import TemplatesAccordion from "./TemplatesAccordion/TemplatesAccordion";
import TemplateItem from "./TemplatesAccordion/TemplateItem/TemplateItem";
import TooltipUrgencyButton from "./TemplatesAccordion/TooltipUrgencyButton/TooltipUrgencyButton";
import { UrgencyStatus } from "../../shared/models/business/enums";
import { getAccordionUrgencyStatusByExamTemplates } from "../../modules/CreateOrder/utils";
import { useTemplatesAccordionsStore } from "./store";

export const TemplatesAccordions: FC<TemplatesAccordionsProps> = ({
    title,
    isReadOnly,
    kitTemplates,
    examTemplates,
    getExamTemplatesByKitUUID,
    onStatusChange,
    onAllStatusesChange,
}) => {
    const {
        templatesAccordionsStore: {
            isTemplateAccordionActive,
            setupUrgencyTypesLookups,
            setupExpandedByUserTemplatesAccordions,
        },
    } = useTemplatesAccordionsStore();

    const { data: urgencyTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.URGENCY_TYPES, getUrgencyTypesLookup, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data, true),
    });

    useEffect(() => urgencyTypesLookup && setupUrgencyTypesLookups(urgencyTypesLookup), [urgencyTypesLookup]);

    const getUrgencyStatus = () => {
        const kitExamTemplates = kitTemplates?.map(({ uuid }) => getExamTemplatesByKitUUID(uuid) ?? []).flat() ?? [];

        return getAccordionUrgencyStatusByExamTemplates((examTemplates ?? []).concat(kitExamTemplates));
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <TooltipUrgencyButton urgency={getUrgencyStatus()} size="sm" isActive isReadOnly />
                    {title && <p className="text-md font-bold">{title}</p>}
                </div>
                {!isReadOnly && (
                    <div className="flex gap-1">
                        <TooltipUrgencyButton urgency={UrgencyStatus.NORMAL} onClick={onAllStatusesChange} />
                        <TooltipUrgencyButton urgency={UrgencyStatus.URGENT} onClick={onAllStatusesChange} />
                        <TooltipUrgencyButton urgency={UrgencyStatus.EMERGENCY} onClick={onAllStatusesChange} />
                    </div>
                )}
            </div>
            <div className="mt-4 overflow-auto">
                {kitTemplates.map(kit => {
                    const examTemplatesByKit = getExamTemplatesByKitUUID(kit.uuid);
                    return (
                        <TemplatesAccordion
                            key={kit.uuid}
                            title={kit.name}
                            status={getAccordionUrgencyStatusByExamTemplates(examTemplatesByKit)}
                            isReadOnly={isReadOnly}
                            isOpen={isTemplateAccordionActive(kit.uuid)}
                            onToggle={() => setupExpandedByUserTemplatesAccordions(kit.uuid)}
                            onStatusClick={onStatusChange?.({
                                kitUUID: kit.uuid,
                                type: SetUrgencyStatusEnum.KIT_TEMPLATE,
                            })}
                        >
                            {examTemplatesByKit?.map(exam => {
                                return (
                                    <TemplateItem
                                        key={exam.uuid}
                                        {...exam}
                                        isReadOnly={isReadOnly}
                                        onStatusClick={onStatusChange?.({
                                            kitUUID: kit.uuid,
                                            examUUID: exam.uuid,
                                            type: SetUrgencyStatusEnum.KIT_EXAM_TEMPLATE,
                                        })}
                                    />
                                );
                            })}
                        </TemplatesAccordion>
                    );
                })}
                {Boolean(examTemplates?.length) && (
                    <TemplatesAccordion
                        title="Other exams"
                        status={getAccordionUrgencyStatusByExamTemplates(examTemplates)}
                        isReadOnly={isReadOnly}
                        isOpen={isTemplateAccordionActive(EXAMS_ACCORDION_UUID)}
                        onToggle={() => setupExpandedByUserTemplatesAccordions(EXAMS_ACCORDION_UUID)}
                        onStatusClick={onStatusChange?.({ type: SetUrgencyStatusEnum.EXAM_TEMPLATES })}
                    >
                        {examTemplates?.map(exam => {
                            return (
                                <TemplateItem
                                    key={exam.uuid}
                                    {...exam}
                                    isReadOnly={isReadOnly}
                                    onStatusClick={onStatusChange?.({
                                        examUUID: exam.uuid,
                                        type: SetUrgencyStatusEnum.EXAM_TEMPLATE,
                                    })}
                                />
                            );
                        })}
                    </TemplatesAccordion>
                )}
            </div>
        </>
    );
};

export default observer(TemplatesAccordions);
