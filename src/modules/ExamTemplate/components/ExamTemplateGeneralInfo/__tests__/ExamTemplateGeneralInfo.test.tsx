// libs
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

// helpers
import {
    createExamTemplate,
    editExamTemplate,
    getExamTemplateInfo,
    getExamTemplateParams,
} from "../../../../../api/examTemplates";
import { mockFunction, resolveServerResponse } from "../../../../../testingInfrustructure/utils";
import { getExamTemplateStatuses, getMeasurementUnits, getSampleTypes } from "../../../../../api/dictionaries";

// models
import { ExamTemplateStatusesEnum } from "../../../../../shared/models/business/examTemplate";

//  constants
import { EXAM_TEMPLATE_TITLES } from "../../../constants";

// components
import ExamTemplateModule from "../../../ExamTemplateModule";

// mocks
import {
    MOCKED_EXAM_TEMPLATE_STATUSES,
    MOCKED_MEASUREMENT_UNITS,
    MOCKED_SAMPLE_TYPES,
} from "../../../../../testingInfrustructure/mocks/dictionaries";
import {
    MOCKED_EXAM_TEMPLATE_INPUT_VALUES,
    MOCKED_EXAM_TEMPLATE_GENERAL_INFO,
} from "../../../../../testingInfrustructure/mocks/examTemplate";

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();

const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_MEASUREMENT_UNITS = mockFunction(getMeasurementUnits);
const MOCKED_GET_EXAM_TEMPLATE_STATUSES = mockFunction(getExamTemplateStatuses);

const MOCKED_EXAM_TEMPLATE_INFO = mockFunction(getExamTemplateInfo);
const MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST = jest.fn();
const MOCKED_EXAM_TEMPLATE_PARAMS = mockFunction(getExamTemplateParams);
const MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST = jest.fn();

const MOCKED_CREATE_EXAM_TEMPLATE = mockFunction(createExamTemplate);
const MOCKED_EDIT_EXAM_TEMPLATE = mockFunction(editExamTemplate);
const MOCKED_EDIT_EXAM_TEMPLATE_QUERY_REQUEST = jest.fn();

const MOCK_QUERY = jest.fn(() => ({ uuid: "" }));

jest.mock("../../../../../api/dictionaries");
jest.mock("../../../../../api/examTemplates");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF,
            },
            query: MOCK_QUERY(),
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();

    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <ExamTemplateModule />
        </QueryClientProvider>
    );
    return container;
};

