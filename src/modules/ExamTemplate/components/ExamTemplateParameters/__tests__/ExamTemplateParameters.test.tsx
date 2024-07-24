// libs
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

// helpers
import { getExamTemplateInfo, getExamTemplateParams, setParamsRelations } from "../../../../../api/examTemplates";
import { mockFunction, resolveServerResponse } from "../../../../../testingInfrustructure/utils";
import { getExamTemplateStatuses, getMeasurementUnits, getSampleTypes } from "../../../../../api/dictionaries";
import { createParamsGroup, deleteParamsGroup, editParamsGroup } from "../../../../../api/paramsGroups";

//  constants
import { EXAM_TEMPLATE_TITLES } from "../../../constants";

// components
import ExamTemplateModule from "../../../ExamTemplateModule";

// mocks
import {
    MOCKED_EXAM_TEMPLATE_STATUSES,
    MOCKED_MEASUREMENT_UNITS,
    MOCKED_SAMPLE_TYPES,
} from "../../../../../testingInfrustructure/mocks/dictionaries";
import {
    MOCKED_EXAM_TEMPLATE_GENERAL_INFO,
    MOCKED_EXAM_TEMPLATE_PARAMETERS,
} from "../../../../../testingInfrustructure/mocks/examTemplate";

const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();

const MOCKED_GET_SAMPLE_TYPES = mockFunction(getSampleTypes);
const MOCKED_GET_MEASUREMENT_UNITS = mockFunction(getMeasurementUnits);
const MOCKED_GET_EXAM_TEMPLATE_STATUSES = mockFunction(getExamTemplateStatuses);

const MOCKED_EXAM_TEMPLATE_INFO = mockFunction(getExamTemplateInfo);
const MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST = jest.fn();
const MOCKED_EXAM_TEMPLATE_PARAMS = mockFunction(getExamTemplateParams);
const MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST = jest.fn();

const MOCKED_CREATE_GROUP = mockFunction(createParamsGroup);
const MOCKED_EDIT_GROUP = mockFunction(editParamsGroup);
const MOCKED_EDIT_GROUP_QUERY_REQUEST = jest.fn();
const MOCKED_DELETE_GROUP = mockFunction(deleteParamsGroup);
const MOCKED_DELETE_GROUP_QUERY_REQUEST = jest.fn();

const MOCKED_SET_PARAMS_RELATIONS = mockFunction(setParamsRelations);
const MOCKED_SET_PARAMS_RELATIONS_QUERY_REQUEST = jest.fn();

const MOCKED_GROUP_NAME = faker.random.alpha(10);
const MOCKED_CREATE_GROUP_RESPONSE = { name: MOCKED_GROUP_NAME, uuid: faker.datatype.uuid() };
const MOCK_QUERY = jest.fn(() => ({ uuid: MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid }));

jest.mock("../../../../../api/dictionaries");
jest.mock("../../../../../api/examTemplates");
jest.mock("../../../../../api/paramsGroups");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF,
            },
            query: MOCK_QUERY(),
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <ExamTemplateModule />
        </QueryClientProvider>
    );
};

