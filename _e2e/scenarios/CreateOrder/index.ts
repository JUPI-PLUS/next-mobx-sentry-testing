import { t, test } from "testcafe";
import { APPLICATION_URL, adminUser } from "../../shared/roles";
import { ordersListLogger, ordersListPromise } from "../../requestLoggers/orders";
import { Order } from "../../../src/shared/models/business/order";
import OrdersModel from "../../pageModels/Orders/OrdersModel";
import CreateOrderModel from "../../pageModels/CreateOrder/CreateOrderModel";
import { examinationsListLogger, examinationsPromise } from "../../requestLoggers/examinations";
import { ExaminationTemplate } from "../../../src/shared/models/business/examTemplate";
import { fromSecTimestampToMs } from "../../../src/shared/utils/date";

fixture`Create order`.page(`${APPLICATION_URL}`).requestHooks([ordersListLogger, examinationsListLogger]);

let orders: Array<Order> = [];
let examinations: Array<ExaminationTemplate> = [];

test("Creating order", async () => {
    await t.useRole(adminUser).navigateTo("/orders");

    // listening  and setting orders list request
    await t.expect(ordersListLogger.contains(record => record.response.statusCode === 200)).ok();
    const ordersListResponse = await ordersListPromise(0);
    orders = ordersListResponse.data;

    // pressing 3 dots, selecting patient and redirect to creating a new order for him
    await t.click(OrdersModel.orderActionsButton(orders[0].order_number)).click(OrdersModel.selectPatientLink);
    await OrdersModel.redirectToAddOrder();

    // listening  and setting  examinations list request
    await t.expect(examinationsListLogger.contains(record => record.response.statusCode === 200)).ok();
    const examinationsResponse = await examinationsPromise();
    examinations = examinationsResponse.data;

    await CreateOrderModel.createPatientOrder(examinations[0]);

    await OrdersModel.fillFindOrderFilters({
        order_number: orders[0].order_number,
        created_at_from: fromSecTimestampToMs(orders[0].created_at_timestamp),
        status: orders[0].status,
    });

    // checking if the order is found
    await t.expect(OrdersModel.orderDetailsLink(orders[0].order_number).exists).ok();
});
