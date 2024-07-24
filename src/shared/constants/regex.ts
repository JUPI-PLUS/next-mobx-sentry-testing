export const PARSE_QUERY_PARAMS_REGEX = /[^[}]+(?=])/g; // " something/exams/[uuid]/[id] " -> [ "uuid", "id" ]

export const PARSE_PHONE_NUMBER_REGEX = /[()-\s]/g;

export const HTML_STRING_REGEX = new RegExp(
    /(<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>(\w|\s)+<\/(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)/,
    "gmi"
);
