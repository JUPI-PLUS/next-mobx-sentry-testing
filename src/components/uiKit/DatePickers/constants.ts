import { DATE_FORMATS } from "../../../shared/constants/formates";
import IMask from "imask";

export const MIN_YEAR = 1902;
export const MAX_YEAR = (() => new Date().getFullYear() + 10)();
export const CURRENT_YEAR = (() => new Date().getFullYear())();
export const DATE_RANGE_MASK = `${DATE_FORMATS.DATE_ONLY} - ${DATE_FORMATS.DATE_ONLY}`;
export const DATE_MASK = DATE_FORMATS.DATE_ONLY;
export const DATETIME_MASK = DATE_FORMATS.DATETIME_PICKER_VALUE;
export const DEFAULT_MASK_BLOCKS = {
    dd: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
    },
    MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
    },
    yyyy: {
        mask: IMask.MaskedRange,
        from: MIN_YEAR,
        to: MAX_YEAR,
    },
};

export const DEFAULT_MASK_OPTIONS = {
    mask: DATE_MASK,
    pattern: DATE_MASK,
    blocks: DEFAULT_MASK_BLOCKS,
    umask: true,
    lazy: true,
    overwrite: false,
};

export const DATE_RANGE_MASK_OPTIONS = {
    ...DEFAULT_MASK_OPTIONS,
    mask: DATE_RANGE_MASK,
    pattern: DATE_RANGE_MASK,
};

export const DATE_TIME_MASK_OPTIONS = {
    ...DEFAULT_MASK_OPTIONS,
    mask: DATETIME_MASK,
    pattern: DATETIME_MASK,
    blocks: {
        ...DEFAULT_MASK_BLOCKS,
        HH: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 23,
            maxLength: 2,
        },
        mm: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 59,
            maxLength: 2,
        },
    },
};
