// helpers
import useKeyEvent from "../../../shared/hooks/useKeyEvent";

// models
import { FocusableBlockProps } from "./models";

const FocusableBlock = ({
    children,
    onClick,
    className,
    tabIndex = 0,
    eventKeys = ["Enter", "Space"],
    ...props
}: FocusableBlockProps) => {
    const { eventCallback } = useKeyEvent(eventKeys, onClick);
    return (
        <div
            role="button"
            tabIndex={tabIndex}
            onClick={onClick}
            onKeyDown={eventCallback}
            className={className}
            {...props}
        >
            {children}
        </div>
    );
};

export default FocusableBlock;
