export type StackedProgressBarsProps<T> = {
    progressBars: Array<ProgressBar<T>>;
    value?: number;
    withPinIcon?: boolean;
    className?: string;
    startLabel?: string | number;
    endLabel?: string | number;
};

export type ProgressBar<T> = {
    color: string;
    from: number;
    to: number;
    keyId: string;
    hasMarker: boolean;
} & T;

export type IconContainerProps = {
    from: number;
    to: number;
    value: number;
};
