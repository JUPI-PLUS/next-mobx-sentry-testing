import {render, screen} from "@testing-library/react";
import Notification from "../Notification";
import {NotificationVariant} from "../models";
import {AcademicCapIcon} from "@heroicons/react/20/solid";

const MOCKED_NOTIFICATION_TEXT = 'My notification';

describe('Notification component', () => {
    it.each<NotificationVariant>
    (['error', 'info', 'warning'])
    ('Should render without errors', (variant) => {
        render(<Notification text={MOCKED_NOTIFICATION_TEXT} variant={variant}/>);

        expect(screen.getByText(MOCKED_NOTIFICATION_TEXT)).toBeInTheDocument();
        expect(screen.getByTestId('notification-default-icon')).toBeInTheDocument();
    })

    it('Should render custom icon', () => {
        render(<Notification text={MOCKED_NOTIFICATION_TEXT} icon={<AcademicCapIcon data-testid="custom-icon" />} />)

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    })
})