// libs
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

// stores
import UserStore from "../../../shared/store/UserStore";

// api
import {
    examinationSave,
    examinationsListOfSamples,
    examinationValidate,
    getExaminationListBySample,
} from "../../../api/samples";
import { getExamStatuses, getMeasurementUnits } from "../../../api/dictionaries";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { getLookupItems, toLookupList } from "../../../shared/utils/lookups";

// models
import { ExamStatusesEnum } from "../../../shared/models/business/exam";

// components
import ExaminationsModule from "../ExaminationsModule";

// mocks
import { MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";
import {
    MOCKED_EXAMINATIONS_BY_SAMPLE,
    MOCKED_MEASURE_UNITS_LOOKUP,
    MOCKED_SAMPLES,
    MOCKED_SAMPLES_WITH_STATUS_DONE,
    MOCKED_SAMPLES_WITH_STATUS_NEW,
    MOCKED_SAMPLES_WITH_STATUS_ON_VALIDATION,
} from "../../../testingInfrustructure/mocks/examinations-result";
import { MOCKED_PARAMETER_OPTIONS } from "../../../testingInfrustructure/mocks/parameters";
import { MOCKED_EXAM_STATUSES } from "../../../testingInfrustructure/mocks/dictionaries";

jest.mock("../../../api/samples");
jest.mock("../../../api/dictionaries");
jest.mock("../../../api/lookups");
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

const MOCKED_GET_EXAM_STATUSES = mockFunction(getExamStatuses);
const MOCKED_GET_MEASUREMENT_UNITS = mockFunction(getMeasurementUnits);

const MOCKED_EXAMINATIONS_LIST_OF_SAMPLES = mockFunction(examinationsListOfSamples);
const MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST = jest.fn();

const MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE = mockFunction(getExaminationListBySample);
const MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST = jest.fn();

const MOCKED_EXAMINATION_SAVE = mockFunction(examinationSave);
const MOCKED_EXAMINATION_VALIDATE = mockFunction(examinationValidate);

const MOCKED_EXAMINATIONS = MOCKED_EXAMINATIONS_BY_SAMPLE(1, 1);

const setup = () => {
    const queryClient = new QueryClient();

    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <ExaminationsModule />
        </QueryClientProvider>
    );
    return container;
};

