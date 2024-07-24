import { render, screen, renderHook } from "@testing-library/react";
import Popper from "../Popper";
import { useRef } from "react";
import { PopperProps } from "../models";
import userEvent from "@testing-library/user-event";

const MOCKED_BUTTON_TEXT = "Click me";
const MOCKED_POPPER_TEXT = "My popper children";
const MOCKED_CLOSE_CALLBACK = jest.fn();

const setup = (popperProps?: Partial<PopperProps>) => {
    const { result } = renderHook(() => useRef(null));
    render(
        <>
            <button ref={result.current}>{MOCKED_BUTTON_TEXT}</button>
            <Popper sourceRef={result.current} onClose={MOCKED_CLOSE_CALLBACK} {...popperProps}>
                <p>{MOCKED_POPPER_TEXT}</p>
            </Popper>
            <div data-testid="close-popper-block" />
        </>
    );
};

describe("Popper component", () => {
    it("Should render component without errors", () => {
        setup({ isOpen: true });

        expect(screen.getByText(MOCKED_POPPER_TEXT)).toBeInTheDocument();
    });

    it('Should call onClose callback if user click away from popper', () => {
        setup({ isOpen: true });

        expect(screen.getByText(MOCKED_POPPER_TEXT)).toBeInTheDocument();

        userEvent.click(screen.getByTestId('close-popper-block'));

        expect(MOCKED_CLOSE_CALLBACK).toHaveBeenCalled()
    })
});
