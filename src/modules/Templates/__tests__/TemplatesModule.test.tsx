// libs
import React from "react";
import { stringify } from "query-string";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { act, render, screen } from "@testing-library/react";

// mocks
import { MOCKED_LIST_OF_TEMPLATES, MOCKED_TEMPLATE } from "../../../testingInfrustructure/mocks/templates";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import {
    createGroup,
    deleteTemplate,
    getListOfTemplates,
    getParentsOfTemplate,
    moveGroupToParent,
    patchTemplate,
} from "../../../api/templates";
import { moveKitTemplatesToGroup } from "../../../api/kits";
import { moveExamTemplatesToGroup } from "../../../api/exams";
import { getExamTemplateStatuses, getKitTemplateStatuses } from "../../../api/dictionaries";

// constants
import { ROUTES } from "../../../shared/constants/routes";

// models
import { TemplateTypeEnum } from "../../../shared/models/business/template";

// components
import TemplatesModule from "../TemplatesModule";
import { MOCKED_EXAM_TEMPLATE_STATUSES } from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_KIT_TEMPLATE_STATUSES } from "../../../testingInfrustructure/mocks/kits";

const MOCKED_GET_LIST_OF_TEMPLATES = mockFunction(getListOfTemplates);
const MOCKED_GET_PARENTS_OF_TEMPLATE = mockFunction(getParentsOfTemplate);
const MOCKED_DELETE_TEMPLATE_GROUP = mockFunction(deleteTemplate);
const MOCKED_GET_EXAM_TEMPLATE_STATUSES = mockFunction(getExamTemplateStatuses);
const MOCKED_GET_KIT_TEMPLATE_STATUSES = mockFunction(getKitTemplateStatuses);
const MOCKED_QUERY = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_PATCH_TEMPLATE_GROUP_REQUEST = jest.fn();
const MOCKED_PATCH_TEMPLATE_GROUP = mockFunction(patchTemplate).mockImplementation(
    () => MOCKED_PATCH_TEMPLATE_GROUP_REQUEST
);
const MOCKED_CREATE_TEMPLATE_GROUP = mockFunction(createGroup);
const MOCK_GROUP_WITHOUT_CHILD = MOCKED_TEMPLATE({ item_type: TemplateTypeEnum.GROUP, has_child: false });
const MOCK_GROUP_WITH_CHILD = MOCKED_TEMPLATE({ item_type: TemplateTypeEnum.GROUP, has_child: true });
const MOCK_EXAM_TEMPLATE = MOCKED_TEMPLATE({ item_type: TemplateTypeEnum.EXAM });
const MOCK_KIT_TEMPLATE = MOCKED_TEMPLATE({ item_type: TemplateTypeEnum.KIT });
const MOCK_MOVE_GROUP = mockFunction(moveGroupToParent);
const MOCK_MOVE_EXAM = mockFunction(moveExamTemplatesToGroup);
const MOCK_MOVE_KIT = mockFunction(moveKitTemplatesToGroup);
const MOCK_GROUP_NAME = faker.random.alpha(10);
// text on dropdown actions
const DELETE_ACTION_TEXT = "Delete";
const EDIT_ACTION_TEXT = "Edit";
const MOVE_TO_ACTION_TEXT = "Move to";

jest.spyOn(React, "useId").mockImplementation(() => "");
jest.mock("../../../api/templates");
jest.mock("../../../api/kits");
jest.mock("../../../api/exams");
jest.mock("../../../api/dictionaries");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: MOCKED_QUERY(),
            push: MOCKED_PUSH,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <TemplatesModule />
        </QueryClientProvider>
    );
    return container;
};

