import { act, render, screen } from "@testing-library/react";
import { UserStatus } from "../../../shared/models/business/user";
import StatusAccessPage from "../StatusAccess/StatusAccessPage";
import { store } from "../../../shared/store";
import { MOCK_USER } from "../../../testingInfrustructure/mocks/users";

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

const setup = (requiredStatus: UserStatus | UserStatus[], tolerant = false) => {
    render(
        <StatusAccessPage required={requiredStatus} tolerant={tolerant}>
            <p>{MOCKED_CHILDREN_TEXT}</p>
        </StatusAccessPage>
    );
};

describe("StatusAccessPage", () => {
    it.each([
        {
            requiredStatus: UserStatus.ACTIVE,
            meData: MOCK_USER({}),
            tolerant: false,
        },
        {
            requiredStatus: [UserStatus.ACTIVE],
            meData: MOCK_USER({}),
            tolerant: true,
        },
    ])(
        "Should render children if user status satisfy required status",
        async ({ requiredStatus, meData, tolerant }) => {
            store.user.setUser(meData);
            await act(async () => {
                setup(requiredStatus, tolerant);
            });

            expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
        }
    );

    it.each([
        {
            requiredStatus: UserStatus.NEW,
            meData: MOCK_USER({}),
            tolerant: false,
        },
        {
            requiredStatus: UserStatus.BLOCKED,
            meData: MOCK_USER({}),
            tolerant: false,
        },
    ])(
        "Should redirect to 403 page if user role doesnt satisfy required role",
        async ({ requiredStatus, meData, tolerant }) => {
            store.user.setUser(meData);

            await act(async () => {
                setup(requiredStatus, tolerant);
            });

            expect(MOCKED_REPLACE).toHaveBeenCalled();
        }
    );
});
