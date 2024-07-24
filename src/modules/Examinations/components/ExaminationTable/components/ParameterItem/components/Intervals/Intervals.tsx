// libs
import React from "react";
import { observer } from "mobx-react";
import get from "lodash/get";
import { useQuery } from "react-query";

// api
import { getReferenceColors } from "../../../../../../../../api/dictionaries";

// helpers
import { isValueReal } from "../../../../../../../../shared/utils/common";
import { isValueInRange } from "../../../../../../../../components/uiKit/ProgressBar/Stacked/utils";
import { transformReferenceValues } from "../../../../utils";
import { toLookupList } from "../../../../../../../../shared/utils/lookups";

// models
import { IntervalsProps } from "./models";
import { ParameterViewTypeEnum } from "../../../../../../../../shared/models/business/enums";
import { ReferenceValueMaybeHasMarker } from "../../../../../../models";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../../../shared/constants/queryKeys";

// stores
import { useExaminationStore } from "../../../../../../store";

// components
import ExclamationMarkIcon from "../../../../../../../../components/uiKit/Icons/ExclamationMarkIcon";
import StackedProgressBar from "../../../../../../../../components/uiKit/ProgressBar/Stacked/StackedProgressBars";
import IntervalsDescriptions from "./IntervalsDescriptions";

const Intervals = ({ biologicalReferenceIntervals, referenceValues, typeViewId, path }: IntervalsProps) => {
    const {
        examinationStore: { examinationTableData },
    } = useExaminationStore();

    const { data: referenceColorsLookup = [] } = useQuery(
        DICTIONARIES_QUERY_KEYS.REFERENCE_COLORS,
        getReferenceColors,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    if (typeViewId === ParameterViewTypeEnum.NUMBER && referenceValues) {
        const value = get(examinationTableData, path);
        const isValueValid = isValueReal(value);
        const numberValue = Number(value);
        const { title } = referenceValues.find(({ from, to }) => isValueInRange(from, to, numberValue)) || {};
        const isReferralIntervalsAvailable = Boolean(title);
        const referenceValuesWithKeyId = transformReferenceValues(numberValue, referenceValues, referenceColorsLookup);

        return (
            <div
                className={`col-span-5 flex w-full items-center gap-5 ${
                    isValueValid ? "justify-between" : "justify-end"
                }`}
                data-testid="param-intervals"
            >
                {isValueValid && (
                    <span className="flex items-center">
                        {!title && <ExclamationMarkIcon />}
                        <span className="break-words text-md max-w-120" data-testid="param-intervals-title">
                            {title ?? "Out of range"}
                        </span>
                    </span>
                )}
                {isReferralIntervalsAvailable && (
                    <StackedProgressBar<ReferenceValueMaybeHasMarker>
                        withPinIcon={true}
                        progressBars={referenceValuesWithKeyId}
                        startLabel={referenceValues[0]?.from}
                        endLabel={referenceValues.at(-1)?.to}
                        value={numberValue}
                    />
                )}
                <IntervalsDescriptions referenceValues={referenceValuesWithKeyId} groupTitle="Referral intervals" />
            </div>
        );
    }

    return (
        <p className="col-span-5 text-md whitespace-pre-wrap leading-7" data-testid="param-intervals">
            {biologicalReferenceIntervals}
        </p>
    );
};

export default observer(Intervals);
