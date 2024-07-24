// libs
import React, { useContext } from "react";
import { render, screen, act, waitFor, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { stringify } from "query-string";

// stores
import { ParametersStoreContext } from "../store";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { getParameter, getParametersList } from "../../../api/parameters";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";
import { getExamTemplateStatuses, getMeasurementUnits, getParameterViewTypes } from "../../../api/dictionaries";

// components
import ParametersModule from "../ParametersModule";

// mocks
import { MOCKED_PARAMETERS } from "../../../testingInfrustructure/mocks/parameters";
import {
    MOCKED_EXAM_TEMPLATE_STATUSES,
    MOCKED_MEASUREMENT_UNITS,
    MOCKED_PARAMETER_VIEW_TYPES,
} from "../../../testingInfrustructure/mocks/dictionaries";

jest.mock("../../../api/dictionaries");
jest.mock("../../../api/parameters");

const MOCKED_PARAMETERS_LIST_REQUEST = mockFunction(getParametersList);
const MOCKED_MEASUREMENT_UNITS_REQUEST = mockFunction(getMeasurementUnits);
const MOCKED_PARAMETER_VIEW_TYPES_REQUEST = mockFunction(getParameterViewTypes);
const MOCKED_EXAM_TEMPLATE_STATUSES_REQUEST = mockFunction(getExamTemplateStatuses);
const MOCKED_GET_PARAMETER = mockFunction(getParameter);
const MOCKED_GET_PARAMETER_QUERY_REQUEST = jest.fn();
const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_QUERY = jest.fn();
const MOCKED_AS_PATH = jest.fn();

const MOCKED_CURRENT_PARAMETERS = MOCKED_PARAMETERS();

jest.mock("next/router", () => ({
    events: {
        on: jest.fn(),
        off: jest.fn(),
    },
    useRouter() {
        return {
            asPath: MOCKED_AS_PATH(),
            route: "",
            query: MOCKED_QUERY(),
            replace: MOCK_ROUTER_REPLACE,
            push: jest.fn(),
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF,
            },
        };
    },
}));

const setup = (locationProps = {}) => {
    const queryClient = new QueryClient();
    defineLocationProps(locationProps);
    render(
        <QueryClientProvider client={queryClient}>
            <ParametersModule />
        </QueryClientProvider>
    );
};

describe("Parameters module", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        resolveServerResponse(MOCKED_PARAMETERS_LIST_REQUEST, { data: MOCKED_CURRENT_PARAMETERS, total: 5 });
        resolveServerResponse(MOCKED_MEASUREMENT_UNITS_REQUEST, { data: MOCKED_MEASUREMENT_UNITS });
        resolveServerResponse(MOCKED_PARAMETER_VIEW_TYPES_REQUEST, { data: MOCKED_PARAMETER_VIEW_TYPES });
        resolveServerResponse(MOCKED_EXAM_TEMPLATE_STATUSES_REQUEST, { data: MOCKED_EXAM_TEMPLATE_STATUSES });
        resolveServerResponse(MOCKED_GET_PARAMETER_QUERY_REQUEST, { data: MOCKED_CURRENT_PARAMETERS[0] });
        MOCKED_GET_PARAMETER.mockReturnValue(MOCKED_GET_PARAMETER_QUERY_REQUEST);
        MOCKED_QUERY.mockReturnValue({});
        MOCKED_AS_PATH.mockReturnValue("");
    });

    afterEach(() => {
        jest.clearAllMocks();
        const { result } = renderHook(() => useContext(ParametersStoreContext));
        result.current.parametersStore.resetParametersFilters();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText("Constructor / Parameters")).toBeInTheDocument();
        expect(screen.getByText(MOCKED_CURRENT_PARAMETERS[0].name)).toBeInTheDocument();
    });

    it("Should call get parameters list request with code filter", async () => {
        await act(async () => {
            setup();
        });
        await act(() => {
            userEvent.paste(screen.getByTestId("code-filter-input"), MOCKED_CURRENT_PARAMETERS[0].code);
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_PARAMETERS_LIST_REQUEST).toHaveBeenCalledWith(1, `code=${MOCKED_CURRENT_PARAMETERS[0].code}`);

        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(
            {
                hash: "",
                query: stringify({ page: 1, code: MOCKED_CURRENT_PARAMETERS[0].code }),
            },
            undefined,
            { shallow: true }
        );
    });

    it.each([
        {
            setupSearchString: "?order_by=code&order_way=asc",
            expectedSearchString: "order_by=code&order_way=asc",
        },
        {
            setupSearchString: "?order_by=code&order_way=desc",
            expectedSearchString: "order_by=code&order_way=desc",
        },
        {
            setupSearchString: "?order_by=code&order_way=some_another_value",
            expectedSearchString: "order_by=code&order_way=asc",
        },
        {
            setupSearchString: "?order_way=desc",
            expectedSearchString: "",
        },
        {
            setupSearchString: "?order_by=code",
            expectedSearchString: "order_by=code&order_way=asc",
        },
    ])(
        "Should call get parameters list request with different sorting queries from pathname",
        async ({ setupSearchString, expectedSearchString }) => {
            await act(async () => {
                setup({
                    search: setupSearchString,
                });
            });

            expect(MOCKED_PARAMETERS_LIST_REQUEST).toHaveBeenCalledWith(1, expectedSearchString);
        }
    );

    it("Should call get parameters list request with queries from pathname and setup filters according to query params", async () => {
        MOCKED_QUERY.mockReturnValue({
            page: 2,
            code: MOCKED_CURRENT_PARAMETERS[1].code,
        });

        await act(async () => {
            setup({ search: `?page=2&code=${MOCKED_CURRENT_PARAMETERS[1].code}` });
        });

        await waitFor(() =>
            expect(MOCKED_PARAMETERS_LIST_REQUEST).toHaveBeenCalledWith(2, `code=${MOCKED_CURRENT_PARAMETERS[1].code}`)
        );

        expect(screen.getByTestId("code-filter-input")).toHaveValue(MOCKED_CURRENT_PARAMETERS[1].code);
    });

    it("If pathname includes hash - should call get parameter request and open drawer", async () => {
        MOCKED_AS_PATH.mockReturnValue(`path#${MOCKED_CURRENT_PARAMETERS[0].uuid}`);

        await act(async () => {
            setup();
        });

        expect(MOCKED_GET_PARAMETER).toHaveBeenCalledWith(MOCKED_CURRENT_PARAMETERS[0].uuid);
        expect(MOCKED_GET_PARAMETER_QUERY_REQUEST).toHaveBeenCalled();

        expect(screen.getByTestId("drawer-title")).toBeInTheDocument();
        expect(screen.getByTestId("parameter-code")).toHaveValue(MOCKED_CURRENT_PARAMETERS[0].code);
    });
});
