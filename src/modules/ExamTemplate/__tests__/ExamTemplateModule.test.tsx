// libs
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

// helpers
import { getExamTemplateInfo, getExamTemplateParams } from "../../../api/examTemplates";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { getExamTemplateStatuses, getMeasurementUnits, getSampleTypes } from "../../../api/dictionaries";

// components
import ExamTemplateModule from "../ExamTemplateModule";

// mocks
import {
    MOCKED_EXAM_TEMPLATE_STATUSES,
    MOCKED_MEASUREMENT_UNITS,
    MOCKED_SAMPLE_TYPES,
} from "../../../testingInfrustructure/mocks/dictionaries";
import { MOCKED_EXAM_TEMPLATE_GENERAL_INFO } from "../../../testingInfrustructure/mocks/examTemplate";

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_MEASUREMENT_UNITS = mockFunction(getMeasurementUnits);
const MOCKED_GET_EXAM_TEMPLATE_STATUSES = mockFunction(getExamTemplateStatuses);
const MOCKED_EXAM_TEMPLATE_INFO = mockFunction(getExamTemplateInfo);
const MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST = jest.fn();
const MOCKED_EXAM_TEMPLATE_PARAMS = mockFunction(getExamTemplateParams);
const MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST = jest.fn();
const MOCK_QUERY = jest.fn(() => ({ uuid: "" }));

jest.mock("../../../api/dictionaries");
jest.mock("../../../api/examTemplates");
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

    render(
        <QueryClientProvider client={queryClient}>
            <ExamTemplateModule />
        </QueryClientProvider>
    );
};

describe("Exam Template module", () => {
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

    it("Should render component without errors as create exam template", async () => {
        await act(async () => {
            setup();
        });
        expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Create exam template");
    });

    it("Should render component without errors as edit exam template", async () => {
        MOCK_QUERY.mockReturnValue({ uuid: MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid });

        await act(async () => {
            setup();
        });
        expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Edit exam template");
    });
});
