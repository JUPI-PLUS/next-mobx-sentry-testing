import React from "react";
import { act, render, screen } from "@testing-library/react";
import CreateOrderModule from "../CreateOrderModule";
import { QueryClient, QueryClientProvider } from "react-query";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { details } from "../../../api/users";
import { getSampleTypes, getSexTypes } from "../../../api/dictionaries";
import { createOrder } from "../../../api/orders";
import { getExamTemplatesByKitUUID, getKitTemplate } from "../../../api/kits";
import { getListOfTemplates } from "../../../api/templates";
import { getOrderConditionsByExamTemplateUUIDs, patchOrderConditions } from "../../../api/orderConditions";
import { MOCKED_SAMPLE_TYPES, MOCKED_SEX_TYPES } from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCK_DELETED_PATIENT, MOCK_PATIENT } from "../../../testingInfrustructure/mocks/users";
import { MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";
import { MOCKED_LIST_OF_TEMPLATES } from "../../../testingInfrustructure/mocks/templates";
import { MOCKED_ORDER_CONDITIONS } from "../../../testingInfrustructure/mocks/orderConditions";
import { format, fromUnixTime } from "date-fns";
import { addOffsetToUtcDate } from "../../../shared/utils/date";
import { DATE_FORMATS } from "../../../shared/constants/formates";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS, hiddenConditionsArray } from "../models";
import { getExamTemplateInfo } from "../../../api/examTemplates";
import { TemplateTypeEnum } from "../../../shared/models/business/template";
import { ROUTES } from "../../../shared/constants/routes";
import { showWarningToast } from "../../../components/uiKit/Toast/helpers";

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCKED_QUERY = jest.fn();
const MOCKED_REPLACE = jest.fn();
const MOCKED_GET_DETAILS = mockFunction(details);
const MOCKED_GET_DETAILS_QUERY_REQUEST = jest.fn();
const MOCKED_GET_SEX_TYPES = mockFunction(getSexTypes);
const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_CREATE_ORDER = mockFunction(createOrder);
const MOCKED_UPDATE_ORDER_CONDITIONS = mockFunction(patchOrderConditions);
const MOCKED_GET_LIST_OF_TEMPLATES = mockFunction(getListOfTemplates);
const MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID = jest.fn();
const MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID_REQUEST = mockFunction(getExamTemplatesByKitUUID);
const MOCKED_GET_KIT_TEMPLATE_BY_UUID = jest.fn();
const MOCKED_GET_KIT_TEMPLATE_BY_UUID_REQUEST = mockFunction(getKitTemplate);
const MOCKED_GET_EXAM_TEMPLATE = jest.fn();
const MOCKED_GET_EXAM_TEMPLATE_REQUEST = mockFunction(getExamTemplateInfo);
const MOCKED_GET_CONDITIONS_BY_EXAM_TEMPLATE_UUIDS = jest.fn();
const MOCKED_GET_CONDITIONS_BY_EXAM_TEMPLATE_UUIDS_REQUEST = mockFunction(getOrderConditionsByExamTemplateUUIDs);
const MOCKED_SHOW_WARNING_TOAST_MESSAGE = mockFunction(showWarningToast);

jest.spyOn(React, "useId").mockImplementation(() => "");
jest.mock("../../../api/config");
jest.mock("../../../api/users");
jest.mock("../../../api/dictionaries");
jest.mock("../../../api/orders");
jest.mock("../../../api/kits");
jest.mock("../../../api/templates");
jest.mock("../../../api/examTemplates");
jest.mock("../../../api/orderConditions");
jest.mock("../../../components/uiKit/Toast/helpers");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REPLACE,
            query: MOCKED_QUERY(),
            push: jest.fn(),
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
            <CreateOrderModule />
        </QueryClientProvider>
    );
    return container;
};

const ORDER_CONDITIONS = MOCKED_ORDER_CONDITIONS;

const MOCKED_KIT = MOCKED_LIST_OF_TEMPLATES.find(template => template.item_type === TemplateTypeEnum.KIT);
const MOCKED_EXAM = MOCKED_LIST_OF_TEMPLATES.find(template => template.item_type === TemplateTypeEnum.EXAM);
const randomReferralDoctorText = faker.random.alphaNumeric(10);
const randomReferralNotesText = faker.random.alphaNumeric(10);

const selectConditions = async () => {
    for (const { name, id, options } of ORDER_CONDITIONS) {
        if (!hiddenConditionsArray.includes(id)) {
            const selectInput = document.getElementById(`react-select-${name}-input`) as HTMLSelectElement;
            if (selectInput) {
                await expect(selectInput).toBeInTheDocument();
                // opening a select
                await act(async () => {
                    userEvent.click(selectInput);
                });
                // choosing an option
                await act(async () => {
                    userEvent.click(screen.getByText(options[0].name));
                });
            }
        }
    }
};

