import React, { FC, useMemo } from "react";
import fromUnixTime from "date-fns/fromUnixTime";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { DATE_FORMATS } from "../../../../../../shared/constants/formates";
import { SampleItemProps } from "../../../../models";
import { DEFAULT_TIMEZONE } from "../../../../../../shared/constants/timezones";
import FocusableBlock from "../../../../../../components/uiKit/FocusableBlock/FocusableBlock";

const SampleItem: FC<SampleItemProps> = ({ isSelected, sampleNumber, sampleType, expiredTime, onClickHandler }) => {
    const containerClassname = useMemo(
        () => (isSelected ? "text-white bg-brand-100" : "text-dark-900 bg-white"),
        [isSelected]
    );

    return (
        <FocusableBlock
            className={`-outline-offset-1 border border-inset border-dark-300 py-2.5 px-4 max-w-xs text-base font-medium rounded-md shadow-card-shadow ${containerClassname}`}
            data-testid={`sample-card-${sampleNumber}`}
            onClick={onClickHandler}
        >
            <div className="flex justify-between w-full">
                <span className="font-bold">Sample {sampleNumber}</span>
                <span className="text-md font-normal">{sampleType}</span>
            </div>
            <div className="flex mt-0.5 text-sm font-normal">
                <span className="flex items-center">
                    Make results till:
                    {expiredTime
                        ? formatInTimeZone(fromUnixTime(expiredTime), DEFAULT_TIMEZONE, DATE_FORMATS.DATE_TIME)
                        : "infinity"}
                </span>
            </div>
        </FocusableBlock>
    );
};

export default SampleItem;
