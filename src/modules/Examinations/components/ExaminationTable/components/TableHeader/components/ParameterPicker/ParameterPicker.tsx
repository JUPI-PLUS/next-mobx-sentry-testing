// libs
import React from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useExaminationStore } from "../../../../../../store";

// api
import { getExamTemplatesByWorkplaceUUID } from "../../../../../../../../api/workplaces";

// helpers
import { toLookupList } from "../../../../../../../../shared/utils/lookups";

// models
import { Lookup } from "../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../shared/models/common";

// constants
import { WORKPLACE_QUERY_KEYS } from "../../../../../../../../shared/constants/queryKeys";

// components
import { IconButton } from "../../../../../../../../components/uiKit/Button/Button";
import FunnelIcon from "../../../../../../../../components/uiKit/Icons/FunnelIcon";
import LookupList from "../../../../../../../../components/uiKit/LookupList/LookupList";
import { XMarkIcon } from "@heroicons/react/20/solid";

const ParameterPicker = () => {
    const {
        examinationStore: {
            setupExamTemplatesByWorkplaceLookup,
            examTemplatesByWorkplaceLookup,
            selectedWorkplace,
            examTemplatesLookup,
        },
    } = useExaminationStore();

    const { data: examTemplatesForWorkplace = [], isFetching } = useQuery(
        WORKPLACE_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(selectedWorkplace?.uuid ?? ""),
        getExamTemplatesByWorkplaceUUID(selectedWorkplace?.uuid ?? ""),
        {
            enabled: Boolean(selectedWorkplace?.uuid),
            select: queryData => {
                return toLookupList(queryData.data.data);
            },
        }
    );

    const onResetExamTemplatesFilter = () => {
        setupExamTemplatesByWorkplaceLookup([]);
    };

    const onSubmitExamTemplatesFilter = (pickedLookups: Lookup<ID>[]) => {
        setupExamTemplatesByWorkplaceLookup(pickedLookups);
    };

    const lookupListForFilter = selectedWorkplace ? examTemplatesForWorkplace : examTemplatesLookup;
    const isExamTemplatesFilterHasValue = Boolean(examTemplatesByWorkplaceLookup.length);

    return (
        <div className="col-span-3 flex">
            <span>Param</span>
            {isExamTemplatesFilterHasValue && (
                <div className="pl-2 pr-1 bg-brand-100 ml-1.5 text-white rounded-full flex justify-between">
                    {examTemplatesByWorkplaceLookup.length}
                    <IconButton
                        aria-label="Cleanup exam templates by workplaces filter"
                        size="thin"
                        variant="neutral"
                        className="ml-0.5"
                        onClick={onResetExamTemplatesFilter}
                    >
                        <XMarkIcon className="fill-white opacity-60 w-4 h-4" />
                    </IconButton>
                </div>
            )}
            <LookupList
                onSubmit={onSubmitExamTemplatesFilter}
                lookups={lookupListForFilter}
                selectedLookups={examTemplatesByWorkplaceLookup}
                matchField="label"
                onReset={onResetExamTemplatesFilter}
                disabled={isFetching}
            >
                <IconButton
                    aria-label="Exam templates by workplaces filter"
                    size="thin"
                    className="fill-dark-700 p-1 ml-0.5 rounded-full"
                    type="button"
                >
                    <FunnelIcon />
                </IconButton>
            </LookupList>
        </div>
    );
};

export default observer(ParameterPicker);
