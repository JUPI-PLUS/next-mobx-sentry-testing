/* eslint-disable @typescript-eslint/no-loop-func */
import { fixture, t, test } from "testcafe";
import { APPLICATION_URL, adminUser } from "../../shared/roles";
import OrdersModel from "../../pageModels/Orders/OrdersModel";
import { Order } from "../../../src/shared/models/business/order";
import { ExaminationTemplate } from "../../../src/shared/models/business/examTemplate";
import CreateOrderModel from "../../pageModels/CreateOrder/CreateOrderModel";
import { ordersListLogger, ordersListPromise } from "../../requestLoggers/orders";
import { examinationsListLogger, examinationsPromise } from "../../requestLoggers/examinations";
import { fromSecTimestampToMs } from "../../../src/shared/utils/date";

let orders: Array<Order> = [];
let examinations: Array<ExaminationTemplate> = [];

fixture`Orders scenario`.page(`${APPLICATION_URL}/orders`).requestHooks([ordersListLogger, examinationsListLogger]);

test("Should log in as admin", async () => {
    // login and redirect to orders page
    await t.useRole(adminUser).navigateTo("/orders");

    // listening  and setting orders list request
    await t.expect(ordersListLogger.contains(record => record.response.statusCode === 200)).ok();
    const ordersListResponse = await ordersListPromise(0);
    orders = ordersListResponse.data;
});

// 4) Repeat points 2 and 3 by random times (max 10)
for (let index = 0; index < 10; index++) {
    test("Find patient by filters and create order for him", async () => {
        // login and redirect to orders page
        await t.useRole(adminUser).navigateTo("/orders");

        await OrdersModel.filterAndSelectPatient(orders[0]);

        // listening  and setting  examinations list request
        await t.expect(examinationsListLogger.contains(record => record.response.statusCode === 200)).ok();
        const examinationsResponse = await examinationsPromise();
        examinations = examinationsResponse.data;

        await CreateOrderModel.createPatientOrder(examinations[index]);
    });
}
test("Find order by its filters", async () => {
    // login
    await t.useRole(adminUser).navigateTo("/orders");

    // setting up the filters
    // 5) By order number, 6) By date of creation, 7) By date of order status
    await OrdersModel.fillFindOrderFilters({
        order_number: orders[0].order_number,
        created_at_from: fromSecTimestampToMs(orders[0].created_at_timestamp),
        status: orders[0].status,
    });

    // checking if the order is found
    await t.expect(OrdersModel.orderDetailsLink(orders[0].order_number).exists).ok();
});
