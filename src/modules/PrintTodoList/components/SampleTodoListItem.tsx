import Barcode from "../../PrintBarcode/scripts/reactBarcode";
import { format, fromUnixTime } from "date-fns";
import { addOffsetToUtcDate } from "../../../shared/utils/date";
import { DATE_FORMATS } from "../../../shared/constants/formates";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { DEFAULT_TIMEZONE } from "../../../shared/constants/timezones";
import { COMMA_SEPARATOR } from "../../../shared/constants/common";
import React, { FC } from "react";
import { SampleTodoListItemProps } from "../models";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../shared/constants/user";

const SampleTodoListItem: FC<SampleTodoListItemProps> = ({
    sampleNumber,
    orderNumber,
    samplingDatetime,
    firstName,
    lastName,
    examNames,
    referralDoctor,
    birthdateTimestamp,
    onBarcodeMounted,
}) => {
    const isUserDeleted = !Boolean(firstName && lastName);
    return (
        <tr className="text-center">
            <td className="border-dark-500 border py-3 px-4">{orderNumber}</td>
            <td className="border-dark-500 border py-3 px-4">
                <p>{sampleNumber}</p>
                <div>
                    <Barcode
                        value={sampleNumber}
                        height={30}
                        background="transparent"
                        fontOptions="16px"
                        displayValue={false}
                        margin={0}
                        renderer="img"
                        onMount={onBarcodeMounted}
                    />
                </div>
            </td>
            <td className="border-dark-500 border py-3 px-4">
                <div>{isUserDeleted ? DEFAULT_DELETED_USER_MOCK_TEXT : `${firstName} ${lastName}`}</div>
                <div>
                    {isUserDeleted
                        ? DEFAULT_DELETED_USER_MOCK_TEXT
                        : format(addOffsetToUtcDate(fromUnixTime(birthdateTimestamp!)), DATE_FORMATS.DATE_ONLY_DOTS)}
                </div>
            </td>
            <td className="border-dark-500 border py-3 px-4 break-word">
                {formatInTimeZone(fromUnixTime(samplingDatetime), DEFAULT_TIMEZONE, DATE_FORMATS.DATE_TIME)}
            </td>
            <td className="border-dark-500 border py-3 px-4 break-word">{referralDoctor ?? "--"}</td>
            <td className="border-dark-500 border py-3 px-4 break-word">{examNames.join(`${COMMA_SEPARATOR} `)}</td>
        </tr>
    );
};

export default SampleTodoListItem;
