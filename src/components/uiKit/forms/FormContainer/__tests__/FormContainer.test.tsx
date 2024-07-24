import {act, render, screen} from "@testing-library/react";
import FormContainer from "../FormContainer";
import FormInput from "../../Inputs/CommonInput/FormInput";
import {object, ObjectSchema, string} from "yup";
import {ObjectShape} from "yup/lib/object";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../../../../../shared/constants/routes";
import { clearQueriesLogout } from "../../../../../shared/utils/clearQueriesLogout";
import { mockFunction, resolveServerResponse } from "../../../../../testingInfrustructure/utils";
import { logout } from "../../../../../api/users";

const MOCKED_DISCLOSURE_ON_CLOSE = jest.fn();
const MOCKED_DISCLOSURE_IS_OPEN = jest.fn();

const useRouter = jest.spyOn(require("next/router"), "useRouter");
jest.mock("../../../../../shared/hooks/useDisclosure", () => ({
    useDisclosure() {
        return {
            onClose: MOCKED_DISCLOSURE_ON_CLOSE,
            isOpen: MOCKED_DISCLOSURE_IS_OPEN(),
        }
    }
}))
jest.mock("../../../../../shared/hooks/useBeforeLeaveConfirmation/useBeforeLeaveConfirmation", () => ({
    useBeforeLeaveConfirmation() {
        return {
            leaveConfirmation: jest.fn(),
        }
    }
}))

jest.mock("../../../../../shared/utils/clearQueriesLogout")
jest.mock("../../../../../api/users")

const MOCKED_DEFAULT_VALUES = {
    input: '',
}

const MOCKED_INPUT_NAME = 'input';

const DEFAULT_MOCKED_SCHEMA = object().shape({
    input: string()
});

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_CLEAR_QUERIES_LOGOUT = mockFunction(clearQueriesLogout);
const MOCKED_LOGOUT = mockFunction(logout);

const DEFAULT_MOCKED_ON_SUBMIT = jest.fn();

const MOCKED_INPUT_PLACEHOLDER = 'Placeholder';

const setup = (children: JSX.Element | JSX.Element[], onSubmit: typeof jest.fn, schema: ObjectSchema<ObjectShape>) => {
    render(
        <FormContainer schema={schema} onSubmit={onSubmit} defaultValues={MOCKED_DEFAULT_VALUES}>
            {children}
        </FormContainer>
    );
}

describe('FormContainer component', () => {
    beforeAll(() => {
        useRouter.mockImplementation(() => ({
            push: MOCKED_PUSH,
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF
            }
        }));
    })
    it('Should render component without errors', () => {
        setup(
            <FormInput name={MOCKED_INPUT_NAME} placeholder={MOCKED_INPUT_PLACEHOLDER}/>,
            DEFAULT_MOCKED_ON_SUBMIT,
            DEFAULT_MOCKED_SCHEMA
        );

        expect(screen.getByPlaceholderText(MOCKED_INPUT_PLACEHOLDER)).toBeInTheDocument();
    });

    it('Should show validation message on incorrect value in input', async () => {
        const expectedValidationError = 'Error';
        const incorrectValue = 'Hello';
        setup(
            <>
                <FormInput name={MOCKED_INPUT_NAME} placeholder={MOCKED_INPUT_PLACEHOLDER}/>
                <button type='submit'>Submit</button>
            </>,
            DEFAULT_MOCKED_ON_SUBMIT,
            object().shape({
                input: string().min(10, expectedValidationError)
            })
        )

        await act(async () => {
            userEvent.paste(screen.getByPlaceholderText(MOCKED_INPUT_PLACEHOLDER), incorrectValue);
        })

        await act(async () => {
            userEvent.click(screen.getByText('Submit'));
        })

        expect(screen.getByText(expectedValidationError)).toBeInTheDocument();
    });

    it('Should call onSubmit when pass validation rules', async () => {
        const validationError = 'Error';
        const correctValue = 'Hello my pretty form!';
        setup(
            <>
                <FormInput name={MOCKED_INPUT_NAME} placeholder={MOCKED_INPUT_PLACEHOLDER}/>
                <button type='submit'>Submit</button>
            </>,
            DEFAULT_MOCKED_ON_SUBMIT,
            object().shape({
                input: string().min(10, validationError)
            })
        );

        await act(async () => {
            userEvent.paste(screen.getByPlaceholderText(MOCKED_INPUT_PLACEHOLDER), correctValue);
        });

        await act(async () => {
            userEvent.click(screen.getByText('Submit'))
        });

        expect(screen.queryByText(validationError)).not.toBeInTheDocument();
        expect(DEFAULT_MOCKED_ON_SUBMIT).toHaveBeenCalled();
    });

    it.skip("Should clear queries if user logout when form is dirty",  async () => {
        MOCKED_DISCLOSURE_IS_OPEN.mockReturnValue(true);
        resolveServerResponse(MOCKED_CLEAR_QUERIES_LOGOUT, {})
        resolveServerResponse(MOCKED_LOGOUT, {})
        setup(
            <>
                <FormInput name={MOCKED_INPUT_NAME} placeholder={MOCKED_INPUT_PLACEHOLDER}/>
                <button type='submit'>Submit</button>
            </>,
            DEFAULT_MOCKED_ON_SUBMIT,
            object().shape({
                input: string().min(10, "")
            })
        );

        await act(async () => {
            userEvent.click(screen.getByRole("button", { name: "Confirm" }))
        })

        expect(MOCKED_CLEAR_QUERIES_LOGOUT).toHaveBeenCalled()
        expect(MOCKED_PUSH).toHaveBeenCalledWith(ROUTES.login.route)
    });
});
