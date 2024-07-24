import { RequestLogger } from "testcafe";
import { APPLICATION_BE_URL } from "../shared/roles";
import { resolveRequestPromise } from "../utils";
import { CommonServerListResponse } from "../../src/shared/models/axios";
import { ExaminationTemplate } from "../../src/shared/models/business/examTemplate";

export const examinationsListLogger = RequestLogger(
    {
        url: new RegExp(`${APPLICATION_BE_URL}/kits_templates`),
        method: "get",
    },
    {
        logResponseBody: true,
    }
);

export const examinationsPromise = async () =>
    resolveRequestPromise<CommonServerListResponse<ExaminationTemplate>>(
        examinationsListLogger.requests[0].response.body
    );
