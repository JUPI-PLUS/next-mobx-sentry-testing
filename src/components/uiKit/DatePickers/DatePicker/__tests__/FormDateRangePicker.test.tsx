import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import FormDatePicker from "../FormDatePicker";
import { format } from "date-fns";

const MOCKED_ON_CHANGE = jest.fn();
const MOCKED_ON_SUBMIT = jest.fn();

const calendarIconTestId = "date-calendar-icon";

const setup = () => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            date: ""
        }
    }))

    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(MOCKED_ON_SUBMIT)}>
                <FormDatePicker name="date" onChange={MOCKED_ON_CHANGE} control={result.current.control} defaultValue="" />
            </form>
        </FormProvider>
    )
}


describe("FormDateRangePicker", () => {
    it("Should render without errors", () => {
        setup();

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByTestId(calendarIconTestId)).toBeInTheDocument();
    });

    it("Should call onChange on select date", async () => {
        const today = format(new Date(), "do LLLL (EEEE)");

        setup();

        await act(async () => {
            fireEvent.click(screen.getByTestId(calendarIconTestId));
        });

        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: today }));
        });

        await act(async () => {
            userEvent.click(screen.getByText("Submit"));
        });

        expect(MOCKED_ON_CHANGE).toHaveBeenCalled();
    });
});
