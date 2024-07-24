// libs
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { QueryClient, QueryClientProvider } from "react-query";

// helpers
import { mockFunction, resolveServerResponse } from "../../../../testingInfrustructure/utils";
import { createParameter, getParameters, getParameter } from "../../../../api/parameters";
import { getMeasurementUnits, getParameterViewTypes } from "../../../../api/dictionaries";

// components
import AssignOrCreateParameterDrawer from "../AssignOrCreateParameterDrawer";

// mocks
import {
    MOCKED_NEW_PARAMETER,
    MOCKED_PARAMETER_OPTIONS,
    MOCKED_PARAMETERS,
} from "../../../../testingInfrustructure/mocks/parameters";
import {
    MOCKED_MEASUREMENT_UNITS,
    MOCKED_PARAMETER_VIEW_TYPES,
} from "../../../../testingInfrustructure/mocks/dictionaries";

const MOCKED_GET_MEASUREMENT_UNITS = mockFunction(getMeasurementUnits);
const MOCKED_GET_PARAMETER_VIEW_TYPES = mockFunction(getParameterViewTypes);

const MOCKED_GET_PARAMETER = mockFunction(getParameter);
const MOCKED_GET_PARAMETER_QUERY_REQUEST = jest.fn();

const MOCKED_CREATE_PARAMETER = mockFunction(createParameter);
const MOCKED_GET_PARAMETERS = mockFunction(getParameters);
const MOCKED_GET_PARAMETERS_QUERY_REQUEST = jest.fn();

const MOCKED_ON_CLOSE_CALLBACK = jest.fn();
const MOCKED_ON_SUBMIT_CALLBACK = jest.fn();

jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useId: () => "",
}));
jest.mock("../../../../api/dictionaries");
jest.mock("../../../../api/parameters");
jest.mock("../../../../api/parameterOptions");

const MOCKED_CURRENT_PARAMETERS = MOCKED_PARAMETERS();

// @ts-ignore
const setup = (props = {}) => {
    const queryClient = new QueryClient();

    const { container } = render(
        <QueryClientProvider client={queryClient}>
            <AssignOrCreateParameterDrawer
                onClose={MOCKED_ON_CLOSE_CALLBACK}
                onSubmit={MOCKED_ON_SUBMIT_CALLBACK}
                {...props}
            />
        </QueryClientProvider>
    );
    return container;
};

