import { faker } from "@faker-js/faker";
import { getIconPosition, isValueInRange } from "../utils";

describe("getIconPosition", () => {
    it("Should return correct icon position", () => {
        const from = 0;
        const to = 100;
        const value = faker.datatype.number({ min: from, max: to });
        const expected = {
            left: value + "%",
        };

        expect(getIconPosition(from, to, value)).toEqual(expected);
    });
    it("Should return half icon position when range is 0", () => {
        const from = 20;
        const to = from;
        const value = faker.datatype.number({ min: from, max: to });
        const expected = {
            left: "50%",
        };

        expect(getIconPosition(from, to, value)).toEqual(expected);
    });
});

describe("isValueInRange", () => {
    it("Should be in range", () => {
        const from = 0;
        const to = 100;
        const value = faker.datatype.number({ min: from + 1, max: to });

        expect(isValueInRange(from, to, value)).toBeTruthy();
        expect(isValueInRange(value, value, value)).toBeTruthy();
    });
    it("Should be out of range", () => {
        const from = 0;
        const to = 100;
        const value = faker.datatype.number({ min: to + 1, max: to * 2 });

        expect(isValueInRange(from, to, value)).toBeFalsy();
        expect(isValueInRange(from, to, from)).toBeFalsy();
    });
});
