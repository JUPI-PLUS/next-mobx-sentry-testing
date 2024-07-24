import { render, screen } from "@testing-library/react";
import TableStatus from "../TableStatus";
import { TableStatusVariant } from "../models";

describe("TableStatus component", () => {
    it.each<{ variant: TableStatusVariant; expectedClass: string }>([
        {
            variant: "warning",
            expectedClass: "before:bg-yellow-100",
        },
        {
            variant: "success",
            expectedClass: "before:bg-green-100",
        },
        {
            variant: "error",
            expectedClass: "before:bg-red-100",
        },
        {
            variant: "neutral",
            expectedClass: "before:bg-dark-500",
        },
    ])("Should render status according to variant", ({ variant, expectedClass }) => {
        render(<TableStatus variant={variant} text="Any status text" />);

        expect(screen.getByText("Any status text")).toBeInTheDocument();
        expect(screen.getByTestId(`table-status-${variant}`)).toBeInTheDocument();
        expect(screen.getByTestId(`table-status-${variant}`)).toHaveClass(expectedClass);
    });
});
