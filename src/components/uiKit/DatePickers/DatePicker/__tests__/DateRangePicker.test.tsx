import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatePicker from "../DatePicker";
import { DatePickerProps } from "../../models";
import { addDays, format, startOfDay } from "date-fns";
import { DATE_FORMATS } from "../../../../../shared/constants/formates";

const mockedOnChange = jest.fn();

const setup = (props?: Partial<DatePickerProps>) => {
    render(<DatePicker {...props} name="date-picker" showOutsideDays />);
};

const calendarTestId = "date-picker-calendar-icon";

describe("DatePicker", () => {
    it("Should render without errors", () => {
        setup();

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByTestId(calendarTestId)).toBeInTheDocument();
        expect(screen.queryByTestId("date-range-container")).not.toBeInTheDocument();
    });

    it("Should open date picker", async () => {
        setup();

        await act(async () => {
            userEvent.click(screen.getByTestId(calendarTestId));
        });

        expect(screen.getByTestId("date-range-container")).toBeInTheDocument();
    });

    it("Should close date picker by clicking on cancel button", async () => {
        setup();

        await act(async () => {
            userEvent.click(screen.getByTestId(calendarTestId));
        });

        expect(screen.getByTestId("date-range-container")).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByText("Cancel"));
        });

        expect(screen.queryByTestId("date-range-container")).not.toBeInTheDocument();
    });

    it("Should set one date to input", async () => {
        const today = new Date();
        const dateStart = format(today, "do LLLL (EEEE)");
        const expectedStart = format(today, DATE_FORMATS.DATE_ONLY);

        setup({ onChange: mockedOnChange });

        await selectDateRangeInCalendar(dateStart);

        expect(screen.getByRole("textbox")).toHaveValue(`${expectedStart}`);
        expect(mockedOnChange).toHaveBeenCalledWith({
            from: startOfDay(today),
            to: undefined,
        });
    });

    // TODO: skipped cause this test should be in date filter picker
    it.skip("Should set new range to input", async () => {
        const today = new Date();
        const tomorrow = addDays(today, 1);
        const dateStart = format(today, "do LLLL (EEEE)");
        const dateEnd = format(tomorrow, "do LLLL (EEEE)");

        const expectedStart = format(today, DATE_FORMATS.DATE_ONLY);
        const expectedEnd = format(tomorrow, DATE_FORMATS.DATE_ONLY);

        setup();

        await selectDateRangeInCalendar(dateStart, dateEnd);

        expect(screen.getByRole("textbox")).toHaveValue(`${expectedStart} - ${expectedEnd}`);
    });

    it("Should call onChange on select date range", async () => {
        const today = new Date();
        const dateStart = format(today, "do MMMM (EEEE)");

        setup({ onChange: mockedOnChange });

        await selectDateRangeInCalendar(dateStart);

        expect(mockedOnChange).toHaveBeenCalledWith({
            from: startOfDay(today),
            to: undefined,
        });
    });

    it("Should call onReset on click on clear button", async () => {
        const today = new Date();
        const dateStart = format(today, "do LLLL (EEEE)");

        setup({ onChange: mockedOnChange });

        await selectDateRangeInCalendar(dateStart);

        expect(mockedOnChange).toHaveBeenCalledWith({
            from: startOfDay(today),
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("date-picker-reset-calendar-value-icon"));
        });

        expect(screen.getByTestId("datepicker-input")).toHaveValue("");
    });

    it("Should call onChange with empty value by clicking on Apply without select any date", async () => {
        setup({ onChange: mockedOnChange });

        await act(async () => {
            userEvent.click(screen.getByTestId(calendarTestId));
        });

        expect(screen.getByTestId("date-range-container")).toBeInTheDocument();
        act(() => {
            userEvent.click(screen.getByText("Submit"));
        });

        expect(mockedOnChange).toHaveBeenCalledWith(undefined);
    });
});

async function selectDateRangeInCalendar(start: string, end?: string) {
    await act(async () => {
        userEvent.click(screen.getByTestId(calendarTestId));
    });

    expect(screen.getByTestId("date-range-container")).toBeInTheDocument();

    act(() => {
        fireEvent.click(screen.getByRole("button", { name: start }));
    });

    if (end) {
        act(() => {
            fireEvent.click(screen.getByRole("button", { name: end }), { shiftKey: true });
        });
    }

    act(() => {
        userEvent.click(screen.getByText("Submit"));
    });
}
