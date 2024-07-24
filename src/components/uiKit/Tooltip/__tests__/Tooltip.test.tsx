import { act, render, screen } from "@testing-library/react";
import { Tooltip } from "../Tooltip";
import { TooltipProps } from "../models";
import userEvent from "@testing-library/user-event";

const MOCKED_CONTENT_TEXT = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem consequuntur eveniet, fugit illo ipsa iste necessitatibus nemo neque quisquam quo, sed similique ut? Enim fugiat illo neque porro. Neque, ut?";
const MOCKED_TOOLTIP_TEXT = "My popper children";

const setup = (tooltipProps?: Partial<TooltipProps>) => {

    render(
        <>
            <Tooltip className="max-w-xl" text={MOCKED_TOOLTIP_TEXT} {...tooltipProps}>
                <p>{MOCKED_CONTENT_TEXT}</p>
            </Tooltip>

        </>
    );
};

describe("Tooltip component", () => {
    it("Should render component without errors", () => {
        setup();

        expect(screen.getByText(MOCKED_CONTENT_TEXT)).toBeInTheDocument();
    });

    it("Should render tooltip on hover", async () => {
        setup({isStatic: true});

        expect(screen.getByText(MOCKED_CONTENT_TEXT)).toBeInTheDocument();

        await act(async () => {
            userEvent.hover(screen.getByText(MOCKED_CONTENT_TEXT));
        })

        expect(screen.getByText(MOCKED_TOOLTIP_TEXT)).toBeInTheDocument();
    });
});
