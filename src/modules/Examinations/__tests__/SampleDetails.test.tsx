// libs
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format, fromUnixTime } from "date-fns";

// stores
import UserStore from "../../../shared/store/UserStore";

// api
import { examinationsListOfSamples, getOrdersConditionsBySample, getSampleDetails } from "../../../api/samples";
import { getConditionTypes, getSampleTypes, getSexTypes } from "../../../api/dictionaries";
import { details } from "../../../api/users";

// helpers
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { addOffsetToUtcDate, getPatientAge } from "../../../shared/utils/date";

// models
import { ConditionTypesEnum } from "../../../components/ParameterDrawers/components/ParameterConditions/models";
import { SampleStatuses } from "../../../shared/models/business/enums";

// constants
import { DATE_FORMATS } from "../../../shared/constants/formates";

// components
import ExaminationsModule from "../ExaminationsModule";

// mocks
import { MOCK_DELETED_PATIENT, MOCK_USER, MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";
import {
    MOCKED_CONDITION_TYPES_LOOKUP,
    MOCKED_SAMPLE_TYPES_LOOKUP,
    MOCKED_SAMPLES,
} from "../../../testingInfrustructure/mocks/examinations-result";
import { MOCKED_SEX_TYPES } from "../../../testingInfrustructure/mocks/dictionaries";
import {
    MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX,
    MOCKED_ORDER_CONDITIONS_BY_SAMPLE,
    MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_DAYS,
    MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS,
    MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS_INVALID,
} from "../../../testingInfrustructure/mocks/orderConditions";

jest.mock("../../../api/samples");
jest.mock("../../../api/dictionaries");
jest.mock("../../../api/users");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_SEX_TYPES = mockFunction(getSexTypes);
const MOCKED_GET_CONDITION_TYPES = mockFunction(getConditionTypes);

const MOCKED_GET_SAMPLE_DETAILS = mockFunction(getSampleDetails);
const MOCKED_GET_SAMPLE_DETAILS_QUERY_REQUEST = jest.fn();

const MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE = mockFunction(getOrdersConditionsBySample);
const MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST = jest.fn();

const MOCKED_GET_USER_DETAILS = mockFunction(details);
const MOCKED_GET_USER_DETAILS_QUERY_REQUEST = jest.fn();

const MOCKED_EXAMINATIONS_LIST_OF_SAMPLES = mockFunction(examinationsListOfSamples);
const MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST = jest.fn();

const MOCKED_USER = MOCK_USER({});
const MOCKED_SAMPLE = { ...MOCKED_SAMPLES[0], sample_statuses_id: SampleStatuses.NEW };

const setup = () => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <ExaminationsModule />
        </QueryClientProvider>
    );
};

