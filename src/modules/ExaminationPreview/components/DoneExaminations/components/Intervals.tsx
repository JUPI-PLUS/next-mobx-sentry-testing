// libs
import React from "react";

// helpers
import { transformReferenceValues } from "../../../../Examinations/components/ExaminationTable/utils";
import { getIconPosition } from "../../../../../components/uiKit/ProgressBar/Stacked/utils";

// models
import { IntervalsProps } from "../models";

// components
import ProgressBar from "../../../../../components/uiKit/ProgressBar/ProgressBar";

const Intervals = ({ value, referenceColorsLookup, biologicalReferenceIntervals, referenceValues }: IntervalsProps) => {
    if (referenceValues) {
        const progressBars = transformReferenceValues(value, referenceValues, referenceColorsLookup);
        return (
            <div className="flex gap-0.5 w-full py-5">
                {progressBars.map(({ color, from, to, keyId, hasMarker, title }, index) => (
                    <ProgressBar key={keyId} style={{ backgroundColor: color }}>
                        {hasMarker && (
                            <div
                                className="w-3 h-3 border-2 rounded-full bg-light-200 absolute -translate-x-1/2 -translate-y-1/2 top-0.5 z-10"
                                style={{ ...getIconPosition(from, to, value), borderColor: color }}
                            />
                        )}
                        <span className="absolute leading-4 -translate-y-5 font-bold">{title}</span>
                        <span className="absolute leading-4 translate-y-2 text-xs">{from}</span>
                    </ProgressBar>
                ))}
            </div>
        );
    }

    return <p>{biologicalReferenceIntervals}</p>;
};

export default Intervals;
