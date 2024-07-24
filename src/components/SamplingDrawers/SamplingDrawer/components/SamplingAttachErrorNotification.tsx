import React, { FC } from "react";
import Notification from "../../../uiKit/Notification/Notification";

const SamplingAttachErrorNotification: FC = () => {
    return (
        <div className="mb-2">
            <Notification variant="error" text={"Order’s User and Sample’s User do not match"} />
        </div>
    );
};

export default SamplingAttachErrorNotification;
