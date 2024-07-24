import { addMethod, StringSchema, string } from "yup";
import { getParsedHTMLBodyFromString } from "../utils/string";
import { MAX_HTML_BODY_LENGTH_MULTIPLIER } from "./rules";
import { validatePhone } from "react-international-phone";

addMethod<StringSchema>(string, "optionalMin", function (min: number, msg: string) {
    return this.test({
        name: "optionalMin",
        message: msg,
        test: value => {
            if (value) {
                return value.length >= min;
            }
            return true;
        },
    });
});

addMethod<StringSchema>(string, "richTextMin", function (min: number, msg: string) {
    return this.test({
        name: "richTextMin",
        message: msg,
        test: value => {
            if (value) {
                const body = getParsedHTMLBodyFromString(value);
                const text = body.textContent;

                return text!.length >= min;
            }
            return false;
        },
    });
});

addMethod<StringSchema>(string, "richTextMax", function (max: number, msg: string) {
    return this.test({
        name: "richTextMax",
        message: msg,
        test: value => {
            if (value) {
                const body = getParsedHTMLBodyFromString(value);
                const text = body.textContent;
                const html = body.innerHTML;

                return text!.length <= max && html!.length <= max * MAX_HTML_BODY_LENGTH_MULTIPLIER;
            }
            return true;
        },
    });
});

addMethod<StringSchema>(string, "richTextRequired", function (msg: string) {
    return this.test({
        name: "richTextRequired",
        message: msg,
        test: value => {
            if (value) {
                const body = getParsedHTMLBodyFromString(value);
                const text = body.textContent;

                return Boolean(text?.length);
            }
            return false;
        },
    });
});

addMethod<StringSchema>(string, "phoneNumberValid", function (msg: string) {
    return this.test({
        name: "phoneNumberValid",
        message: msg,
        test: value => {
            if (value) {
                const { isValid } = validatePhone(value);
                return isValid;
            }
            return false;
        },
    });
});
