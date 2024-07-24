// libs
import { screen, render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

// components
import VerificationInput from "../VerificationInput";

const FORM_INPUT_NAME = "verification-input";

const setup = (props = {}) => {
    Object.defineProperty(window, "requestAnimationFrame", {
        writable: true,
        value: (cb: () => void) => {
            cb();
        },
    });

    render(<VerificationInput {...props} name={FORM_INPUT_NAME} />);
};

describe("VerificationInput component", () => {
    it("Should render without errors", () => {
        setup();
        expect(screen.getAllByTestId("verification-single-input")).toHaveLength(6);
    });

    it("Should render defined number of inputs", () => {
        const customLength = Number(faker.random.numeric(1));
        setup({ length: customLength });
        expect(screen.getAllByTestId("verification-single-input")).toHaveLength(customLength);
    });

    it("Should render error message", () => {
        const errorMessage = "Something went wrong";
        setup({
            errorMessage: errorMessage,
        });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("Should fillup inputs when value is defined", () => {
        const mockedInputValue = faker.random.numeric(3);

        setup({ length: 3, value: mockedInputValue });
        const inputs = screen.getAllByTestId("verification-single-input");

        const input = inputs[0];
        expect(input).toHaveValue(mockedInputValue[0]);

        const secondInput = inputs[1];
        expect(secondInput).toHaveValue(mockedInputValue[1]);

        const thirdInput = inputs[2];
        expect(thirdInput).toHaveValue(mockedInputValue[2]);
    });

    it("Should focus on next input when user type something", () => {
        const mockedInputValue = faker.random.numeric(1);

        setup();
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];
        const secondInput = inputs[1];

        act(() => {
            userEvent.type(input, mockedInputValue);
        })

        expect(input).toHaveValue(mockedInputValue);
        expect(secondInput).toHaveFocus();
    });

    it("Should delete value in input and remain focus on it when user press delete button", () => {
        const mockedInputValue = faker.random.numeric(2);

        setup({ length: 3, value: mockedInputValue });
        const inputs = screen.getAllByTestId("verification-single-input");
        const secondInput = inputs[1];

        act(() => {
            userEvent.click(secondInput);
            userEvent.keyboard("{Delete}");
        })

        expect(secondInput).toHaveValue("");
        expect(secondInput).toHaveFocus();
    });

    it("Should delete value in input and remain focus on it when user press backspace button", () => {
        const mockedInputValue = faker.random.numeric(2);

        setup({ length: 3, value: mockedInputValue });
        const inputs = screen.getAllByTestId("verification-single-input");
        const secondInput = inputs[1];

        act(() => {
            userEvent.click(secondInput);
            userEvent.keyboard("{Backspace}");
        })

        expect(secondInput).toHaveValue("");
        expect(secondInput).toHaveFocus();
    });

    it("Should change focus on left input when user press arrow left button", () => {
        setup();
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];
        const secondInput = inputs[1];

        act(() => {
            userEvent.click(secondInput);
            userEvent.keyboard("{ArrowLeft}");
        })

        expect(input).toHaveFocus();
    });

    it("Should change focus on right input when user press arrow right button", () => {
        setup();
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];
        const secondInput = inputs[1];

        act(() => {
            userEvent.click(input);
            userEvent.keyboard("{ArrowRight}");
        })

        expect(secondInput).toHaveFocus();
    });

    it("When focused input is empty and user press delete button should clear value on previous input and focus on it", () => {
        const mockedInputValue = faker.random.numeric(2);

        setup({ length: 3, value: mockedInputValue });
        const inputs = screen.getAllByTestId("verification-single-input");
        const secondInput = inputs[1];
        const thirdInput = inputs[2];

        expect(thirdInput).toHaveValue("");

        act(() => {
            userEvent.click(thirdInput);
            userEvent.keyboard("{Backspace}");
        })

        expect(secondInput).toHaveValue("");
        expect(secondInput).toHaveFocus();
    });

    it("Should not call onChange and not fillup input if validation failed - expected number in input, received alpha", () => {
        const mockedOnChange = jest.fn();
        const mockedInputValue = faker.random.alpha(1);

        setup({ onChange: mockedOnChange });
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];

        act(() => {
            userEvent.type(input, mockedInputValue);
        })

        expect(input).toHaveValue("");
        expect(mockedOnChange).not.toHaveBeenCalled();
    });

    it("Should call onChange when user type something", () => {
        const mockedOnChange = jest.fn();
        const mockedInputValue = faker.random.numeric(1);

        setup({ onChange: mockedOnChange });
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];

        act(() => {
            userEvent.type(input, mockedInputValue);
        })

        expect(mockedOnChange).toHaveBeenNthCalledWith(1, mockedInputValue);
    });

    it("Should call onChange when user paste text", () => {
        const mockedOnChange = jest.fn();
        const mockedInputValue = faker.random.numeric(1);

        setup({ onChange: mockedOnChange });
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];

        const clipboardEvent = new Event("paste", {
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        // @ts-ignore
        clipboardEvent.clipboardData = {
            getData: () => mockedInputValue,
        };

        act(() => {
            userEvent.paste(input, mockedInputValue, clipboardEvent);
        })

        expect(mockedOnChange).toHaveBeenNthCalledWith(1, mockedInputValue);
    });

    it("Should call onCompleted when user fillup all inputs", () => {
        const mockedOnCompleted = jest.fn();
        const mockedInputValue = faker.random.numeric(2);

        setup({ length: 2, onCompleted: mockedOnCompleted });
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];
        const secondInput = inputs[1];

        act(() => {
            userEvent.type(input, mockedInputValue[0]);
            userEvent.type(secondInput, mockedInputValue[1]);
        })

        expect(mockedOnCompleted).toHaveBeenNthCalledWith(1, mockedInputValue);
    });

    it("Should call onCompleted when user paste value and all inputs are filled", () => {
        const mockedOnCompleted = jest.fn();
        const mockedInputValue = faker.random.numeric(4);

        setup({ length: 4, onCompleted: mockedOnCompleted });
        const inputs = screen.getAllByTestId("verification-single-input");
        const input = inputs[0];

        const clipboardEvent = new Event("paste", {
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        // @ts-ignore
        clipboardEvent.clipboardData = {
            getData: () => mockedInputValue,
        };

        act(() => {
            userEvent.paste(input, mockedInputValue, clipboardEvent);
        })

        expect(mockedOnCompleted).toHaveBeenNthCalledWith(1, mockedInputValue);
    });
});
