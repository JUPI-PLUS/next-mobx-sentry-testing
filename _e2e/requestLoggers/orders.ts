import { RequestLogger } from "testcafe";
import { APPLICATION_BE_URL } from "../shared/roles";
import { resolveRequestPromise } from "../utils";
import { CommonServerListResponse } from "../../src/shared/models/axios";
import { Order } from "../../src/shared/models/business/order";

export const ordersListLogger = RequestLogger(
    {
        url: new RegExp(`${APPLICATION_BE_URL}/orders`),
        method: "get",
    },
    {
        logRequestHeaders: true,
        logResponseHeaders: true,
        logResponseBody: true,
    }
);

export const ordersListPromise = async (index: number) =>
    resolveRequestPromise<CommonServerListResponse<Order>>(ordersListLogger.requests[index].response.body);
