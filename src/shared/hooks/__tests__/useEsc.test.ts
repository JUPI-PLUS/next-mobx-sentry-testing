import {renderHook} from "@testing-library/react";
import useEsc from "../useEsc";
import userEvent from "@testing-library/user-event";

describe('useEsc hook', () => {
    const MOCKED_CALLBACK = jest.fn();

    it('Should not call cb if user click non esc button', () => {
        renderHook(() => useEsc(MOCKED_CALLBACK));

        userEvent.keyboard('[Shift]');

        expect(MOCKED_CALLBACK).not.toHaveBeenCalled();
    })

    it('Should call cb when user click on esc button', () => {
        renderHook(() => useEsc(MOCKED_CALLBACK));

        userEvent.keyboard('[Escape]');

        expect(MOCKED_CALLBACK).toHaveBeenCalled();
    });
})