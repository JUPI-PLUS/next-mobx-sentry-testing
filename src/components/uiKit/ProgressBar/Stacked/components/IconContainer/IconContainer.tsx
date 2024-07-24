// libs
import { FC } from "react";

// models
import { IconContainerProps } from "../../models";

// helpers
import { getIconPosition } from "../../utils";

// components
import PinIcon from "../../../../Icons/PinIcon";

const IconContainer: FC<IconContainerProps> = ({ from, to, value }) => {
    return (
        <PinIcon
            className="absolute -top-1 -translate-y-full -translate-x-1/2 fill-dark-900"
            data-testid="pin-icon"
            style={getIconPosition(from, to, value)}
        />
    );
};

export default IconContainer;
