import {render, renderHook, screen} from "@testing-library/react";
import Toggle from "../Toggle";
import {ToggleProps, FormToggleProps} from "../models";
import userEvent from "@testing-library/user-event";
import {FormProvider, useForm} from "react-hook-form";
import FormToggle from "../FormToggle";
import {act} from "react-dom/test-utils";

const MOCKED_TOGGLE_LABEL = "My pretty toggle";
const MOCKED_CHECKBOX_ERROR_MESSAGE = "Error";
const MOCKED_TOGGLE_NAME = "my-pretty-toggle";

const setup = (props?: Partial<ToggleProps>) => {
    render(<Toggle {...props} />)
};

const formSetup = (onSubmit: typeof jest.fn, props?: Partial<FormToggleProps>) => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            [MOCKED_TOGGLE_NAME]: false
        }
    }));

    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(onSubmit)}>
                <FormToggle name={MOCKED_TOGGLE_NAME} {...props} />
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );

    return result;
}

describe('Toggle component', () => {
    const MOCKED_TOGGLE_CHANGE = jest.fn();
    it('Should render component without errors', () => {
        setup({ label: MOCKED_TOGGLE_LABEL });

        expect(screen.getByText(MOCKED_TOGGLE_LABEL)).toBeInTheDocument();
    });

    it('Should render error message', () => {
        setup({ errorMessage: MOCKED_CHECKBOX_ERROR_MESSAGE });

        expect(screen.getByText(MOCKED_CHECKBOX_ERROR_MESSAGE)).toBeInTheDocument();
    });

    it('Should should call onChange callback when checkbox was clicked', () => {
        setup({ name: MOCKED_TOGGLE_NAME, label: MOCKED_TOGGLE_LABEL, onChange: MOCKED_TOGGLE_CHANGE });

        userEvent.click(screen.getByLabelText(MOCKED_TOGGLE_LABEL));

        expect(MOCKED_TOGGLE_CHANGE).toHaveBeenCalled();
        expect(screen.getByLabelText(MOCKED_TOGGLE_LABEL)).toBeChecked();
    });
});

describe('FormToggle component', () => {
    const MOCKED_ON_SUBMIT = jest.fn();
    it('Should render component without errors', () => {
       formSetup(MOCKED_ON_SUBMIT, { name: MOCKED_TOGGLE_NAME, label: MOCKED_TOGGLE_LABEL });

       expect(screen.getByLabelText(MOCKED_TOGGLE_LABEL)).toBeInTheDocument();
    });

    it('Should call onSubmit on click on submit button', async () => {
        formSetup(MOCKED_ON_SUBMIT, { label: MOCKED_TOGGLE_LABEL });

        await act(async () => {
            userEvent.click(screen.getByLabelText(MOCKED_TOGGLE_LABEL));
        });

        await act(async () => {
            userEvent.click(screen.getByRole('button', { name: 'Submit' }));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith({ [MOCKED_TOGGLE_NAME]: true }, expect.anything());
    });

    it('Should render error under toggle', async () => {
        const expectedError = 'Smth went wrong';
        const form = formSetup(MOCKED_ON_SUBMIT, { name: MOCKED_TOGGLE_NAME, label: MOCKED_TOGGLE_LABEL });

        await act(async () => {
            form.current.setError(MOCKED_TOGGLE_NAME, {
                message: expectedError,
            });
        });

        expect(screen.getByText(expectedError)).toBeInTheDocument();
    })
})