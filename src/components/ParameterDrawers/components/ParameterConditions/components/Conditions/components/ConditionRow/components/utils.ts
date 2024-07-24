export const getValidMaskedNumberValue = (value: string | number): number | null => {
    if (value === "") return null;

    const numberValue = Number(value);

    if (numberValue >= 0) return numberValue;

    return null;
};
