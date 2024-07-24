import {render, screen} from "@testing-library/react";
import {CircularProgressLoader} from "../CircularProgressLoader";

describe('CircularProgressLoader component', () => {
    it('Should render component without error', () => {
        render(<CircularProgressLoader />);

        expect(screen.getByTestId("circular-progress")).toBeInTheDocument();
    });
});