describe("Exam Template module - step 1 - general info", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES });
        resolveServerResponse(MOCKED_GET_MEASUREMENT_UNITS, { data: MOCKED_MEASUREMENT_UNITS });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATE_STATUSES, { data: MOCKED_EXAM_TEMPLATE_STATUSES });
        resolveServerResponse(MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST, { data: {} });
        MOCKED_EXAM_TEMPLATE_INFO.mockReturnValue(MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST);
        resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, { data: [] });
        MOCKED_EXAM_TEMPLATE_PARAMS.mockReturnValue(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create Exam Template", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_CREATE_EXAM_TEMPLATE, { data: MOCKED_EXAM_TEMPLATE_GENERAL_INFO });
        });

        it("Should render component without errors and with default status_id selected", async () => {
            let renderResult: HTMLElement;

            await act(async () => {
                renderResult = setup();
            });
            expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Create exam template");

            const statusIdInputValue = renderResult!.querySelector('[name="status_id"]') as HTMLSelectElement;
            expect(statusIdInputValue).toHaveValue(String(ExamTemplateStatusesEnum.ACTIVE));
        });

        it("Should fillup general info form and call createExamTemplate endpoint, with changing step on the next one", async () => {
            await act(async () => {
                setup();
            });

            await fillForm();

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });

            const expectedOptions = { ...MOCKED_EXAM_TEMPLATE_GENERAL_INFO };
            // @ts-ignore
            delete expectedOptions.uuid;

            expect(MOCKED_CREATE_EXAM_TEMPLATE).toHaveBeenCalledWith(expectedOptions);
            expect(screen.getByTestId("stepper-header-title")).toHaveTextContent("Parameters");
        });

        it("Should not call createExamTemplate endpoint when code field was not provided, without changing step", async () => {
            await act(async () => {
                setup();
            });

            await fillForm();

            await act(async () => {
                userEvent.clear(screen.getByTestId("exam-general-code"));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            expect(screen.getByText("Please, enter a valid exam code")).toBeInTheDocument();

            expect(MOCKED_CREATE_EXAM_TEMPLATE).not.toHaveBeenCalled();
            expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(EXAM_TEMPLATE_TITLES.GENERAL_INFO);
        });
    });

    describe("Edit Exam Template", () => {
        beforeAll(() => {
            MOCK_QUERY.mockReturnValue({ uuid: MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid });

            resolveServerResponse(MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST, { data: MOCKED_EXAM_TEMPLATE_GENERAL_INFO });
            MOCKED_EXAM_TEMPLATE_INFO.mockReturnValue(MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST);

            resolveServerResponse(MOCKED_EDIT_EXAM_TEMPLATE_QUERY_REQUEST, { data: {} });
            MOCKED_EDIT_EXAM_TEMPLATE.mockReturnValue(MOCKED_EDIT_EXAM_TEMPLATE_QUERY_REQUEST);
        });

        it("Should render component without errors and with filled general info fields", async () => {
            let renderResult: HTMLElement;

            await act(async () => {
                renderResult = setup();
            });

            expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Edit exam template");

            expect(screen.getByTestId("exam-general-code")).toHaveValue(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.code);
            expect(screen.getByTestId("exam-general-name")).toHaveValue(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.name);
            expect(screen.getByTestId("exam-general-term")).toHaveValue(String(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.term));
            expect(screen.getByTestId("exam-general-volume")).toHaveValue(
                String(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.volume)
            );
            expect(screen.getByTestId("exam-general-preparation")).toHaveValue(
                MOCKED_EXAM_TEMPLATE_GENERAL_INFO.preparation
            );
            expect(screen.getByTestId("exam-general-description")).toHaveValue(
                MOCKED_EXAM_TEMPLATE_GENERAL_INFO.description
            );

            const typeIdInputValue = renderResult!.querySelector('[name="sample_types_id"]') as HTMLSelectElement;
            expect(typeIdInputValue).toHaveValue(String(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.sample_types_id));

            const measureUnitIdInputValue = renderResult!.querySelector(
                '[name="si_measurement_units_id"]'
            ) as HTMLSelectElement;
            expect(measureUnitIdInputValue).toHaveValue(
                String(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.si_measurement_units_id)
            );

            const statusIdInputValue = renderResult!.querySelector('[name="status_id"]') as HTMLSelectElement;
            expect(statusIdInputValue).toHaveValue(String(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.status_id));
        });

        it("Should call editExamTemplate endpoint when user changed code, with changing step on the next one", async () => {
            const randomCode = faker.random.alpha(10);

            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("exam-general-code"));
                userEvent.paste(screen.getByTestId("exam-general-code"), randomCode);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });

            expect(MOCKED_EDIT_EXAM_TEMPLATE).toHaveBeenCalledWith(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid);

            expect(MOCKED_EDIT_EXAM_TEMPLATE_QUERY_REQUEST).toHaveBeenCalledWith({
                ...MOCKED_EXAM_TEMPLATE_GENERAL_INFO,
                code: randomCode,
            });
            expect(screen.getByTestId("stepper-header-title")).toHaveTextContent("Parameters");
        });

        it("Should not call editExamTemplate endpoint when user didn't make any changes, with changing step on the next one", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });

            expect(MOCKED_EDIT_EXAM_TEMPLATE_QUERY_REQUEST).not.toHaveBeenCalled();
            expect(screen.getByTestId("stepper-header-title")).toHaveTextContent("Parameters");
        });

        it("Should not call createExamTemplate endpoint when code field was not provided, with no changing step", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("exam-general-code"));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            expect(screen.getByText("Please, enter a valid exam code")).toBeInTheDocument();

            expect(MOCKED_EDIT_EXAM_TEMPLATE_QUERY_REQUEST).not.toHaveBeenCalled();
            expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(EXAM_TEMPLATE_TITLES.GENERAL_INFO);
        });
    });
});

const fillForm = async () => {
    const selects = screen.queryAllByRole("combobox");

    await act(async () => {
        userEvent.paste(screen.getByTestId("exam-general-code"), MOCKED_EXAM_TEMPLATE_INPUT_VALUES.code);
    });

    await act(async () => {
        userEvent.paste(screen.getByTestId("exam-general-name"), MOCKED_EXAM_TEMPLATE_INPUT_VALUES.name);
    });

    await act(async () => {
        userEvent.paste(screen.getByTestId("exam-general-term"), MOCKED_EXAM_TEMPLATE_INPUT_VALUES.term);
    });

    await act(async () => {
        userEvent.click(selects[0]);
    });

    await act(async () => {
        userEvent.click(screen.getByText(MOCKED_EXAM_TEMPLATE_INPUT_VALUES.sample_types_id));
    });

    await act(async () => {
        userEvent.click(selects[1]);
    });

    await act(async () => {
        userEvent.click(screen.getByText(MOCKED_EXAM_TEMPLATE_INPUT_VALUES.si_measurement_units_id));
    });

    await act(async () => {
        userEvent.paste(screen.getByTestId("exam-general-volume"), MOCKED_EXAM_TEMPLATE_INPUT_VALUES.volume);
    });

    await act(async () => {
        userEvent.click(selects[2]);
    });

    await act(async () => {
        userEvent.click(screen.getByText(MOCKED_EXAM_TEMPLATE_INPUT_VALUES.status_id));
    });

    await act(async () => {
        userEvent.paste(screen.getByTestId("exam-general-preparation"), MOCKED_EXAM_TEMPLATE_INPUT_VALUES.preparation);
    });

    await act(async () => {
        userEvent.paste(screen.getByTestId("exam-general-description"), MOCKED_EXAM_TEMPLATE_INPUT_VALUES.description);
    });

    await act(async () => {
        userEvent.paste(
            screen.getByTestId("exam-general-sample-prefix"),
            MOCKED_EXAM_TEMPLATE_INPUT_VALUES.sample_prefix
        );
    });
};
