// libs
import React, { useMemo } from "react";
import { useQuery } from "react-query";

// api
import { getMeasurementUnits } from "../../../../../../api/dictionaries";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";

// models
import { ParameterItemProps } from "./models";
import { ExamStatusesEnum } from "../../../../../../shared/models/business/exam";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

// components
import ParameterNotes from "../Notes/ParameterNotes/ParameterNotes";
import Intervals from "./components/Intervals/Intervals";
import ValueInput from "./components/ValueInput/ValueInput";

const ParameterItem = ({ param, examStatus, path }: ParameterItemProps) => {
    const {
        name,
        value,
        si_measurement_units_id: measureUnitId,
        biological_reference_intervals: biologicalReferenceIntervals,
        uuid,
        options,
        reference_values: referenceValues,
        type_view_id: typeViewId,
    } = param;

    const { data: measureUnitLookup } = useQuery(DICTIONARIES_QUERY_KEYS.MEASUREMENT_UNITS, getMeasurementUnits, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const measureUnitLabel = useMemo(
        () => getLookupItem(measureUnitLookup, measureUnitId)?.label || "",
        [measureUnitLookup, measureUnitId]
    );

    return (
        <div className="border-t border-inset border-dark-400 px-4">
            <div className="grid grid-cols-12 items-center py-2">
                <p className="text-md col-span-3 break-word" data-testid="param-name">
                    {name}
                </p>
                <div className="col-span-4 grid grid-cols-3 items-center h-full max-w-full gap-4">
                    <div className="col-span-2">
                        <ValueInput
                            uuid={uuid}
                            path={`${path}.value`}
                            value={value}
                            examStatus={examStatus}
                            disabled={examStatus === ExamStatusesEnum.DONE}
                            options={toLookupList(options)}
                            referenceValues={referenceValues}
                            typeViewId={typeViewId}
                        />
                    </div>
                    <p className="flex justify-center col-span-1 text-md" data-testid="param-measure-unit">
                        {measureUnitLabel}
                    </p>
                </div>
                <Intervals
                    referenceValues={referenceValues}
                    biologicalReferenceIntervals={biologicalReferenceIntervals}
                    typeViewId={typeViewId}
                    path={`${path}.value`}
                />
            </div>
            <ParameterNotes
                examStatus={examStatus}
                path={`${path}.result_notes`}
                className="w-full pt-3 border-t border-inset border-dark-400 pb-5"
            />
        </div>
    );
};

export default ParameterItem;
