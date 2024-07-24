//  libs
import React, { FC, useMemo } from "react";
import { format, fromUnixTime } from "date-fns";

//  helpers
import { addOffsetToUtcDate } from "../../../../shared/utils/date";

//  models
import { SampleStatuses } from "../../../../shared/models/business/enums";
import { SamplingErrorNotificationProps } from "../models";
//  constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";

//  components
import Notification from "../../../uiKit/Notification/Notification";

const SamplingStatusErrorNotification: FC<SamplingErrorNotificationProps> = ({ updatedAt, status, barcode }) => {
    const statusText = useMemo(() => {
        switch (status) {
            case SampleStatuses.DONE:
                return "done";
            case SampleStatuses.DAMAGED:
                return "damaged";
            default:
                return "";
        }
    }, [status]);

    const notificationText = useMemo(
        () =>
            `Sample ${barcode} was marked as ${statusText} at ${format(
                addOffsetToUtcDate(fromUnixTime(updatedAt)),
                DATE_FORMATS.DATETIME_PICKER_VALUE
            )}`,
        [barcode, statusText, updatedAt]
    );

    return (
        <div className="mb-2">
            <Notification variant="error" text={notificationText} />
        </div>
    );
};

export default SamplingStatusErrorNotification;
