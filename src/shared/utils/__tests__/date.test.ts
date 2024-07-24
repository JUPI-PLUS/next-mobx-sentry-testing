// helpers
import { addOffsetToUtcDate } from "../date";

describe("Date utils", () => {
    describe("getDateWithoutTimezone util", () => {
        it.each([new Date(), new Date().toISOString(), new Date().getTime()])(
            "Should return date without timezone",
            () => {
                const sourceDate = new Date();
                const expectedDate = new Date(sourceDate.valueOf() + sourceDate.getTimezoneOffset() * 60 * 1000);

                expect(addOffsetToUtcDate(sourceDate)).toEqual(expectedDate);
            }
        );
    });
});
