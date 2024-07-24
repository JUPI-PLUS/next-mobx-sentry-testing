import {act, render, screen} from "@testing-library/react";
import Accordion from "../Accordion";
import userEvent from "@testing-library/user-event";

const MOCKED_CHILDREN_TEXT = "Some text";
const MOCKED_TITLE = "Title";

const setup = (isOpen: boolean) => {
    render(
        <Accordion title={MOCKED_TITLE} isOpen={isOpen}>
            <p>{MOCKED_CHILDREN_TEXT}</p>
        </Accordion>
    )
}

describe("Accordion", () => {
    it("Should render component without errors", () => {
        setup(true);

        expect(screen.getByText(MOCKED_TITLE)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
    });

    it("Should open content by clicking on accordion title", () => {
        setup(false);

        expect(screen.getByTestId(`accordion-content-${MOCKED_TITLE}`)).toHaveClass("max-h-0");

        act(() => {
            userEvent.click(screen.getByText(MOCKED_TITLE))
        })

        expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
        expect(screen.getByTestId(`accordion-content-${MOCKED_TITLE}`)).toHaveClass("max-h-9999");
    });
});