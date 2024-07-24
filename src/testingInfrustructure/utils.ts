export function mockFunction<T extends (...args: never[]) => unknown>(fn: T): jest.MockedFunction<T> {
    return fn as jest.MockedFunction<T>;
}

export function resolveServerResponse<T extends (...args: never[]) => unknown>(
    fn: jest.MockedFunction<T>,
    data: unknown
) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return fn.mockResolvedValue({ data });
}

export function rejectServerResponse<T extends (...args: never[]) => unknown>(
    fn: jest.MockedFunction<T>,
    error: unknown
) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return fn.mockRejectedValue(error);
}
