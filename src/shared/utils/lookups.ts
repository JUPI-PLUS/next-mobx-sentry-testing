//  models
import { CommonDictionaryItem } from "../models/dictionaries";
import { Lookup } from "../models/form";
import { ID } from "../models/common";

export const toLookupList = <
    ReturnType extends Lookup<LookupType> & Partial<T>,
    T extends CommonDictionaryItem = CommonDictionaryItem,
    LookupType = ID
>(
    serverLookup: T[] | null,
    shouldAddRest = false
): ReturnType[] =>
    serverLookup?.map<ReturnType>(item =>
        shouldAddRest
            ? ({
                  ...item,
                  value: item.id,
                  label: item.name,
              } as ReturnType & T)
            : ({ value: item.id, label: item.name } as ReturnType)
    ) || [];

export const getLookupItem = <T extends Lookup<LookupType>, LookupType = ID>(
    lookupArray: T[] | undefined,
    value: T[keyof T] | null, // Warning: Only primitives allowed
    propertyAccessor: keyof T | undefined = "value"
): T | null => {
    if (typeof value === "function" || typeof value === "object") return null;
    return lookupArray?.find(lookupItem => lookupItem[propertyAccessor] === value) || null;
};

export const getLookupItems = <T extends Lookup<LookupType>, LookupType = ID>(
    lookupArray: Array<T> | undefined,
    valuesArray: Array<T[keyof T]> | null | undefined,
    propertyAccessor: keyof T | undefined = "value"
): Array<T> | null => {
    if (typeof valuesArray === "function" || !valuesArray?.length) return null;
    const lookupItems = valuesArray.reduce<Array<T>>((accumulator, value) => {
        const foundLookup = lookupArray?.find(lookupItem => lookupItem[propertyAccessor] === value);
        if (foundLookup) {
            accumulator.push(foundLookup);
        }

        return accumulator;
    }, []);
    return lookupItems.length ? lookupItems : null;
};