describe("AssignOrCreateParameterDrawer component", () => {
    beforeAll(() => {
        jest.useFakeTimers();

        resolveServerResponse(MOCKED_GET_MEASUREMENT_UNITS, { data: MOCKED_MEASUREMENT_UNITS });
        resolveServerResponse(MOCKED_GET_PARAMETER_VIEW_TYPES, { data: MOCKED_PARAMETER_VIEW_TYPES });

        resolveServerResponse(MOCKED_GET_PARAMETERS_QUERY_REQUEST, { data: MOCKED_CURRENT_PARAMETERS });
        MOCKED_GET_PARAMETERS.mockReturnValue(MOCKED_GET_PARAMETERS_QUERY_REQUEST);

        resolveServerResponse(MOCKED_GET_PARAMETER_QUERY_REQUEST, { data: {} });
        MOCKED_GET_PARAMETER.mockReturnValue(MOCKED_GET_PARAMETER_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("Should call onClose callback on click on close icon", () => {
        setup();

        userEvent.click(screen.getByTestId("close-drawer-button"));

        expect(MOCKED_ON_CLOSE_CALLBACK).toHaveBeenCalled();
    });

    describe("Step 1 - assign or create parameter", () => {
        it("Should render component without errors", () => {
            setup();

            expect(screen.getByTestId("drawer-title")).toHaveTextContent("Add parameter");
            const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
            expect(selectInput).toBeInTheDocument();
            expect(screen.getByTestId("submit-drawer-button")).toBeInTheDocument();
            expect(screen.getByTestId("submit-drawer-button")).toBeDisabled();
            expect(screen.queryByTestId("drawer-optional-button")).not.toBeInTheDocument();
        });

        it("Should not call getParameters endpoint if user paste parameter code less than 2 symbols", async () => {
            setup();

            const fakeCode = faker.random.alpha(1);
            const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
            await act(async () => {
                userEvent.click(selectInput);
                userEvent.paste(selectInput, fakeCode);
            });

            expect(MOCKED_GET_PARAMETERS_QUERY_REQUEST).not.toHaveBeenCalled();
            expect(MOCKED_GET_PARAMETERS).not.toHaveBeenCalled();
        });

        it("Should not call getParameters endpoint if user paste parameter code greater than 10 symbols", async () => {
            setup();

            const fakeCode = faker.random.alpha(11);
            const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
            await act(async () => {
                userEvent.click(selectInput);
                userEvent.paste(selectInput, fakeCode);
            });

            expect(MOCKED_GET_PARAMETERS_QUERY_REQUEST).not.toHaveBeenCalled();
            expect(MOCKED_GET_PARAMETERS).not.toHaveBeenCalled();
        });

        it("Should call getParameters endpoint if user paste parameter code greater or equal 2 symbols and less or equal 10 symbols", async () => {
            setup();

            const fakeCode = faker.random.alpha(6);
            const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
            await act(async () => {
                userEvent.click(selectInput);
                userEvent.paste(selectInput, fakeCode);
                jest.runOnlyPendingTimers();
            });

            expect(MOCKED_GET_PARAMETERS_QUERY_REQUEST).toHaveBeenCalled();
            expect(MOCKED_GET_PARAMETERS).toHaveBeenCalled();

            expect(
                screen.getByText(`${MOCKED_CURRENT_PARAMETERS[0].code} - ${MOCKED_CURRENT_PARAMETERS[0].name}`)
            ).toBeInTheDocument();
        });

        it("Should call getParameters endpoint and filter result array so that it doesn't contain pickedParamsUUID ", async () => {
            setup({ pickedParamsUUID: [MOCKED_CURRENT_PARAMETERS[1].uuid] });

            const fakeCode = faker.random.alpha(6);
            const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
            await act(async () => {
                userEvent.click(selectInput);
                userEvent.paste(selectInput, fakeCode);
                jest.runOnlyPendingTimers();
            });

            expect(MOCKED_GET_PARAMETERS_QUERY_REQUEST).toHaveBeenCalled();
            expect(MOCKED_GET_PARAMETERS).toHaveBeenCalled();

            expect(
                screen.queryByText(`${MOCKED_CURRENT_PARAMETERS[1].code} - ${MOCKED_CURRENT_PARAMETERS[1].name}`)
            ).not.toBeInTheDocument();
        });

        it("Should select parameter, change step on the next one, go back to the first step, and parameter should remain picked", async () => {
            setup();

            const index = 0;
            await selectParameter(MOCKED_CURRENT_PARAMETERS[index].code, index);

            expect(MOCKED_GET_PARAMETER).toHaveBeenCalledWith(MOCKED_CURRENT_PARAMETERS[index].uuid);
            expect(MOCKED_GET_PARAMETER_QUERY_REQUEST).toHaveBeenCalled();

            expect(screen.getByTestId("drawer-optional-button")).toBeInTheDocument();
            await act(async () => {
                userEvent.click(screen.getByTestId("drawer-optional-button"));
            });
            expect(
                screen.getByText(`${MOCKED_CURRENT_PARAMETERS[index].code} - ${MOCKED_CURRENT_PARAMETERS[index].name}`)
            ).toBeInTheDocument();
            expect(screen.getByTestId("submit-drawer-button")).not.toBeDisabled();
        });

        it("Should create parameter", async () => {
            setup();

            const code = faker.random.alpha(6);
            await createNewParameter(code);
            expect(screen.getByTestId("drawer-optional-button")).toBeInTheDocument();
        });
    });

    describe("Step 2 - parameter info fields", () => {
        it("Should render component without errors", async () => {
            setup();

            const index = 0;
            await selectParameter(MOCKED_CURRENT_PARAMETERS[index].code, index);

            expect(screen.getByTestId("submit-drawer-button")).toBeInTheDocument();
            expect(screen.getByTestId("submit-drawer-button")).not.toBeDisabled();
            expect(screen.getByTestId("drawer-optional-button")).toBeInTheDocument();
        });

        it(
            "Should select existed parameter, change step on the next one, fields are filled with parameter data," +
                "fields are disabled, onSubmit called",
            async () => {
                const index = 0;

                const MOCKED_PARAMETERS_WITH_CUSTOM_DATA = MOCKED_PARAMETERS({
                    is_printable: true,
                    is_required: false,
                    type_view_id: 3,
                    options: MOCKED_PARAMETER_OPTIONS,
                });
                resolveServerResponse(MOCKED_GET_PARAMETERS_QUERY_REQUEST, {
                    data: MOCKED_PARAMETERS_WITH_CUSTOM_DATA,
                });

                const selectedParameter = MOCKED_PARAMETERS_WITH_CUSTOM_DATA[index];

                resolveServerResponse(MOCKED_GET_PARAMETER_QUERY_REQUEST, { data: selectedParameter });
                MOCKED_GET_PARAMETER.mockReturnValue(MOCKED_GET_PARAMETER_QUERY_REQUEST);

                let renderResult: HTMLElement;
                await act(async () => {
                    renderResult = setup();
                });

                await selectParameter(selectedParameter.code, index);

                expect(MOCKED_GET_PARAMETER).toHaveBeenCalledWith(selectedParameter.uuid);
                expect(MOCKED_GET_PARAMETER_QUERY_REQUEST).toHaveBeenCalled();

                // code
                expect(screen.getByTestId("parameter-code")).toHaveValue(selectedParameter.code);
                expect(screen.getByTestId("parameter-code")).toBeDisabled();

                // name
                expect(screen.getByTestId("parameter-name")).toHaveValue(selectedParameter.name);
                expect(screen.getByTestId("parameter-name")).toBeDisabled();

                // measure unit
                const measureUnitSelectInput = renderResult!.querySelector(
                    "#react-select-si_measurement_units_id-input"
                ) as HTMLSelectElement;
                expect(measureUnitSelectInput).toBeDisabled();
                expect(
                    screen.getByText(MOCKED_MEASUREMENT_UNITS[selectedParameter.si_measurement_units_id].name)
                ).toBeInTheDocument();

                // biological reference intervals
                expect(screen.getByTestId("parameter-biological-reference-intervals")).toHaveValue(
                    selectedParameter.biological_reference_intervals
                );
                expect(screen.getByTestId("parameter-biological-reference-intervals")).toBeDisabled();

                // type view id
                const typeViewIdSelectInput = renderResult!.querySelector(
                    "#react-select-type_view_id-input"
                ) as HTMLSelectElement;
                expect(typeViewIdSelectInput).toBeDisabled();
                expect(
                    screen.getByText(MOCKED_PARAMETER_VIEW_TYPES[selectedParameter.type_view_id].name)
                ).toBeInTheDocument();

                // options
                expect(screen.getByText("Options list")).toBeInTheDocument();
                // @ts-ignore
                expect(screen.getByTestId("parameter-option-0")).toHaveTextContent(selectedParameter.options[0].name);
                expect(screen.queryByTestId("option-edit-icon-0")).not.toBeInTheDocument();

                // notes
                expect(renderResult!.querySelector(".ql-editor")!).toHaveTextContent(selectedParameter.notes);
                expect(renderResult!.querySelector(".ql-editor--disabled")!).toBeInTheDocument();

                // is printable
                expect(screen.getByTestId("parameter-is-printable")).toBeChecked();
                expect(screen.getByTestId("parameter-is-printable")).toBeDisabled();

                // is required
                expect(screen.getByTestId("parameter-is-required")).not.toBeChecked();
                expect(screen.getByTestId("parameter-is-required")).toBeDisabled();

                await act(async () => {
                    userEvent.click(screen.getByTestId("submit-drawer-button"));
                });
                expect(MOCKED_ON_SUBMIT_CALLBACK).toHaveBeenCalledWith({
                    ...selectedParameter,
                    notes: `<p>${selectedParameter.notes}</p>`,
                });
            }
        );

        it(
            "Should create parameter, change step on the next one, fillup fields," +
                "createParameter endpoint called, onSubmit called",
            async () => {
                const newParameterWithUuid = { ...MOCKED_NEW_PARAMETER, options: null, uuid: faker.datatype.uuid() };

                resolveServerResponse(MOCKED_CREATE_PARAMETER, {
                    data: newParameterWithUuid,
                });

                let renderResult: HTMLElement;
                await act(async () => {
                    renderResult = setup();
                });

                await createNewParameter(MOCKED_NEW_PARAMETER.code);

                expect(screen.getByTestId("parameter-code")).toHaveValue(MOCKED_NEW_PARAMETER.code);
                expect(MOCKED_GET_PARAMETER_QUERY_REQUEST).not.toHaveBeenCalled();

                await fillForm(renderResult!, MOCKED_NEW_PARAMETER);

                await act(async () => {
                    userEvent.click(screen.getByTestId("submit-drawer-button"));
                });

                expect(MOCKED_CREATE_PARAMETER).toHaveBeenCalledWith({
                    ...MOCKED_NEW_PARAMETER,
                    options: [],
                    notes: `<p>${MOCKED_NEW_PARAMETER.notes}</p>`,
                });
                expect(MOCKED_ON_SUBMIT_CALLBACK).toHaveBeenCalledWith(newParameterWithUuid);
            }
        );

        it("Should create parameter, not call createParameter endpoint, not call onSubmit", async () => {
            const code = faker.random.alpha(6);

            setup();

            await createNewParameter(code);

            expect(MOCKED_CREATE_PARAMETER).not.toHaveBeenCalled();
            expect(MOCKED_ON_SUBMIT_CALLBACK).not.toHaveBeenCalledWith();
        });
    });
});

const selectParameter = async (code: string, index: number) => {
    const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
    await act(async () => {
        userEvent.click(selectInput);
        userEvent.paste(selectInput, code);
        jest.runOnlyPendingTimers();
    });
    const selectOption = document.getElementById(`react-select-parameterCodeAutocomplete-option-${index}`)!;
    await act(async () => {
        userEvent.click(selectOption);
    });
    await act(async () => {
        userEvent.click(screen.getByTestId("submit-drawer-button"));
    });
};

const createNewParameter = async (code: string) => {
    const selectInput = document.getElementById("react-select-parameterCodeAutocomplete-input")!;
    await act(async () => {
        userEvent.click(selectInput);
        userEvent.paste(selectInput, code);
        jest.runOnlyPendingTimers();
    });
    const selectOption = document.getElementById(
        `react-select-parameterCodeAutocomplete-option-${MOCKED_CURRENT_PARAMETERS.length}`
    )!;
    await act(async () => {
        userEvent.click(selectOption);
    });
    await act(async () => {
        userEvent.click(screen.getByTestId("submit-drawer-button"));
    });
};

// @ts-ignore
const fillForm = async (renderResult, selectedParameter) => {
    const selects = screen.queryAllByRole("combobox");

    // name
    await act(async () => {
        userEvent.paste(screen.getByTestId("parameter-name"), selectedParameter.name);
    });

    // measure units
    await act(async () => {
        userEvent.click(selects[0]);
    });
    await act(async () => {
        userEvent.click(screen.getByText(MOCKED_MEASUREMENT_UNITS[selectedParameter.si_measurement_units_id].name));
    });

    // biological reference intervals
    await act(async () => {
        userEvent.paste(
            screen.getByTestId("parameter-biological-reference-intervals"),
            selectedParameter.biological_reference_intervals
        );
    });

    // type view id
    await act(async () => {
        userEvent.click(selects[1]);
    });
    await act(async () => {
        userEvent.click(screen.getByText(MOCKED_PARAMETER_VIEW_TYPES[selectedParameter.type_view_id].name));
    });

    // notes
    await act(async () => {
        userEvent.type(renderResult!.querySelector(".ql-editor")!, selectedParameter.notes);
    });

    // is printable
    await act(async () => {
        userEvent.click(screen.getByTestId("parameter-is-printable"));
    });

    // is required
    await act(async () => {
        userEvent.click(screen.getByTestId("parameter-is-required"));
    });
};
