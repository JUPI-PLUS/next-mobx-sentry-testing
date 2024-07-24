import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import UsersResult from "../UsersResult";
import { mockFunction, resolveServerResponse } from "../../../../../testingInfrustructure/utils";
import { listOfUsers } from "../../../../../api/users";
import userEvent from "@testing-library/user-event";
import { MOCKED_ORDER_USERS } from "../../../../../testingInfrustructure/mocks/orders";

const MOCKED_SETUP_ACTIVE_USER = jest.fn();
const MOCKED_LIST_OF_USERS = mockFunction(listOfUsers);
const MOCKED_LIST_OF_USERS_QUERY_REQUEST = jest.fn();
const MOCKED_USERS_FILTERS_QUERY_STRING = jest.fn();

jest.mock("../../../../../api/users");
jest.mock("../../../store", () => ({
    useOrdersStore() {
        return {
            ordersStore: {
                usersFiltersQueryString: MOCKED_USERS_FILTERS_QUERY_STRING(),
                setupActiveUser: MOCKED_SETUP_ACTIVE_USER,
            },
        };
    },
}));

const queryClient = new QueryClient();

const setup = () => {
    render(
        <QueryClientProvider client={queryClient}>
            <UsersResult />
        </QueryClientProvider>
    );
};

describe("Deprecated_Orders UsersResult", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_LIST_OF_USERS_QUERY_REQUEST, { data: MOCKED_ORDER_USERS });
        MOCKED_LIST_OF_USERS.mockReturnValue(MOCKED_LIST_OF_USERS_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render component without errors", async () => {
        MOCKED_USERS_FILTERS_QUERY_STRING.mockReturnValue("some filter");
        await act(async () => {
            setup();
        });

        MOCKED_ORDER_USERS.map(user => {
            expect(screen.getByTestId(`user-details-card-${user.first_name}-${user.last_name}`));
        });
        expect(screen.getByTestId("users-filter-list-total")).toBeInTheDocument();
    });

    it("Should render nothing if user filters are empty", () => {
        MOCKED_USERS_FILTERS_QUERY_STRING.mockReturnValue("");
        setup();

        expect(MOCKED_LIST_OF_USERS_QUERY_REQUEST).not.toHaveBeenCalled();
        expect(screen.queryByTestId("users-filter-list-total")).not.toBeInTheDocument();
    });

    it("Should setup active user by clicking on card", async () => {
        MOCKED_USERS_FILTERS_QUERY_STRING.mockReturnValue("some filter");
        await act(async () => {
            setup();
        });

        act(() => {
            userEvent.click(
                screen.getByTestId(
                    `user-details-card-${MOCKED_ORDER_USERS[0].first_name}-${MOCKED_ORDER_USERS[0].last_name}`
                )
            );
        });

        expect(MOCKED_SETUP_ACTIVE_USER).toHaveBeenCalledWith(MOCKED_ORDER_USERS[0]);
    });
});
