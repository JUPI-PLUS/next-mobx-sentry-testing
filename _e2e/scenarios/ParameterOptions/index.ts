import { RequestLogger, t, test } from "testcafe";
import { APPLICATION_BE_URL, APPLICATION_URL, adminUser } from "../../shared/roles";
import { resolveRequestPromise } from "../../utils";
import { CommonServerListResponse } from "../../../src/shared/models/axios";
import { ParameterOption } from "../../../src/modules/ParameterOptions/components/ParameterOptionsTable/models";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ParameterOptionsModel from "../../../e2e/pageModels/ParameterOptionsModel";
import DialogModel from "../../components/Dialog/DialogModel";
import ToastModel from "../../components/Toast/ToastModel";
import { PossibleMethods } from "../../shared/enums";
import { MOCKED_PARAMETER_OPTIONS } from "../../../src/testingInfrustructure/mocks/parameters";

const paramsOptionLogger = (method: PossibleMethods) =>
    RequestLogger(
        {
            url: new RegExp(`${APPLICATION_BE_URL}/params_options`),
            method: method,
        },
        {
            logResponseBody: true,
        }
    );

const paramsOptionPostLogger = paramsOptionLogger(PossibleMethods.POST);
const paramsOptionPatchLogger = paramsOptionLogger(PossibleMethods.PATCH);
const paramsOptionListLogger = paramsOptionLogger(PossibleMethods.GET);

let paramsOptions: Array<ParameterOption>;

const paramsOptionListPromiseResolve = async (index: number) =>
    resolveRequestPromise<CommonServerListResponse<ParameterOption>>(
        paramsOptionListLogger.requests[index].response.body
    );

fixture`ParameterOptions`
    .page(`${APPLICATION_URL}/parameter-options`)
    .requestHooks([paramsOptionPostLogger, paramsOptionPatchLogger, paramsOptionListLogger]);

const PARAMETER_OPTION = MOCKED_PARAMETER_OPTIONS[0];
const PARAMETER_OPTION1 = MOCKED_PARAMETER_OPTIONS[1];

test("Parameter Options page", async () => {
    // 1) Login to system as admin
    // 2) Go to parameter options page
    await t.useRole(adminUser).maximizeWindow().navigateTo("/parameter-options");

    // 3) Try create an option
    // 4) Fill all fields
    await ParameterOptionsModel.addOption({ name: PARAMETER_OPTION.name });

    // 5) Save the option
    await t.click(DialogModel.dialogSubmitButton);
    await t.click(ToastModel.closeToastButton);

    // 6) Try to find this option
    await ParameterOptionsModel.fillFilters({ name: PARAMETER_OPTION.name });

    // 7) Try to edit this option
    await t.click(ParameterOptionsModel.actionButton).click(ParameterOptionsModel.editButton);
    await ParameterOptionsModel.fillForm({ name: PARAMETER_OPTION1.name });

    // Save the option
    await t.click(DialogModel.dialogSubmitButton);
    await t.click(ToastModel.closeToastButton);

    // Try to find this option
    await ParameterOptionsModel.fillFilters({ name: PARAMETER_OPTION1.name });

    // 8) Try to delete this option
    await t.click(ParameterOptionsModel.actionButton).click(ParameterOptionsModel.deleteButton);
    // Save the option
    await t.click(DialogModel.submitDialogButton);
    // 9) Clear filters (you should see a full list of options)
    await t.click(ToastModel.closeToastButton);
    await ParameterOptionsModel.resetFilters();

    // listening to request and setting paramsOption
    await t.expect(paramsOptionListLogger.contains(record => record.response.statusCode === 200)).ok();

    const paramsOptionsResponse = await paramsOptionListPromiseResolve(paramsOptionListLogger.requests.length - 1);

    paramsOptions = paramsOptionsResponse.data;

    for (let index = 0; index < paramsOptions.length; index++) {
        await t.expect(ParameterOptionsModel.nameCell(paramsOptions[index].name).exists).ok();
    }
});
