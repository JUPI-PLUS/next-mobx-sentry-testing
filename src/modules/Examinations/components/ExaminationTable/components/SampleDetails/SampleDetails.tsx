// libs
import React, { useMemo } from "react";
import { format, fromUnixTime } from "date-fns";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useExaminationStore } from "../../../../store";

// api
import { getConditionTypes, getSampleTypes, getSexTypes } from "../../../../../../api/dictionaries";
import { details } from "../../../../../../api/users";
import { getOrdersConditionsBySample } from "../../../../../../api/samples";

// helpers
import { addOffsetToUtcDate } from "../../../../../../shared/utils/date";
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";
import { getTransformedOrdersConditions } from "../../utils";

// constants
import { DATE_FORMATS } from "../../../../../../shared/constants/formates";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import {
    DICTIONARIES_QUERY_KEYS,
    PATIENTS_QUERY_KEYS,
    SAMPLES_QUERY_KEYS,
} from "../../../../../../shared/constants/queryKeys";

// components
import Dot from "../../../../../../components/uiKit/Dot/Dot";
import SampleIcon from "../../../../../../components/uiKit/Icons/SampleIcon";
import SampleDetailsActions from "./components/Action/SampleDetailsActions";
import SampleDetailsConditions from "./components/SampleDetailsConditions/SampleDetailsConditions";
import Badge from "../../../../../../components/uiKit/Badge/Badge";
import { PencilSmallIcon } from "../../../../../../components/uiKit/Icons";
import { SampleActionType } from "../../../../../../shared/models/business/sample";
import { IconButton } from "../../../../../../components/uiKit/Button/Button";

const SampleDetails = () => {
    const {
        examinationStore: { activeSample, failedExams, setupSampleActionType },
    } = useExaminationStore();

    const { data: sampleTypesLookup = [] } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: sexTypesLookup = [] } = useQuery(DICTIONARIES_QUERY_KEYS.SEX_TYPES, getSexTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: ordersConditionsBySample = [] } = useQuery(
        SAMPLES_QUERY_KEYS.ORDERS_CONDITIONS(activeSample!.uuid),
        getOrdersConditionsBySample(activeSample!.uuid),
        {
            select: queryData => queryData.data.data,
        }
    );

    const { data: conditionTypesLookup = [] } = useQuery(DICTIONARIES_QUERY_KEYS.CONDITION_TYPES, getConditionTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: patient } = useQuery(
        PATIENTS_QUERY_KEYS.PATIENT(activeSample!.user_uuid),
        details(activeSample!.user_uuid),
        {
            select: queryData => queryData.data.data,
        }
    );

    const conditions = useMemo(() => {
        if (!patient || !conditionTypesLookup.length || !sexTypesLookup.length) return [];

        return getTransformedOrdersConditions(ordersConditionsBySample, patient, sexTypesLookup, conditionTypesLookup);
    }, [ordersConditionsBySample, conditionTypesLookup, patient, sexTypesLookup]);

    const sampleType = getLookupItem(sampleTypesLookup, activeSample?.type_id)?.label || "";

    if (!activeSample) return null;

    const sampleCreatedDate = activeSample.created_at_timestamp
        ? format(addOffsetToUtcDate(fromUnixTime(activeSample.created_at_timestamp)), DATE_FORMATS.DATE_ONLY)
        : "infinity";

    const sampleUpdatedDate = activeSample.updated_at_timestamp
        ? format(addOffsetToUtcDate(fromUnixTime(activeSample.updated_at_timestamp)), DATE_FORMATS.DATE_ONLY)
        : "infinity";

    return (
        <div className="px-6 py-6 bg-white rounded-t-lg border-b border-dark-400">
            <div className="flex justify-between items-center gap-16">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-dark-300 flex items-center justify-center">
                        <SampleIcon />
                    </div>
                    <div>
                        <div className="flex gap-4 items-center">
                            <p className="font-bold" data-testid="sample-number">
                                Sample №{activeSample.barcode}
                            </p>
                            {failedExams && (
                                <>
                                    <Badge text="Damaged" variant="error" />
                                    <div>Failed count: {failedExams.length}</div>
                                    {/* TODO: wait for BE */}
                                    <div className="flex-1">Notes: notes</div>
                                    <IconButton
                                        onClick={() => setupSampleActionType(SampleActionType.EditMarkAsDamagedNote)}
                                        variant="neutral"
                                    >
                                        <PencilSmallIcon className="fill-dark-700" />
                                    </IconButton>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <p data-testid="sample-type">
                                <span className="text-dark-700">Type </span>
                                {sampleType}
                            </p>
                            <Dot />
                            <p data-testid="sample-create-date">
                                <span className="text-dark-700">Created </span>
                                {sampleCreatedDate}
                            </p>
                            <Dot />
                            <p data-testid="sample-update-date">
                                <span className="text-dark-700">Last edit </span>
                                {sampleUpdatedDate}
                            </p>
                        </div>
                    </div>
                </div>
                <SampleDetailsActions />
            </div>
            <SampleDetailsConditions conditions={conditions} />
        </div>
    );
};

export default observer(SampleDetails);
