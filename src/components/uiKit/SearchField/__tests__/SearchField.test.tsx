import { act, render, screen } from "@testing-library/react";
import SearchField from "../SearchField";
import userEvent from "@testing-library/user-event";

const MOCKED_ON_CHANGE = jest.fn();
const MOCKED_ON_RESET = jest.fn();

const setup = () => {
    render(<SearchField onChange={MOCKED_ON_CHANGE} onReset={MOCKED_ON_RESET} label="Search by" name="search" value="" />);
};

describe("SearchField component", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it("Should render without errors", () => {
        setup();

        expect(screen.getByTestId("search-icon")).toBeInTheDocument();
        expect(screen.getByLabelText("Search by")).toBeInTheDocument();
        expect(screen.queryByTestId("reset-icon")).not.toBeInTheDocument();
    });

    it("Should call delayed onChange", async () => {
        setup();

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Search by"), "Some text");
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_ON_CHANGE).toHaveBeenCalledWith("Some text");
    });

    it("Should clear input value by clicking on reset button", async () => {
        setup();

        await act(async () => {
           userEvent.paste(screen.getByLabelText("Search by"), "Some text");
           jest.runOnlyPendingTimers();
        });

        expect(MOCKED_ON_CHANGE).toHaveBeenCalledWith("Some text");

        await act(async () => {
            userEvent.click(screen.getByTestId("reset-icon"));
            jest.runOnlyPendingTimers();
        });

        expect(MOCKED_ON_RESET).toHaveBeenCalled();
    });
});


