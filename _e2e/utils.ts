import { t } from "testcafe";
import { InputType, unzip } from "zlib";
import { PossibleMethods } from "./shared/enums";

export const selectOption = async (selector: Selector, label: string, options?: TypeActionOptions) => {
    await t.typeText(selector, label, options).pressKey("enter");
};

export const toggleCheckbox = async (selector: Selector) => {
    await t.click(selector);
};

export const toggleCheckboxTo = async (selector: Selector, desiredFlag: boolean) => {
    const currentFlag = await selector.checked;

    if (desiredFlag === currentFlag) {
        return;
    }
    await t.click(selector);
};

export const resolveRequestPromise = async <T>(buffer: InputType, method = PossibleMethods.GET): Promise<T> => {
    return new Promise((resolve, reject) => {
        try {
            if (method === PossibleMethods.GET || method === PossibleMethods.PATCH) {
                unzip(buffer, (error, data) => {
                    resolve(JSON.parse(data.toString("utf-8")));
                });
            }
            if (method === PossibleMethods.POST) {
                resolve(JSON.parse((buffer as Buffer).toString("utf-8")));
            }
        } catch (err) {
            reject(err);
        }
    });
};
