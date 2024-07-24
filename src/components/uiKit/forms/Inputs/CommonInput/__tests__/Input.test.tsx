import {screen, render, renderHook, act} from '@testing-library/react';
import Input from '../Input';
import {FormInputProps, InputProps} from '../models';
import userEvent from '@testing-library/user-event';
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import FormInput from "../FormInput";
import {FormProvider, useForm} from "react-hook-form";

const INPUT_LABEL = 'Hello input!';
const FORM_INPUT_NAME = 'formInput';

const setup = (props: InputProps) => {
    render(<Input {...props} name="my-test-input"/>);
};

const formSetup = (props: FormInputProps, onSubmit: typeof jest.fn) => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            formInput: ""
        }
    }))

    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(onSubmit)}>
                <FormInput name={FORM_INPUT_NAME}/>
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    )

    return { form: result }
}

describe('Input component', () => {
    it('Should render without errors', () => {
        setup({label: INPUT_LABEL});
        expect(screen.getByLabelText(INPUT_LABEL)).toBeInTheDocument();
    });

    it('Should render icons for input', () => {
        setup({
            startIcon: <InformationCircleIcon data-testid="start-icon"/>,
        });

        expect(screen.getByTestId('start-icon')).toBeInTheDocument();

        setup({
            endIcon: <InformationCircleIcon data-testid="end-icon"/>,
        });

        expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('Should render error message', () => {
        const expectedErrorMessage = 'Smth went wrong';
        setup({
            errorMessage: expectedErrorMessage,
        });

        expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
    });

    it('Should call onChange when user type smth', () => {
        const mockedOnChange = jest.fn();
        setup({onChange: mockedOnChange, label: INPUT_LABEL});
        const input = screen.getByLabelText(INPUT_LABEL);

        userEvent.type(input, 'BA');

        expect(mockedOnChange).toHaveBeenCalledTimes(2);
    });

    it('Should call onChange when user paste text', () => {
        const mockedOnChange = jest.fn();
        setup({onChange: mockedOnChange, label: INPUT_LABEL});
        const input = screen.getByLabelText(INPUT_LABEL);
        const expectedInputValue = 'Lorem ipsum dolor sit amet.';

        userEvent.paste(input, expectedInputValue);

        expect(mockedOnChange).toHaveBeenCalledTimes(1);
    });
});

describe('FormInput component', () => {
    it('Should render component without errors', () => {
        const mockedOnSubmit = jest.fn();
        formSetup({name: FORM_INPUT_NAME}, mockedOnSubmit);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('Should call onSubmit on click on submit button', async () => {
        const expectedInputValue = "Hello!";
        const mockedOnSubmit = jest.fn();
        formSetup({name: FORM_INPUT_NAME}, mockedOnSubmit);

        await act(async () => {
            userEvent.paste(screen.getByRole('textbox'), expectedInputValue);
        })

        await act(async () => {
            userEvent.click(screen.getByRole('button'));
        })

        expect(mockedOnSubmit).toHaveBeenCalledWith({formInput: expectedInputValue}, expect.anything())
    });

    it('Should show error under input',  async () => {
        const expectedErrorMessage = "Smth went wrong";
        const mockedOnSubmit = jest.fn();
        const {form} = formSetup({name: FORM_INPUT_NAME}, mockedOnSubmit);

        await act(async () => {
            form.current.setError(FORM_INPUT_NAME, {
                message: expectedErrorMessage
            })
        })

        expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
    })
})
