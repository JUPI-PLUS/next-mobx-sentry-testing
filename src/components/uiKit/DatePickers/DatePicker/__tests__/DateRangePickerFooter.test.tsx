import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRange } from "react-day-picker";
import DatePickerFooter from "../components/DatePickerFooter";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../../../../shared/constants/formates";

const mockedOnCancel = jest.fn();
const mockedOnSubmit = jest.fn();

const setup = (range?: DateRange) => {
    render(<DatePickerFooter range={range} onCancel={mockedOnCancel} onSubmit={mockedOnSubmit} />);
};

describe("DateRangePickerFooter", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render selected date", () => {
        const range = { from: new Date() };
        const expectedDateFrom = format(range.from, DATE_FORMATS.DATE_ONLY);
        setup(range);

        expect(screen.getByText(expectedDateFrom)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("Should call onSubmit callback if range of dates was selected", () => {
        const range = { from: new Date(), to: new Date() };
        setup(range);

        act(() => {
            userEvent.click(screen.getByRole("button", { name: "Apply" }));
        });

        expect(mockedOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockedOnSubmit).toHaveBeenCalledWith(range);
    });

    it("Should call onSubmit callback if range of dates is empty", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByRole("button", { name: "Apply" }));
        });

        expect(mockedOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockedOnSubmit).toHaveBeenCalledWith(undefined);
    });

    it("Should call onCancel callback if user cancel selection", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByRole("button", { name: "Cancel" }));
        });

        expect(mockedOnSubmit).not.toHaveBeenCalled();
        expect(mockedOnCancel).toHaveBeenCalledTimes(1);
    });
});

