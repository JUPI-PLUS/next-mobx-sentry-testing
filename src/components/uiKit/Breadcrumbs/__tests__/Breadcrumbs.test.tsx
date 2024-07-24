import { render, screen } from "@testing-library/react";
import Breadcrumbs from "../Breadcrumbs";

const MOCKED_LABEL = "Breadcrumbs label";

describe("Breadcrumbs component", () => {
    it("Should render component without error", () => {
        render(<Breadcrumbs label={MOCKED_LABEL} />);

        expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
        expect(screen.getByText(MOCKED_LABEL)).toBeInTheDocument();
    });
});
