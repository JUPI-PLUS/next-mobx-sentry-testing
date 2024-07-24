import CheckCircleIcon from "../Icons/CheckCircleIcon";
import ErrorCircleIcon from "../Icons/ErrorCircleIcon";
import WarningCircleIcon from "../Icons/WarningCircleIcon";
import { ToastIconProps } from "./models";

const ToastIcon = ({ type }: ToastIconProps) => {
    const iconClassList = "w-8 h-8 mr-5 shrink-0";

    switch (type) {
        case "error":
            return <ErrorCircleIcon data-testid={`toast-${type}-icon`} className={iconClassList} />;
        case "warning":
            return <WarningCircleIcon data-testid={`toast-${type}-icon`} className={iconClassList} />;
        case "success":
        default:
            return <CheckCircleIcon data-testid={`toast-${type}-icon`} className={iconClassList} />;
    }
};

export default ToastIcon;
