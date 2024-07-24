import { act, render, screen } from "@testing-library/react";
import UserAvatar from "../UserAvatar";
import { store } from "../../../../../../shared/store";
import { MOCK_USER, MOCKED_PERMISSIONS_IDS } from "../../../../../../testingInfrustructure/mocks/users";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../../../../../../../pages/_app";
import UserStore from "../../../../../../shared/store/UserStore";

jest.mock("../../../../../../shared/hooks/useGetBase64Image", () => ({
    useGetBase64Image() {
        return {
            data: "stringOfBlobImage",
        };
    },
}));

jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
        };
    },
}));

const setup = () => {
    render(
        <QueryClientProvider client={queryClient}>
            <UserAvatar />
        </QueryClientProvider>
    );
};

const MOCKED_USER = MOCK_USER({});

describe("UserAvatar component", () => {
    beforeAll(() => {
        store.user.setUser(MOCKED_USER);
    });

    it("Should render without errors", () => {
        setup();

        expect(screen.getByTestId("avatar")).toBeInTheDocument();
        expect(screen.getByTestId("avatar-image")).toBeInTheDocument();
    });

    it("Should open dropdown by clicking on avatar", async () => {
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
        setup();

        await act(async () => {
            userEvent.click(screen.getByTestId("avatar-container"));
        });

        expect(screen.getByTestId("dropdown-container")).toBeInTheDocument();
        expect(screen.getByTestId("profile-settings-menu-item")).toBeInTheDocument();
        expect(screen.getByTestId("logout-menu-item")).toBeInTheDocument();
    });
});
