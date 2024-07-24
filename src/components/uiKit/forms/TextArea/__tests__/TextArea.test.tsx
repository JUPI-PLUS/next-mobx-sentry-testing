import {screen, render, renderHook, act} from '@testing-library/react';
import TextArea from '../TextArea';
import {FormTextAreaProps, TextAreaProps} from '../models';
import userEvent from '@testing-library/user-event';
import FormTextArea from "../FormTextArea";
import {FormProvider, useForm} from "react-hook-form";

const TEXT_AREA_LABEL = 'Hello input!';
const FORM_TEXT_AREA_NAME = 'formInput';

const setup = (props: TextAreaProps) => {
    render(<TextArea {...props} name="my-test-input"/>);
};

const formSetup = (props: FormTextAreaProps, onSubmit: typeof jest.fn) => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            formInput: ""
        }
    }))

    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(onSubmit)}>
                <FormTextArea name={FORM_TEXT_AREA_NAME}/>
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    )

    return { form: result }
}

describe('TextArea component', () => {
    it('Should render without errors', () => {
        setup({label: TEXT_AREA_LABEL});
        expect(screen.getByLabelText(TEXT_AREA_LABEL)).toBeInTheDocument();
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
        setup({onChange: mockedOnChange, label: TEXT_AREA_LABEL});
        const input = screen.getByLabelText(TEXT_AREA_LABEL);

        userEvent.type(input, 'BA');

        expect(mockedOnChange).toHaveBeenCalledTimes(2);
    });

    it('Should call onChange when user paste text', () => {
        const mockedOnChange = jest.fn();
        setup({onChange: mockedOnChange, label: TEXT_AREA_LABEL});
        const input = screen.getByLabelText(TEXT_AREA_LABEL);
        const expectedInputValue = 'Lorem ipsum dolor sit amet.';

        userEvent.paste(input, expectedInputValue);

        expect(mockedOnChange).toHaveBeenCalledTimes(1);
    });
});

describe('FormTextArea component', () => {
    it('Should render component without errors', () => {
        const mockedOnSubmit = jest.fn();
        formSetup({name: FORM_TEXT_AREA_NAME}, mockedOnSubmit);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('Should call onSubmit on click on submit button', async () => {
        const expectedInputValue = "Hello!";
        const mockedOnSubmit = jest.fn();
        formSetup({name: FORM_TEXT_AREA_NAME}, mockedOnSubmit);

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
        const {form} = formSetup({name: FORM_TEXT_AREA_NAME}, mockedOnSubmit);

        await act(async () => {
            form.current.setError(FORM_TEXT_AREA_NAME, {
                message: expectedErrorMessage
            })
        })

        expect(screen.getByText(expectedErrorMessage)).toBeInTheDocument();
    })
})
