// libs
import React, { useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { endOfDay, format, getUnixTime, startOfDay } from "date-fns";
import { faker } from "@faker-js/faker";

// stores
import UserStore from "../../../shared/store/UserStore";
import { ExaminationStoreContext } from "../store";

// api
import { getExamTemplatesByWorkplaceUUID } from "../../../api/workplaces";
import { examinationsListOfSamples, getExaminationListBySample } from "../../../api/samples";
import { getExamTemplates, getSampleTypes } from "../../../api/dictionaries";
import { getWorkplacesLookup } from "../../../api/lookups";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { removeOffsetFromDate } from "../../../shared/utils/date";

// models
import { SortingByValues } from "../models";
import { SortingWay } from "../../../shared/models/common";
import { UrgencyStatus } from "../../../shared/models/business/enums";

// constants
import { DATE_FORMATS } from "../../../shared/constants/formates";

// components
import ExaminationsModule from "../ExaminationsModule";

// mocks
import { MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";
import {
    MOCKED_EXAM_TEMPLATES_LOOKUP,
    MOCKED_SAMPLE_TYPES_LOOKUP,
    MOCKED_SAMPLES,
} from "../../../testingInfrustructure/mocks/examinations-result";
import { MOCKED_EXAM_TEMPLATE_ARRAY } from "../../../testingInfrustructure/mocks/exams";
import { MOCKED_WORKPLACES } from "../../../testingInfrustructure/mocks/dictionaries";

jest.mock("../../../api/samples");
jest.mock("../../../api/workplaces");
jest.mock("../../../api/lookups");
jest.mock("../../../api/dictionaries");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const MOCKED_EXAMINATIONS_LIST_OF_SAMPLES = mockFunction(examinationsListOfSamples);
const MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST = jest.fn();
const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_EXAM_TEMPLATES = mockFunction(getExamTemplates);
const MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE = mockFunction(getExaminationListBySample);
const MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST = jest.fn();
const MOCKED_GET_WORKPLACES_LOOKUP = mockFunction(getWorkplacesLookup);
const MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID = mockFunction(getExamTemplatesByWorkplaceUUID);
const MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST = jest.fn();

const setup = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <ExaminationsModule />
        </QueryClientProvider>
    );
};