describe("Exam Template module - step 2 - parameters", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_GET_SAMPLE_TYPES, { data: MOCKED_SAMPLE_TYPES });
        resolveServerResponse(MOCKED_GET_MEASUREMENT_UNITS, { data: MOCKED_MEASUREMENT_UNITS });
        resolveServerResponse(MOCKED_GET_EXAM_TEMPLATE_STATUSES, { data: MOCKED_EXAM_TEMPLATE_STATUSES });

        resolveServerResponse(MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST, { data: MOCKED_EXAM_TEMPLATE_GENERAL_INFO });
        MOCKED_EXAM_TEMPLATE_INFO.mockReturnValue(MOCKED_EXAM_TEMPLATE_INFO_QUERY_REQUEST);

        resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, { data: MOCKED_EXAM_TEMPLATE_PARAMETERS });
        MOCKED_EXAM_TEMPLATE_PARAMS.mockReturnValue(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST);

        resolveServerResponse(MOCKED_SET_PARAMS_RELATIONS_QUERY_REQUEST, { data: {} });
        MOCKED_SET_PARAMS_RELATIONS.mockReturnValue(MOCKED_SET_PARAMS_RELATIONS_QUERY_REQUEST);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render component without errors and with wright parameters (groups and params) on the second step", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByTestId("breadcrumbsLabel")).toHaveTextContent("Edit exam template");
        await act(async () => {
            userEvent.click(screen.getByTestId("submit-stepper-button"));
        });
        expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(EXAM_TEMPLATE_TITLES.PARAMETERS);
        expect(screen.getByTestId("add-parameter-button")).toBeInTheDocument();
        expect(screen.getByTestId("add-parameters-group-button")).toBeInTheDocument();

        expect(
            screen.getByTestId(`parameter-group-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
        ).toHaveTextContent(MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_name!);

        expect(
            screen.getByTestId(`parameter-group-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
        ).toHaveTextContent(MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_name!);

        expect(
            screen.getByTestId(`parameter-param-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].uuid}`)
        ).toHaveTextContent(MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].name);
    });

    it("Should call setParamsRelations endpoint by clicking save template button", async () => {
        resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, {
            data: MOCKED_EXAM_TEMPLATE_PARAMETERS.slice(0, 2),
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-stepper-button"));
        });
        expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(EXAM_TEMPLATE_TITLES.PARAMETERS);
        await act(async () => {
            userEvent.click(screen.getByTestId("submit-stepper-button"));
        });

        expect(MOCKED_SET_PARAMS_RELATIONS).toHaveBeenCalledWith(MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid);
        expect(MOCKED_SET_PARAMS_RELATIONS_QUERY_REQUEST).toHaveBeenCalledWith(
            MOCKED_EXAM_TEMPLATE_PARAMETERS[1].params!.map(param => ({
                param_uuid: param.uuid,
                group_uuid: MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid,
            }))
        );
    });

    it("Should not call setParamsRelations endpoint by clicking save template button if there is no parameters in exam template", async () => {
        resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, {
            data: [MOCKED_EXAM_TEMPLATE_PARAMETERS[0]],
        });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-stepper-button"));
        });
        expect(screen.getByTestId("stepper-header-title")).toHaveTextContent(EXAM_TEMPLATE_TITLES.PARAMETERS);
        await act(async () => {
            userEvent.click(screen.getByTestId("submit-stepper-button"));
        });

        expect(MOCKED_SET_PARAMS_RELATIONS_QUERY_REQUEST).not.toHaveBeenCalled();
    });

    describe("Groups", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, {
                data: MOCKED_EXAM_TEMPLATE_PARAMETERS.slice(0, 2),
            });
            MOCKED_EXAM_TEMPLATE_PARAMS.mockReturnValue(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST);
        });

        it("Should check group icons - all groups should have plus and edit icons, group with parameters in it shouldn't have delete icon", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });

            expect(
                screen.getByTestId(`parameter-add-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
            ).toBeInTheDocument();
            expect(
                screen.getByTestId(`parameter-add-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
            ).toBeInTheDocument();

            expect(
                screen.getByTestId(`parameter-edit-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
            ).toBeInTheDocument();
            expect(
                screen.getByTestId(`parameter-edit-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
            ).toBeInTheDocument();

            expect(
                screen.getByTestId(`parameter-delete-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId(`parameter-delete-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
            ).not.toBeInTheDocument();

            expect(
                screen.queryByTestId(`parameter-open-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
            ).not.toBeInTheDocument();
            expect(
                screen.getByTestId(`parameter-open-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
            ).toBeInTheDocument();
        });

        it("Should add new group", async () => {
            resolveServerResponse(MOCKED_CREATE_GROUP, { data: MOCKED_CREATE_GROUP_RESPONSE });

            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("add-parameters-group-button"));
            });
            await act(async () => {
                userEvent.paste(screen.getByTestId("add-group-name-input"), MOCKED_GROUP_NAME);
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_CREATE_GROUP).toHaveBeenCalledWith({
                name: MOCKED_GROUP_NAME,
                exam_template_uuid: MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid,
            });
            expect(screen.getByTestId(`parameter-group-name-${MOCKED_CREATE_GROUP_RESPONSE.uuid}`)).toHaveTextContent(
                MOCKED_CREATE_GROUP_RESPONSE.name
            );
        });

        it("Should not add new group with less than two symbols in name field", async () => {
            resolveServerResponse(MOCKED_CREATE_GROUP, {});

            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("add-parameters-group-button"));
            });
            await act(async () => {
                userEvent.paste(screen.getByTestId("add-group-name-input"), faker.random.alpha(1));
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(screen.getByText("Group name should be greater than 2 symbols")).toBeInTheDocument();
            expect(MOCKED_CREATE_GROUP).not.toHaveBeenCalled();
        });

        it("Should edit group", async () => {
            resolveServerResponse(MOCKED_EDIT_GROUP_QUERY_REQUEST, {
                data: { name: MOCKED_GROUP_NAME, uuid: MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid },
            });
            MOCKED_EDIT_GROUP.mockReturnValue(MOCKED_EDIT_GROUP_QUERY_REQUEST);

            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-edit-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
                );
            });
            await act(async () => {
                userEvent.clear(screen.getByTestId("add-group-name-input"));
                userEvent.paste(screen.getByTestId("add-group-name-input"), MOCKED_GROUP_NAME);
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_EDIT_GROUP).toHaveBeenCalledWith(MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid);
            expect(MOCKED_EDIT_GROUP_QUERY_REQUEST).toHaveBeenCalledWith({
                name: MOCKED_GROUP_NAME,
                exam_template_uuid: MOCKED_EXAM_TEMPLATE_GENERAL_INFO.uuid,
            });
            expect(
                screen.getByTestId(`parameter-group-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
            ).toHaveTextContent(MOCKED_GROUP_NAME);
        });

        it("Should delete group", async () => {
            resolveServerResponse(MOCKED_DELETE_GROUP_QUERY_REQUEST, {});
            MOCKED_DELETE_GROUP.mockReturnValue(MOCKED_DELETE_GROUP_QUERY_REQUEST);

            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-delete-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
                );
            });
            expect(screen.getByText("Delete group")).toBeInTheDocument();
            await act(() => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(MOCKED_DELETE_GROUP).toHaveBeenCalledWith(MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid);
            expect(
                screen.queryByTestId(`parameter-group-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[0].group_uuid}`)
            ).not.toBeInTheDocument();
        });

        // Will be implemented in future (AssignOrCreateParameterDrawer.tsx)
        it.todo("Should add param in a group");
    });

    describe("Params in source", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, {
                data: MOCKED_EXAM_TEMPLATE_PARAMETERS.slice(2),
            });
            MOCKED_EXAM_TEMPLATE_PARAMS.mockReturnValue(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST);
        });

        it("Should check param icons - all params should have delete and edit icons, and shouldn't have add icon", async () => {
            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });

            expect(
                screen.getByTestId(`parameter-edit-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].uuid}`)
            ).toBeInTheDocument();
            expect(
                screen.getByTestId(`parameter-delete-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].uuid}`)
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId(`parameter-add-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].uuid}`)
            ).not.toBeInTheDocument();
        });

        it("Should delete param from source", async () => {
            await act(async () => {
                setup();
            });

            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-delete-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].uuid}`)
                );
            });
            expect(screen.getByText("Delete parameter")).toBeInTheDocument();
            await act(() => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(
                screen.queryByTestId(`parameter-param-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[2].params![0].uuid}`)
            ).not.toBeInTheDocument();
        });

        // Will be implemented in future (ParameterDrawer.tsx)
        it.todo("Should edit param");

        // Will be implemented in future (AssignOrCreateParameterDrawer.tsx)
        it.todo("Should add param in source");
    });

    describe("Params in group", () => {
        beforeAll(() => {
            resolveServerResponse(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST, {
                data: [MOCKED_EXAM_TEMPLATE_PARAMETERS[1]],
            });
            MOCKED_EXAM_TEMPLATE_PARAMS.mockReturnValue(MOCKED_EXAM_TEMPLATE_PARAMS_QUERY_REQUEST);
        });

        it("Should toggle open state of the group with parameters", async () => {
            resolveServerResponse(MOCKED_CREATE_GROUP, { data: MOCKED_CREATE_GROUP_RESPONSE });

            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });

            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-open-button-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
                );
            });
            expect(
                screen.getByTestId(`parameter-param-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].params![0].uuid}`)
            ).toHaveTextContent(MOCKED_EXAM_TEMPLATE_PARAMETERS[1].params![0].name);

            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-open-button-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
                );
            });
            expect(
                screen.queryByTestId(`parameter-param-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].params![0].uuid}`)
            ).not.toBeInTheDocument();
        });

        it("Should delete param from folder", async () => {
            await act(async () => {
                setup();
            });
            await act(async () => {
                userEvent.click(screen.getByTestId("submit-stepper-button"));
            });
            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-open-button-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].group_uuid}`)
                );
            });
            await act(async () => {
                userEvent.click(
                    screen.getByTestId(`parameter-delete-icon-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].params![0].uuid}`)
                );
            });
            expect(screen.getByText("Delete parameter")).toBeInTheDocument();
            await act(() => {
                userEvent.click(screen.getByTestId("submit-dialog-button"));
            });

            expect(
                screen.queryByTestId(`parameter-param-name-${MOCKED_EXAM_TEMPLATE_PARAMETERS[1].params![0].uuid}`)
            ).not.toBeInTheDocument();
        });
    });
});
