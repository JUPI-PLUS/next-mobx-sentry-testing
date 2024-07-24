import {act, render, renderHook, screen} from "@testing-library/react";
import CreatableMultiSelect from "../CreatableMultiSelect";
import FormCreatableMultiSelect from "../FormCreatableMultiSelect";
import userEvent from "@testing-library/user-event";
import {FormMultiSelectProps, MultiSelectProps} from "../models";
import {FormProvider, useForm} from "react-hook-form";

const MOCKED_OPTIONS = [
    {
        label: 'A', value: 'a',
    },
    {
        label: 'B', value: 'b',
    },
    {
        label: 'C', value: 'c',
    }
];

const MOCKED_NAME = 'my-pretty-select';
const MOCKED_LABEL = 'My pretty select';
const MOCKED_ERROR_MESSAGE = 'Smth wrong';

const setup = (props: MultiSelectProps<{ label: string; value: string }>) => {
    render(<CreatableMultiSelect {...props} />);
}

const formSetup = (props: FormMultiSelectProps<{ label: string; value: string }>, onSubmit: typeof jest.fn) => {
    const {result} = renderHook(() => useForm({
        defaultValues: {
            'my-pretty-select': ''
        },
    }))
    render(
        <FormProvider {...result.current}>
            <form onSubmit={result.current.handleSubmit(onSubmit)}>
                <FormCreatableMultiSelect {...props} />
                <button type="submit">Submit</button>
            </form>
        </FormProvider>
    );

    return result;
}

describe('CreatableMultiSelect component', () => {
    it('Should render component without errors', () => {
        setup({name: MOCKED_NAME, label: MOCKED_LABEL, options: MOCKED_OPTIONS})

        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText(MOCKED_LABEL)).toBeInTheDocument();
    });

    it('Should render error message', () => {
        setup({name: MOCKED_NAME, label: MOCKED_LABEL, options: MOCKED_OPTIONS, errorMessage: MOCKED_ERROR_MESSAGE});

        expect(screen.getByText(MOCKED_ERROR_MESSAGE)).toBeInTheDocument();
    });

    it('Should call onChange when user change selected option', () => {
        const mockedOnChange = jest.fn();
        setup({name: MOCKED_NAME, options: MOCKED_OPTIONS, onChange: mockedOnChange});

        expect(screen.getByRole('combobox')).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByRole('combobox'));
        })

        act(() => {
            userEvent.click(screen.getByText('A'));
        })

        expect(mockedOnChange).toHaveBeenCalledWith([{label: "A", value: "a"}], expect.anything())
    });

    it('Should render disabled option', () => {
        setup({name: MOCKED_NAME, options: [...MOCKED_OPTIONS, {label: 'D', value: 'd', disabled: true}]});

        expect(screen.getByRole('combobox')).toBeInTheDocument();

        act(() => {
            userEvent.click(screen.getByRole('combobox'));
        })

        expect(screen.getByText('D')).toHaveAttribute('aria-disabled', "true")

    });
});

describe('FormCreatableMultiSelect component', () => {
    const MOCKED_ON_SUBMIT = jest.fn();

    it('Should render component without errors', () => {
        formSetup({name: MOCKED_NAME, options: MOCKED_OPTIONS}, MOCKED_ON_SUBMIT);

        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('Should call onSubmit with selected option', async () => {
        formSetup({name: MOCKED_NAME, options: MOCKED_OPTIONS}, MOCKED_ON_SUBMIT);

        await act(async () => {
            userEvent.click(screen.getByRole('combobox'));
        });

        await act(async () => {
            userEvent.click(screen.getByText('A'));
        });

        await act(async () => {
            userEvent.click(screen.getByText('Submit'));
        });

        expect(MOCKED_ON_SUBMIT).toHaveBeenCalledWith({'my-pretty-select': [{label: 'A', value: 'a'}]}, expect.anything())
    });

    it('Should show error message',async () => {
        const form = formSetup({ name: MOCKED_NAME, options: MOCKED_OPTIONS }, MOCKED_ON_SUBMIT);

        await act(async () => {
            form.current.setError(MOCKED_NAME, {
                message: MOCKED_ERROR_MESSAGE
            });
        });

        expect(screen.getByText(MOCKED_ERROR_MESSAGE)).toBeInTheDocument()
    });
});