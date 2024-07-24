// libs
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { act, render, renderHook, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import { stringify } from "query-string";
import { useContext } from "react";

// stores
import { MeasureUnitsStoreContext } from "../store";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import {
    createMeasureUnit,
    deleteMeasureUnit,
    getExamTemplatesByMeasureUnitId,
    getMeasureUnitDetails,
    getMeasureUnitsList,
    getParamsByMeasureUnitId,
    patchMeasureUnit,
} from "../../../api/measureUnits";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";

// components
import MeasureUnitsModule from "../MeasureUnitsModule";

// mocks
import { MOCKED_MEASUREMENT_UNITS } from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_EXAM_TEMPLATE } from "../../../testingInfrustructure/mocks/exams";
import { MOCKED_SHORT_PARAMETER } from "../../../testingInfrustructure/mocks/parameters";

const MOCKED_QUERY = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_GET_MEASURE_UNIT_DETAILS_REQUEST = jest.fn();
const MOCKED_GET_EXAM_TEMPLATES_BY_MEASURE_UNIT_ID_REQUEST = jest.fn();
const MOCKED_GET_PARAMS_BY_MEASURE_UNIT_ID_REQUEST = jest.fn();
const MOCKED_PATCH_MEASURE_UNIT_REQUEST = jest.fn();
const MOCKED_MEASURE_UNIT = MOCKED_MEASUREMENT_UNITS[0];
const MOCKED_EXAM_TEMPLATE_ITEM = MOCKED_EXAM_TEMPLATE(1);
const MOCKED_PARAMETER_ITEM = MOCKED_SHORT_PARAMETER();
const MOCKED_RANDOM_MEASURE_UNIT_NAME = faker.random.alphaNumeric(5);

const MOCKED_GET_MEASURE_UNITS_LIST = mockFunction(getMeasureUnitsList);
const MOCKED_DELETE_MEASURE_UNIT = mockFunction(deleteMeasureUnit);
const MOCKED_CREATE_MEASURE_UNIT = mockFunction(createMeasureUnit);
const MOCKED_PATCH_MEASURE_UNIT = mockFunction(patchMeasureUnit);

mockFunction(getMeasureUnitDetails).mockReturnValue(MOCKED_GET_MEASURE_UNIT_DETAILS_REQUEST);
mockFunction(getExamTemplatesByMeasureUnitId).mockReturnValue(MOCKED_GET_EXAM_TEMPLATES_BY_MEASURE_UNIT_ID_REQUEST);
mockFunction(getParamsByMeasureUnitId).mockReturnValue(MOCKED_GET_PARAMS_BY_MEASURE_UNIT_ID_REQUEST);
jest.mock("../../../api/measureUnits");
jest.mock("next/router", () => ({
    events: {
        ...jest.requireActual("next/router").events,
    },
    useRouter() {
        return {
            query: MOCKED_QUERY(),
            push: MOCKED_PUSH,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            replace: jest.fn(),
            route: "",
            asPath: "",
        };
    },
}));

const setup = (locationProps = {}) => {
    const queryClient = new QueryClient();
    defineLocationProps(locationProps);
    render(
        <QueryClientProvider client={queryClient}>
            <MeasureUnitsModule />
        </QueryClientProvider>
    );
};

