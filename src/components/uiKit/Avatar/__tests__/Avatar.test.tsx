import { render, screen } from "@testing-library/react";
import Avatar from "../Avatar";

describe("Avatar component", () => {
    it("Should render image", () => {
        render(<Avatar image="some-image.jpg" />);

        expect(screen.getByTestId("avatar-image")).toBeInTheDocument();
        expect(screen.queryByTestId("avatar-placeholder")).not.toBeInTheDocument();
    });

    it("Should render image placeholder", () => {
        render(<Avatar />);

        expect(screen.queryByTestId("avatar-image")).not.toBeInTheDocument();
        expect(screen.getByTestId("avatar-placeholder")).toBeInTheDocument();
    });
});
