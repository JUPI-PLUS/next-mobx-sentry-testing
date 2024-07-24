export const VALIDATION_MESSAGES = {
    EQUAL_LENGTH_SYMBOLS: (fieldName: string, length: number) => `${fieldName} should be ${length} symbols`,
    MIN_LENGTH_SYMBOLS: (fieldName: string, minLength: number) =>
        `${fieldName} should be greater than ${minLength} symbols`,
    MAX_LENGTH_SYMBOLS: (fieldName: string, maxLength: number) =>
        `${fieldName} should be equal or less than ${maxLength} symbols`,
    REQUIRED: (fieldName: string) => `${fieldName} is required`,
    ONLY_LETTERS: (fieldName: string) => `${fieldName} should have only letters`,
    ONLY_NUMBERS: (fieldName: string) => `${fieldName} should have only numbers`,
    NUMBER_LETTERS: (fieldName: string) => `${fieldName} should have letters and/or numbers`,
    ENTER_VALID: (fieldName: string) => `Please, enter a valid ${fieldName.toLowerCase()}`,
    SELECT_MORE_THAN: (fieldName: string, min: number) => `${fieldName} should have more than ${min} option(s)`,
    SELECT_LESS_THAN: (fieldName: string, max: number) => `${fieldName} should have less than ${max} options`,
    CANT_BE_FUTURE_DATE: (fieldName: string) => `Can not be a future date in ${fieldName} field`,
    PASSWORD: "Password should have number, lower case, upper case, special symbol and at least 8 characters",
    CONFIRM_PASSWORD: "Confirm password",
    AT_LEAST_ONE_SHOULD_BE_FILLED: (fieldName: string) => `At least one ${fieldName} should be filled`,
    SHOULD_BE_GREATER_THAT: (firstField: string, lastField: string) =>
        `${firstField} should be greater than ${lastField}`,
    SHOULD_BE_UNIQ: (fieldName: string) => `${fieldName} should be unique`,
};

export const FILTERS_VALIDATION_MESSAGES = {
    SHOULD_BE_NUMBER: "Field should be a number",
    MIN_LENGTH_SYMBOLS: (minLength: number) => `Min symbols is ${minLength}`,
    MAX_LENGTH_SYMBOLS: (maxLength: number) => `Max symbols is ${maxLength} symbols`,
    MIN_MAX_LENGTH_SYMBOLS: (minLength: number, maxLength: number) =>
        `Min symbols is ${minLength} and max is ${maxLength} symbols`,
    ENTER_VALID: (fieldName: string) => `Please, enter a valid ${fieldName}`,
};
