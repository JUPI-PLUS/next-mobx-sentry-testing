// libs
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import { format, fromUnixTime } from "date-fns";

// helpers
import { details } from "../../../api/users";
import { postOrderKitActivation } from "../../../api/orders";
import { DATE_FORMATS } from "../../../shared/constants/formates";
import { mockFunction, rejectServerResponse, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { addOffsetToUtcDate } from "../../../shared/utils/date";
import { getSexTypes } from "../../../api/dictionaries";
import { getExamsTemplatesByKitCode, getOrderConditionsByKitCode } from "../../../api/kits";

// components
import KitActivationModule from "../KitActivationModule";

// mocks
import { MOCKED_SEX_TYPES } from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCK_PATIENT } from "../../../testingInfrustructure/mocks/users";
import { MOCKED_ORDER_CONDITION } from "../../../testingInfrustructure/mocks/orderConditions";
import { MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";
import { hiddenConditionsArray } from "../models";

const MOCKED_QUERY = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE_REQUEST = jest.fn();
const MOCKED_GET_EXAMS_TEMPLATES_BY_KIT_CODE_REQUEST = jest.fn();
const MOCKED_GET_DETAILS_QUERY_REQUEST = jest.fn();
const ORDER_CONDITIONS = [
    MOCKED_ORDER_CONDITION(1),
    MOCKED_ORDER_CONDITION(2),
    MOCKED_ORDER_CONDITION(3),
    MOCKED_ORDER_CONDITION(4),
];
const MOCKED_RANDOM_KIT_CODE = faker.random.numeric(12);
const MOCKED_RANDOM_KIT_CODE_ERROR_MESSAGE = faker.random.alphaNumeric(12);

const MOCKED_GET_DETAILS = mockFunction(details);
const MOCKED_GET_SEX_TYPES = mockFunction(getSexTypes);
const MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE = mockFunction(getOrderConditionsByKitCode);
const MOCKED_GET_EXAMS_TEMPLATES_BY_KIT_CODE = mockFunction(getExamsTemplatesByKitCode);
const MOCKED_POST_ORDER_KIT_ACTIVATION = mockFunction(postOrderKitActivation);
const randomReferralDoctorText = faker.random.alphaNumeric(10);
const randomReferralNotesText = faker.random.alphaNumeric(10);

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useId: () => "",
}));
jest.mock("../../../api/kits");
jest.mock("../../../api/dictionaries");
jest.mock("../../../api/users");
jest.mock("../../../api/orders");
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

const selectConditions = async () => {
    for (const { name, id, options } of ORDER_CONDITIONS) {
        if (!hiddenConditionsArray.includes(id)) {
            const selectInput = document.getElementById(`react-select-${name}-input`) as HTMLSelectElement;
            if (selectInput) {
                await expect(selectInput).toBeInTheDocument();
                await act(async () => {
                    userEvent.click(selectInput);
                });
                await act(async () => {
                    userEvent.click(screen.getByText(options[0].name));
                });
            }
        }
    }
};

const setup = () => {
    const queryClient = new QueryClient();
    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <KitActivationModule />
        </QueryClientProvider>
    );
    return container;
};

describe("KitActivationModule", () => {
    beforeEach(() => {
        MOCKED_QUERY.mockReturnValue({ userId: MOCK_PATIENT.uuid });

        MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE.mockReturnValue(MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE_REQUEST);
        resolveServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE_REQUEST, { data: ORDER_CONDITIONS });

        MOCKED_GET_EXAMS_TEMPLATES_BY_KIT_CODE.mockReturnValue(MOCKED_GET_EXAMS_TEMPLATES_BY_KIT_CODE_REQUEST);
        resolveServerResponse(MOCKED_GET_EXAMS_TEMPLATES_BY_KIT_CODE_REQUEST, { data: MOCKED_EXAM_TEMPLATE_ARRAY });

        MOCKED_GET_DETAILS.mockReturnValue(MOCKED_GET_DETAILS_QUERY_REQUEST);
        resolveServerResponse(MOCKED_GET_DETAILS_QUERY_REQUEST, { data: MOCK_PATIENT });

        resolveServerResponse(MOCKED_POST_ORDER_KIT_ACTIVATION, { data: {} });
        resolveServerResponse(MOCKED_GET_SEX_TYPES, { data: MOCKED_SEX_TYPES });
    });

    it("Should render table component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("kit-number-input")).toBeInTheDocument();
        expect(screen.getByTestId("kit-number-btn")).toBeInTheDocument();
    });

    it("Should render user details", async () => {
        await act(async () => {
            setup();
        });
        const sexType = MOCKED_SEX_TYPES.find(({ id }) => id === MOCK_PATIENT.sex_id)!;
        expect(screen.getByTestId("patientFullName")).toHaveTextContent(
            `${MOCK_PATIENT.first_name} ${MOCK_PATIENT.last_name}`
        );
        expect(screen.getByTestId("patientBirthday")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCK_PATIENT.birth_date!)), DATE_FORMATS.DATE_ONLY)
        );
        expect(screen.getByTestId("patientSex")).toHaveTextContent(sexType.name);
    });

    it("Should call getOrderConditionsByKitCode and getExamsTemplatesByKitCode with mocked kitCode", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            await userEvent.paste(screen.getByTestId("kit-number-input"), MOCKED_RANDOM_KIT_CODE);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("kit-number-btn"));
        });

        expect(MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE).toHaveBeenLastCalledWith(MOCKED_RANDOM_KIT_CODE);
        expect(MOCKED_GET_EXAMS_TEMPLATES_BY_KIT_CODE).toHaveBeenLastCalledWith(MOCKED_RANDOM_KIT_CODE);
    });

    it("Should show server error under kit code input when code is invalid", async () => {
        rejectServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_KIT_CODE_REQUEST, {
            response: {
                data: {
                    errors: [
                        {
                            field: "kit_number",
                            message: [MOCKED_RANDOM_KIT_CODE_ERROR_MESSAGE],
                        },
                    ],
                    message: "Validation exception",
                    status: "Error",
                },
            },
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            await userEvent.paste(screen.getByTestId("kit-number-input"), MOCKED_RANDOM_KIT_CODE);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("kit-number-btn"));
        });

        expect(screen.getByTestId("field-kit_number-error-container")).toHaveTextContent(
            MOCKED_RANDOM_KIT_CODE_ERROR_MESSAGE
        );
    });

    it("Should call postOrderKitActivation on submit order by kit code", async () => {
        let renderResult: HTMLElement;

        await act(async () => {
            renderResult = setup();
        });

        await act(async () => {
            await userEvent.paste(screen.getByTestId("kit-number-input"), MOCKED_RANDOM_KIT_CODE);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("kit-number-btn"));
        });

        await selectConditions();

        await act(async () => {
            userEvent.paste(screen.getByTestId("referral-doctor"), randomReferralDoctorText);
        });

        await act(async () => {
            userEvent.type(renderResult!.querySelector(".ql-editor")!, randomReferralNotesText);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("activate-order-btn"));
        });

        expect(MOCKED_POST_ORDER_KIT_ACTIVATION).toBeCalledWith({
            kit_number: MOCKED_RANDOM_KIT_CODE,
            order_conditions: ORDER_CONDITIONS.map(condition => ({
                operator: condition.operator,
                value: condition.options[0].id,
                type_id: condition.id,
            })),
            referral_doctor: randomReferralDoctorText,
            referral_notes: `<p>${randomReferralNotesText}</p>`,
            user_uuid: MOCK_PATIENT.uuid,
        });
    });
});
