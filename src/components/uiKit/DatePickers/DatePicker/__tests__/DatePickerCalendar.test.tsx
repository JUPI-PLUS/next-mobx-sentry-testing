import { act, fireEvent, render, screen } from "@testing-library/react";
import { DateRange } from "react-day-picker";
import DatePickerCalendar from "../components/DatePickerCalendar";
import { add, format } from "date-fns";

const mockedSetDate = jest.fn();
const mockedOnClickAway = jest.fn();

const setup = (range?: DateRange) => {
    render(
        <DatePickerCalendar
            dateRange={range}
            setDate={mockedSetDate}
            onClickAway={mockedOnClickAway}
            showOutsideDays
        />
    );
};

describe("DatePickerCalendar", () => {
    it("Should component without errors render selected date range", () => {
        const range = { from: new Date(), to: new Date() };
        setup(range);

        const formattedDate = format(new Date(), "dd/MM/yyyy");

        expect(screen.getByTestId(formattedDate)).toBeInTheDocument();
        expect(screen.getByTestId(formattedDate)).toHaveClass("rdp-day_selected");
    });

    it("Should call setDate on click on day in calendar", async () => {
        setup();

        const today = format(new Date(), "do MMMM (EEEE)");
        const tomorrow = format(add(new Date(), {
            days: 1
        }), "do MMMM (EEEE)");

        expect(screen.getByTestId("date-range-container")).toBeInTheDocument();

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: today }));
        });

        act(() => {
            fireEvent.click(screen.getByRole("button", { name: tomorrow }), { shiftKey: true });
        });

        expect(mockedSetDate).toHaveBeenCalled();
    });
});
