import { getDateRangeFilter } from "../filters";
import { addDays, format } from "date-fns";
import { DATE_FORMATS } from "../../constants/formates";

describe("Filters utils", () => {
    describe("getDateRangeFilter util", () => {
        it("Should return an empty array if range wasnt provided", () => {
            expect(getDateRangeFilter()).toEqual([]);
        });

        it("Should return same date if 'to' parameter wasnt provided", () => {
            const expectedDate = format(new Date(), DATE_FORMATS.DATE_FILTER);
            expect(getDateRangeFilter({ from: new Date() })).toEqual([
                expectedDate,
                expectedDate
            ]);
        });

        it("Should return formatted date range", () => {
            const expectedFrom = format(new Date(), DATE_FORMATS.DATE_FILTER);
            const expectedTo = format(addDays(new Date(), 1), DATE_FORMATS.DATE_FILTER);

            expect(getDateRangeFilter({
                from: new Date(),
                to: addDays(new Date(), 1)
            })).toEqual([expectedFrom, expectedTo]);
        });
    });
});