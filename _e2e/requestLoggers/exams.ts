import { RequestLogger } from "testcafe";
import { APPLICATION_BE_URL } from "../shared/roles";
import { resolveRequestPromise } from "../utils";
import { CommonServerListResponse } from "../../src/shared/models/axios";
import { OrderExamDetails } from "../../src/modules/Order/models";
import { uuidRegexString } from "../../src/shared/constants/auth";

export const examsByOrderLogger = RequestLogger(
    {
        url: new RegExp(`${APPLICATION_BE_URL}/orders\/${uuidRegexString}\/exams`, "i"),
        method: "get",
    },
    {
        logResponseBody: true,
    }
);
export const examsListByOrderPromise = async (index: number) =>
    resolveRequestPromise<CommonServerListResponse<OrderExamDetails>>(examsByOrderLogger.requests[index].response.body);
