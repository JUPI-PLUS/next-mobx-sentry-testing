import { handleServerFormValidation } from "../form";

describe("Form utils", () => {
    describe("handleServerFormValidation", () => {
        it("Should return empty array if message object is empty", () => {
            expect(handleServerFormValidation({
                // @ts-ignore
                response: {
                    data: {
                        status: "",
                        message: "",
                        errors: []
                    }
                }
            })).toHaveLength(0);
        });

        it("Should return empty array if error object hasnt message field", () => {
            expect(handleServerFormValidation({
                // @ts-ignore
                response: {
                    // @ts-ignore
                    data: {}
                }
            })).toHaveLength(0);
        });

        it("Should return error message if its string", () => {
            const mockedFiled = "field";
            const mockedError = "Error";
            const expectedErrorsObject = {
                field: mockedFiled,
                message: [mockedError],
                messageLocaliseId: [mockedError]
            }

            const result = handleServerFormValidation({
                // @ts-ignore
                response: {
                    // @ts-ignore
                    data: {
                        status: "",
                        errors: [expectedErrorsObject]
                    }
                }
            });
            expect(result).toHaveLength(1);
            expect(result[0]).toBe(expectedErrorsObject);
        });

        it("Should return an empty array if error is null", () => {
            expect(handleServerFormValidation(null)).toEqual([]);
        });
    });
});