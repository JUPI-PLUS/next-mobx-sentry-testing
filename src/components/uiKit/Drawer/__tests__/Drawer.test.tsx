import { render, screen } from "@testing-library/react";
import Drawer from "../Drawer";
import userEvent from "@testing-library/user-event";
import FormDrawer from "../FormDrawer";
import { object, string } from "yup";
import FormInput from "../../forms/Inputs/CommonInput/FormInput";
import { act } from "react-dom/test-utils";

const MOCKED_ON_SUBMIT = jest.fn();
const MOCKED_ON_CLOSE = jest.fn();
const MOCKED_ON_CANCEL = jest.fn();

const MOCKED_SIZE = "xs";
const MOCKED_TITLE = "Drawer title";
const MOCKED_SUBMIT_TEXT = "Submit";
const MOCKED_CANCEL_TEXT = "Cancel";
const MOCKED_CHILDREN_TEXT = "Hello children";
const MOCKED_CHILDREN = <p>{MOCKED_CHILDREN_TEXT}</p>;

const MOCKED_INPUT_LABEL = "My input";
const MOCKED_FORM_SCHEMA = object().shape({
    input: string().min(5).max(10).required(),
});

const MOCKED_FORM_DEFAULT_VALUES = {
    input: "",
};

const MOCKED_FORM_CHILDREN = (
    <div>
        <FormInput name="input" label={MOCKED_INPUT_LABEL} />
    </div>
);

const setup = (isOpen = true, couldCloseOnBackdrop = false) => {
    render(
        <Drawer
            isOpen={isOpen}
            onSubmit={MOCKED_ON_SUBMIT}
            onClose={MOCKED_ON_CLOSE}
            onCancel={MOCKED_ON_CANCEL}
            title={MOCKED_TITLE}
            submitText={MOCKED_SUBMIT_TEXT}
            cancelText={MOCKED_CANCEL_TEXT}
            couldCloseOnBackdrop={couldCloseOnBackdrop}
        >
            {MOCKED_CHILDREN}
        </Drawer>
    );
};

const formSetup = (isOpen = true) => {
    render(
        <FormDrawer
            cancelButtonClassName="bg-white"
            cancelButtonVariant="neutral"
            submitButtonClassName="bg-white"
            submitButtonVariant="primary"
            couldCloseOnBackdrop
            couldCloseOnEsc
            schema={MOCKED_FORM_SCHEMA}
            defaultValues={MOCKED_FORM_DEFAULT_VALUES}
            mode="onSubmit"
            isOpen={isOpen}
            onSubmit={MOCKED_ON_SUBMIT}
            onClose={MOCKED_ON_CLOSE}
            onCancel={MOCKED_ON_CANCEL}
            title={MOCKED_TITLE}
            submitText={MOCKED_SUBMIT_TEXT}
            cancelText={MOCKED_CANCEL_TEXT}
            side="right"
            size={MOCKED_SIZE}
        >
            {MOCKED_FORM_CHILDREN}
        </FormDrawer>
    );
};

describe("Drawer component", () => {
    it("Should render component without errors", () => {
        setup();

        expect(screen.getByText(MOCKED_TITLE)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_CANCEL_TEXT)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_SUBMIT_TEXT)).toBeInTheDocument();
        expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
    });

    it("Should call onClose callback on click on close icon", () => {
        setup();

        userEvent.click(screen.getByTestId("close-drawer-button"));

        expect(MOCKED_ON_CLOSE).toHaveBeenCalled();
    });

    it("Should call onCancel callback on click on cancel button", () => {
        setup();

        userEvent.click(screen.getByText(MOCKED_CANCEL_TEXT));

        expect(MOCKED_ON_CANCEL).toHaveBeenCalled();
    });

    it("Should call onSubmit callback on click on submit button", () => {
        setup();

        userEvent.click(screen.getByText(MOCKED_SUBMIT_TEXT));

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalled();
    });

    it("Should not render drawer if isOpen prop is false", () => {
        setup(false);

        expect(screen.queryByText(MOCKED_TITLE)).not.toBeInTheDocument();
    });

    it("Should close drawer on click on backdrop if prop was provided", () => {
        setup(true, true);

        expect(screen.getByTestId("drawer-inner-container")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("drawer-container"));

        expect(screen.getByTestId("drawer-inner-container")).toBeInTheDocument();
    });
});

describe("FormDrawer", () => {
    it("Should render component without errors", () => {
        formSetup();

        expect(screen.getByText(MOCKED_TITLE)).toBeInTheDocument();
        expect(screen.getByLabelText(MOCKED_INPUT_LABEL)).toBeInTheDocument();
    });

    it("Should show error if value in input dont satisfy validation rules", async () => {
        formSetup();

        await act(async () => {
            userEvent.paste(screen.getByLabelText(MOCKED_INPUT_LABEL), "qwe");
        });

        await act(async () => {
            userEvent.click(screen.getByText(MOCKED_SUBMIT_TEXT));
        });

        expect(screen.getByTestId("field-input-error-container")).toBeInTheDocument();
    });

    it("Should call onSubmit callback on valid input", async () => {
        const MOCKED_INPUT_VALUE = "qwerty";
        formSetup();

        await act(async () => {
            userEvent.paste(screen.getByLabelText(MOCKED_INPUT_LABEL), MOCKED_INPUT_VALUE);
        });

        await act(async () => {
            userEvent.click(screen.getByText(MOCKED_SUBMIT_TEXT));
        });

        expect(screen.queryByTestId("field-input-error-container")).not.toBeInTheDocument();
        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith({ input: MOCKED_INPUT_VALUE }, expect.anything());
    });

    it("Should not render drawer if isOpen prop is false", () => {
        formSetup(false);

        expect(screen.queryByText(MOCKED_TITLE)).not.toBeInTheDocument();
    });
});