describe("MeasureUnitsModule", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        MOCKED_QUERY.mockReturnValue({});

        MOCKED_PATCH_MEASURE_UNIT.mockReturnValue(MOCKED_PATCH_MEASURE_UNIT_REQUEST);

        resolveServerResponse(MOCKED_PATCH_MEASURE_UNIT_REQUEST, { data: {} });

        resolveServerResponse(MOCKED_GET_MEASURE_UNITS_LIST, {
            data: MOCKED_MEASUREMENT_UNITS,
        });
        resolveServerResponse(MOCKED_GET_MEASURE_UNIT_DETAILS_REQUEST, {
            data: MOCKED_MEASURE_UNIT,
        });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_MEASURE_UNIT_ID_REQUEST, {
            data: [],
        });
        resolveServerResponse(MOCKED_GET_PARAMS_BY_MEASURE_UNIT_ID_REQUEST, {
            data: [],
        });
    });

    afterEach(async () => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        const { result } = renderHook(() => useContext(MeasureUnitsStoreContext));
        await act(async () => {
            result.current.measureUnitsStore.resetMeasureUnitsFilter();
        });
    });

    it("Should render table component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("name-filter-input")).toBeInTheDocument();
        expect(screen.getAllByTestId("action-button")[0]).toBeInTheDocument();
    });

    it("Should call getMeasureUnitsList, with filters", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("name-filter-input"), MOCKED_RANDOM_MEASURE_UNIT_NAME);
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_GET_MEASURE_UNITS_LIST).toBeCalledWith(
            1,
            stringify({ search_string: MOCKED_RANDOM_MEASURE_UNIT_NAME })
        );
    });

    it.each([
        {
            setupSearchString: "?page=1&order_by=name&order_way=asc",
            expectedSearchString: "order_by=name&order_way=asc",
        },
        {
            setupSearchString: "?page=1&order_by=name&order_way=desc",
            expectedSearchString: "order_by=name&order_way=desc",
        },
        {
            setupSearchString: "?page=1&order_by=name&order_way=some_another_value",
            expectedSearchString: "order_by=name&order_way=asc",
        },
        {
            setupSearchString: "?page=1&order_way=desc",
            expectedSearchString: "",
        },
        {
            setupSearchString: "?page=1&order_by=name",
            expectedSearchString: "order_by=name&order_way=asc",
        },
    ])(
        "Should call getMeasureUnitsList request with different sorting queries from pathname",
        async ({ setupSearchString, expectedSearchString }) => {
            await act(async () => {
                setup({
                    search: setupSearchString,
                });
            });

            expect(MOCKED_GET_MEASURE_UNITS_LIST).toHaveBeenCalledWith(1, expectedSearchString);
        }
    );

    it("Should call getMeasureUnitsList request with queries from pathname and setup filters according to query params", async () => {
        MOCKED_QUERY.mockReturnValue({
            page: 2,
            name: MOCKED_RANDOM_MEASURE_UNIT_NAME,
        });

        await act(async () => {
            setup({
                search: `?page=2&search_string=${MOCKED_RANDOM_MEASURE_UNIT_NAME}`,
            });
        });

        expect(MOCKED_GET_MEASURE_UNITS_LIST).toHaveBeenCalledWith(
            2,
            `search_string=${MOCKED_RANDOM_MEASURE_UNIT_NAME}`
        );

        expect(screen.getByTestId("name-filter-input")).toHaveValue(MOCKED_RANDOM_MEASURE_UNIT_NAME);
    });

    it("Should call deleteMeasureUnit", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("delete-measure-unit"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DELETE_MEASURE_UNIT).toBeCalledWith(MOCKED_MEASURE_UNIT.id);
    });

    it("Should show delete dialog with attached exam template without option to delete measure unit", async () => {
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_MEASURE_UNIT_ID_REQUEST, {
            data: [MOCKED_EXAM_TEMPLATE_ITEM],
        });
        resolveServerResponse(MOCKED_GET_PARAMS_BY_MEASURE_UNIT_ID_REQUEST, {
            data: [MOCKED_PARAMETER_ITEM],
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("delete-measure-unit"));
        });

        expect(screen.getByTestId(`examination-template-item-${MOCKED_EXAM_TEMPLATE_ITEM.uuid}`)).toBeInTheDocument();
        expect(screen.getByTestId(`param-item-${MOCKED_PARAMETER_ITEM.uuid}`)).toBeInTheDocument();

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DELETE_MEASURE_UNIT).not.toBeCalled();
    });

    it("Should call createMeasureUnit", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("add-measure-unit-button"));
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("create-name-input"), MOCKED_RANDOM_MEASURE_UNIT_NAME);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_CREATE_MEASURE_UNIT).toBeCalledWith({ name: MOCKED_RANDOM_MEASURE_UNIT_NAME });
    });

    it("Should call patchMeasureUnit", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("edit-measure-unit"));
        });

        await act(async () => {
            userEvent.clear(screen.getByTestId("edit-name-input"));
            userEvent.paste(screen.getByTestId("edit-name-input"), MOCKED_RANDOM_MEASURE_UNIT_NAME);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_PATCH_MEASURE_UNIT).toBeCalledWith(MOCKED_MEASURE_UNIT.id);
        expect(MOCKED_PATCH_MEASURE_UNIT_REQUEST).toBeCalledWith({ name: MOCKED_RANDOM_MEASURE_UNIT_NAME });
    });
});
