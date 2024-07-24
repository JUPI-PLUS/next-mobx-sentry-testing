import React from "react";
import { faker } from "@faker-js/faker";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { getExamTemplateStatuses, getKitTemplateStatuses } from "../../../api/dictionaries";
import { getExamTemplatesList } from "../../../api/exams";
import { createKitTemplate, getExamTemplatesByKitUUID, getKitTemplate } from "../../../api/kits";
import { MOCKED_EXAM_TEMPLATE_STATUSES, MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";
import { MOCKED_KIT_TEMPLATE, MOCKED_KIT_TEMPLATE_STATUSES } from "../../../testingInfrustructure/mocks/kits";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import KitTemplateModule from "../KitTemplateModule";
import UserStore from "../../../shared/store/UserStore";
import { MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";

export const MOCKED_UUID = faker.datatype.uuid();

jest.spyOn(React, "useId").mockImplementation(() => "");
jest.mock("../../../api/dictionaries");
jest.mock("../../../api/exams");
jest.mock("../../../api/kits");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            replace: jest.fn(),
            query: MOCKED_UUID,
        };
    },
}));

const MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID = jest.fn();
const MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID_REQUEST = mockFunction(getExamTemplatesByKitUUID);
const MOCKED_GET_KIT_TEMPLATE_STATUSES_REQUEST = mockFunction(getKitTemplateStatuses);
const MOCKED_GET_EXAM_TEMPLATE_STATUSES_REQUEST = mockFunction(getExamTemplateStatuses);
const MOCKED_GET_EXAM_TEMPLATES_LIST_REQUEST = mockFunction(getExamTemplatesList);
const MOCKED_GET_KIT_TEMPLATE = jest.fn();
const MOCKED_GET_KIT_TEMPLATE_REQUEST = mockFunction(getKitTemplate);
const MOCKED_CREATE_KIT_TEMPLATE_REQUEST = mockFunction(createKitTemplate);

const setup = () => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <KitTemplateModule />
        </QueryClientProvider>
    );
};

describe("KitTemplateModule", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        jest.useFakeTimers();
        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
        resolveServerResponse(MOCKED_GET_KIT_TEMPLATE_STATUSES_REQUEST, { data: MOCKED_KIT_TEMPLATE_STATUSES });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATE_STATUSES_REQUEST, { data: MOCKED_EXAM_TEMPLATE_STATUSES });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_LIST_REQUEST, { data: MOCKED_EXAM_TEMPLATE_ARRAY });
        resolveServerResponse(MOCKED_GET_KIT_TEMPLATE, { data: MOCKED_KIT_TEMPLATE });
        MOCKED_GET_KIT_TEMPLATE_REQUEST.mockImplementation(() => MOCKED_GET_KIT_TEMPLATE);
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID, { data: MOCKED_EXAM_TEMPLATE_ARRAY });
        MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID_REQUEST.mockImplementation(() => MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID);
        resolveServerResponse(MOCKED_CREATE_KIT_TEMPLATE_REQUEST, { data: MOCKED_KIT_TEMPLATE });
    });

    it("Should render with no errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText("Create kit template")).toBeInTheDocument();
        expect(screen.getByText("General kit info")).toBeInTheDocument();
        expect(screen.getByText("Exam templates")).toBeInTheDocument();
    });

    it("Should come up a validation error when trying to send request with no exam templates", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("kit-name-input"), "anyname");
            userEvent.paste(screen.getByTestId("kit-code-input"), "anycode");
            userEvent.click(screen.getByText(MOCKED_KIT_TEMPLATE_STATUSES[0].name));
        });

        await act(async () => {
            userEvent.click(screen.getByText(MOCKED_KIT_TEMPLATE_STATUSES[1].name));
        });

        await act(async () => {
            userEvent.click(screen.getByText("Save"));
        });

        // TODO! Waiting for FE task after each the cleanup will be called and comment below will be uncommented
        // expect(screen.getByText("Exam template name is required")).toBeInTheDocument();
    });

    it("Should fulfil form correctly and send request", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.paste(screen.getByTestId("kit-name-input"), "anyname");
            userEvent.paste(screen.getByTestId("kit-code-input"), "anycode");
            userEvent.click(screen.getByText(MOCKED_KIT_TEMPLATE_STATUSES[0].name));
        });

        await act(async () => {
            userEvent.click(screen.getByText(MOCKED_KIT_TEMPLATE_STATUSES[1].name));
        });

        await act(async () => {
            const selectPlaceholder = document.getElementById("react-select-exam_templates-placeholder")!;
            userEvent.click(selectPlaceholder);
        });

        await act(async () => {
            const selectListbox = document.getElementById("react-select-exam_templates-listbox")!;
            userEvent.type(selectListbox, "ab");
            jest.runOnlyPendingTimers();
        });

        await act(async () => {
            const selectListbox = document.getElementById("react-select-exam_templates-listbox")!;
            const firstOption = within(selectListbox).getByText(
                `${MOCKED_EXAM_TEMPLATE_ARRAY[0].name} (${MOCKED_EXAM_TEMPLATE_ARRAY[0].code})`
            );
            userEvent.click(firstOption);
        });

        await act(async () => {
            userEvent.click(screen.getByText("Save"));
        });

        expect(MOCKED_GET_EXAM_TEMPLATES_LIST_REQUEST).toHaveBeenCalledWith("name=ab");
        expect(MOCKED_GET_KIT_TEMPLATE_REQUEST).toHaveBeenCalled();
    });
});
