// libs
import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { fromUnixTime } from "date-fns";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";

// api
import { getMeasurementUnits, getReferenceColors, getSampleTypes } from "../../../../api/dictionaries";

// helpers
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";

// models
import { DoneExaminationsProps } from "./models";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { DEFAULT_TIMEZONE } from "../../../../shared/constants/timezones";

// components
import Parameter from "./components/Parameter";
import ViewRichText from "../../../../components/uiKit/RichText/ViewRichText";
import ListCheckIcon from "../../../../components/uiKit/Icons/ListCheckIcon";

const DoneExaminations = ({ exams, sampleDetails }: DoneExaminationsProps) => {
    const { data: measureUnitLookup = [] } = useQuery(DICTIONARIES_QUERY_KEYS.MEASUREMENT_UNITS, getMeasurementUnits, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: dataSampleTypes } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: referenceColorsLookup = [] } = useQuery(
        DICTIONARIES_QUERY_KEYS.REFERENCE_COLORS,
        getReferenceColors,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const sampleTypeName = useMemo(
        () => getLookupItem(dataSampleTypes, sampleDetails.sample_type_id)?.label || "",
        [dataSampleTypes, sampleDetails.sample_type_id]
    );

    if (!Boolean(exams.length)) return null;

    return (
        <>
            <div className="border-t border-r border-l border-dark-500 rounded-t-md">
                <div className="flex justify-between items-center bg-dark-200 p-3">
                    <div className="text-md font-bold">{sampleTypeName}</div>
                    <div>
                        {formatInTimeZone(
                            fromUnixTime(sampleDetails.sampling_datetime_timestamp),
                            DEFAULT_TIMEZONE,
                            DATE_FORMATS.DATE_TIME_ONLY_DOTS
                        )}
                    </div>
                </div>
            </div>
            <ul className="flex flex-col">
                {exams.map(exam => (
                    <li
                        key={exam.uuid}
                        className="group border-r border-l last:border-b border-dark-500 last:rounded-b-md"
                    >
                        <div className="pt-3 px-3 border-b border-dark-500 group-last:border-0">
                            <div className="font-bold mb-1.5">{exam.name}</div>
                            <ViewRichText className="mb-3" html={exam.exam_description ?? ""} />
                            <hr className="bg-dark-400" />

                            <ul className="flex flex-col gap-3 pt-3">
                                {exam.params.map(param => (
                                    <Parameter
                                        key={param.uuid}
                                        param={param}
                                        measureUnitLookup={measureUnitLookup}
                                        referenceColorsLookup={referenceColorsLookup}
                                    />
                                ))}
                            </ul>

                            {exam.notes && (
                                <>
                                    <hr className="bg-dark-400 my-3" />
                                    <div className="flex mb-3 gap-6">
                                        <p className="flex items-start text-brand-100 text-sm font-bold whitespace-nowrap ">
                                            <ListCheckIcon className="fill-brand-100 w-5 h-5" />
                                            Zusätzliche Anmerkungen:
                                        </p>
                                        <ViewRichText html={exam.notes} />
                                    </div>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default DoneExaminations;
