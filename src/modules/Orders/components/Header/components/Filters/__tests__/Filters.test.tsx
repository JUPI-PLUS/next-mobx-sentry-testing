import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Filters from "../Filters";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { endOfDay, format, getUnixTime, startOfDay } from "date-fns";
import FormContainer from "../../../../../../../components/uiKit/forms/FormContainer/FormContainer";
import { object } from "yup";
import { removeOffsetFromDate } from "../../../../../../../shared/utils/date";
import { MOCKED_ORDER_STATUSES } from "../../../../../../../testingInfrustructure/mocks/dictionaries";
import { DATE_FORMATS } from "../../../../../../../shared/constants/formates";
import { toLookupList } from "../../../../../../../shared/utils/lookups";

const MOCKED_SETUP_ORDER_FILTER = jest.fn();
const MOCK_ROUTER_PUSH = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();

const MOCKED_ORDER_STATUSES_LOOKUP = toLookupList(MOCKED_ORDER_STATUSES);

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "",
            query: {},
            replace: MOCK_ROUTER_REPLACE,
            push: MOCK_ROUTER_PUSH,
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF,
            },
        };
    },
}));

jest.mock("../../../../../store", () => ({
    useOrdersStore() {
        return {
            ordersStore: {
                setupOrderFilter: MOCKED_SETUP_ORDER_FILTER,
                orderStatusesLookup: MOCKED_ORDER_STATUSES_LOOKUP,
                activeOrdersFilter: {},
            },
        };
    },
}));
jest.mock("../../../../../../../api/dictionaries");

const queryClient = new QueryClient();

const setup = () => {
    render(
        <QueryClientProvider client={queryClient}>
            <FormContainer
                onSubmit={() => {}}
                schema={object()}
                defaultValues={{ order_number: "", created_at: { from: undefined, to: undefined }, status: null }}
            >
                <Filters />
            </FormContainer>
        </QueryClientProvider>
    );
};

describe("Deprecated_Orders Filters", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("order-number-filter-input")).toBeInTheDocument();
        expect(screen.getByTestId("datepicker-input")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("Should setup order filters", async () => {
        const now = new Date();
        const nowTimestamp = getUnixTime(removeOffsetFromDate(startOfDay(now)));
        const endOfDayTimestamp = getUnixTime(removeOffsetFromDate(endOfDay(now)));
        const mockedFilters = {
            orderNumber: faker.random.alpha(10),
            createdAtDate: format(now, DATE_FORMATS.DATE_ONLY),
            orderStatus: MOCKED_ORDER_STATUSES_LOOKUP[faker.datatype.number({ min: 0, max: 3 })],
        };
        await act(async () => {
            setup();
        });

        await act(async () => {
            await userEvent.paste(screen.getByTestId("order-number-filter-input"), mockedFilters.orderNumber);
            jest.runOnlyPendingTimers();
        });

        act(() => {
            userEvent.click(screen.getByTestId("created_at-calendar-icon"));
        });

        act(() => {
            userEvent.click(screen.getByTestId(mockedFilters.createdAtDate));
        });

        act(() => {
            userEvent.click(screen.getByTestId("date-picker-submit-button"));
        });

        act(() => {
            userEvent.click(screen.getByRole("combobox"));
        });

        act(() => {
            userEvent.click(screen.getByText(mockedFilters.orderStatus.label));
        });

        expect(MOCKED_SETUP_ORDER_FILTER).toHaveBeenNthCalledWith(1, "order_number", mockedFilters.orderNumber);
        expect(MOCKED_SETUP_ORDER_FILTER).toHaveBeenNthCalledWith(2, "created_at_from", nowTimestamp);
        expect(MOCKED_SETUP_ORDER_FILTER).toHaveBeenNthCalledWith(3, "created_at_to", endOfDayTimestamp);
        expect(MOCKED_SETUP_ORDER_FILTER).toHaveBeenNthCalledWith(4, "status", mockedFilters.orderStatus.value);
    });
});
