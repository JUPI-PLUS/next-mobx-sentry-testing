import { render, screen, act } from "@testing-library/react";
import ToastContainer from "../ToastContainer";
import { showErrorToast, showSuccessToast, showWarningToast } from "../helpers";

const MOCKED_TITLE = "Mocked title";
const MOCKED_MESSAGE = "Mocked message";

describe("Toast helpers", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.clearAllTimers();
    });

    it.each([
        {
            fn: showWarningToast,
            dataTestId: "toast-warning-icon"
        },
        {
            fn: showErrorToast,
            dataTestId: "toast-error-icon"
        },
        {
            fn: showSuccessToast,
            dataTestId: "toast-success-icon"
        }
    ])("Should render different toast", async ({ fn, dataTestId }) => {
        await act(async () => {
            render(<ToastContainer />);
        });

        await act(async () => {
            fn({message: MOCKED_MESSAGE, title: MOCKED_TITLE});
            jest.runOnlyPendingTimers();
        });

        expect(await screen.findByText(MOCKED_MESSAGE)).toBeInTheDocument();
        expect(await screen.findByText(MOCKED_TITLE)).toBeInTheDocument();
        expect(await screen.findByTestId(dataTestId)).toBeInTheDocument();
    })
});
