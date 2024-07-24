import { format, fromUnixTime } from "date-fns";
import { FC, useEffect, useState } from "react";
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { addOffsetToUtcDate } from "../../../../shared/utils/date";
import Barcode from "../../scripts/reactBarcode";
import { PrintItemProps } from "./models";
import { getLookupItem } from "../../../../shared/utils/lookups";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { DEFAULT_TIMEZONE } from "../../../../shared/constants/timezones";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../../shared/constants/user";

const PrintItem: FC<PrintItemProps> = ({ dataPatient, dataSample, sampleTypes }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isMounted) {
            window.print();
        }
    }, [isMounted]);

    const patientName = `${dataPatient.last_name},${dataPatient.first_name}`;
    const isUserDeleted = !Boolean(dataPatient.last_name && dataPatient.first_name);

    return (
        <ul className="font-bold leading-none text-sm w-[40mm]">
            <li className="mb-2 text-ellipsis overflow-hidden whitespace-nowrap">
                {isUserDeleted ? DEFAULT_DELETED_USER_MOCK_TEXT : patientName}
            </li>
            <li className="mb-1">
                <span className="mr-4">
                    {isUserDeleted
                        ? DEFAULT_DELETED_USER_MOCK_TEXT
                        : format(
                              addOffsetToUtcDate(fromUnixTime(dataPatient.birth_date!)),
                              DATE_FORMATS.DATE_ONLY_DOTS
                          )}
                </span>
            </li>
            <li className="mb-1 ml-2">
                {dataSample.sample_barcode && (
                    <Barcode
                        value={dataSample.sample_barcode}
                        height={30}
                        background="transparent"
                        fontOptions="16px"
                        displayValue={false}
                        margin={0}
                        renderer="img"
                        onMount={() => setIsMounted(true)}
                    />
                )}
            </li>
            <li className="pl-9">
                <span className="text-sm">{dataSample.sample_barcode}</span>
            </li>
            <li className="relative flex flex-col whitespace-nowrap after:h-2 after:w-px after:bg-black after:content-[''] after:absolute after:right-0 after:top-1/2">
                <span className="overflow-ellipsis overflow-hidden">
                    {dataSample && getLookupItem(sampleTypes, dataSample.sample_type_id)?.label}
                </span>
                <span>
                    {formatInTimeZone(
                        fromUnixTime(dataSample.sampling_datetime_timestamp),
                        DEFAULT_TIMEZONE,
                        DATE_FORMATS.DATE_TIME_ONLY_DOTS
                    )}
                </span>
            </li>
        </ul>
    );
};

export default PrintItem;
