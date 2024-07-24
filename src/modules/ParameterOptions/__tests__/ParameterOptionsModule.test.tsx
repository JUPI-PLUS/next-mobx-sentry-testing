// libs
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { stringify } from "query-string";

// components
import ParameterOptionsModule from "../ParameterOptionsModule";

// api
import {
    assignedParametersToOption,
    createParameterOption,
    deleteParameterOption,
    listOfParameterOptions,
    updateParameterOption,
} from "../../../api/parameterOptions";

// helpers
import { mockFunction, rejectServerResponse, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { showSuccessToast } from "../../../components/uiKit/Toast/helpers";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";

const MOCKED_LIST_OF_PARAMETERS_OPTIONS = mockFunction(listOfParameterOptions);
const MOCKED_CREATE_PARAMETER_OPTION = mockFunction(createParameterOption);
const MOCKED_UPDATE_PARAMETER_OPTION = mockFunction(updateParameterOption);
const MOCKED_UPDATE_PARAMETER_OPTION_MUTATION_CALLER = jest.fn();
const MOCKED_DELETE_PARAMETER_OPTION = mockFunction(deleteParameterOption);
const MOCKED_ASSIGNED_PARAMETERS_TO_OPTION = mockFunction(assignedParametersToOption);
const MOCKED_UPDATE_PARAMETER_OPTION_QUERY_CALLER = jest.fn();
const MOCKED_SHOW_SUCCESS_TOAST_MESSAGE = mockFunction(showSuccessToast);
const MOCKED_PARAMETER_OPTIONS = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(20),
}));
const MOCKED_QUERY = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();

const MOCKED_PARAMETER_OPTION_NAME = faker.random.alpha(10);

