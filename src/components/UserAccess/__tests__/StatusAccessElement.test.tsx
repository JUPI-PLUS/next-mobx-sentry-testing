import { act, render, screen } from "@testing-library/react";
import { UserStatus } from "../../../shared/models/business/user";
import StatusAccessElement from "../StatusAccess/StatusAccessElement";
import { store } from "../../../shared/store";
import { MOCK_USER } from "../../../testingInfrustructure/mocks/users";

jest.mock("../../../api/users");

const MOCKED_CHILDREN_TEXT = "My pretty children";

const setup = (requiredStatus: UserStatus | UserStatus[], tolerant = false) => {
    render(
        <StatusAccessElement required={requiredStatus} tolerant={tolerant}>
            <p>{MOCKED_CHILDREN_TEXT}</p>
        </StatusAccessElement>
    );
};

describe("StatusAccessElement", () => {
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
            meData: MOCK_USER({ status: UserStatus.ACTIVE }),
            tolerant: false,
        },
    ])(
        "Should not render children element if user status doesnt satisfy required status",
        async ({ requiredStatus, meData, tolerant }) => {
            store.user.setUser(meData);
            await act(async () => {
                setup(requiredStatus, tolerant);
            });

            expect(screen.queryByText(MOCKED_CHILDREN_TEXT)).not.toBeInTheDocument();
        }
    );
});