describe("Examinations module - sample details", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST, {
            data: [MOCKED_SAMPLE],
            total: 1,
        });
        MOCKED_EXAMINATIONS_LIST_OF_SAMPLES.mockReturnValue(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST);

        resolveServerResponse(MOCKED_GET_USER_DETAILS_QUERY_REQUEST, {
            data: MOCKED_USER,
        });
        MOCKED_GET_USER_DETAILS.mockReturnValue(MOCKED_GET_USER_DETAILS_QUERY_REQUEST);

        resolveServerResponse(MOCKED_GET_SAMPLE_DETAILS_QUERY_REQUEST, {
            data: MOCKED_SAMPLE,
        });
        MOCKED_GET_SAMPLE_DETAILS.mockReturnValue(MOCKED_GET_SAMPLE_DETAILS_QUERY_REQUEST);

        resolveServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST, {
            data: MOCKED_ORDER_CONDITIONS_BY_SAMPLE,
        });
        MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE.mockReturnValue(MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST);

        resolveServerResponse(MOCKED_GET_SEX_TYPES, { data: MOCKED_SEX_TYPES });
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES_LOOKUP });
        resolveServerResponse(MOCKED_GET_CONDITION_TYPES, { data: MOCKED_CONDITION_TYPES_LOOKUP });

        UserStore.setupPermissions(MOCKED_PERMISSIONS_IDS);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render correct sample details", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(screen.getByTestId("sample-number")).toHaveTextContent(`Sample №${MOCKED_SAMPLES[0].barcode}`);
        expect(screen.getByTestId("sample-type")).toHaveTextContent(
            MOCKED_SAMPLE_TYPES_LOOKUP.find(({ id }) => id === MOCKED_SAMPLES[0].type_id)!.name
        );
        expect(screen.getByTestId("sample-create-date")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCKED_SAMPLES[0].created_at_timestamp)), DATE_FORMATS.DATE_ONLY)
        );
        expect(screen.getByTestId("sample-update-date")).toHaveTextContent(
            format(addOffsetToUtcDate(fromUnixTime(MOCKED_SAMPLES[0].updated_at_timestamp)), DATE_FORMATS.DATE_ONLY)
        );

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it("Should render correct condition types if sex and age are not provided in conditions by sample", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        const conditionNameElements = screen.getAllByTestId("condition-name");
        const conditionValueElements = screen.getAllByTestId("condition-value");

        new Array(conditionNameElements.length).fill(null).forEach((_, index) => {
            if (index === 0) {
                expect(conditionNameElements[index]).toHaveTextContent(
                    MOCKED_CONDITION_TYPES_LOOKUP.find(({ id }) => id === ConditionTypesEnum.SEX)!.name
                );
                expect(conditionValueElements[index]).toHaveTextContent(
                    MOCKED_SEX_TYPES.find(({ id }) => id === MOCKED_USER.sex_id)!.name
                );
                return;
            }

            if (index === 1) {
                expect(conditionNameElements[index]).toHaveTextContent(
                    MOCKED_CONDITION_TYPES_LOOKUP.find(({ id }) => id === ConditionTypesEnum.AGE_YEARS)!.name
                );
                expect(conditionValueElements[index]).toHaveTextContent(
                    String(getPatientAge(MOCKED_USER.birth_date!, "years"))
                );
                return;
            }
            expect(conditionNameElements[index]).toHaveTextContent(MOCKED_ORDER_CONDITIONS_BY_SAMPLE[index - 2].name);
            expect(conditionValueElements[index]).toHaveTextContent(MOCKED_ORDER_CONDITIONS_BY_SAMPLE[index - 2].value);
        });

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it("Should render correct sex condition type if sex is provided in conditions by sample", async () => {
        resolveServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST, {
            data: [MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX],
        });
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(screen.getAllByTestId("condition-name")[0]).toHaveTextContent(
            MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX.name
        );
        expect(screen.getAllByTestId("condition-value")[0]).toHaveTextContent(
            MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX.value
        );

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it(
        "Should render correct age(years) condition type if both age(years) and age(days) are provided in conditions by sample, " +
            "and patient is older than one year",
        async () => {
            resolveServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST, {
                data: [MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS, MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_DAYS],
            });
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("condition-name")[1]).toHaveTextContent(
                MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS.name
            );
            expect(screen.getAllByTestId("condition-value")[1]).toHaveTextContent(
                MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS.value
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        }
    );

    it(
        "Should render correct age(days) condition type if both age(years) and age(days) are provided in conditions by sample, " +
            "and patient is not older than one year",
        async () => {
            resolveServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST, {
                data: [
                    MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS_INVALID,
                    MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_DAYS,
                ],
            });
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });

            expect(screen.getAllByTestId("condition-name")[1]).toHaveTextContent(
                MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_DAYS.name
            );
            expect(screen.getAllByTestId("condition-value")[1]).toHaveTextContent(
                MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_DAYS.value
            );

            // cleanup
            await act(async () => {
                userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
            });
        }
    );

    it("Should not render age condition and sex condition if user is deleted", async () => {
        resolveServerResponse(MOCKED_GET_ORDER_CONDITIONS_BY_SAMPLE_QUERY_REQUEST, {
            data: [
                ...MOCKED_ORDER_CONDITIONS_BY_SAMPLE,
                MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX,
                MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS,
            ],
        });
        resolveServerResponse(MOCKED_GET_USER_DETAILS_QUERY_REQUEST, {
            data: MOCK_DELETED_PATIENT,
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        expect(screen.queryByText(MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX.name)).not.toBeInTheDocument();
        expect(screen.queryByText(MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX.value)).not.toBeInTheDocument();

        expect(screen.queryByText(MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS.name)).not.toBeInTheDocument();
        expect(screen.queryByText(MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS.value)).not.toBeInTheDocument();

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it("Should show Sample details drawer if user clicks on View details button", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("sample-actions-button"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("view-details-item"));
        });

        expect(MOCKED_GET_SAMPLE_DETAILS).toHaveBeenCalledWith(MOCKED_SAMPLES[0].uuid);
        expect(screen.getByTestId("drawer-title")).toHaveTextContent("Sample details");

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it("Should show Mark sample as damaged drawer if user clicks on Mark as damaged button", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("sample-actions-button"));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("mark-as-damaged-item"));
        });

        expect(screen.getByTestId("drawer-title")).toHaveTextContent("Mark sample as damaged");

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });

    it.skip("Should not show Mark as damaged button if sample is already damaged", async () => {
        resolveServerResponse(MOCKED_EXAMINATIONS_LIST_OF_SAMPLES_QUERY_REQUEST, {
            data: [{ ...MOCKED_SAMPLE, sample_statuses_id: SampleStatuses.FAILED_ON_VALIDATION }],
            total: 1,
        });
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("sample-actions-button"));
        });

        expect(screen.queryByTestId("mark-as-damaged-item")).not.toBeInTheDocument();

        // cleanup
        await act(async () => {
            userEvent.click(screen.getByTestId(`sample-card-${MOCKED_SAMPLES[0].barcode}`));
        });
    });
});