describe("Examinations module - samples list", () => {
    beforeAll(() => {
        jest.useFakeTimers();

        resolveServerResponse(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST, { data: [] });
        MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE.mockReturnValue(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST);

        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST, {
            data: MOCKED_EXAM_TEMPLATE_ARRAY,
        });
        MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID.mockReturnValue(
            MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID_QUERY_REQUEST
        );

        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES_LOOKUP });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES, { data: MOCKED_EXAM_TEMPLATES_LOOKUP });
        resolveServerResponse(MOCKED_GET_WORKPLACES_LOOKUP, { data: MOCKED_WORKPLACES });

        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
    });

    beforeEach(() => {
        resolveServerResponse(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST, {
            data: MOCKED_SAMPLES,
            total: MOCKED_SAMPLES.length,
        });
        MOCKED_EXAMINATIONS_LIST_OF_SAMPLES.mockReturnValue(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenCalledWith("");
        expect(screen.getByTestId("samples-filter-list-total")).toHaveTextContent(
            `Results found: ${MOCKED_SAMPLES.length}`
        );
        expect(screen.getByText(new RegExp(MOCKED_SAMPLES[0].barcode, "i"))).toBeInTheDocument();
        expect(screen.getByText(MOCKED_SAMPLE_TYPES_LOOKUP[MOCKED_SAMPLES[0].type_id].name)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(MOCKED_SAMPLES[1].barcode, "i"))).toBeInTheDocument();
        expect(screen.getByText(MOCKED_SAMPLE_TYPES_LOOKUP[MOCKED_SAMPLES[1].type_id].name)).toBeInTheDocument();
    });

    describe("Sorting controls", () => {
        afterEach(() => {
            jest.clearAllMocks();
            const { result } = renderHook(() => useContext(ExaminationStoreContext));
            result.current.examinationStore.resetSampleSorting();
        });

        it.each([
            {
                initialOrderWay: SortingWay.ASC,
                value: SortingWay.DESC,
            },
            {
                initialOrderWay: SortingWay.DESC,
                value: SortingWay.NONE,
            },
            {
                initialOrderWay: SortingWay.NONE,
                value: SortingWay.ASC,
            },
        ])("Should call examinationsListOfSamples on change order way", async ({ initialOrderWay, value }) => {
            const { result } = renderHook(() => useContext(ExaminationStoreContext));
            result.current.examinationStore.setupSamplesSorting("order_way", initialOrderWay);

            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("order-way-button"));
                jest.runOnlyPendingTimers();
            });

            expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(3, value ? `order_way=${value}` : "");
        });

        it.each([
            {
                value: SortingByValues.EXPIRE_DATE,
            },
            {
                value: SortingByValues.CREATION_DATE,
            },
        ])("Should call examinationsListOfSamples on change order by", async ({ value }) => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("order-by-button"));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`order-by-${value}`));
                jest.runOnlyPendingTimers();
            });

            expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(3, `order_by=${value}`);
        });

        it(
            "Should call examinationsListOfSamples on change order by urgency " +
                "and show samples which contains exams with urgency_id === UrgencyStatus.URGENT in first order",
            async () => {
                const mockedUrgentExam = { ...MOCKED_SAMPLES[0].exams[0], urgency_id: UrgencyStatus.URGENT };
                const mockedSample = { ...MOCKED_SAMPLES[0], exams: [mockedUrgentExam] };
                resolveServerResponse(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST, {
                    data: [MOCKED_SAMPLES[1], MOCKED_SAMPLES[2], mockedSample],
                    total: 3,
                });

                await act(async () => {
                    setup();
                });

                await act(async () => {
                    userEvent.click(screen.getByTestId("order-by-button"));
                });

                await act(async () => {
                    userEvent.click(screen.getByTestId(`order-by-${SortingByValues.URGENCY}`));
                    jest.runOnlyPendingTimers();
                });

                expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(
                    3,
                    `order_by=${SortingByValues.EXPIRE_DATE}`
                );

                const samples = screen.getAllByTestId(new RegExp(/^sample-card-/));
                expect(samples).toHaveLength(3);

                const urgentSample = screen.getByTestId(new RegExp(`sample-card-${mockedSample.barcode}`));
                expect(samples[0]).toEqual(urgentSample);
            }
        );
    });

    it.each([
        {
            inputPlaceholder: "Sample",
            value: faker.random.numeric(11),
            filterField: "barcode",
        },
        { inputPlaceholder: "Order", value: faker.random.numeric(9), filterField: "exam_order_number" },
    ])(
        "Should call examinationsListOfSamples on change filter $inputPlaceholder (sample number and order number)",
        async ({ inputPlaceholder, value, filterField }) => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("show-more-link"));
            });

            await act(async () => {
                userEvent.paste(screen.getByPlaceholderText(inputPlaceholder), value);
                jest.runOnlyPendingTimers();
            });

            expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenCalledWith(`${filterField}=${value}`);

            // clean up
            await act(async () => {
                userEvent.click(screen.getByTestId("reset-filters"));
            });
        }
    );

    it("Should call examinationsListOfSamples on change Date filter", async () => {
        const now = new Date();
        const nowTimestamp = getUnixTime(removeOffsetFromDate(startOfDay(now)));
        const endOfDayTimestamp = getUnixTime(removeOffsetFromDate(endOfDay(now)));
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("show-more-link"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("expired-calendar-icon"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(format(now, DATE_FORMATS.DATE_ONLY)));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("date-picker-submit-button"));
        });

        expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(
            4,
            `expire_date_from=${nowTimestamp}&expire_date_to=${endOfDayTimestamp}`
        );

        // clean up
        await act(async () => {
            userEvent.click(screen.getByTestId("reset-filters"));
        });
    });

    it("Should call examinationsListOfSamples on change Sample type filter", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("show-more-link"));
        });

        await act(async () => {
            userEvent.click(screen.getAllByRole("combobox")[1]);
        });

        await act(async () => {
            userEvent.click(screen.getAllByText(MOCKED_SAMPLE_TYPES_LOOKUP[0].name)[0]);
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(
            4,
            `type_id[]=${MOCKED_SAMPLE_TYPES_LOOKUP[0].id}`
        );

        // clean up
        await act(async () => {
            userEvent.click(screen.getByTestId("reset-filters"));
        });
    });

    it("Should call examinationsListOfSamples on change Exam type filter", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("show-more-link"));
        });

        await act(async () => {
            userEvent.click(screen.getAllByRole("combobox")[2]);
        });

        await act(async () => {
            userEvent.click(screen.getAllByText(MOCKED_EXAM_TEMPLATES_LOOKUP[0].name)[0]);
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(
            4,
            `exam_template_id[]=${MOCKED_EXAM_TEMPLATES_LOOKUP[0].id}`
        );

        // clean up
        await act(async () => {
            userEvent.click(screen.getByTestId("reset-filters"));
        });
    });

    it("Should call examinationsListOfSamples, fillup and disable Exam type filter on change Workplace filter", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getAllByRole("combobox")[0]);
        });

        await act(async () => {
            userEvent.click(screen.getByText(MOCKED_WORKPLACES[0].name));
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_GET_EXAM_TEMPLATES_BY_WORKPLACE_UUID).toHaveBeenCalledWith(MOCKED_WORKPLACES[0].uuid);

        expect(screen.getByLabelText("Exam type")).toBeDisabled();
        expect(screen.getByText(MOCKED_EXAM_TEMPLATE_ARRAY[0].name)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_EXAM_TEMPLATE_ARRAY[1].name)).toBeInTheDocument();

        const result = MOCKED_EXAM_TEMPLATE_ARRAY.map(examTemplate => `exam_template_id[]=${examTemplate.id}`).join(
            "&"
        );

        await waitFor(() => expect(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES).toHaveBeenNthCalledWith(6, result));

        // clean up
        await act(async () => {
            userEvent.click(screen.getByTestId("clear-value-workplace"));
        });
    });

    it("Should call getExaminationListBySample on select sample", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE).toHaveBeenCalledWith(MOCKED_SAMPLES[0].uuid);
    });
});
