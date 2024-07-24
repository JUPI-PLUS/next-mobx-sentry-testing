// libs
import React, { useContext } from "react";
import { render, screen, act, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { stringify } from "query-string";

// stores
import UserStore from "../../../shared/store/UserStore";
import { WorkplacesStoreContext } from "../store";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { getWorkplacesList, getExamTemplatesByWorkplaceUUID, deleteWorkplace } from "../../../api/workplaces";
import { getExamTemplates, getGeneralStatuses } from "../../../api/dictionaries";
import { showSuccessToast } from "../../../components/uiKit/Toast/helpers";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";

// components
import WorkplacesModule from "../WorkplacesModule";

// constants
import { ROUTES } from "../../../shared/constants/routes";

// mocks
import { MOCKED_GENERAL_STATUSES } from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_WORKPLACES } from "../../../testingInfrustructure/mocks/workplaces";
import { MOCKED_EXAM_TEMPLATES_LOOKUP } from "../../../testingInfrustructure/mocks/examinations-result";
import { MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";
import { MOCKED_EXAM_TEMPLATE } from "../../../testingInfrustructure/mocks/exams";

jest.mock("../../../api/dictionaries");
jest.mock("../../../api/workplaces");
jest.mock("../../../components/uiKit/Toast/helpers");

const MOCKED_WORKPLACES_LIST_REQUEST = mockFunction(getWorkplacesList);
const MOCKED_GENERAL_STATUSES_REQUEST = mockFunction(getGeneralStatuses);
const MOCKED_GET_EXAM_TEMPLATES = mockFunction(getExamTemplates);
const MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID = mockFunction(getExamTemplatesByWorkplaceUUID);
const MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST = jest.fn();
const MOCKED_DELETE_WORKPLACE = mockFunction(deleteWorkplace);
const MOCKED_DELETE_WORKPLACE_QUERY_REQUEST = jest.fn();
const MOCKED_SHOW_SUCCESS_TOAST_MESSAGE = mockFunction(showSuccessToast);

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCK_ROUTER_PUSH = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_QUERY = jest.fn();
const MOCKED_AS_PATH = jest.fn();

const MOCKED_EXAM_TEMPLATE_ITEM = MOCKED_EXAM_TEMPLATE(1);

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
            push: MOCK_ROUTER_PUSH,
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
            <WorkplacesModule />
        </QueryClientProvider>
    );
};

