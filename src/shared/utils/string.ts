// libs
import { isString, isArray, isPlainObject, isEmpty, filter, map, pickBy, mapValues, isNull } from "lodash";

// helpers
import { AT_LEAST_TWO_MORE_HTML_TAGS_WITH_BR_REGEX, REGEX_VALIDATION } from "../validation/rules";
import { isValueReal } from "./common";
import { HTML_STRING_REGEX, PARSE_PHONE_NUMBER_REGEX } from "../constants/regex";

const isHTML = (str: string) => HTML_STRING_REGEX.test(str);

export const getParsedHTMLBodyFromString = (value: string) => {
    const parser = new DOMParser();
    const res = parser.parseFromString(value, "text/html");
    return res.body;
};

export const trimRichTextSpaces = (value: string | null) => {
    if (!isValueReal(value)) return null;
    const htmlValue = getParsedHTMLBodyFromString(value);
    const trimmedText = htmlValue.textContent!.trim();

    //  if value of rich text is empty, return an empty string
    if (trimmedText.length <= 0) return "";

    // remove duplication of <br/> tags
    return value.replace(AT_LEAST_TWO_MORE_HTML_TAGS_WITH_BR_REGEX, "<p><br></p>");
};

export const toLowerCaseFirst = (str: string): string => {
    if (!str.length) return "";
    const letter = str[0];
    return `${letter.toLowerCase()}${str.slice(1)}`;
};

export const deepTrim = (object: Record<string, unknown> | string | Array<unknown>): unknown => {
    if (isString(object)) {
        if (isHTML(object)) return trimRichTextSpaces(object);
        return trimString(object);
    }
    if (isArray(object)) return sanitizeArray(object);
    if (isPlainObject(object)) return sanitizeObject(object);
    return object;
};

function trimString(string: string): string {
    return isEmpty(string)
        ? string
        : string
              .replace(REGEX_VALIDATION.NON_WHITESPACE_CHARACTERS_EXCLUDE_NEW_LINE, " ")
              .replace(REGEX_VALIDATION.NEW_LINE_CHARACTERS, "\n")
              .trim();
}

function sanitizeArray(array: Array<unknown>) {
    return filter(map(array, deepTrim), isProvided);
}

function sanitizeObject(object: Record<string, unknown>) {
    return pickBy(mapValues(object, deepTrim), isProvided);
}

function isProvided(value: unknown) {
    return !isNull(value) || !isString(value) || !isArray(value) || !isPlainObject(value);
}

export const trimPhoneNumber = (phone: string) => phone.replace(PARSE_PHONE_NUMBER_REGEX, "");
