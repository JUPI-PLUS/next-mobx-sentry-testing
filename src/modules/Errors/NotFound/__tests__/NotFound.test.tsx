import { render, screen } from "@testing-library/react";
import NotFoundModule from "../index";
import userEvent from "@testing-library/user-event";

const MOCKED_REPLACE = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REPLACE
        };
    }
}));

const setup = () => {
    render(<NotFoundModule />);
};

describe("NotFound module", () => {
    it("Should render component without error", () => {
        setup();

        expect(screen.getByText("Not found")).toBeInTheDocument();
    });

    it("Should redirect to dashboard by clicking on button", () => {
        setup();

        userEvent.click(screen.getByRole("button", { name: "Go to dashboard" }));

        expect(MOCKED_REPLACE).toHaveBeenCalled();
    })
});