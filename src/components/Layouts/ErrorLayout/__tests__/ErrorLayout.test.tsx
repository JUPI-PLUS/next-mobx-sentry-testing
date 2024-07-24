import { render, screen } from "@testing-library/react";
import ErrorLayout from "../ErrorLayout";

const MOCKED_CHILDREN_TEXT = "Hello children!";
const MOCKED_CHILDREN = <p>{MOCKED_CHILDREN_TEXT}</p>

describe("ErrorLayout component", () => {
    it("Should render without errors", () => {
        render(<ErrorLayout>{MOCKED_CHILDREN}</ErrorLayout>);

        expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
    });
});