jest.mock("../../../api/parameterOptions");
jest.mock("../../../components/uiKit/Toast/helpers");
jest.mock("next/router", () => ({
    events: {
        ...jest.requireActual("next/router").events,
    },
    useRouter() {
        return {
            push: jest.fn(),
            replace: MOCK_ROUTER_REPLACE,
            query: MOCKED_QUERY(),
            route: "",
            asPath: "",
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const setup = (locationProps = {}) => {
    const queryClient = new QueryClient();
    defineLocationProps(locationProps);
    render(
        <QueryClientProvider client={queryClient}>
            <ParameterOptionsModule />
        </QueryClientProvider>
    );
};

describe("ParameterOptionsModule", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        resolveServerResponse(MOCKED_LIST_OF_PARAMETERS_OPTIONS, {
            data: MOCKED_PARAMETER_OPTIONS,
            total: MOCKED_PARAMETER_OPTIONS.length,
        });
        MOCKED_QUERY.mockReturnValue({});
        jest.useFakeTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it("Should render without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText(MOCKED_PARAMETER_OPTIONS[0].name)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_PARAMETER_OPTIONS[4].name)).toBeInTheDocument();
        expect(screen.getByTestId("create-option-button")).toBeInTheDocument();
    });

    it("Should call fetch list of parameter options request with name filter", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("name-filter-input"), MOCKED_PARAMETER_OPTION_NAME);
            jest.runOnlyPendingTimers();
        });

        await waitFor(() =>
            expect(MOCKED_LIST_OF_PARAMETERS_OPTIONS).toHaveBeenCalledWith(1, `name=${MOCKED_PARAMETER_OPTION_NAME}`)
        );

        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(
            {
                hash: "",
                query: stringify({ page: 1, name: MOCKED_PARAMETER_OPTION_NAME }),
            },
            undefined,
            { shallow: true }
        );
    });

    it("Should call fetch list of parameter options request with queries from pathname and setup filters according to query params", async () => {
        MOCKED_QUERY.mockReturnValue({
            page: 2,
            name: MOCKED_PARAMETER_OPTION_NAME,
        });

        await act(async () => {
            setup({ search: `?page=2&name=${MOCKED_PARAMETER_OPTION_NAME}` });
        });

        await waitFor(() =>
            expect(MOCKED_LIST_OF_PARAMETERS_OPTIONS).toHaveBeenCalledWith(2, `name=${MOCKED_PARAMETER_OPTION_NAME}`)
        );

        expect(screen.getByTestId("name-filter-input")).toHaveValue(MOCKED_PARAMETER_OPTION_NAME);
    });

    it("Should call createParameterOption callback on create option", async () => {
        resolveServerResponse(MOCKED_CREATE_PARAMETER_OPTION, { data: { name: "" } });
        const expectedOptionName = faker.random.alpha(10);
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("create-option-button"));
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("option-name-field"), expectedOptionName);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_CREATE_PARAMETER_OPTION).toHaveBeenCalledWith({ name: expectedOptionName });
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
    });

    it("Should show validation error if user tries to create option with name that already exist", async () => {
        const mockedErrorMessage = "This name already been taken";
        rejectServerResponse(MOCKED_CREATE_PARAMETER_OPTION, {
            response: { data: { errors: [{ field: "name", message: mockedErrorMessage }] } },
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("create-option-button"));
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("option-name-field"), faker.random.alpha(10));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(screen.getByTestId("field-name-error-container")).toBeInTheDocument();
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
    });

    it("Should show validation error on input special characters", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("create-option-button"));
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("option-name-field"), "!@#$%^&*");
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(screen.getByTestId("field-name-error-container")).toBeInTheDocument();
        expect(MOCKED_CREATE_PARAMETER_OPTION).not.toHaveBeenCalled();
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
    });

    it("Should call updateParameterOption callback on update option", async () => {
        resolveServerResponse(MOCKED_UPDATE_PARAMETER_OPTION_MUTATION_CALLER, { data: { name: "" } });
        MOCKED_UPDATE_PARAMETER_OPTION.mockReturnValue(MOCKED_UPDATE_PARAMETER_OPTION_MUTATION_CALLER);
        const expectedOptionName = faker.random.alpha(10);
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("edit-option"));
        });

        await act(async () => {
            userEvent.clear(screen.getByTestId("option-name-field"));
            userEvent.paste(screen.getByTestId("option-name-field"), expectedOptionName);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_UPDATE_PARAMETER_OPTION_MUTATION_CALLER).toHaveBeenCalledWith({ name: expectedOptionName });
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
    });

    it("Should show validation error if user tries to edit option with name that already exist", async () => {
        const mockedErrorMessage = "This name already been taken";
        rejectServerResponse(MOCKED_UPDATE_PARAMETER_OPTION_MUTATION_CALLER, {
            response: { data: { errors: [{ field: "name", message: mockedErrorMessage }] } },
        });
        MOCKED_UPDATE_PARAMETER_OPTION.mockReturnValue(MOCKED_UPDATE_PARAMETER_OPTION_MUTATION_CALLER);
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("edit-option"));
        });

        await act(async () => {
            userEvent.clear(screen.getByTestId("option-name-field"));
            userEvent.paste(screen.getByTestId("option-name-field"), faker.random.alpha(10));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(screen.getByTestId("field-name-error-container")).toBeInTheDocument();
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).not.toHaveBeenCalled();
    });

    it("Should delete option that no assigned to any parameter", async () => {
        resolveServerResponse(MOCKED_DELETE_PARAMETER_OPTION, {});
        MOCKED_ASSIGNED_PARAMETERS_TO_OPTION.mockReturnValue(MOCKED_UPDATE_PARAMETER_OPTION_QUERY_CALLER);
        resolveServerResponse(MOCKED_UPDATE_PARAMETER_OPTION_QUERY_CALLER, { data: [] });
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("delete-option"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_DELETE_PARAMETER_OPTION).toHaveBeenCalled();
        expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
    });

    it("Should show list of parameters to which option was assigned on delete option", async () => {
        const mockedParameters = [
            {
                id: 1,
                uuid: faker.datatype.uuid(),
                si_measurement_units_id: 1,
                name: faker.random.alpha(10),
                code: faker.random.alpha(10),
                biological_reference_intervals: faker.random.alpha(10),
                notes: null,
                type_id: 1,
                type_view_id: 1,
                is_printable: false,
                is_required: false,
            },
        ];
        resolveServerResponse(MOCKED_DELETE_PARAMETER_OPTION, {});
        MOCKED_ASSIGNED_PARAMETERS_TO_OPTION.mockReturnValue(MOCKED_UPDATE_PARAMETER_OPTION_QUERY_CALLER);
        resolveServerResponse(MOCKED_UPDATE_PARAMETER_OPTION_QUERY_CALLER, { data: mockedParameters });
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByTestId("action-button")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("delete-option"));
        });

        expect(screen.getByText(mockedParameters[0].name)).toBeInTheDocument();
        expect(screen.getByText(mockedParameters[0].code)).toBeInTheDocument();
    });
});
