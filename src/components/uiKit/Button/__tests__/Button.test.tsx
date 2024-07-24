import {render, screen} from "@testing-library/react";
import {IconButton, OutlineButton, SolidButton, TextButton} from "../Button";
import {ButtonProps, ButtonVariant, IconButtonProps} from "../models";
import userEvent from "@testing-library/user-event";
import {InformationCircleIcon} from "@heroicons/react/20/solid";

const MOCKED_BUTTON_TEXT = "Hello button!";

const setupOutline = (props?: ButtonProps) => {
    return render(<OutlineButton {...props} text={MOCKED_BUTTON_TEXT}/>)
}

const setupSolid = (props?: ButtonProps) => {
    return render(<SolidButton {...props} text={MOCKED_BUTTON_TEXT}/>)
}

const setupText = (props?: ButtonProps) => {
    return render(<TextButton {...props} text={MOCKED_BUTTON_TEXT}/>)
}

const setupIcon = (props?: Partial<IconButtonProps>) => {
    return render(<IconButton {...props}><InformationCircleIcon data-testid="icon-for-icon-button"/></IconButton>)
}

describe("Button component", () => {
    describe("BaseButton", () => {
        it('Should render disabled button', () => {
            setupOutline({disabled: true});

            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeDisabled();
        });

        it('Should render disabled button', () => {
            setupOutline({disabled: true});

            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeInTheDocument();
            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeDisabled();
        });

        it('Should call onClick handler when user click on button', () => {
            const mockedOnClick = jest.fn();
            setupOutline({onClick: mockedOnClick});

            userEvent.click(screen.getByRole('button'));
            expect(mockedOnClick).toHaveBeenCalled();
        });

        it('Should render small button', () => {
            setupOutline({size: 'sm'});

            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('Should render large button', () => {
            setupOutline({size: 'lg'});

            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('Should render startIcon', () => {
            setupOutline({startIcon: <InformationCircleIcon className="w-4 h-4" data-testid="start-icon"/>});

            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
        })

        it('Should render endIcon', () => {
            setupOutline({endIcon: <InformationCircleIcon className="w-4 h-4" data-testid="end-icon"/>})

            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        })
    });

    describe("OutlineButton component", () => {
        it.each(['error', 'neutral', 'warning', 'primary'])('Should render component without error', (variant) => {
            setupOutline({variant: variant as ButtonVariant});

            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeInTheDocument();
        });
    });

    describe("SolidButton component", () => {
        it.each(['error', 'neutral', 'warning', 'primary'])('Should render component without error', (variant) => {
            setupSolid({variant: variant as ButtonVariant});

            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeInTheDocument();
        });
    });

    describe("TextButton component", () => {
        it.each(['error', 'neutral', 'warning', 'primary'])('Should render component without error', (variant) => {
            setupText({variant: variant as ButtonVariant});

            expect(screen.getByRole('button', {name: MOCKED_BUTTON_TEXT})).toBeInTheDocument();
        });
    });

    describe("IconButton component", () => {
        it.each(['error', 'neutral', 'warning', 'primary'])('Should render component without error', (variant) => {
            setupIcon({variant: variant as ButtonVariant});

            expect(screen.getByTestId('icon-for-icon-button')).toBeInTheDocument();
        });

        it.each<"thin" | "sm" | "md" | "lg">(['sm', 'md', 'lg'])('Should render component with different size', (size) => {
            setupIcon({ size });

            expect(screen.getByTestId('icon-for-icon-button')).toBeInTheDocument();
        });
    });
});
