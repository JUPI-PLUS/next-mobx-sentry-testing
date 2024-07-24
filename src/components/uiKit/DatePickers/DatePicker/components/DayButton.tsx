import { Button, DayProps, useDayRender } from "react-day-picker";
import React from "react";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../../../../shared/constants/formates";

const DayComponent = ({ date, displayMonth }: DayProps) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const dayRender = useDayRender(date, displayMonth, buttonRef);

    if (dayRender.isHidden) {
        return <></>;
    }
    if (!dayRender.isButton) {
        return <div {...dayRender.divProps} />;
    }

    return <Button {...dayRender.buttonProps} ref={buttonRef} data-testid={format(date, DATE_FORMATS.DATE_ONLY)} />;
};

export default DayComponent;
