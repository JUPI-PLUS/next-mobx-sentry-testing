import { isValueReal } from "../common";

describe("Common utils", () => {
    describe("isValueReal", () => {
        it("Should return false only when value is null or undefined", () => {
            expect(isValueReal(null)).toBeFalsy();
            expect(isValueReal(undefined)).toBeFalsy();

            expect(isValueReal(0)).toBeTruthy();
            expect(isValueReal("0")).toBeTruthy();
            expect(isValueReal("")).toBeTruthy();
            expect(isValueReal(" ")).toBeTruthy();
            expect(isValueReal(NaN)).toBeTruthy();
            expect(isValueReal([])).toBeTruthy();
            expect(isValueReal({})).toBeTruthy();
        });
    });
});
