import {act, render, screen} from "@testing-library/react";
import UsersFilters from "../UsersFilters";
import userEvent from "@testing-library/user-event";
import {faker} from "@faker-js/faker";
import { endOfDay, format, getUnixTime, startOfDay } from "date-fns";
import { removeOffsetFromDate } from "../../../../../shared/utils/date";
import { DATE_FORMATS } from "../../../../../shared/constants/formates";
import UserStore from "../../../../../shared/store/UserStore";
import { MOCKED_PERMISSIONS_IDS } from "../../../../../testingInfrustructure/mocks/users";

const MOCKED_SETUP_USER_FILTER_VALUE = jest.fn();
const MOCKED_RESET_USER_FILTER = jest.fn();
const MOCKED_USERS_FILTERS_QUERY_STRING = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
            }
        };
    },
}));

jest.mock("../../../store", () => ({
    useOrdersStore() {
        return {
            ordersStore: {
                setupUserFilterValue: MOCKED_SETUP_USER_FILTER_VALUE,
                resetUserFilter: MOCKED_RESET_USER_FILTER,
                usersFiltersQueryString: MOCKED_USERS_FILTERS_QUERY_STRING(),
                _userFilters: {
                    birth_date_to: new Date(),
                    birth_date_from: new Date(),
                    email: "",
                    first_name: "",
                    last_name: "",
                    barcode: "",
                },
            }
        }
    }
}));

const setup = () => {
    render(
        <UsersFilters/>
    )
}

describe('Deprecated_Orders UsersFilters', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS)
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it("Should render without errors", () => {
        MOCKED_USERS_FILTERS_QUERY_STRING.mockResolvedValue("")
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("show-more-link"));
        });

        expect(screen.getByTestId("users-filter-uuid")).toBeInTheDocument();
        expect(screen.getByTestId("users-filter-first-name")).toBeInTheDocument();
        expect(screen.getByTestId("users-filter-last-name")).toBeInTheDocument();
        expect(screen.getByTestId("birthday-calendar-icon")).toBeInTheDocument();
        expect(screen.getByTestId("users-filter-email")).toBeInTheDocument();
        expect(screen.getByTestId("reset-filters")).toBeInTheDocument();
    });

    it("Should setup user filters and reset it", async () => {
        const now = new Date();
        const nowTimestamp = getUnixTime(removeOffsetFromDate(startOfDay(now)));
        const nowEndDayTimestamp = getUnixTime(removeOffsetFromDate(endOfDay(now)));
        MOCKED_USERS_FILTERS_QUERY_STRING.mockReturnValue("some filters");
        const mockedFilters = {
            uuid: "102020302",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            birthday: format(now, DATE_FORMATS.DATE_ONLY),
            email: faker.internet.email(),
        }
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("show-more-link"));
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("users-filter-uuid"), mockedFilters.uuid);
            jest.runOnlyPendingTimers();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("users-filter-first-name"), mockedFilters.firstName)
            jest.runOnlyPendingTimers();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("users-filter-last-name"), mockedFilters.lastName)
            jest.runOnlyPendingTimers();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("birthday-calendar-icon"))
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(mockedFilters.birthday));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("date-picker-submit-button"));
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("users-filter-email"), mockedFilters.email)
            jest.runOnlyPendingTimers();
        })

        expect(MOCKED_SETUP_USER_FILTER_VALUE).toHaveBeenNthCalledWith(1, "barcode", mockedFilters.uuid);
        expect(MOCKED_SETUP_USER_FILTER_VALUE).toHaveBeenNthCalledWith(2, "first_name", mockedFilters.firstName);
        expect(MOCKED_SETUP_USER_FILTER_VALUE).toHaveBeenNthCalledWith(3, "last_name", mockedFilters.lastName);
        expect(MOCKED_SETUP_USER_FILTER_VALUE).toHaveBeenNthCalledWith(4, "birth_date_from", nowTimestamp);
        expect(MOCKED_SETUP_USER_FILTER_VALUE).toHaveBeenNthCalledWith(5, "birth_date_to", nowEndDayTimestamp);
        expect(MOCKED_SETUP_USER_FILTER_VALUE).toHaveBeenNthCalledWith(6, "email", mockedFilters.email);

        act(() => {
            userEvent.click(screen.getByTestId("reset-filters"));
        });

        expect(MOCKED_RESET_USER_FILTER).toHaveBeenCalled();
    });
});
