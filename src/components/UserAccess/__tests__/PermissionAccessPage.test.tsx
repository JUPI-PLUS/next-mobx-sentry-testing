import { act, render } from "@testing-library/react";
import PermissionAccessPage from "../PermissionAccess/PermissionAccessPage";
import { store } from "../../../shared/store";

const MOCKED_REPLACE = jest.fn();

jest.mock("../../../api/users");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REPLACE,
        };
    },
}));

const MOCKED_CHILDREN_TEXT = "My pretty children";

const setup = (requiredPermissions: number | number[], tolerant = false) => {
    render(
        <PermissionAccessPage required={requiredPermissions} tolerant={tolerant}>
            <p>{MOCKED_CHILDREN_TEXT}</p>
        </PermissionAccessPage>
    );
};

describe("PermissionAccessPage", () => {
    it("Should redirect to 403 page if user role doesnt satisfy required role", async () => {
        store.user.setupPermissions([1, 3]);
        await act(async () => {
            setup([10], false);
        });

        expect(MOCKED_REPLACE).toHaveBeenCalled();
    });
});
