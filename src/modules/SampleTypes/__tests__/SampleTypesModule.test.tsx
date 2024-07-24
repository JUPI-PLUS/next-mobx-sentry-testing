// libs
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { act, render, renderHook, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import { stringify } from "query-string";
import { useContext } from "react";

// stores
import { SampleTypesStoreContext } from "../store";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import {
    deleteSampleType,
    getExamTemplatesBySampleTypeId,
    getSampleTypeDetails,
    getSampleTypesList,
} from "../../../api/sampleTypes";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";

// components
import SampleTypesModule from "../SampleTypesModule";

// mocks
import { MOCKED_SAMPLE_TYPES } from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_EXAM_TEMPLATE } from "../../../testingInfrustructure/mocks/exams";

const MOCKED_QUERY = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST = jest.fn();
const MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST = jest.fn();
const MOCKED_SAMPLE_TYPE = MOCKED_SAMPLE_TYPES[0];
const MOCKED_EXAM_TEMPLATE_ITEM = MOCKED_EXAM_TEMPLATE(1);
const MOCKED_RANDOM_SAMPLE_TYPE_NAME = faker.random.alphaNumeric(5);

const MOCKED_GET_SAMPLE_TYPES_LIST = mockFunction(getSampleTypesList);
const MOCKED_DELETE_SAMPLE_TYPE = mockFunction(deleteSampleType);

mockFunction(getSampleTypeDetails).mockReturnValue(MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST);
mockFunction(getExamTemplatesBySampleTypeId).mockReturnValue(MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST);
jest.mock("../../../api/sampleTypes");
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
            <SampleTypesModule />
        </QueryClientProvider>
    );
};

describe("SampleTypesModule", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES_LIST, {
            data: MOCKED_SAMPLE_TYPES,
        });
        MOCKED_QUERY.mockReturnValue({});
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST, {
            data: MOCKED_SAMPLE_TYPE,
        });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST, {
            data: [],
        });
    });

    afterEach(async () => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        const { result } = renderHook(() => useContext(SampleTypesStoreContext));
        await act(async () => {
            result.current.sampleTypesStore.resetSampleTypesFilter();
        })
    });

    it("Should render table component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("name-filter-input")).toBeInTheDocument();
        expect(screen.getAllByTestId("action-button")[0]).toBeInTheDocument();
    });

    it("Should call getSampleTypesList, with filters", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("name-filter-input"), MOCKED_RANDOM_SAMPLE_TYPE_NAME);
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_GET_SAMPLE_TYPES_LIST).toBeCalledWith(1, stringify({ name: MOCKED_RANDOM_SAMPLE_TYPE_NAME }));
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
        "Should call getSampleTypesList request with different sorting queries from pathname",
        async ({ setupSearchString, expectedSearchString }) => {
            await act(async () => {
                setup({
                    search: setupSearchString,
                });
            });

            expect(MOCKED_GET_SAMPLE_TYPES_LIST).toHaveBeenCalledWith(1, expectedSearchString);
        }
    );

    it("Should call getSampleTypesList request with queries from pathname and setup filters according to query params", async () => {
        MOCKED_QUERY.mockReturnValue({
            page: 2,
            name: MOCKED_RANDOM_SAMPLE_TYPE_NAME,
        });

        await act(async () => {
            setup({
                search: `?page=2&name=${MOCKED_RANDOM_SAMPLE_TYPE_NAME}`,
            });
        });

        expect(MOCKED_GET_SAMPLE_TYPES_LIST).toHaveBeenCalledWith(2, `name=${MOCKED_RANDOM_SAMPLE_TYPE_NAME}`);

        expect(screen.getByTestId("name-filter-input")).toHaveValue(MOCKED_RANDOM_SAMPLE_TYPE_NAME);
    });

    it("Should call deleteSampleType", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("delete-sample-type"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DELETE_SAMPLE_TYPE).toBeCalledWith(MOCKED_SAMPLE_TYPE.id);
    });

    it("Should show delete dialog with attached exam template without option to delete sample type", async () => {
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST, {
            data: [MOCKED_EXAM_TEMPLATE_ITEM],
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("delete-sample-type"));
        });

        expect(screen.getByTestId(`examination-template-item-${MOCKED_EXAM_TEMPLATE_ITEM.uuid}`)).toBeInTheDocument();

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DELETE_SAMPLE_TYPE).not.toBeCalled();
    });
});
