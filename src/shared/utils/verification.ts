// libs
import isEmpty from "lodash/isEmpty";
import omitBy from "lodash/omitBy";

// constants
import { VERIFICATION_LOCAL_STORAGE_KEYS } from "../constants/verification";

type VerificationStorageField = Record<string, number>;
type VerificationStorage = Record<string, VerificationStorageField>;

export const getVerificationFromStorage = (): VerificationStorage => {
    return JSON.parse(window.localStorage.getItem(VERIFICATION_LOCAL_STORAGE_KEYS.USER_VERIFICATION) || "{}");
};
export const getVerificationFromStorageByUuid = (userUUID: string, uuid: string): number | null => {
    const data = getVerificationFromStorage();
    return data?.[userUUID]?.[uuid] || null;
};
export const setVerificationToStorage = (userUUID: string, uuid: string, targetTime: number) => {
    const data = getVerificationFromStorage();
    data[uuid] = {
        ...(data[userUUID] || {}),
        [uuid]: targetTime,
    };
    window.localStorage.setItem(VERIFICATION_LOCAL_STORAGE_KEYS.USER_VERIFICATION, JSON.stringify(data));
};
export const removeVerificationFromStorage = (userUUID: string, uuid: string) => {
    const data = getVerificationFromStorage();
    if (data[userUUID]) {
        delete data[userUUID][uuid];
    }
    if (isEmpty(data[userUUID])) {
        delete data[userUUID];
    }
    window.localStorage.setItem(VERIFICATION_LOCAL_STORAGE_KEYS.USER_VERIFICATION, JSON.stringify(data));
};
export const recheckVerificationInStorage = () => {
    const data = getVerificationFromStorage();
    const dateNow = Date.now();
    const nextData = Object.entries(data).reduce<VerificationStorage>((acc, [uuid, verificationData]) => {
        const resultObj = omitBy(verificationData, timestamp => timestamp <= dateNow);
        if (!isEmpty(resultObj)) {
            acc[uuid] = resultObj as VerificationStorageField;
        }
        return acc;
    }, {});
    window.localStorage.setItem(VERIFICATION_LOCAL_STORAGE_KEYS.USER_VERIFICATION, JSON.stringify(nextData));
};
