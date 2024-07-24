// libs
import pick from "lodash/pick";
import omit from "lodash/omit";
import { parse } from "query-string";
import { ParsedUrlQuery } from "querystring";
import { UrlObject } from "url";
import { parseRelativeUrl } from "next/dist/shared/lib/router/utils/parse-relative-url";
import { formatUrl, formatWithValidation } from "next/dist/shared/lib/router/utils/format-url";
import { removeTrailingSlash } from "next/dist/shared/lib/router/utils/remove-trailing-slash";
import { getRouteRegex } from "next/dist/shared/lib/router/utils/route-regex";
import { getRouteMatcher } from "next/dist/shared/lib/router/utils/route-matcher";
import { interpolateAs } from "next/dist/shared/lib/router/router";

// models
import { FilterFieldsType, Primitives, SortingFieldsType } from "../models/routing";
import { SortingWay } from "../models/common";

// constants
import { PARSE_QUERY_PARAMS_REGEX } from "../constants/regex";

export const getDynamicQueryNames = (route: string): string[] => route.match(PARSE_QUERY_PARAMS_REGEX) || [];

export const getDynamicQueryObject = (query: ParsedUrlQuery, route: string): Pick<ParsedUrlQuery, string> =>
    pick(query, getDynamicQueryNames(route));

export const getRouteHash = (path: string): string => path.split("#")[1] || "";

/**
 * This function checks if number from query valid - it should be an integer positive number
 * @param {Primitives | string[] | undefined} queryValue - Query string
 * @returns {boolean}
 */
export const isQueryNumberNatural = (queryValue: Primitives | string[] | undefined): boolean => {
    const numericQueryValue = Number(queryValue);
    return (
        Boolean(queryValue) &&
        !isNaN(numericQueryValue) &&
        Number.isInteger(numericQueryValue) &&
        numericQueryValue >= 1
    );
};

/**
 * This function will return definite fields object form query string, transformed according to settings
 * @param {string} queryString - Query string
 * @param {FilterFieldsType} filterFieldsTypes - Filter settings
 */
export const getTransformedQueries = (queryString: string, filterFieldsTypes: FilterFieldsType) => {
    const parsedQueries = parse(queryString, {
        arrayFormat: "bracket",
    });
    const pickedFields = pick(parsedQueries, Object.keys(filterFieldsTypes));

    // If u defined for parsing settings that u expect numbers for some fields, it always cast to number and return array of numbers.
    // For strings - works the same.
    return Object.entries(pickedFields).reduce<Record<string, Primitives | Primitives[]>>((acc, [key, value]) => {
        const { isArray, isString, isNumber } = filterFieldsTypes[key];
        if (isArray) {
            // Type and value guard
            if (!Array.isArray(value) || !value.length) return acc;

            acc[key] = (value as Primitives[]).reduce<Primitives[]>((rAcc, val) => {
                if (isNumber) {
                    return isQueryNumberNatural(val) ? [...rAcc, Number(val)] : rAcc;
                }
                return Boolean(val) ? [...rAcc, val] : rAcc;
            }, []);
        } else {
            // Type guard
            if (typeof value === "object") return acc;

            if (isNumber && isQueryNumberNatural(value)) {
                acc[key] = Number(value);
            }

            if (isString && value.trim().length) {
                acc[key] = value;
            }
        }
        return acc;
    }, {});
};

/**
 * This function will return sorting fields object form query string or null if order_by is not presented in query string
 * @param {string} queryString - Query string
 */
export const getTransformedSortingQueries = (queryString: string): SortingFieldsType | null => {
    const parsedQueries = parse(queryString);
    if (!parsedQueries.order_by) {
        return null;
    }
    return {
        order_by: parsedQueries.order_by as string,
        order_way: parsedQueries.order_way === SortingWay.DESC ? SortingWay.DESC : SortingWay.ASC,
    };
};

/**
 * This function will return represented string url form next js url object
 * @param {object} url - The next js url representation
 * @returns {string} Url string
 */
export const nextJSUrlToString = (url: UrlObject) => {
    const { query, pathname, hash } = parseRelativeUrl(formatUrl(url));
    const route = removeTrailingSlash(pathname);
    const parsedAs = parseRelativeUrl(pathname);
    const asPathname = parsedAs.pathname;
    const shouldInterpolate = route === asPathname;
    const routeRegex = getRouteRegex(route);
    const routeMatch = getRouteMatcher(routeRegex)(asPathname);
    const interpolatedAs = shouldInterpolate
        ? interpolateAs(route, asPathname, query)
        : ({} as { result: undefined; params: undefined });

    if (!routeMatch || (shouldInterpolate && !interpolatedAs.result)) {
        const missingParams = Object.keys(routeRegex.groups).filter(
            param => !query[param] && !routeRegex.groups[param].optional
        );

        if (missingParams.length > 0) {
            if (process.env.NODE_ENV !== "production") {
                // eslint-disable-next-line no-console
                console.warn(
                    `${
                        shouldInterpolate ? `Interpolating href` : `Mismatching \`as\` and \`href\``
                    } failed to manually provide ` +
                        `the params: ${missingParams.join(", ")} in the \`href\`'s \`query\``
                );
            }

            throw new Error(
                (shouldInterpolate
                    ? `The provided \`href\` (${pathname}) value is missing query values (${missingParams.join(
                          ", "
                      )}) to be interpolated properly. `
                    : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) +
                    `Read more: https://nextjs.org/docs/messages/${
                        shouldInterpolate ? "href-interpolation-failed" : "incompatible-href-as"
                    }`
            );
        }
    } else {
        // Merge params into `query`, overwriting any specified in search
        Object.assign(query, routeMatch);
    }

    return formatWithValidation(
        Object.assign({}, parsedAs, {
            pathname: interpolatedAs.result,
            query: omit(query, interpolatedAs.params!),
            hash,
        })
    );
};
