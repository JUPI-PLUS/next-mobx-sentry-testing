import {AutocompleteProps, FormAutocompleteProps} from "../models";
import {act, render, renderHook, screen} from "@testing-library/react";
import Autocomplete from "../Autocomplete";
import FormAutocomplete from "../FormAutocomplete";
import {FormProvider, useForm} from "react-hook-form";
import userEvent from "@testing-library/user-event";

const MOCKED_OPTIONS = [
    {
        label: 'A',
        value: 'a'
    },
    {
        label: 'B',
        value: 'b',
    },
    {
        label: 'C',
        value: 'c'
    }
]

const MOCKED_LOAD_OPTIONS = (_: string) => new Promise<{ label: string; value: string }[]>((resolve) => resolve(MOCKED_OPTIONS));

const MOCKED_LABEL = 'My pretty autocomplete';
const MOCKED_NAME = 'my-pretty-autocomplete';
const MOCKED_ERROR_MESSAGE = 'Smth went wrong';

const setup = (props?: AutocompleteProps<{ label: string; value: string }>) => {
    render(<Autocomplete {...props} label={MOCKED_LABEL} name={MOCKED_NAME}/>)
}

const formSetup = (onSubmit: typeof jest.fn, props?: FormAutocompleteProps<{ label: string; value: string }>) => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            [MOCKED_NAME]: null
        }
    }))
    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(onSubmit)}>
                <FormAutocomplete {...props} name={MOCKED_NAME}/>
                <button type='submit'>Submit</button>
            </form>
        </FormProvider>
    );

    return result
}

describe('Autocomplete component', () => {
    it('Should render component without errors', () => {
        setup();

        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText(MOCKED_LABEL)).toBeInTheDocument();
    });

    it('Should show error message', () => {
        setup({errorMessage: MOCKED_ERROR_MESSAGE});

        expect(screen.getByText(MOCKED_ERROR_MESSAGE)).toBeInTheDocument();
    })
});

describe('FormAutocomplete component', () => {
    const MOCKED_ON_SUBMIT = jest.fn();
    it('Should render component without errors', () => {
        formSetup(MOCKED_ON_SUBMIT);

        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('Should call onSubmit with selected option', async () => {
        formSetup(MOCKED_ON_SUBMIT, {name: MOCKED_NAME, loadOptions: MOCKED_LOAD_OPTIONS});

        await act(async () => {
            userEvent.click(screen.getByRole('combobox'));
        });

        await act(async () => {
            userEvent.paste(screen.getByRole('combobox'), 'Smth');
        });

        await act(async () => {
            userEvent.click(screen.getByText('A'))
        });

        await act(async () => {
            userEvent.click(screen.getByText('Submit'));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith({
            [MOCKED_NAME]: {
                label: 'A',
                value: 'a'
            }
        }, expect.anything())
    });

    it('Should show error message', async () => {
        const form = formSetup(MOCKED_ON_SUBMIT, { name: MOCKED_NAME, loadOptions: MOCKED_LOAD_OPTIONS });

        await act(async () => {
            form.current.setError(MOCKED_NAME, {
                message: MOCKED_ERROR_MESSAGE
            });
        });

        expect(screen.getByText(MOCKED_ERROR_MESSAGE)).toBeInTheDocument();
    })
});