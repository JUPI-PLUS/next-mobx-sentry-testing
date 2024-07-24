import { render, screen } from "@testing-library/react";
import ToastContent from "../ToastContent";
import userEvent from "@testing-library/user-event";

const MOCKED_CLOSE_FN = jest.fn();
const MOCKED_TITLE = "Mocked title";
const MOCKED_MESSAGE = "Mocked message";

describe("ToastMessage component", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    it("Should render component without error ", () => {
        const { rerender } = render(<ToastContent message={MOCKED_MESSAGE} title={MOCKED_TITLE} type="success" />);

        expect(screen.getByText(MOCKED_TITLE)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_MESSAGE)).toBeInTheDocument();
        expect(screen.getByTestId("toast-close-btn")).toBeInTheDocument();
        expect(screen.getByTestId("toast-success-icon")).toBeInTheDocument();

        rerender(<ToastContent message={MOCKED_MESSAGE} title={MOCKED_TITLE} type="warning" />);
        expect(screen.getByTestId("toast-warning-icon")).toBeInTheDocument();

        rerender(<ToastContent message={MOCKED_MESSAGE} title={MOCKED_TITLE} type="error" />);
        expect(screen.getByTestId("toast-error-icon")).toBeInTheDocument();
    });

    it("Should not show title when title not provided", () => {
        render(<ToastContent message={MOCKED_MESSAGE} type="error" />);

        expect(screen.queryByTestId("toast-title")).not.toBeInTheDocument();
    });

    it("Should not show message when title not provided", () => {
        render(<ToastContent title={MOCKED_TITLE} type="error" />);

        expect(screen.queryByTestId("toast-message")).not.toBeInTheDocument();
    });

    it("Should called closeToast func", () => {
        render(<ToastContent message={MOCKED_MESSAGE} title={MOCKED_TITLE} type="success" closeToast={MOCKED_CLOSE_FN} />);

        userEvent.click(screen.getByTestId("toast-close-btn"));

        expect(MOCKED_CLOSE_FN).toHaveBeenCalled();
    });
});
