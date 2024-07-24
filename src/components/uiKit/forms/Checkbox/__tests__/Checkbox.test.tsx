import {render, renderHook, screen} from "@testing-library/react";
import Checkbox from "../Checkbox";
import {CheckboxProps, FormCheckboxProps} from "../models";
import userEvent from "@testing-library/user-event";
import {FormProvider, useForm} from "react-hook-form";
import FormCheckbox from "../FormCheckbox";
import {act} from "react-dom/test-utils";

const MOCKED_CHECKBOX_LABEL = "My pretty checkbox";
const MOCKED_CHECKBOX_ERROR_MESSAGE = "Error";
const MOCKED_CHECKBOX_NAME = "my-pretty-checkbox";

const setup = (props?: Partial<CheckboxProps>) => {
    render(<Checkbox {...props} />)
};

const formSetup = (onSubmit: typeof jest.fn, props?: Partial<FormCheckboxProps>) => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            [MOCKED_CHECKBOX_NAME]: false
        }
    }));

    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(onSubmit)}>
                <FormCheckbox name={MOCKED_CHECKBOX_NAME} {...props} />
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );

    return result;
}

describe('Checkbox component', () => {
    const MOCKED_CHECKBOX_CHANGE = jest.fn();
    it('Should render component without errors', () => {
        setup({ label: MOCKED_CHECKBOX_LABEL });

        expect(screen.getByText(MOCKED_CHECKBOX_LABEL)).toBeInTheDocument();
    });

    it('Should render error message', () => {
        setup({ errorMessage: MOCKED_CHECKBOX_ERROR_MESSAGE });

        expect(screen.getByText(MOCKED_CHECKBOX_ERROR_MESSAGE)).toBeInTheDocument();
    });

    it('Should should call onChange callback when checkbox was clicked', () => {
        setup({ name: MOCKED_CHECKBOX_NAME, label: MOCKED_CHECKBOX_LABEL, onChange: MOCKED_CHECKBOX_CHANGE });

        userEvent.click(screen.getByLabelText(MOCKED_CHECKBOX_LABEL));

        expect(MOCKED_CHECKBOX_CHANGE).toHaveBeenCalled();
        expect(screen.getByLabelText(MOCKED_CHECKBOX_LABEL)).toBeChecked();
    });
});

describe('FormCheckbox component', () => {
    const MOCKED_ON_SUBMIT = jest.fn();
    it('Should render component without errors', () => {
       formSetup(MOCKED_ON_SUBMIT, { name: MOCKED_CHECKBOX_NAME, label: MOCKED_CHECKBOX_LABEL });

       expect(screen.getByLabelText(MOCKED_CHECKBOX_LABEL)).toBeInTheDocument();
    });

    it('Should call onSubmit on click on submit button', async () => {
        formSetup(MOCKED_ON_SUBMIT, { label: MOCKED_CHECKBOX_LABEL });

        await act(async () => {
            userEvent.click(screen.getByLabelText(MOCKED_CHECKBOX_LABEL));
        });

        await act(async () => {
            userEvent.click(screen.getByRole('button', { name: 'Submit' }));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith({ [MOCKED_CHECKBOX_NAME]: true }, expect.anything());
    });

    it('Should render error under checkbox', async () => {
        const expectedError = 'Smth went wrong';
        const form = formSetup(MOCKED_ON_SUBMIT, { name: MOCKED_CHECKBOX_NAME, label: MOCKED_CHECKBOX_LABEL });

        await act(async () => {
            form.current.setError(MOCKED_CHECKBOX_NAME, {
                message: expectedError,
            });
        });

        expect(screen.getByText(expectedError)).toBeInTheDocument();
    })
})
