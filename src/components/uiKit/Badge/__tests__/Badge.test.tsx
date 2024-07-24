import {render, screen} from "@testing-library/react";
import Badge from "../Badge";

const MOCKED_BADGE_TEXT = "Hello";

describe("Badge component", () => {
    it.each<{ variant: "info" | "error" | "warning" | "neutral" | "success"; expectedClass: string }>([
        {
            variant: "info",
            expectedClass: "bg-brand-100 text-white"
        },
        {
            variant: "error",
            expectedClass: "bg-red-100 text-white"
        },
        {
            variant: "warning",
            expectedClass: "bg-yellow-100 text-white"
        },
        {
            variant: "neutral",
            expectedClass: "bg-dark-500 text-white"
        },
        {
            variant: "success",
            expectedClass: "bg-green-100 text-white"
        },
    ])("Should render badge according to variant", ({variant, expectedClass}) => {
        render(<Badge text={MOCKED_BADGE_TEXT} variant={variant}/>)
        expect(screen.getByTestId(`badge-${variant}-${MOCKED_BADGE_TEXT}`)).toBeInTheDocument();
        expect(screen.getByTestId(`badge-${variant}-${MOCKED_BADGE_TEXT}`)).toHaveClass(expectedClass);
    })
})