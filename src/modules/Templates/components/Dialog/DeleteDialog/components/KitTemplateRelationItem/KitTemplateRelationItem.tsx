// libs
import React, { FC, useMemo } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import { useQuery } from "react-query";

//  helpers
import { getLookupItem, toLookupList } from "../../../../../../../shared/utils/lookups";
import { getExamTemplateStatuses } from "../../../../../../../api/dictionaries";

// models
import { BadgeProps } from "../../../../../../../components/uiKit/Badge/models";
import { KitTemplate } from "../../../../../../KitTemplate/components/KitForm/models";
import { ExamTemplateStatusesEnum } from "../../../../../../../shared/models/business/examTemplate";

//  constants
import { ROUTES } from "../../../../../../../shared/constants/routes";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../../shared/constants/queries";

// components
import { OutlineButton } from "../../../../../../../components/uiKit/Button/Button";
import Badge from "../../../../../../../components/uiKit/Badge/Badge";

const KitTemplateRelationItem: FC<KitTemplate> = ({ uuid, status_id, name, code }) => {
    const { data: examTemplateStatusesLookup = [] } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        getExamTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select(queryData) {
                return toLookupList(queryData.data.data);
            },
        }
    );

    const badgeProps = useMemo<BadgeProps>(() => {
        const badgeText = getLookupItem(examTemplateStatusesLookup, status_id)?.label ?? "";
        switch (status_id) {
            case ExamTemplateStatusesEnum.ACTIVE:
                return { variant: "success", text: badgeText };
            case ExamTemplateStatusesEnum.INACTIVE:
            default:
                return { variant: "error", text: badgeText };
        }
    }, [examTemplateStatusesLookup, status_id]);

    return (
        <li className="grid grid-cols-4 py-4 px-5 items-center border border-inset border-dark-600 rounded-md mb-4">
            <div className="col-span-3">
                <div className="flex items-center leading-snug">
                    <div className="text-sm text-dark-800 mr-2">{code}</div>
                    <Badge {...badgeProps} />
                </div>
                <div className="text-md mt-2 text-dark-900 break-word">{name}</div>
            </div>
            <div className="col-span-1">
                <Link href={{ pathname: ROUTES.editKitTemplate.route, query: { uuid } }} target="_blank">
                    <a target="_blank">
                        <OutlineButton text="Browse" className="ml-auto" />
                    </a>
                </Link>
            </div>
        </li>
    );
};

export default observer(KitTemplateRelationItem);
