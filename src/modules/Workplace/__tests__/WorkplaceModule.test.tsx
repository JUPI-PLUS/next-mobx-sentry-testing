// libs
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { faker } from "@faker-js/faker";

// api
import { getExamTemplatesByWorkplaceUUID, getWorkplace, createWorkplace, editWorkplace } from "../../../api/workplaces";
import { getExamTemplatesList } from "../../../api/exams";
import { getExamTemplateStatuses, getGeneralStatuses } from "../../../api/dictionaries";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { showSuccessToast } from "../../../components/uiKit/Toast/helpers";

// constants
import { ROUTES } from "../../../shared/constants/routes";
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";
import { DEFAULT_GENERAL_STATUS_ID } from "../../../shared/constants/dictionaries";

// components
import WorkplaceModule from "../WorkplaceModule";

// mocks
import {
    MOCKED_EXAM_TEMPLATE_STATUSES,
    MOCKED_GENERAL_STATUSES,
} from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_WORKPLACE, MOCKED_WORKPLACE_FIELDS } from "../../../testingInfrustructure/mocks/workplaces";
import { MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";

jest.mock("../../../api/dictionaries");
jest.mock("../../../api/workplaces");
jest.mock("../../../api/exams");
jest.mock("../../../components/uiKit/Toast/helpers");

const MOCKED_GENERAL_STATUSES_REQUEST = mockFunction(getGeneralStatuses);
const MOCKED_GET_EXAM_TEMPLATE_STATUSES = mockFunction(getExamTemplateStatuses);
const MOCKED_GET_EXAM_TEMPLATES_LIST_REQUEST = mockFunction(getExamTemplatesList);
const MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID = mockFunction(getExamTemplatesByWorkplaceUUID);
const MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST = jest.fn();
const MOCKED_GET_WORKPLACE = mockFunction(getWorkplace);
const MOCKED_GET_WORKPLACE_QUERY_REQUEST = jest.fn();
const MOCKED_CREATE_WORKPLACE = mockFunction(createWorkplace);
const MOCKED_EDIT_WORKPLACE = mockFunction(editWorkplace);
const MOCKED_EDIT_WORKPLACE_QUERY_REQUEST = jest.fn();

const MOCKED_SHOW_SUCCESS_TOAST_MESSAGE = mockFunction(showSuccessToast);

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCK_ROUTER_PUSH = jest.fn();
const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_QUERY = jest.fn();

jest.spyOn(React, "useId").mockImplementation(() => "");
jest.mock("next/router", () => ({
    events: {
        on: jest.fn(),
        off: jest.fn(),
    },
    useRouter() {
        return {
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

const setup = () => {
    const queryClient = new QueryClient();

    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <WorkplaceModule />
        </QueryClientProvider>
    );
    return container;
};

describe("Workplace module", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        resolveServerResponse(MOCKED_GENERAL_STATUSES_REQUEST, { data: MOCKED_GENERAL_STATUSES });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATE_STATUSES, { data: MOCKED_EXAM_TEMPLATE_STATUSES });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_LIST_REQUEST, { data: MOCKED_EXAM_TEMPLATE_ARRAY });

        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST, {
            data: MOCKED_EXAM_TEMPLATE_ARRAY,
        });
        MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID.mockReturnValue(
            MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST
        );
        resolveServerResponse(MOCKED_GET_WORKPLACE_QUERY_REQUEST, { data: MOCKED_WORKPLACE });
        MOCKED_GET_WORKPLACE.mockReturnValue(MOCKED_GET_WORKPLACE_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create Workplace", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_CREATE_WORKPLACE, { data: MOCKED_WORKPLACE });
            MOCKED_QUERY.mockReturnValue({});
        });

        it("Should render component without errors and with default status_id selected", async () => {
            let renderResult: HTMLElement;

            await act(async () => {
                renderResult = setup();
            });
            expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Create workplace");

            const statusIdInputValue = renderResult!.querySelector('[name="status_id"]') as HTMLSelectElement;
            expect(statusIdInputValue).toHaveValue(String(DEFAULT_GENERAL_STATUS_ID));
        });

        it("Should fillup form and call createWorkplace request with selected data", async () => {
            let renderResult: HTMLElement;

            await act(async () => {
                renderResult = setup();
            });

            // @ts-ignore
            await fillForm(renderResult);

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-button"));
            });

            const expectedOptions = {
                ...MOCKED_WORKPLACE_FIELDS,
                notes: `<p>${MOCKED_WORKPLACE_FIELDS.notes}</p>`,
                exam_templates_uuids: [MOCKED_EXAM_TEMPLATE_ARRAY[0].uuid],
            };

            expect(MOCKED_CREATE_WORKPLACE).toHaveBeenCalledWith(expectedOptions);
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCK_ROUTER_PUSH).toHaveBeenCalledWith(ROUTES.workplaces.route);
        });

        it("Should not call createWorkplace request when code field was not provided", async () => {
            let renderResult: HTMLElement;

            await act(async () => {
                renderResult = setup();
            });

            // @ts-ignore
            await fillForm(renderResult);

            await act(async () => {
                userEvent.clear(screen.getByTestId("workplace-code-input"));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-button"));
            });
            expect(screen.getByText(VALIDATION_MESSAGES.ENTER_VALID("workplace code"))).toBeInTheDocument();

            expect(MOCKED_CREATE_WORKPLACE).not.toHaveBeenCalled();
        });
    });

    describe("Edit workplace", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_EDIT_WORKPLACE_QUERY_REQUEST, { data: MOCKED_WORKPLACE });
            MOCKED_EDIT_WORKPLACE.mockReturnValue(MOCKED_EDIT_WORKPLACE_QUERY_REQUEST);

            MOCKED_QUERY.mockReturnValue({ uuid: MOCKED_WORKPLACE.uuid });
        });

        it("Should render component without errors and with filled workplace fields", async () => {
            let renderResult: HTMLElement;

            await act(async () => {
                renderResult = setup();
            });

            expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Edit workplace");

            expect(screen.getByTestId("workplace-name-input")).toHaveValue(MOCKED_WORKPLACE.name);
            expect(screen.getByTestId("workplace-code-input")).toHaveValue(MOCKED_WORKPLACE.code);

            const statusIdInputValue = renderResult!.querySelector('[name="status_id"]') as HTMLSelectElement;
            expect(statusIdInputValue).toHaveValue(String(MOCKED_WORKPLACE.status_id));

            expect(screen.getByText(new RegExp(MOCKED_WORKPLACE.notes, "i"))).toBeInTheDocument();

            expect(screen.getByText(MOCKED_EXAM_TEMPLATE_ARRAY[0].name)).toBeInTheDocument();
        });

        it("Should call editWorkplace endpoint when user changes code", async () => {
            const randomCode = faker.random.alpha(10);

            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("workplace-code-input"));
                userEvent.paste(screen.getByTestId("workplace-code-input"), randomCode);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-button"));
            });

            const expectedOptions = {
                ...MOCKED_WORKPLACE_FIELDS,
                notes: `<p>${MOCKED_WORKPLACE_FIELDS.notes}</p>`,
                code: randomCode,
                exam_templates_uuids: MOCKED_EXAM_TEMPLATE_ARRAY.map(({ uuid }) => uuid),
            };

            expect(MOCKED_EDIT_WORKPLACE).toHaveBeenCalledWith(MOCKED_WORKPLACE.uuid);
            expect(MOCKED_EDIT_WORKPLACE_QUERY_REQUEST).toHaveBeenCalledWith(expectedOptions);
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCK_ROUTER_PUSH).toHaveBeenCalledWith(ROUTES.workplaces.route);
        });

        it("Should call editWorkplace endpoint when user deletes exam template", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getAllByTestId("remove-exam-template-button")[0]);
            });
            expect(screen.queryByText(MOCKED_EXAM_TEMPLATE_ARRAY[0].name)).not.toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-button"));
            });

            const expectedExamTemplatesArray = MOCKED_EXAM_TEMPLATE_ARRAY.map(({ uuid }) => uuid);
            expectedExamTemplatesArray.shift();
            const expectedOptions = {
                ...MOCKED_WORKPLACE_FIELDS,
                notes: `<p>${MOCKED_WORKPLACE_FIELDS.notes}</p>`,
                exam_templates_uuids: expectedExamTemplatesArray,
            };

            expect(MOCKED_EDIT_WORKPLACE).toHaveBeenCalledWith(MOCKED_WORKPLACE.uuid);
            expect(MOCKED_EDIT_WORKPLACE_QUERY_REQUEST).toHaveBeenCalledWith(expectedOptions);
            expect(MOCKED_SHOW_SUCCESS_TOAST_MESSAGE).toHaveBeenCalled();
            expect(MOCK_ROUTER_PUSH).toHaveBeenCalledWith(ROUTES.workplaces.route);
        });

        it("Submit button should has disabled state if user didn't make any changes", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId("submit-button")).toBeDisabled();
        });

        it("Should not call editWorkplace endpoint when code field was not provided", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("workplace-code-input"));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-button"));
            });

            expect(screen.getByText(VALIDATION_MESSAGES.ENTER_VALID("workplace code"))).toBeInTheDocument();
            expect(MOCKED_EDIT_WORKPLACE_QUERY_REQUEST).not.toHaveBeenCalled();
        });
    });
});

