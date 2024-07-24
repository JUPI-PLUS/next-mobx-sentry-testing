//  libs
import { FC } from "react";
import fromUnixTime from "date-fns/fromUnixTime";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";

//  models
import { SampleDetailsDrawerContentProps } from "../models";

//  constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { DEFAULT_TIMEZONE } from "../../../../shared/constants/timezones";

const SampleDetailsDrawerContent: FC<SampleDetailsDrawerContentProps> = ({ data, examSampleTypes }) => {
    return (
        <ul>
            <li
                className="py-3 w-full flex justify-between border-b border-inset border-dark-400"
                data-testid="sample-view-details-item"
            >
                <span>Datetime</span>
                <span>
                    {formatInTimeZone(
                        fromUnixTime(data.sampling_datetime_timestamp),
                        DEFAULT_TIMEZONE,
                        DATE_FORMATS.DATETIME_PICKER_VALUE
                    )}
                </span>
            </li>
            <li
                className="py-3 w-full flex justify-between border-b border-inset border-dark-400"
                data-testid="sample-number-item"
            >
                <span>Number</span>
                <span>{data?.sample_barcode}</span>
            </li>
            <li
                className="py-3 w-full flex justify-between border-b border-inset border-dark-400"
                data-testid="sample-type-item"
            >
                <>
                    <span>Type</span>
                    {examSampleTypes.map(
                        sampleType =>
                            sampleType.value === data?.sample_type_id && (
                                <span key={sampleType.value}>{sampleType.label}</span>
                            )
                    )}
                </>
            </li>
            <li
                className="py-3 w-full flex justify-between border-b border-inset border-dark-400"
                data-testid="sample-volume-item"
            >
                <span>Volume</span>
                <span>{data?.volume} ml</span>
            </li>
        </ul>
    );
};
export default SampleDetailsDrawerContent;
