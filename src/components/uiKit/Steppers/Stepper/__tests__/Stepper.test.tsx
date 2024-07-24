// libs
import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";

// components
import Stepper from "../Stepper";

const MOCKED_TITLES = new Array(3).fill(null).map(() => faker.random.alpha(10));
const MOCKED_CHILDREN = new Array(3).fill(null).map(() => faker.random.alpha(250));
const MOCKED_DEFAULT_ACTIVE_STEP = 0;

// @ts-ignore
const setup = props => {
    render(
        <Stepper {...props}>
            {MOCKED_CHILDREN.map(child => (
                <p>{child}</p>
            ))}
        </Stepper>
    );
};

describe("Stepper component", () => {
    it("Should render component without errors", () => {
        // @ts-ignore
        setup({ activeStep: MOCKED_DEFAULT_ACTIVE_STEP, titles: MOCKED_TITLES });
        expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(MOCKED_TITLES[MOCKED_DEFAULT_ACTIVE_STEP]);
        expect(screen.getByTestId("stepper-header-steps")).toHaveTextContent(
            `Step ${MOCKED_DEFAULT_ACTIVE_STEP + 1}/${MOCKED_CHILDREN.length}`
        );
    });

    it("Should render third step in a stepper", () => {
        const activeStep = 2;
        // @ts-ignore
        setup({ activeStep, titles: MOCKED_TITLES });

        expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(MOCKED_TITLES[activeStep]);
        expect(screen.getByTestId("stepper-header-steps")).toHaveTextContent(
            `Step ${activeStep + 1}/${MOCKED_CHILDREN.length}`
        );

        expect(screen.getByText(MOCKED_CHILDREN[activeStep])).toBeInTheDocument();
    });

    it("Should render default step title if titles were not provided", () => {
        const activeStep = 1;
        setup({ activeStep });

        expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(`Step ${activeStep + 1}`);
        expect(screen.getByTestId("stepper-header-steps")).toHaveTextContent(
            `Step ${activeStep + 1}/${MOCKED_CHILDREN.length}`
        );
    });
});