describe("Examinations module - examinations table", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        resolveServerResponse(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST, {
            data: MOCKED_SAMPLES,
            total: MOCKED_SAMPLES.length,
        });
        MOCKED_EXAMINATIONS_LIST_OF_SAMPLES.mockReturnValue(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST);
        resolveServerResponse(MOCKED_GET_MEASUREMENT_UNITS, { data: MOCKED_MEASURE_UNITS_LOOKUP });
        resolveServerResponse(MOCKED_GET_EXAM_STATUSES, { data: MOCKED_EXAM_STATUSES });

        resolveServerResponse(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST, {
            data: MOCKED_EXAMINATIONS,
        });
        MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE.mockReturnValue(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST);

        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should call getExaminationListBySample and render examinations table on select sample", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE).toHaveBeenCalledWith(MOCKED_SAMPLES[0].uuid);

        expect(screen.getByText(new RegExp(MOCKED_EXAMINATIONS[0].order_number, "i"))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(MOCKED_EXAMINATIONS[0].order_notes, "i"))).toBeInTheDocument();
        expect(screen.getAllByTestId("exam-name")[0]).toHaveTextContent(MOCKED_EXAMINATIONS[0].exams[0].name);
        expect(screen.getAllByTestId("param-name")[0]).toHaveTextContent(
            MOCKED_EXAMINATIONS[0].exams[0].params[0].name
        );
        expect(screen.getAllByTestId("param-intervals")[0]).toHaveTextContent(
            MOCKED_EXAMINATIONS[0].exams[0].params[0].biological_reference_intervals
        );

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    describe("Notes", () => {
        it("Parameter notes: should show Add notes button, add note and call examinationSave callback if notes are not provided", async () => {
            const mockedNote = faker.random.alpha(50);
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("exam-notes-does-not-exists")[0]).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("0-exams-0-params-0-result_notes-add-button"));
            });

            await act(async () => {
                userEvent.type(document!.querySelectorAll(".ql-editor")[0]!, mockedNote);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("0-exams-0-params-0-result_notes-close-button"));
            });

            expect(screen.getByText(new RegExp(mockedNote, "i"))).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(MOCKED_EXAMINATION_SAVE).toHaveBeenCalled();

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        it("Parameter notes: should show validation message on input invalid notes length", async () => {
            const mockedNote = faker.random.alpha(3001);
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("0-exams-0-params-1-result_notes-add-button"));
            });

            await act(async () => {
                userEvent.type(document!.querySelectorAll(".ql-editor")[0]!, mockedNote);
            });

            expect(screen.getByText(new RegExp(mockedNote, "i"))).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(screen.getByTestId("field-0-exams-0-params-1-result_notes-error-container")).toHaveTextContent(
                "Notes should be equal or less than 3000 symbols"
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        it("Examination notes: should show Add notes button, add note and call examinationSave callback if notes are not provided", async () => {
            const mockedNote = faker.random.alpha(50);
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("0-exams-0-notes-add-button"));
            });

            await act(async () => {
                userEvent.type(document!.querySelectorAll(".ql-editor")[0]!, mockedNote);
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("0-exams-0-notes-close-button"));
            });

            expect(screen.getByText(new RegExp(mockedNote, "i"))).toBeInTheDocument();

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(MOCKED_EXAMINATION_SAVE).toHaveBeenCalled();

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });
    });

    describe("Parameter View Type STRING", () => {
        it("Should render correct parameter data", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("param-name")[0]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[0].name
            );
            expect(screen.getByTestId("0-exams-0-params-0-value")).toHaveValue(
                MOCKED_EXAMINATIONS[0].exams[0].params[0].value
            );
            expect(screen.getAllByTestId("param-measure-unit")[0]).toHaveTextContent(
                MOCKED_MEASURE_UNITS_LOOKUP.find(
                    ({ id }) => id === MOCKED_EXAMINATIONS[0].exams[0].params[0].si_measurement_units_id
                )!.name
            );
            expect(screen.getAllByTestId("param-intervals")[0]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[0].biological_reference_intervals
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        it("Should call examinationSave callback on input valid value and click on Save button", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("0-exams-0-params-0-value"));
                userEvent.paste(screen.getByTestId("0-exams-0-params-0-value"), faker.random.alpha(20));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(MOCKED_EXAMINATION_SAVE).toHaveBeenCalled();

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        it("Should show validation message on input invalid value to examination result input", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.paste(screen.getByTestId("0-exams-0-params-0-value"), faker.random.alpha(46));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(screen.getByTestId(`field-0-exams-0-params-0-value-error-container`)).toHaveTextContent(
                "Parameter should be equal or less than 45 symbols"
            );
            expect(MOCKED_EXAMINATION_SAVE).not.toHaveBeenCalled();

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });
    });

    describe("Parameter View Type NUMBER", () => {
        it("Should render correct parameter data", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("param-name")[1]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[1].name
            );
            expect(screen.getByTestId("0-exams-0-params-1-value")).toHaveValue(
                MOCKED_EXAMINATIONS[0].exams[0].params[1].value
            );
            expect(screen.getAllByTestId("param-measure-unit")[1]).toHaveTextContent(
                MOCKED_MEASURE_UNITS_LOOKUP.find(
                    ({ id }) => id === MOCKED_EXAMINATIONS[0].exams[0].params[1].si_measurement_units_id
                )!.name
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        it(
            "Should change parameter Notes value on input valid value to examination result input," +
                "should call examinationSave callback on click on Save button",
            async () => {
                await act(async () => {
                    setup();
                });

                await act(async () => {
                    userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
                });

                await act(async () => {
                    userEvent.clear(screen.getByTestId("0-exams-0-params-1-value"));
                    userEvent.paste(
                        screen.getByTestId("0-exams-0-params-1-value"),
                        String(MOCKED_EXAMINATIONS[0].exams[0].params[1].reference_values![2].to)
                    );
                    jest.runOnlyPendingTimers();
                });

                expect(screen.getByTestId("param-intervals-title")).toHaveTextContent(
                    MOCKED_EXAMINATIONS[0].exams[0].params[1].reference_values![2].title
                );

                expect(
                    screen.getByText(
                        new RegExp(MOCKED_EXAMINATIONS[0].exams[0].params[1].reference_values![2].note, "i")
                    )
                ).toBeInTheDocument();

                await act(async () => {
                    userEvent.click(screen.getByTestId("save-examination-order"));
                });

                expect(MOCKED_EXAMINATION_SAVE).toHaveBeenCalled();

                // cleanup
                await act(async () => {
                    userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
                });
            }
        );

        it("Should show Out of range info on input invalid value to examination result input", async () => {
            const invalidValue = 99999999;
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.clear(screen.getByTestId("0-exams-0-params-1-value"));
                userEvent.paste(screen.getByTestId("0-exams-0-params-1-value"), String(invalidValue));
                jest.runOnlyPendingTimers();
            });

            expect(screen.getByTestId("param-intervals-title")).toHaveTextContent("Out of range");

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });
    });

    describe("Parameter View Type DROPDOWN_STRICT", () => {
        it("Should render correct parameter data", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("param-name")[2]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[2].name
            );

            const inputValue = renderResult!.querySelector('[name="0-exams-0-params-2-value"]') as HTMLSelectElement;
            expect(inputValue).toHaveValue(
                String(
                    MOCKED_PARAMETER_OPTIONS.find(
                        ({ name }) => name === MOCKED_EXAMINATIONS[0].exams[0].params[2].value
                    )!.id
                )
            );

            expect(screen.getAllByTestId("param-measure-unit")[2]).toHaveTextContent(
                MOCKED_MEASURE_UNITS_LOOKUP.find(
                    ({ id }) => id === MOCKED_EXAMINATIONS[0].exams[0].params[2].si_measurement_units_id
                )!.name
            );

            expect(screen.getAllByTestId("param-intervals")[2]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[2].biological_reference_intervals
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        // TODO: Fix bug: clicking by react select menu portal causes rerender of a component
        it.skip("Should call examinationSave callback on change value and click on Save button", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.click(screen.queryAllByRole("combobox")[3]);
            });

            await act(async () => {
                userEvent.click(screen.getByText(MOCKED_PARAMETER_OPTIONS[1].name));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(MOCKED_EXAMINATION_SAVE).toHaveBeenCalled();

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });
    });

    describe("Parameter View Type DROPDOWN_MULTISELECT", () => {
        it("Should render correct parameter data", async () => {
            let renderResult: HTMLElement;
            await act(async () => {
                renderResult = setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("param-name")[4]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[4].name
            );

            const items = getLookupItems(
                toLookupList(MOCKED_EXAMINATIONS[0].exams[0].params[4].options),
                MOCKED_EXAMINATIONS[0].exams[0].params[4].value!.split(";"),
                "label"
            )!;
            const inputValues = renderResult!.querySelectorAll('[name="0-exams-0-params-4-value"]');
            expect(inputValues[0]).toHaveValue(String(items[0].value));
            expect(inputValues[1]).toHaveValue(String(items[1].value));

            expect(screen.getAllByTestId("param-measure-unit")[4]).toHaveTextContent(
                MOCKED_MEASURE_UNITS_LOOKUP.find(
                    ({ id }) => id === MOCKED_EXAMINATIONS[0].exams[0].params[4].si_measurement_units_id
                )!.name
            );

            expect(screen.getAllByTestId("param-intervals")[4]).toHaveTextContent(
                MOCKED_EXAMINATIONS[0].exams[0].params[4].biological_reference_intervals
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });

        // TODO: Fix bug: clicking by react select menu portal causes rerender of a component
        it.skip("Should call examinationSave callback on change value and click on Save button", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            await act(async () => {
                userEvent.click(screen.queryAllByRole("combobox")[4]);
            });

            await act(async () => {
                userEvent.click(screen.getByText(MOCKED_PARAMETER_OPTIONS[5].name));
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("save-examination-order"));
            });

            expect(MOCKED_EXAMINATION_SAVE).toHaveBeenCalled();

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        });
    });

    it("Should disable validation button if params haven't status On Validation", async () => {
        resolveServerResponse(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST, {
            data: MOCKED_SAMPLES_WITH_STATUS_NEW,
        });
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(screen.getByTestId("exam-status")).toHaveTextContent(
            MOCKED_EXAM_STATUSES.find(({ id }) => id === ExamStatusesEnum.NEW)!.name
        );

        expect(screen.getByTestId("validate-examination-order")).toBeDisabled();

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it("Should call examinationValidate callback with exams with status On Validation on click on Validate button", async () => {
        resolveServerResponse(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST, {
            data: MOCKED_SAMPLES_WITH_STATUS_ON_VALIDATION,
        });
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(screen.getByTestId("exam-status")).toHaveTextContent(
            MOCKED_EXAM_STATUSES.find(({ id }) => id === ExamStatusesEnum.ON_VALIDATION)!.name
        );

        expect(screen.getByTestId("validate-examination-order")).not.toBeDisabled();

        await act(async () => {
            userEvent.click(screen.getByTestId("validate-examination-order"));
        });

        expect(MOCKED_EXAMINATION_VALIDATE).toHaveBeenCalled();

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it("Should disable inputs and not show add/edit note buttons for examinations that have status Done", async () => {
        resolveServerResponse(MOCKED_GET_EXAMINATION_LIST_BY_SAMPLE_QUERY_REQUEST, {
            data: MOCKED_SAMPLES_WITH_STATUS_DONE,
        });
        let renderResult: HTMLElement;
        await act(async () => {
            renderResult = setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(screen.getByTestId("exam-status")).toHaveTextContent(
            MOCKED_EXAM_STATUSES.find(({ id }) => id === ExamStatusesEnum.DONE)!.name
        );

        const selects = renderResult!.querySelectorAll('input[id^="react-select-0-exams-0-params"]');

        expect(screen.getByTestId("0-exams-0-params-0-value")).toBeDisabled();
        expect(screen.getByTestId("0-exams-0-params-1-value")).toBeDisabled();
        expect(selects[0]).toBeDisabled();
        expect(selects[1]).toBeDisabled();
        expect(selects[2]).toBeDisabled();

        const addNoteButtons = renderResult!.querySelectorAll('button[id$="add-button"]');
        expect(addNoteButtons).toHaveLength(0);

        const editNoteButtons = renderResult!.querySelectorAll('button[id$="edit-button"]');
        expect(editNoteButtons).toHaveLength(0);

        expect(screen.getByTestId("validate-examination-order")).toBeDisabled();

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });
});
