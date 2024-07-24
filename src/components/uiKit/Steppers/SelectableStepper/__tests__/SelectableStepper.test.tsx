// libs
import { act, render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";

// components
import SelectableStepper from "../SelectableStepper";

const MOCKED_DEFAULT_ACTIVE_STEP = 0;
const MOCKED_STEP_QUANTITY = 3;
const MOCKED_TITLES = new Array(MOCKED_STEP_QUANTITY).fill(null).map(() => faker.random.alpha(10));
const MOCKED_CHILDREN = new Array(MOCKED_STEP_QUANTITY).fill(null).map(() => faker.random.alpha(250));
const MOCKED_SET_ACTIVE_STATE = jest.fn();

const setup = (props = {}) => {
    // @ts-ignore
    const { titles = MOCKED_TITLES, activeStep = MOCKED_DEFAULT_ACTIVE_STEP } = props;
    render(
        <SelectableStepper activeStep={activeStep} titles={titles} setActiveStep={MOCKED_SET_ACTIVE_STATE}>
            {MOCKED_CHILDREN.map((child, index) => (
                <p data-testid={`stepper-child-${index}`}>{child}</p>
            ))}
        </SelectableStepper>
    );
};

describe("Stepper component", () => {
    it("Should render component without errors, first default step is selected", () => {
        setup();
        expect(screen.getByTestId(`stepper-item-title-${MOCKED_DEFAULT_ACTIVE_STEP}`)).toHaveTextContent(
            MOCKED_TITLES[MOCKED_DEFAULT_ACTIVE_STEP]
        );
        expect(screen.getByText(MOCKED_CHILDREN[MOCKED_DEFAULT_ACTIVE_STEP])).toBeInTheDocument();
    });

    it("Should select third step in a stepper", async () => {
        const thirdStepIndex = 2;
        setup();

        await act(() => {
            userEvent.click(screen.getByTestId(`stepper-item-${thirdStepIndex}`));
        });
        expect(MOCKED_SET_ACTIVE_STATE).toHaveBeenCalledWith(thirdStepIndex);
    });

    it("Should render default step title if title weas not provided", () => {
        setup({ titles: ["", ...MOCKED_TITLES] });

        expect(screen.getByTestId(`stepper-item-title-${MOCKED_DEFAULT_ACTIVE_STEP}`)).toHaveTextContent(
            `Step ${MOCKED_DEFAULT_ACTIVE_STEP + 1}`
        );
    });
});
