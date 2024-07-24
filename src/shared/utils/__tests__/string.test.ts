import { deepTrim, toLowerCaseFirst, trimRichTextSpaces } from "../string";

describe("String utils", () => {
    describe("toLowerCaseFirst", () => {
        it("Should return empty string if str argument is empty", () => {
            expect(toLowerCaseFirst("")).toBe("");
        });

        it("Should return string with lower cased first letter", () => {
            const initialString = "Some string";
            const expectedString = "some string";
            expect(toLowerCaseFirst(initialString)).toBe(expectedString);
        });
    });

    describe("DeepTrim", () => {
        it.each([
            {
                title: "an empty string",
                actual: "  some value  ",
                expected: "some value",
            },
            {
                title: "a list with empty strings",
                actual: ["", " Something ", ""],
                expected: ["", "Something", ""],
            },
            {
                title: "a list of empty strings",
                actual: ["", "", ""],
                expected: ["", "", ""],
            },
            {
                title: "a nested string list",
                actual: { foo: ["", " Something ", "", null] },
                expected: { foo: ["", "Something", "", null] },
            },
            {
                title: "a nested empty string",
                actual: { foo: "     " },
                expected: { foo: "" },
            },
            {
                title: "two nested empty strings",
                actual: { foo: { bar: "   " }, qux: { pix: "   ", empty: null } },
                expected: { foo: { bar: "" }, qux: { pix: "", empty: null } },
            },
            {
                title: "a nested empty string and something else",
                actual: { foo: { bar: "     " }, qux: "      Something   ", num: 50, obj: {}, bl: false, empty: null },
                expected: { foo: { bar: "" }, qux: "Something", num: 50, obj: {}, bl: false, empty: null },
            },
            {
                title: "a nested empty string in a list",
                actual: { foo: [{ bar: "  ", num: 12 }, " Something ", 354, true] },
                expected: { foo: [{ bar: "", num: 12 }, "Something", 354, true] },
            },
            {
                title: "a nested empty array",
                actual: { foo: [[], " Something ", 5, false] },
                expected: { foo: [[], "Something", 5, false] },
            },
            {
                title: "a nested empty string in an empty array",
                actual: { foo: [[" ", " "], " Something "] },
                expected: { foo: [["", ""], "Something"] },
            },
            {
                title: "a nested empty string in a nested list",
                actual: { foo: [[{ bar: " " }], " Something "] },
                expected: { foo: [[{ bar: "" }], "Something"] },
            },
            {
                title: "a nested object with empty string",
                actual: { foo: { bar: true, qux: " ", num: 4 } },
                expected: { foo: { bar: true, qux: "", num: 4 } },
            },
        ])("nullifies empty strings", ({ actual, expected }) => {
            const result = deepTrim(actual);
            expect(result).toEqual(expected);
        });
    });

    describe("trimRichTextSpaces", () => {
        it.each([
            {
                res: trimRichTextSpaces(
                    "<blockquote><br></blockquote><blockquote><strong><em>abiba</em></strong></blockquote><blockquote><br></blockquote><blockquote><br></blockquote><blockquote>aboba</blockquote><blockquote><br></blockquote><blockquote><br></blockquote><blockquote><em><u>abuba</u></em></blockquote><blockquote><br></blockquote><blockquote><br></blockquote>"
                ),
                expectedRes:
                    "<blockquote><br></blockquote><blockquote><strong><em>abiba</em></strong></blockquote><p><br></p><blockquote>aboba</blockquote><p><br></p><blockquote><em><u>abuba</u></em></blockquote><p><br></p>",
            },
            {
                res: trimRichTextSpaces(
                    "<p><br></p><p><strong><em>abiba</em></strong></p><p><br></p><p><br></p><p>aboba</p><p><br></p><p><br></p><p><em><u>abuba</u></em></p><p><br></p><p><br></p>"
                ),
                expectedRes:
                    "<p><br></p><p><strong><em>abiba</em></strong></p><p><br></p><p>aboba</p><p><br></p><p><em><u>abuba</u></em></p><p><br></p>",
            },
            {
                res: trimRichTextSpaces("<p><br></p><blockquote><br></blockquote>"),
                expectedRes: "",
            },
        ])("Should return trimmed rich text value (without extra spaces)", ({ res, expectedRes }) => {
            expect(res).toBe(expectedRes);
        });
    });
});
