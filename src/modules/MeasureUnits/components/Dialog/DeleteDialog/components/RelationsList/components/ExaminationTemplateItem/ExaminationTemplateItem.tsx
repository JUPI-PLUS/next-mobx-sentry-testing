// libs
import React, { FC, useMemo } from "react";
import { observer } from "mobx-react";

// store
import { useParametersStore } from "../../../../../../../../Parameters/store";

//  helpers
import { getLookupItem } from "../../../../../../../../../shared/utils/lookups";

// models
import { BadgeProps } from "../../../../../../../../../components/uiKit/Badge/models";
import { ExamTemplateStatusesEnum } from "../../../../../../../../../shared/models/business/examTemplate";
import { ExaminationTemplateItemProps } from "./models";

//  constants
import { ROUTES } from "../../../../../../../../../shared/constants/routes";

// components
import { OutlineButton } from "../../../../../../../../../components/uiKit/Button/Button";
import Badge from "../../../../../../../../../components/uiKit/Badge/Badge";
import LinkComponent from "../../../../../../../../../components/uiKit/LinkComponent/LinkComponent";

const ExaminationTemplateItem: FC<ExaminationTemplateItemProps> = ({ uuid, statusId, name, code }) => {
    const {
        parametersStore: { examinationTemplateStatusesLookup },
    } = useParametersStore();

    const badgeProps = useMemo<BadgeProps>(() => {
        const badgeText = getLookupItem(examinationTemplateStatusesLookup, statusId)?.label ?? "";
        switch (statusId) {
            case ExamTemplateStatusesEnum.ACTIVE:
                return { variant: "success", text: badgeText };
            case ExamTemplateStatusesEnum.INACTIVE:
            default:
                return { variant: "error", text: badgeText };
        }
    }, [statusId, examinationTemplateStatusesLookup]);

    return (
        <li
            className="grid grid-cols-4 py-4 px-5 items-center border border-inset border-dark-600 rounded-md"
            data-testid={`examination-template-item-${uuid}`}
        >
            <div className="col-span-3">
                <div className="flex items-center leading-snug">
                    <div className="text-sm text-dark-800 mr-2">{code}</div>
                    <Badge {...badgeProps} />
                </div>
                <div className="text-md mt-2 text-dark-900 break-word">{name}</div>
            </div>
            <div className="col-span-1">
                <LinkComponent
                    href={{ pathname: ROUTES.examTemplate.edit.route, query: { uuid } }}
                    aTagProps={{ target: "_blank" }}
                >
                    <OutlineButton type="button" text="Browse" className="ml-auto" />
                </LinkComponent>
            </div>
        </li>
    );
};

export default observer(ExaminationTemplateItem);