describe("Workplaces module", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
        resolveServerResponse(MOCKED_WORKPLACES_LIST_REQUEST, { data: MOCKED_WORKPLACES, total: 5 });
        resolveServerResponse(MOCKED_GENERAL_STATUSES_REQUEST, { data: MOCKED_GENERAL_STATUSES });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES, { data: MOCKED_EXAM_TEMPLATES_LOOKUP });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST, { data: [] });
        MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID.mockReturnValue(
            MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST
        );
        resolveServerResponse(MOCKED_DELETE_WORKPLACE_QUERY_REQUEST, { data: [] });
        MOCKED_DELETE_WORKPLACE.mockReturnValue(MOCKED_DELETE_WORKPLACE_QUERY_REQUEST);

        MOCKED_QUERY.mockReturnValue({});
        MOCKED_AS_PATH.mockReturnValue("");
    });

    afterEach(() => {
        jest.clearAllMocks();
        const { result } = renderHook(() => useContext(WorkplacesStoreContext));
        result.current.workplacesStore.resetWorkplacesFilters();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText("Workplaces")).toBeInTheDocument();
        expect(screen.getByText(MOCKED_WORKPLACES[0].name)).toBeInTheDocument();
    });

    it("Should call get workplaces list request with search string filter", async () => {
        await act(async () => {
            setup();
        });
        await act(() => {
            userEvent.paste(screen.getByTestId("search-string-filter-input"), MOCKED_WORKPLACES[0].code);
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_WORKPLACES_LIST_REQUEST).toHaveBeenCalledWith(1, `search_string=${MOCKED_WORKPLACES[0].code}`);

        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(
            {
                hash: "",
                query: stringify({
                    page: 1,
                    search_string: MOCKED_WORKPLACES[0].code,
                }),
            },
            undefined,
            { shallow: true }
        );
    });

    it("Should call get workplaces list request with exam template id filter", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByRole("combobox"));
        });

        await act(() => {
            userEvent.click(screen.getByText(MOCKED_EXAM_TEMPLATES_LOOKUP[0].name));
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_WORKPLACES_LIST_REQUEST).toHaveBeenCalledWith(
            1,
            `exam_template_id[]=${MOCKED_EXAM_TEMPLATES_LOOKUP[0].id}`
        );

        expect(MOCK_ROUTER_REPLACE).toHaveBeenNthCalledWith(
            2,
            {
                hash: "",
                query: stringify(
                    {
                        page: 1,
                        exam_template_id: [MOCKED_EXAM_TEMPLATES_LOOKUP[0].id],
                    },
                    {
                        arrayFormat: "bracket",
                    }
                ),
            },
            undefined,
            { shallow: true }
        );
    });

    it.each([
        {
            setupSearchString: "?order_by=search_string&order_way=asc",
            expectedSearchString: "order_by=search_string&order_way=asc",
        },
        {
            setupSearchString: "?order_by=search_string&order_way=desc",
            expectedSearchString: "order_by=search_string&order_way=desc",
        },
        {
            setupSearchString: "?order_by=search_string&order_way=some_another_value",
            expectedSearchString: "order_by=search_string&order_way=asc",
        },
        {
            setupSearchString: "?order_way=desc",
            expectedSearchString: "",
        },
        {
            setupSearchString: "?order_by=search_string",
            expectedSearchString: "order_by=search_string&order_way=asc",
        },
    ])(
        "Should call get workplaces list request with different sorting queries from pathname",
        async ({ setupSearchString, expectedSearchString }) => {
            await act(async () => {
                setup({
                    search: setupSearchString,
                });
            });

            expect(MOCKED_WORKPLACES_LIST_REQUEST).toHaveBeenCalledWith(1, expectedSearchString);
        }
    );

    it("Should call get workplaces list request with queries from pathname and setup filters according to query params", async () => {
        MOCKED_QUERY.mockReturnValue({
            page: 2,
            search_string: MOCKED_WORKPLACES[1].name,
        });

        await act(async () => {
            setup({
                search: `?page=2&search_string=${MOCKED_WORKPLACES[1].name}`,
            });
        });

        expect(MOCKED_WORKPLACES_LIST_REQUEST).toHaveBeenCalledWith(2, `search_string=${MOCKED_WORKPLACES[1].name}`);

        expect(screen.getByTestId("search-string-filter-input")).toHaveValue(MOCKED_WORKPLACES[1].name);
    });

    it("Should push user to edit workplace page by clicking edit", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });
        await act(async () => {
            userEvent.click(screen.getByTestId("edit-workplace"));
        });

        expect(MOCK_ROUTER_PUSH).toHaveBeenCalledWith({
            pathname: ROUTES.workplaces.edit.route,
            query: { uuid: MOCKED_WORKPLACES[0].uuid },
        });
    });

    it("Should show delete dialog and call deleteWorkplace request if workplace doesn't include any exam templates", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });
        await act(async () => {
            userEvent.click(screen.getByTestId("delete-workplace"));
        });

        expect(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID).toHaveBeenCalledWith(MOCKED_WORKPLACES[0].uuid);

        expect(screen.getByTestId("delete-workplace-dialog-text")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DELETE_WORKPLACE_QUERY_REQUEST).toHaveBeenCalled();
        expect(MOCKED_DELETE_WORKPLACE).toHaveBeenCalledWith(MOCKED_WORKPLACES[0].uuid);
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
    });

    it("Should show delete dialog and not call deleteWorkplace request if workplace includes some exam templates", async () => {
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST, {
            data: [MOCKED_EXAM_TEMPLATE_ITEM],
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[1]);
        });
        await act(async () => {
            userEvent.click(screen.getByTestId("delete-workplace"));
        });

        expect(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID).toHaveBeenCalledWith(MOCKED_WORKPLACES[1].uuid);

        expect(screen.getByTestId("restrict-delete-workplace-dialog-text")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCK_ROUTER_PUSH).toHaveBeenCalledWith({
            pathname: ROUTES.workplaces.edit.route,
            query: { uuid: MOCKED_WORKPLACES[1].uuid },
        });
        expect(MOCKED_DELETE_WORKPLACE_QUERY_REQUEST).not.toHaveBeenCalled();
    });
});
