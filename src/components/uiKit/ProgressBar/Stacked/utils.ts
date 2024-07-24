export const getIconPosition = (from: number, to: number, value: number) => {
    const range = to - from;
    const rangeValue = value - from;

    if (range === 0) return { left: "50%" };

    return {
        left: `${(rangeValue * 100) / range}%`,
    };
};

export const isValueInRange = (from: number, to: number, value: number) => {
    if (from === to) return value === to;

    return value > from && value <= to;
};
