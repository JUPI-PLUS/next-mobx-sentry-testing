export const isValueReal = <ValueType>(value: ValueType | null | undefined): value is ValueType =>
    value !== null && value !== undefined;
