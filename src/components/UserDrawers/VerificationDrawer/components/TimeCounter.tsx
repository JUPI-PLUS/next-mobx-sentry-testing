// libs
import React from "react";

// helpers
import { fromMsToDuration } from "../../../../shared/utils/date";
import { useCountdown } from "../../../../shared/hooks/useCountdown";

// models
import { TimeCounterProps } from "../models";

// components
import { TextButton } from "../../../uiKit/Button/Button";

const TimeCounter = ({ onResend, isResendDisabled, targetTime }: TimeCounterProps) => {
    const { milliseconds, isCountDone } = useCountdown(targetTime, true);

    if (isCountDone)
        return (
            <TextButton
                type="button"
                size="thin"
                variant="neutral"
                className="text-dark-800 font-normal text-sm leading-5"
                data-testid="resend-verification-button"
                text="Resend"
                onClick={onResend}
                disabled={isResendDisabled}
            />
        );

    return (
        <p className="mb-2 text-sm leading-5 text-dark-800" data-testid="verification-time-indicator">
            Resend {fromMsToDuration(milliseconds)}
        </p>
    );
};

export default TimeCounter;
