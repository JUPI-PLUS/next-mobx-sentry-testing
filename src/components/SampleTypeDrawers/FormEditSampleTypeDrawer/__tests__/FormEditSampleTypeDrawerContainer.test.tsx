// libs
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { act, render, screen } from "@testing-library/react";

// mocks
import { MOCKED_SAMPLE_TYPES } from "../../../../testingInfrustructure/mocks/dictionaries";

// helpers
import { mockFunction, resolveServerResponse } from "../../../../testingInfrustructure/utils";
import { getExamTemplatesBySampleTypeId, getSampleTypeDetails, patchSampleType } from "../../../../api/sampleTypes";

// components
import FormEditSampleTypeDrawerContainer from "../FormEditSampleTypeDrawerContainer";
import { MOCKED_EXAM_TEMPLATE } from "../../../../testingInfrustructure/mocks/exams";

const MOCKED_QUERY = jest.fn();
const MOCKED_PUSH = jest.fn();
const MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST = jest.fn();
const MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST = jest.fn();
const MOCKED_PATCH_SAMPLE_TYPE_REQUEST = jest.fn();
const MOCKED_PATCH_SAMPLE_TYPE = mockFunction(patchSampleType).mockReturnValue(MOCKED_PATCH_SAMPLE_TYPE_REQUEST);
const MOCKED_SAMPLE_TYPE = MOCKED_SAMPLE_TYPES[0];
const MOCKED_RANDOM_NAME = faker.random.alpha(10);
const MOCKED_RANDOM_CODE = faker.random.numeric(2);
const MOCKED_EXAM_TEMPLATE_ITEM = MOCKED_EXAM_TEMPLATE(1);

mockFunction(getSampleTypeDetails).mockReturnValue(MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST);
mockFunction(getExamTemplatesBySampleTypeId).mockReturnValue(MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST);
jest.mock("../../../../api/sampleTypes");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: MOCKED_QUERY(),
            push: MOCKED_PUSH,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <FormEditSampleTypeDrawerContainer sampleType={MOCKED_SAMPLE_TYPE} />
        </QueryClientProvider>
    );
};

describe("FormEditSampleTypeDrawerContainer", () => {
    beforeEach(() => {
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST, {
            data: MOCKED_SAMPLE_TYPE,
        });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATES_BY_SAMPLE_TYPE_ID_REQUEST, {
            data: [MOCKED_EXAM_TEMPLATE_ITEM],
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render table component without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("drawer-inner-container")).toBeInTheDocument();
        expect(screen.getByTestId("sample-type-code-input")).toHaveValue(MOCKED_SAMPLE_TYPE.code);
        expect(screen.getByTestId("sample-type-name-input")).toHaveValue(MOCKED_SAMPLE_TYPE.name);
        expect(screen.getByTestId("submit-drawer-button")).toBeDisabled();
        expect(screen.getByTestId(`examination-template-item-${MOCKED_EXAM_TEMPLATE_ITEM.uuid}`)).toBeInTheDocument();
    });

    it("Should replace name and code by server data", async () => {
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPE_DETAILS_REQUEST, {
            data: { id: 1, code: MOCKED_RANDOM_CODE, name: MOCKED_RANDOM_NAME },
        });

        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("sample-type-code-input")).toHaveValue(MOCKED_RANDOM_CODE);
        expect(screen.getByTestId("sample-type-name-input")).toHaveValue(MOCKED_RANDOM_NAME);
    });

    it("Should call patchSampleType by click on submit button", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.clear(screen.getByTestId("sample-type-code-input"));
            userEvent.paste(screen.getByTestId("sample-type-code-input"), MOCKED_RANDOM_CODE);
        });
        await act(async () => {
            userEvent.clear(screen.getByTestId("sample-type-name-input"));
            userEvent.paste(screen.getByTestId("sample-type-name-input"), MOCKED_RANDOM_NAME);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("submit-drawer-button"));
        });

        expect(MOCKED_PATCH_SAMPLE_TYPE).toBeCalledWith(MOCKED_SAMPLE_TYPE.id);
        expect(MOCKED_PATCH_SAMPLE_TYPE_REQUEST).toBeCalledWith({
            id: MOCKED_SAMPLE_TYPE.id,
            code: MOCKED_RANDOM_CODE,
            name: MOCKED_RANDOM_NAME,
        });
    });

    it("Should render attached examination template", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.clear(screen.getByTestId("sample-type-code-input"));
            userEvent.paste(screen.getByTestId("sample-type-code-input"), MOCKED_RANDOM_CODE);
        });
        await act(async () => {
            userEvent.clear(screen.getByTestId("sample-type-name-input"));
            userEvent.paste(screen.getByTestId("sample-type-name-input"), MOCKED_RANDOM_NAME);
        });

        await act(async () => {
            await userEvent.click(screen.getByTestId("submit-drawer-button"));
        });

        expect(MOCKED_PATCH_SAMPLE_TYPE).toBeCalledWith(MOCKED_SAMPLE_TYPE.id);
        expect(MOCKED_PATCH_SAMPLE_TYPE_REQUEST).toBeCalledWith({
            id: MOCKED_SAMPLE_TYPE.id,
            code: MOCKED_RANDOM_CODE,
            name: MOCKED_RANDOM_NAME,
        });
    });
});
