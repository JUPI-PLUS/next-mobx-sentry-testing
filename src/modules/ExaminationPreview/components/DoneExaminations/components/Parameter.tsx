// libs
import React, { useMemo } from "react";

// helpers
import { getLookupItem } from "../../../../../shared/utils/lookups";
import { isValueInRange } from "../../../../../components/uiKit/ProgressBar/Stacked/utils";

// models
import { ParameterProps } from "../models";
import { ParameterViewTypeEnum } from "../../../../../shared/models/business/enums";

// components
import Intervals from "./Intervals";
import ViewRichText from "../../../../../components/uiKit/RichText/ViewRichText";

const Parameter = ({ param, measureUnitLookup, referenceColorsLookup }: ParameterProps) => {
    const {
        name,
        value,
        si_measurement_units_id: measureUnitId,
        biological_reference_intervals: biologicalReferenceIntervals,
        reference_values: referenceValues,
        type_view_id: typeViewId,
        result_notes: resultNotes,
    } = param;

    const measureUnitLabel = useMemo(
        () => getLookupItem(measureUnitLookup, measureUnitId)?.label || "",
        [measureUnitLookup, measureUnitId]
    );

    const isViewTypeNumber = typeViewId === ParameterViewTypeEnum.NUMBER;
    const numberValue = Number(value);
    const referenceValueInRange = referenceValues?.find(({ from, to }) => isValueInRange(from, to, numberValue));

    return (
        <li className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <div>{name}</div>
                <div className="w-1 h-1 bg-dark-900 rounded-full"></div>
                <div>
                    <span className="font-bold">{value}</span> {measureUnitLabel}
                </div>
                {isViewTypeNumber && (
                    <>
                        <div className="w-1 h-1 bg-dark-900 rounded-full"></div>
                        <div className="font-bold">{referenceValueInRange?.title ?? "Out of range"}</div>
                        {!referenceValueInRange?.is_normal && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="tomato"
                                width="20"
                                height="20"
                                viewBox="0 0 45.311 45.311"
                            >
                                <g>
                                    <path d="M22.675,0.02c-0.006,0-0.014,0.001-0.02,0.001c-0.007,0-0.013-0.001-0.02-0.001C10.135,0.02,0,10.154,0,22.656   c0,12.5,10.135,22.635,22.635,22.635c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0c12.5,0,22.635-10.135,22.635-22.635   C45.311,10.154,35.176,0.02,22.675,0.02z M22.675,38.811c-0.006,0-0.014-0.001-0.02-0.001c-0.007,0-0.013,0.001-0.02,0.001   c-2.046,0-3.705-1.658-3.705-3.705c0-2.045,1.659-3.703,3.705-3.703c0.007,0,0.013,0,0.02,0c0.006,0,0.014,0,0.02,0   c2.045,0,3.706,1.658,3.706,3.703C26.381,37.152,24.723,38.811,22.675,38.811z M27.988,10.578   c-0.242,3.697-1.932,14.692-1.932,14.692c0,1.854-1.519,3.356-3.373,3.356c-0.01,0-0.02,0-0.029,0c-0.009,0-0.02,0-0.029,0   c-1.853,0-3.372-1.504-3.372-3.356c0,0-1.689-10.995-1.931-14.692C17.202,8.727,18.62,5.29,22.626,5.29   c0.01,0,0.02,0.001,0.029,0.001c0.009,0,0.019-0.001,0.029-0.001C26.689,5.29,28.109,8.727,27.988,10.578z" />
                                </g>
                            </svg>
                        )}
                    </>
                )}
            </div>
            {isViewTypeNumber && (
                <Intervals
                    value={numberValue}
                    referenceValues={referenceValues}
                    referenceColorsLookup={referenceColorsLookup}
                    biologicalReferenceIntervals={biologicalReferenceIntervals}
                />
            )}
            {resultNotes && (
                <div>
                    <div className="font-bold mb-1">Befund/Ergebnis:</div>
                    <ViewRichText html={resultNotes} />
                </div>
            )}
        </li>
    );
};

export default Parameter;
