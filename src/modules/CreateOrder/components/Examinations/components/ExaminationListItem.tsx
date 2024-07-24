import React, { FC, MouseEvent, useEffect } from "react";
import Checkbox from "../../../../../components/uiKit/forms/Checkbox/Checkbox";
import { useQuery } from "react-query";
import { EXAM_TEMPLATE_QUERY_KEYS, KITS_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { getExamTemplatesByKitUUID, getKitTemplate } from "../../../../../api/kits";
import { observer } from "mobx-react";
import { useCreateOrderStore } from "../../../store";
import { TemplateTypeEnum } from "../../../../../shared/models/business/template";
import { getIcon } from "../../../helpers";
import { ExaminationListItemProps } from "../../../models";
import { getExamTemplateInfo } from "../../../../../api/examTemplates";
import { EXAMS_ACCORDION_UUID } from "../../../constants";
import { useTemplatesAccordionsStore } from "../../../../../components/TemplatesAccordions/store";

const ExaminationListItem: FC<ExaminationListItemProps> = ({ name, isChecked, onChange, uuid, type }) => {
    const {
        createOrderStore: {
            setupKitTemplate,
            setupKitExamTemplates,
            setupIsSelectedTemplatesFetching,
            isKitCached,
            isKitExamsCached,
            isExamCached,
            setupExamTemplate,
            setupCurrentGroupUUID,
        },
    } = useCreateOrderStore();

    const {
        templatesAccordionsStore: { setupAutoExpandedTemplateAccordion },
    } = useTemplatesAccordionsStore();

    const { isFetching: isKitTemplateFetching } = useQuery(KITS_QUERY_KEYS.DETAILS(uuid), getKitTemplate(uuid), {
        enabled: type === TemplateTypeEnum.KIT && isChecked && !isKitCached(uuid),
        select: queryData => queryData.data.data,
        onSuccess: kitTemplate => setupKitTemplate(uuid, kitTemplate),
    });

    const { isFetching: isExamTemplatesByKitFetching } = useQuery(
        KITS_QUERY_KEYS.KIT_EXAM_TEMPLATES(uuid),
        getExamTemplatesByKitUUID(uuid),
        {
            enabled: type === TemplateTypeEnum.KIT && isChecked && !isKitExamsCached(uuid),
            select: queryData => queryData.data.data,
            onSuccess: examTemplates => setupKitExamTemplates(uuid, examTemplates),
        }
    );

    const { isFetching: isExamTemplatesFetching } = useQuery(
        EXAM_TEMPLATE_QUERY_KEYS.INFO(uuid),
        getExamTemplateInfo(uuid),
        {
            enabled: type === TemplateTypeEnum.EXAM && isChecked && !isExamCached(uuid),
            select: queryData => queryData.data.data,
            onSuccess: examTemplate => setupExamTemplate(uuid, examTemplate),
        }
    );

    useEffect(() => {
        setupIsSelectedTemplatesFetching(
            isExamTemplatesByKitFetching || isExamTemplatesFetching || isKitTemplateFetching
        );
    }, [isExamTemplatesByKitFetching, isExamTemplatesFetching, isKitTemplateFetching]);

    const onListItemClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (type !== TemplateTypeEnum.GROUP) {
            onChange(!isChecked, uuid);
            if (type === TemplateTypeEnum.EXAM) {
                setupAutoExpandedTemplateAccordion(EXAMS_ACCORDION_UUID);
                return;
            }
            setupAutoExpandedTemplateAccordion(uuid);
        }
    };

    const onListItemDoubleClick = () => {
        if (type === TemplateTypeEnum.GROUP) {
            setupCurrentGroupUUID(uuid);
        }
    };

    const onCheckboxChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const isCheckedNew = !target.checked;
        onChange(isCheckedNew, uuid);
        if (type === TemplateTypeEnum.EXAM) {
            setupAutoExpandedTemplateAccordion(EXAMS_ACCORDION_UUID);
            return;
        }
        setupAutoExpandedTemplateAccordion(uuid);
    };

    return (
        <div
            className={`flex items-center justify-between border-b first:border-t last:border-b first:border-dark-400 last:border-dark-400 p-3 cursor-pointer relative ${
                isChecked ? "bg-brand-100-4 border-brand-100" : "border-dark-400"
            }`}
            onClick={onListItemClick}
            onDoubleClick={onListItemDoubleClick}
            data-testid={`examinationListItem-${uuid}`}
        >
            <p className="flex items-center">
                {getIcon(type)}
                <span className="break-all">{name}</span>
            </p>
            {type !== TemplateTypeEnum.GROUP && (
                <Checkbox checked={isChecked} value={uuid} onChange={onCheckboxChange} />
            )}
        </div>
    );
};

export default observer(ExaminationListItem);
