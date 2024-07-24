// libs
import React from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useExaminationStore } from "../../../../../../store";

// api
import { getExamStatuses } from "../../../../../../../../api/dictionaries";

// helpers
import { toLookupList } from "../../../../../../../../shared/utils/lookups";

// models
import { Lookup } from "../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../shared/models/common";

// constants
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../../../shared/constants/queries";

// components
import { IconButton } from "../../../../../../../../components/uiKit/Button/Button";
import FunnelIcon from "../../../../../../../../components/uiKit/Icons/FunnelIcon";
import LookupList from "../../../../../../../../components/uiKit/LookupList/LookupList";
import { XMarkIcon } from "@heroicons/react/20/solid";

const StatusPicker = () => {
    const {
        examinationStore: { selectedExamTemplatesStatusesLookup, setupExamsTemplateStatuses },
    } = useExaminationStore();

    const { data: statusesLookup = [], isFetching: isStatusesLookupFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_STATUSES,
        getExamStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const onResetExamTemplatesFilter = () => {
        setupExamsTemplateStatuses([]);
    };

    const onSubmitExamTemplatesFilter = (pickedLookups: Lookup<ID>[]) => {
        setupExamsTemplateStatuses(pickedLookups);
    };

    const isExamTemplatesFilterHasValue = Boolean(selectedExamTemplatesStatusesLookup.length);

    return (
        <div className="col-span-2 flex justify-end pr-1">
            <span>Status</span>
            {isExamTemplatesFilterHasValue && (
                <div className="pl-2 pr-1 bg-brand-100 ml-1.5 text-white rounded-full flex justify-between">
                    {selectedExamTemplatesStatusesLookup.length}
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
                lookups={statusesLookup}
                selectedLookups={selectedExamTemplatesStatusesLookup}
                matchField="label"
                onReset={onResetExamTemplatesFilter}
                disabled={isStatusesLookupFetching}
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

export default observer(StatusPicker);