describe("CreateOrder module", () => {
    beforeAll(async () => {
        MOCKED_QUERY.mockReturnValue({ userId: MOCK_PATIENT.uuid });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID, { data: MOCKED_EXAM_TEMPLATE_ARRAY });
        MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID_REQUEST.mockImplementation(() => MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID);
        resolveServerResponse(MOCKED_GET_KIT_TEMPLATE_BY_UUID, { data: MOCKED_KIT });
        MOCKED_GET_KIT_TEMPLATE_BY_UUID_REQUEST.mockImplementation(() => MOCKED_GET_KIT_TEMPLATE_BY_UUID);
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATE, { data: MOCKED_EXAM });
        MOCKED_GET_EXAM_TEMPLATE_REQUEST.mockImplementation(() => MOCKED_GET_EXAM_TEMPLATE);
        resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCK_PATIENT });
        MOCKED_GET_DETAILS.mockReturnValue(MOCKED_GET_DETAILS_QUERY_REQUEST);
        resolveServerResponse(MOCKED_GET_SEX_TYPES, { data: MOCKED_SEX_TYPES });
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES });
        resolveServerResponse(MOCKED_GET_CONDITIONS_BY_EXAM_TEMPLATE_UUIDS, {
            data: ORDER_CONDITIONS,
        });
        MOCKED_GET_CONDITIONS_BY_EXAM_TEMPLATE_UUIDS_REQUEST.mockImplementation(
            () => MOCKED_GET_CONDITIONS_BY_EXAM_TEMPLATE_UUIDS
        );
        resolveServerResponse(MOCKED_CREATE_ORDER, { data: { uuid: faker.datatype.uuid() } });
        jest.useFakeTimers();
    });

    beforeEach(async () => {
        resolveServerResponse(MOCKED_GET_LIST_OF_TEMPLATES, {
            data: MOCKED_LIST_OF_TEMPLATES,
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });
        expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Add order");
    });

    it("Should render user details", async () => {
        await act(async () => {
            setup();
        });
        const sexType = MOCKED_SEX_TYPES?.find(({ id }) => id === MOCK_PATIENT.sex_id);
        // first_name and last_name without mutation
        expect(screen.getByTestId("patientFullName")).toHaveTextContent(
            `${MOCK_PATIENT.first_name} ${MOCK_PATIENT.last_name}`
        );
        // birth_date without mutation
        expect(screen.getByTestId("patientBirthday")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCK_PATIENT.birth_date!)), DATE_FORMATS.DATE_ONLY)
        );
        // patientSex without mutation
        expect(screen.getByTestId("patientSex")).toHaveTextContent(sexType!.name);
    });

    it("Should render every list item without errors", async () => {
        await act(async () => {
            setup();
        });
        for (const { uuid } of MOCKED_LIST_OF_TEMPLATES) {
            expect(screen.getByTestId(`examinationListItem-${uuid}`)).toBeInTheDocument();
        }
    });

    it("Should call createOrder endpoint on submit order", async () => {
        let renderResult: HTMLElement;
        await act(async () => {
            renderResult = setup();
        });
        if (MOCKED_KIT?.uuid) {
            await act(async () => {
                userEvent.click(screen.getByTestId(`examinationListItem-${MOCKED_KIT.uuid}`));
            });
        }

        if (MOCKED_EXAM?.uuid) {
            await act(async () => {
                userEvent.click(screen.getByTestId(`examinationListItem-${MOCKED_EXAM.uuid}`));
            });
        }

        expect(screen.getByTestId("continue-button")).not.toBeDisabled();

        await act(async () => {
            userEvent.click(screen.getByTestId("continue-button"));
        });

        expect(MOCKED_GET_EXAM_TEMPLATES_BY_KIT_UUID).toHaveBeenCalledTimes(1);

        //second step
        expect(MOCKED_GET_CONDITIONS_BY_EXAM_TEMPLATE_UUIDS).toHaveBeenCalledTimes(1);

        await selectConditions();

        await act(async () => {
            userEvent.paste(screen.getByTestId("referral-doctor"), randomReferralDoctorText);
        });
        await act(async () => {
            userEvent.type(renderResult!.querySelector(".ql-editor")!, randomReferralNotesText);
        });

        // 1st step
        expect(screen.getByTestId("continue-button")).not.toBeDisabled();
        await act(async () => {
            userEvent.click(screen.getByTestId("continue-button"));
        });

        // 2st step
        expect(screen.getByTestId("continue-button")).not.toBeDisabled();
        await act(async () => {
            userEvent.click(screen.getByTestId("continue-button"));
        });

        expect(MOCKED_CREATE_ORDER).toHaveBeenCalledWith({
            referral_doctor: randomReferralDoctorText,
            referral_notes: `<p>${randomReferralNotesText}</p>`,
            ...(MOCKED_KIT?.uuid && {
                kit_templates: [
                    {
                        uuid: MOCKED_KIT.uuid,
                        exam_templates: MOCKED_EXAM_TEMPLATE_ARRAY.map(examTemplate => ({
                            uuid: examTemplate.uuid,
                            urgency_id: DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS,
                        })),
                    },
                ],
            }),
            ...(MOCKED_EXAM?.uuid && {
                exam_templates: [{ uuid: MOCKED_EXAM.uuid, urgency_id: DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS }],
            }),
            user_uuid: MOCK_PATIENT.uuid,
        });
        expect(MOCKED_UPDATE_ORDER_CONDITIONS).toHaveBeenCalled();
    });

    it("Should redirect user to orders list page if patient is deleted", async () => {
        resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCK_DELETED_PATIENT });
        await act(async () => {
            setup();
        });
        expect(MOCKED_SHOW_WARNING_TOAST_MESSAGE).toHaveBeenCalled();
        expect(MOCKED_REPLACE).toHaveBeenCalledWith(ROUTES.orders.list.route);
    });
});
