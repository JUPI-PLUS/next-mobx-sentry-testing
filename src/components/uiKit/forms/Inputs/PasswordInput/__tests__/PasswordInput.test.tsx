import { act, render, screen } from "@testing-library/react";
import PasswordInput from "../PasswordInput";
import userEvent from "@testing-library/user-event";
import FormContainer from "../../../FormContainer/FormContainer";
import { object } from "yup";

const MOCKED_PUSH = jest.fn();
const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: MOCKED_PUSH,
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF
            }
        };
    }
}));

const setup = () => {
    render(<PasswordInput label="Password" name="password" />);
}

const formSetup = () => {
    render(
        <FormContainer schema={object()} defaultValues={{}} onSubmit={() => {}}>
            <PasswordInput label="Password" name="password" />
        </FormContainer>
    );
}

describe("PasswordInput component", () => {
    it("Should render component without errors", () => {
        setup();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("Should show password by click on eye icon", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("show-password-icon"));
        })

        expect(screen.getByTestId("hide-password-icon")).toBeInTheDocument();
    });

    it("Should hide password by click on eye icon", () => {
        setup();

        act(() => {
            userEvent.click(screen.getByTestId("show-password-icon"));
        });

        expect(screen.getByTestId("hide-password-icon")).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByTestId("hide-password-icon"));
        });

        expect(screen.getByTestId("show-password-icon")).toBeInTheDocument();
    });
});

describe("FormPasswordInput component", () => {
    it("Should render without errors", () => {
        formSetup();

        expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });
});