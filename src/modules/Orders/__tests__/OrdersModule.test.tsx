import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { getExamStatuses, getOrderStatuses, getSampleTypes } from "../../../api/dictionaries";
import { details, listOfUsers } from "../../../api/users";
import { getOrderExamsList, getOrderList } from "../../../api/orders";
import { act, render, screen, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import OrdersModule from "../OrdersModule";
import userEvent from "@testing-library/user-event";
import { stringify } from "query-string";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";

import {
    MOCKED_ORDER_EXAMS_LIST,
    MOCKED_ORDER_USERS,
    MOCKED_ORDERS,
} from "../../../testingInfrustructure/mocks/orders";
import {
    MOCKED_EXAM_STATUSES,
    MOCKED_ORDER_STATUSES,
    MOCKED_SAMPLE_TYPES,
} from "../../../testingInfrustructure/mocks/dictionaries";
import UserStore from "../../../shared/store/UserStore";
import { MOCK_DELETED_PATIENT, MOCK_USER, MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../shared/constants/user";

const MOCKED_ORDER_USER = MOCK_USER({});
const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCKED_QUERY = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();

jest.mock("next/router", () => ({
    events: {
        ...jest.requireActual("next/router").events,
    },
    useRouter() {
        return {
            route: "",
            asPath: "",
            query: MOCKED_QUERY(),
            replace: MOCK_ROUTER_REPLACE,
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF,
            },
        };
    },
}));

const MOCKED_GET_ORDER_STATUSES = mockFunction(getOrderStatuses);
const MOCKED_LIST_OF_USERS = mockFunction(listOfUsers);
const MOCKED_LIST_OF_USERS_QUERY_REQUEST = jest.fn();
const MOCKED_GET_ORDERS_LIST = mockFunction(getOrderList);
const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_EXAM_STATUSES = mockFunction(getExamStatuses);
const MOCKED_GET_ORDER_EXAM_LIST = mockFunction(getOrderExamsList);
const MOCKED_GET_USER_DETAILS = mockFunction(details);
const MOCKED_GET_USER_DETAILS_REQUEST = jest.fn();
const MOCKED_ORDER_NUMBER = "1234567891";

jest.mock("../../../api/dictionaries");
jest.mock("../../../api/users");
jest.mock("../../../api/orders");

const setup = (locationProps = {}) => {
    const queryClient = new QueryClient();
    defineLocationProps(locationProps);
    render(
        <QueryClientProvider client={queryClient}>
            <OrdersModule />
        </QueryClientProvider>
    );
};

describe("OrdersModule", () => {
    beforeAll(() => {
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
        UserStore.setUser(MOCKED_ORDER_USER);
        jest.useFakeTimers();
        resolveServerResponse(MOCKED_GET_ORDERS_LIST, { data: MOCKED_ORDERS, total: MOCKED_ORDERS.length });
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES });
        resolveServerResponse(MOCKED_GET_EXAM_STATUSES, { data: MOCKED_EXAM_STATUSES });
        resolveServerResponse(MOCKED_GET_ORDER_STATUSES, { data: MOCKED_ORDER_STATUSES });
        resolveServerResponse(MOCKED_LIST_OF_USERS_QUERY_REQUEST, { data: MOCKED_ORDER_USERS, total: 5 });
        MOCKED_LIST_OF_USERS.mockReturnValue(MOCKED_LIST_OF_USERS_QUERY_REQUEST);
        MOCKED_GET_ORDER_EXAM_LIST.mockImplementation(() =>
            jest.fn().mockResolvedValue({ data: { data: MOCKED_ORDER_EXAMS_LIST } })
        );
        MOCKED_GET_USER_DETAILS.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_USER_DETAILS_REQUEST, {
                data: MOCKED_ORDER_USERS[0],
            })
        );
        MOCKED_QUERY.mockReturnValue({});
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllTimers();
        cleanup();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText(MOCKED_ORDERS[0].order_number)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_ORDERS[0].first_name)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_ORDERS[0].last_name)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_ORDERS[0].referral_doctor)).toBeInTheDocument();
    });

    it("Should filter orders by user uuid", async () => {
        const mockedUsersFilter = { uuid: "123456789" };
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("users-filter-uuid"), mockedUsersFilter.uuid);
            jest.runOnlyPendingTimers();
        });

        await waitFor(() =>
            expect(MOCKED_LIST_OF_USERS).toHaveBeenNthCalledWith(
                2,
                stringify({
                    barcode: mockedUsersFilter.uuid,
                })
            )
        );

        await act(async () => {
            userEvent.click(
                screen.getByTestId(
                    `user-details-card-${MOCKED_ORDER_USERS[0].first_name}-${MOCKED_ORDER_USERS[0].last_name}`
                )
            );
        });

        await waitFor(() =>
            expect(MOCKED_GET_ORDERS_LIST).toHaveBeenNthCalledWith(2, 1, `user_uuid=${MOCKED_ORDER_USERS[0].uuid}`)
        );

        expect(MOCK_ROUTER_REPLACE).toHaveBeenNthCalledWith(
            2,
            {
                hash: "",
                query: stringify({ page: 1, user_uuid: MOCKED_ORDER_USERS[0].uuid }),
            },
            undefined,
            { shallow: true }
        );
    });

    it("Should call fetch orders with order filters", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("order-number-filter-input"), MOCKED_ORDER_NUMBER);
            jest.runOnlyPendingTimers();
        });

        await waitFor(() =>
            expect(MOCKED_GET_ORDERS_LIST).toHaveBeenNthCalledWith(
                3,
                1,
                `order_number=${MOCKED_ORDER_NUMBER}&user_uuid=${MOCKED_ORDER_USERS[0].uuid}`
            )
        );

        expect(MOCK_ROUTER_REPLACE).toHaveBeenNthCalledWith(
            3,
            {
                hash: "",
                query: stringify({ page: 1, user_uuid: MOCKED_ORDER_USERS[0].uuid, order_number: MOCKED_ORDER_NUMBER }),
            },
            undefined,
            { shallow: true }
        );
    });

    it("Should call fetch orders request with queries from pathname and setup filters according to query params", async () => {
        MOCKED_QUERY.mockReturnValue({
            page: 2,
            order_number: MOCKED_ORDER_NUMBER,
            user_uuid: MOCKED_ORDER_USERS[0].uuid,
        });

        await act(async () => {
            setup({ search: `?page=2&order_number=${MOCKED_ORDER_NUMBER}&user_uuid=${MOCKED_ORDER_USERS[0].uuid}` });
        });

        await waitFor(() =>
            expect(MOCKED_GET_ORDERS_LIST).toHaveBeenNthCalledWith(
                1,
                2,
                `order_number=${MOCKED_ORDER_NUMBER}&user_uuid=${MOCKED_ORDER_USERS[0].uuid}`
            )
        );

        expect(screen.getByTestId("order-number-filter-input")).toHaveValue(MOCKED_ORDER_NUMBER);
        expect(screen.getByTestId("user-full-name")).toHaveTextContent(
            `${MOCKED_ORDER_USERS[0].first_name} ${MOCKED_ORDER_USERS[0].last_name}`
        );
    });

    it("Should not show view profile button, activate kit button and add order button if user is deleted", async () => {
        MOCKED_GET_USER_DETAILS.mockImplementation(() =>
            resolveServerResponse(MOCKED_GET_USER_DETAILS_REQUEST, {
                data: MOCK_DELETED_PATIENT,
            })
        );
        await act(async () => {
            setup();
        });

        expect(screen.queryByTestId("view-profile-link")).not.toBeInTheDocument();
        expect(screen.queryByTestId("activate-kit-link")).not.toBeInTheDocument();
        expect(screen.queryByTestId("add-order-link")).not.toBeInTheDocument();
    });

    it("Should show badge with deleted text if user in order is deleted", async () => {
        resolveServerResponse(MOCKED_GET_ORDERS_LIST, {
            data: [{ ...MOCKED_ORDERS[0], first_name: null, last_name: null }],
            total: 1,
        });
        await act(async () => {
            setup();
        });

        expect(screen.getAllByTestId(`badge-neutral-${DEFAULT_DELETED_USER_MOCK_TEXT}`)).toHaveLength(2);
    });
});
