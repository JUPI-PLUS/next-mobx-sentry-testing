import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ButtonGroup from "../ButtonGroup";

const MOCKED_FIRST_BUTTON_TEXT = "first";
const MOCKED_SECOND_BUTTON_TEXT = "second";
const MOCKED_THIRD_BUTTON_TEXT = "third";
const MOCKED_FIRST_BUTTON_CLICK_FUNCTION = jest.fn();
const MOCKED_SECOND_BUTTON_CLICK_FUNCTION = jest.fn();
const MOCKED_THIRD_BUTTON_CLICK_FUNCTION = jest.fn();

const setup = () => {
    return render(
        <ButtonGroup>
            <button
                data-testid={MOCKED_FIRST_BUTTON_TEXT}
                className={MOCKED_FIRST_BUTTON_TEXT}
                onClick={MOCKED_FIRST_BUTTON_CLICK_FUNCTION}
            >
                {MOCKED_FIRST_BUTTON_TEXT}
            </button>
            <button data-testid={MOCKED_SECOND_BUTTON_TEXT} onClick={MOCKED_SECOND_BUTTON_CLICK_FUNCTION}>
                {MOCKED_SECOND_BUTTON_TEXT}
            </button>
            <button data-testid={MOCKED_THIRD_BUTTON_TEXT} onClick={MOCKED_THIRD_BUTTON_CLICK_FUNCTION}>
                {MOCKED_THIRD_BUTTON_TEXT}
            </button>
        </ButtonGroup>
    );
};

describe("ButtonGroup", () => {
    it("Should render without error", () => {
        setup();

        expect(screen.getByTestId(MOCKED_FIRST_BUTTON_TEXT)).toBeInTheDocument();
        expect(screen.getByTestId(MOCKED_SECOND_BUTTON_TEXT)).toBeInTheDocument();
        expect(screen.getByTestId(MOCKED_THIRD_BUTTON_TEXT)).toBeInTheDocument();
    });

    it("Should call correct onClick handlers", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId(MOCKED_FIRST_BUTTON_TEXT));
        });
        expect(MOCKED_FIRST_BUTTON_CLICK_FUNCTION).toBeCalled();

        act(() => {
            userEvent.click(screen.getByTestId(MOCKED_SECOND_BUTTON_TEXT));
        });
        expect(MOCKED_SECOND_BUTTON_CLICK_FUNCTION).toBeCalled();

        act(() => {
            userEvent.click(screen.getByTestId(MOCKED_THIRD_BUTTON_TEXT));
        });
        expect(MOCKED_THIRD_BUTTON_CLICK_FUNCTION).toBeCalled();
    });

    it("Should't replace props of button like className", () => {
        setup();

        expect(screen.getByTestId(MOCKED_FIRST_BUTTON_TEXT)).toHaveClass(MOCKED_FIRST_BUTTON_TEXT);
    });
});