describe("TemplatesModule", () => {
    beforeEach(() => {
        MOCKED_QUERY.mockReturnValue({});
    });
    beforeAll(() => {
        jest.useFakeTimers();
        resolveServerResponse(MOCKED_GET_LIST_OF_TEMPLATES, {
            data: [MOCK_GROUP_WITH_CHILD, MOCK_GROUP_WITHOUT_CHILD, MOCK_EXAM_TEMPLATE, MOCK_KIT_TEMPLATE],
        });
        resolveServerResponse(MOCKED_GET_PARENTS_OF_TEMPLATE, {
            data: MOCKED_LIST_OF_TEMPLATES,
        });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATE_STATUSES, {
            data: MOCKED_EXAM_TEMPLATE_STATUSES,
        });
        resolveServerResponse(MOCKED_GET_KIT_TEMPLATE_STATUSES, {
            data: MOCKED_KIT_TEMPLATE_STATUSES,
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    describe("TemplatesModule Header", () => {
        it("Should render header component without errors", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            const statusSelectInput = renderResult!.querySelector("#react-select-status-input") as HTMLSelectElement;

            expect(statusSelectInput).toBeInTheDocument();
            expect(screen.getByTestId("search-filter-input")).toBeInTheDocument();
        });

        it("Should call templates list request with filters", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            const templateCode = faker.random.alpha(5);

            const statusSelectInput = renderResult!.querySelector("#react-select-status-input") as HTMLSelectElement;

            expect(statusSelectInput).toBeInTheDocument();

            await act(async () => {
                userEvent.click(statusSelectInput);
            });

            await act(async () => {
                userEvent.click(renderResult!.querySelector("#react-select-status-option-0")!);
            });

            await act(async () => {
                userEvent.type(screen.getByTestId("search-filter-input"), templateCode);
                jest.runOnlyPendingTimers();
            });

            expect(MOCKED_GET_LIST_OF_TEMPLATES).lastCalledWith(
                stringify({ name: templateCode, status: MOCKED_EXAM_TEMPLATE_STATUSES[0].id })
            );
        });
    });

    describe("TemplatesModule Table", () => {
        it("Should render table component without errors", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_GROUP_WITH_CHILD.uuid)).toBeInTheDocument();
            expect(screen.getByTestId(MOCK_GROUP_WITHOUT_CHILD.uuid)).toBeInTheDocument();
            expect(screen.getByTestId(MOCK_EXAM_TEMPLATE.uuid)).toBeInTheDocument();
            expect(screen.getByTestId(MOCK_KIT_TEMPLATE.uuid)).toBeInTheDocument();
        });

        it("Should call getListOfTemplates request with group_uuid from query parameter", async () => {
            MOCKED_QUERY.mockReturnValue({ folder: MOCK_GROUP_WITH_CHILD.uuid });
            await act(async () => {
                setup();
            });

            expect(MOCKED_GET_LIST_OF_TEMPLATES).lastCalledWith(stringify({ group_uuid: MOCK_GROUP_WITH_CHILD.uuid }));
        });

        it("Should call router push with query parameters, after double click on group", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_GROUP_WITH_CHILD.uuid)).toBeInTheDocument();
            await act(async () => {
                userEvent.dblClick(screen.getByText(MOCK_GROUP_WITH_CHILD.name));
            });

            expect(MOCKED_PUSH).toHaveBeenLastCalledWith({ query: stringify({ folder: MOCK_GROUP_WITH_CHILD.uuid }) });
        });

        it("Should call router push with query parameters, after double click on kit", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_KIT_TEMPLATE.uuid)).toBeInTheDocument();
            await act(async () => {
                userEvent.dblClick(screen.getByText(MOCK_KIT_TEMPLATE.name));
            });

            expect(MOCKED_PUSH).toHaveBeenLastCalledWith({
                pathname: ROUTES.editKitTemplate.route,
                query: { uuid: MOCK_KIT_TEMPLATE.uuid },
            });
        });

        it("Should call router push with query parameters, after double click on exam", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_EXAM_TEMPLATE.uuid)).toBeInTheDocument();
            await act(async () => {
                userEvent.dblClick(screen.getByText(MOCK_EXAM_TEMPLATE.name));
            });

            expect(MOCKED_PUSH).toHaveBeenLastCalledWith({
                pathname: ROUTES.examTemplate.edit.route,
                query: { uuid: MOCK_EXAM_TEMPLATE.uuid },
            });
        });

        it("Should call deleteTemplate after click on delete action", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_GROUP_WITHOUT_CHILD.uuid)).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITHOUT_CHILD.uuid}-actions`));
            });

            await act(async () => {
                userEvent.click(screen.getByText(DELETE_ACTION_TEXT));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_DELETE_TEMPLATE_GROUP).toHaveBeenCalledWith(MOCK_GROUP_WITHOUT_CHILD.uuid);
        });

        it("Should call patchTemplate after click on edit action", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_GROUP_WITHOUT_CHILD.uuid)).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITHOUT_CHILD.uuid}-actions`));
            });

            await act(async () => {
                userEvent.click(screen.getByText(EDIT_ACTION_TEXT));
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("edit-template-name-input"));
                userEvent.paste(screen.getByTestId("edit-template-name-input"), MOCK_GROUP_NAME);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_PATCH_TEMPLATE_GROUP).toHaveBeenCalledWith(MOCK_GROUP_WITHOUT_CHILD.uuid);
            expect(MOCKED_PATCH_TEMPLATE_GROUP_REQUEST).toHaveBeenCalledWith({ name: MOCK_GROUP_NAME });
        });

        it("Should call createGroup, after click Add group on action dropdown", async () => {
            await act(async () => {
                setup();
            });

            expect(screen.getByTestId(MOCK_GROUP_WITHOUT_CHILD.uuid)).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITHOUT_CHILD.uuid}-actions`));
            });

            await act(async () => {
                userEvent.hover(screen.getByText("Add"));
            });

            await act(async () => {
                userEvent.click(screen.getByText("Add group"));
            });

            await act(async () => {
                userEvent.paste(screen.getByTestId("add-template-name-input"), MOCK_GROUP_NAME);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_CREATE_TEMPLATE_GROUP).toHaveBeenCalledWith({
                name: MOCK_GROUP_NAME,
                parent_uuid: MOCK_GROUP_WITHOUT_CHILD.uuid,
            });
        });

        it("Should call moveGroupToParent, after insert group to group", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITHOUT_CHILD.uuid}-actions`));
            });

            await act(async () => {
                userEvent.click(screen.getByText(MOVE_TO_ACTION_TEXT));
            });

            expect(screen.getByTestId("paste-here-btn")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITH_CHILD.uuid}-insert-icon`));
            });

            expect(screen.getByTestId("template-paste-text")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCK_MOVE_GROUP).toHaveBeenLastCalledWith({
                body: {
                    parent_uuid: MOCK_GROUP_WITH_CHILD.uuid,
                },
                uuid: MOCK_GROUP_WITHOUT_CHILD.uuid,
            });
        });

        it("Should call moveExamTemplatesToGroup, after insert exam template to group", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_EXAM_TEMPLATE.uuid}-actions`));
            });

            await act(async () => {
                userEvent.click(screen.getByText(MOVE_TO_ACTION_TEXT));
            });

            expect(screen.getByTestId("paste-here-btn")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITH_CHILD.uuid}-insert-icon`));
            });

            expect(screen.getByTestId("template-paste-text")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCK_MOVE_EXAM).toHaveBeenLastCalledWith({
                body: {
                    group_uuid: MOCK_GROUP_WITH_CHILD.uuid,
                },
                uuid: MOCK_EXAM_TEMPLATE.uuid,
            });
        });

        it("Should call moveKitTemplatesToGroup, after insert kit template to group", async () => {
            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_KIT_TEMPLATE.uuid}-actions`));
            });

            await act(async () => {
                userEvent.click(screen.getByText(MOVE_TO_ACTION_TEXT));
            });

            expect(screen.getByTestId("paste-here-btn")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId(`${MOCK_GROUP_WITH_CHILD.uuid}-insert-icon`));
            });

            expect(screen.getByTestId("template-paste-text")).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCK_MOVE_KIT).toHaveBeenLastCalledWith({
                body: {
                    group_uuid: MOCK_GROUP_WITH_CHILD.uuid,
                },
                uuid: MOCK_KIT_TEMPLATE.uuid,
            });
        });
    });
});
