import { render, screen } from "@testing-library/react";
import ExamStatus from "../ExamStatus";
import { ExamStatusVariant } from "../models";

describe("ExamStatus component", () => {
    it.each<{ variant: ExamStatusVariant; expectedClass: string }>([
        {
            variant: "warning",
            expectedClass: "text-yellow-100",
        },
        {
            variant: "success",
            expectedClass: "text-green-100",
        },
        {
            variant: "error",
            expectedClass: "text-red-100",
        },
    ])("Should render status according to variant", ({ variant, expectedClass }) => {
        render(<ExamStatus variant={variant} text="Any status text" />);

        expect(screen.getByText("Any status text")).toBeInTheDocument();
        expect(screen.getByTestId(`status-${variant}`)).toBeInTheDocument();
        expect(screen.getByTestId(`status-${variant}`)).toHaveClass(expectedClass);
    });
});
