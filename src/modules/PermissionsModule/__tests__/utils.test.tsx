import { MOCKED_PERMISSIONS_DATA } from "../../../testingInfrustructure/mocks/users";
import { getIdsFromObjectKeys, getOverwritedDefaultPermissions, getPermissionsObjectFromArray } from "../utils";

describe("getIdsFromObjectKeys", () => {
    it("Should return ids of keys with 'true' set as value", () => {
        const MOCKED_PERMISSIONS_OBJECT = {
            1: true,
            2: false,
            3: true,
        };
        const res = getIdsFromObjectKeys(MOCKED_PERMISSIONS_OBJECT);

        expect(res).toEqual([1, 3]);
    });
    it("Should return an empty array if an object is empty", () => {
        const res = getIdsFromObjectKeys({});

        expect(res).toEqual([]);
    });
});

describe("getPermissionsObjectFromArray", () => {
    it("Should return an object with id as key and with 'true' set as value", () => {
        const res = getPermissionsObjectFromArray([MOCKED_PERMISSIONS_DATA[0], MOCKED_PERMISSIONS_DATA[1]], true);

        expect(res).toEqual({ 1: true, 2: true });
    });

    it("Should return an object with id as key and with 'false' set as value", () => {
        const res = getPermissionsObjectFromArray([MOCKED_PERMISSIONS_DATA[0]], false);

        expect(res).toEqual({ 1: false });
    });

    it("Should return an empty object if passed array is empty", () => {
        const res = getPermissionsObjectFromArray([], false);

        expect(res).toEqual({});
    });
});

describe("getOverwritedDefaultPermissions", () => {
    it("Should return overwrited default permissions", () => {
        const res = getOverwritedDefaultPermissions(
            { 1: true },
            [MOCKED_PERMISSIONS_DATA[1], MOCKED_PERMISSIONS_DATA[2]],
            true
        );

        expect(res).toEqual({ 1: true, 2: true, 3: true });
    });
});