const fillForm = async (renderResult: HTMLElement) => {
    const selects = screen.queryAllByRole("combobox");

    // name
    await act(async () => {
        userEvent.paste(screen.getByTestId("workplace-name-input"), MOCKED_WORKPLACE_FIELDS.name);
    });

    // code
    await act(async () => {
        userEvent.paste(screen.getByTestId("workplace-code-input"), MOCKED_WORKPLACE_FIELDS.code);
    });

    // status
    await act(async () => {
        userEvent.click(selects[0]);
    });
    await act(async () => {
        userEvent.click(
            screen.getByText(
                MOCKED_GENERAL_STATUSES.find(({ id }) => id === MOCKED_WORKPLACE_FIELDS.status_id)?.name || ""
            )
        );
    });

    // notes

    await act(async () => {
        userEvent.type(renderResult!.querySelector(".ql-editor")!, MOCKED_WORKPLACE_FIELDS.notes);
    });

    // exam templates
    await act(async () => {
        userEvent.click(document.getElementById("react-select-exam_templates-placeholder")!);
    });
    await act(async () => {
        userEvent.type(document.getElementById("react-select-exam_templates-listbox")!, "ab");
        jest.runOnlyPendingTimers();
    });
    await act(async () => {
        userEvent.click(
            screen.getByText(`${MOCKED_EXAM_TEMPLATE_ARRAY[0].name} (${MOCKED_EXAM_TEMPLATE_ARRAY[0].code})`)
        );
    });
};
