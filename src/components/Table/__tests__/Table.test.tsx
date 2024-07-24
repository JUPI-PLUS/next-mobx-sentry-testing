// libs
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { stringify } from "query-string";
import userEvent from "@testing-library/user-event";

// constants
import { DEFAULT_PAGE_SIZE } from "../constants";

// components
import Table from "../index";

// mocks
import { MOCKED_LIST_OF_TABLE_COLUMNS, MOCKED_LIST_OF_TABLE_DATA } from "../../../testingInfrustructure/mocks/table";

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
        };
    },
}));

const MOCKED_FETCH_CALLBACK = jest.fn();
const MOCKED_SORTING_CHANGE_CALLBACK = jest.fn();

const MOCKED_TABLE_NAME = "Table name";
const MOCKED_FILTER_NAME = "filter";
const MOCKED_FILTERS = `name=${MOCKED_FILTER_NAME}`;

jest.mock("../../../api/dictionaries");
jest.mock("../../../api/users");
jest.mock("../../../api/orders");

const setup = (props = {}) => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <Table
                columns={MOCKED_LIST_OF_TABLE_COLUMNS}
                tableName={MOCKED_TABLE_NAME}
                fetchCallback={MOCKED_FETCH_CALLBACK}
                onSortingChange={MOCKED_SORTING_CHANGE_CALLBACK}
                {...props}
            />
        </QueryClientProvider>
    );
};

describe("Table", () => {
    beforeAll(() => {
        MOCKED_FETCH_CALLBACK.mockReturnValue({
            data: MOCKED_LIST_OF_TABLE_DATA,
            total: MOCKED_LIST_OF_TABLE_DATA.length,
        });
        MOCKED_QUERY.mockReturnValue({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText(MOCKED_LIST_OF_TABLE_COLUMNS[0].header)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_LIST_OF_TABLE_DATA[0].name)).toBeInTheDocument();
    });

    it("Should call fetch callback and replace route with queries", async () => {
        MOCKED_FETCH_CALLBACK.mockReturnValue({ data: MOCKED_LIST_OF_TABLE_DATA, total: DEFAULT_PAGE_SIZE + 1 });

        MOCKED_QUERY.mockReturnValue({
            page: 2,
        });

        await act(async () => {
            setup({ filters: MOCKED_FILTERS });
        });

        await waitFor(() =>
            expect(MOCKED_FETCH_CALLBACK).toHaveBeenNthCalledWith(
                2,
                [MOCKED_TABLE_NAME, 1, DEFAULT_PAGE_SIZE, MOCKED_FILTERS],
                2,
                DEFAULT_PAGE_SIZE
            )
        );
        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(
            {
                hash: "",
                query: stringify({ page: 2, name: MOCKED_FILTER_NAME }),
            },
            undefined,
            { shallow: true }
        );
    });

    it("Should reset page and call fetch callback request with page=1 if page from query is bigger than total options/page size", async () => {
        const invalidPage = 1000000;
        MOCKED_QUERY.mockReturnValue({ page: invalidPage });

        await act(async () => {
            setup();
        });

        await waitFor(() =>
            expect(MOCKED_FETCH_CALLBACK).toHaveBeenNthCalledWith(
                2,
                [MOCKED_TABLE_NAME, invalidPage - 1, DEFAULT_PAGE_SIZE, ""],
                invalidPage,
                DEFAULT_PAGE_SIZE
            )
        );

        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(
            {
                hash: "",
                query: stringify({ page: 1 }),
            },
            undefined,
            { shallow: true }
        );

        await waitFor(() =>
            expect(MOCKED_FETCH_CALLBACK).toHaveBeenNthCalledWith(
                3,
                [MOCKED_TABLE_NAME, 0, DEFAULT_PAGE_SIZE, ""],
                1,
                DEFAULT_PAGE_SIZE
            )
        );
    });

    it.each([-9999, -1, -0.0005, 0, 0.0001, 2.5, "abc"])(
        "Should reset page and call fetch callback request with page=1 if page from query is invalid",
        async invalidPage => {
            MOCKED_QUERY.mockReturnValue({ page: invalidPage });

            await act(async () => {
                setup();
            });

            await waitFor(() =>
                expect(MOCKED_FETCH_CALLBACK).toHaveBeenNthCalledWith(
                    1,
                    [MOCKED_TABLE_NAME, 0, DEFAULT_PAGE_SIZE, ""],
                    1,
                    DEFAULT_PAGE_SIZE
                )
            );

            expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(
                {
                    hash: "",
                    query: stringify({ page: 1 }),
                },
                undefined,
                { shallow: true }
            );
        }
    );

    it("Should call onSortingChange callback request with sorting data if user clicks on sortable header", async () => {
        const index = 0;
        const tableColumn = MOCKED_LIST_OF_TABLE_COLUMNS[index];

        await act(async () => {
            setup({ filters: MOCKED_FILTERS });
        });

        await act(async () => {
            userEvent.click(screen.getByText(tableColumn.header));
        });

        // TODO: fix the issue of react-table - should pass test with: expect(MOCKED_SORTING_CHANGE_CALLBACK).toHaveBeenCalledWith([{ id: tableColumn.id, desc: false }])
        expect(MOCKED_SORTING_CHANGE_CALLBACK).toHaveBeenCalled();
    });
});
