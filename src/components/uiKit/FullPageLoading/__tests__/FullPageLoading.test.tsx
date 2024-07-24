import {render, screen} from "@testing-library/react";
import FullPageLoading from "../FullPageLoading";

describe('FullPageLoading component', () => {
    it('Should render component without error', () => {
        render(
            <FullPageLoading />
        );

        expect(screen.getByTestId('full-page-loading')).toBeInTheDocument();
    });
});