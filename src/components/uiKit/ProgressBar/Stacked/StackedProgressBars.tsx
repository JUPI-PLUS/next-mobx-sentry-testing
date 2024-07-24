// libs
import { useMemo } from "react";

// models
import { StackedProgressBarsProps } from "./models";

// helper
import { isValueReal } from "../../../../shared/utils/common";

// components
import ProgressBar from "../ProgressBar";
import IconContainer from "./components/IconContainer/IconContainer";

const StackedProgressBar = <T,>({
    className = "",
    progressBars,
    withPinIcon = false,
    startLabel,
    endLabel,
    value,
}: StackedProgressBarsProps<T>) => {
    const isPinIconAvailable = useMemo(() => {
        return withPinIcon || Boolean(progressBars.length);
    }, [progressBars, withPinIcon]);

    return (
        <div className={`flex gap-px w-full ${className}`} data-testid="stacked-progress-bar">
            {progressBars.map(({ color, from, to, keyId, hasMarker }, index) => {
                const isFirstItem = index === 0;
                const isLastItem = index + 1 === progressBars.length;

                const isStartLabelVisible = isValueReal(startLabel) && isFirstItem;
                const isEndLabelVisible = isValueReal(endLabel) && isLastItem;

                return (
                    <ProgressBar key={keyId} style={{ backgroundColor: color }} className="text-xs">
                        {isPinIconAvailable && hasMarker && <IconContainer from={from} to={to} value={value!} />}
                        {isStartLabelVisible && (
                            <span className="absolute leading-4 translate-y-1" data-testid="start-label">
                                {startLabel}
                            </span>
                        )}
                        {isEndLabelVisible && (
                            <span className="absolute leading-4 right-0 translate-y-1" data-testid="end-label">
                                {endLabel}
                            </span>
                        )}
                    </ProgressBar>
                );
            })}
        </div>
    );
};

export default StackedProgressBar;
