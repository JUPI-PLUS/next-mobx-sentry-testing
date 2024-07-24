import { Selector, t, test } from "testcafe";
import { ordersListLogger, ordersListPromise } from "../../requestLoggers/orders";
import { APPLICATION_URL, adminUser } from "../../shared/roles";
import OrdersModel from "../../pageModels/Orders/OrdersModel";
import { Order, OrderStatus } from "../../../src/shared/models/business/order";
import { examinationsListLogger, examinationsPromise } from "../../requestLoggers/examinations";
import CreateOrderModel from "../../pageModels/CreateOrder/CreateOrderModel";
import { ExaminationTemplate } from "../../../src/shared/models/business/examTemplate";
import { OrderExamDetails } from "../../../src/modules/Order/models";
import { examsByOrderLogger, examsListByOrderPromise } from "../../requestLoggers/exams";
import OrderDetailsModel from "../../pageModels/OrderDetails/OrderDetailsModel";
import SampleActionsDropdownModel from "../../components/SampleActionsDropdown/SampleActionsDropdown";
import MarkAsDamagedDrawerModel from "../../components/drawers/MarkAsDamagedDrawer/MarkAsDamagedDrawer";
import DrawerModel from "../../components/drawers/Drawer/DrawerModel";
import DialogModel from "../../components/Dialog/DialogModel";
import { addMinutes } from "date-fns";

let orders: Array<Order> = [];
let examinations: Array<ExaminationTemplate> = [];
let exams: Array<OrderExamDetails> = [];

fixture`OrderDetails`
    .page(APPLICATION_URL)
    .requestHooks([ordersListLogger, examinationsListLogger, examsByOrderLogger]);

test("For positive cases", async () => {
    await t.useRole(adminUser).maximizeWindow().navigateTo("/orders");

    // listening  and setting orders list request
    await t.expect(ordersListLogger.contains(record => record.response.statusCode === 200)).ok();
    const ordersListResponse = await ordersListPromise(0);
    orders = ordersListResponse.data;

    await OrdersModel.filterAndSelectPatient(orders[0]);

    // listening  and setting  examinations list request
    await t.expect(examinationsListLogger.contains(record => record.response.statusCode === 200)).ok();
    const examinationsResponse = await examinationsPromise();
    examinations = examinationsResponse.data;

    await CreateOrderModel.createPatientOrder(examinations[0]);

    // setting up the filters
    await OrdersModel.fillFindOrderFilters({
        order_number: orders[0].order_number,
        created_at_from: new Date().getTime(),
        status: OrderStatus.NEW,
    });

    // checking if the order is found
    await t.expect(OrdersModel.orderDetailsLink(orders[0].order_number).exists).ok();
    await OrdersModel.redirectToOrderDetails(orders[0].order_number);

    await t.expect(examsByOrderLogger.contains(record => record.response.statusCode === 200)).ok();
    const examsResponse = await examsListByOrderPromise(0);
    exams = examsResponse.data;

    // calling twice to check resampling
    for (let index = 0; index < 2; index++) {
        await t.click(OrdersModel.orderExamCheckbox(exams[0].exam_uuid)).click(OrdersModel.addSampleToExamsButton);

        await OrderDetailsModel.fillAddSampleForm({
            sample_type_id: 1,
            si_measurement_units_id: 1,
            volume: 150,
        });
    }

    // 7) Setup sample as damaged
    await t
        .click(OrderDetailsModel.dropdownButton(exams[0].exam_uuid))
        .click(SampleActionsDropdownModel.markAsDamagedButton);
    await MarkAsDamagedDrawerModel.fillForm({
        damage_reason: { label: "Too few or no sample material", value: 1 },
        updated_at: { from: new Date() },
    });
    await t.click(DrawerModel.submitButton);
    await t.expect(examsByOrderLogger.contains(record => record.response.statusCode === 200)).ok();
    const indexOfTheLastReq = () => examsByOrderLogger.requests.filter(req => req.response.body).length - 1;
    const examsResponse2 = await examsListByOrderPromise(indexOfTheLastReq());
    exams = examsResponse2.data;

    await t.expect(Selector("span").withText(`${exams[0].sample_num} (damaged)`).exists).ok();

    // 8) Detach attached sample.
    await t
        .click(OrderDetailsModel.dropdownButton(exams[0].exam_uuid))
        .click(SampleActionsDropdownModel.removeButton)
        .click(DialogModel.submitDialogButton, { speed: 0.2 });
    // Order should change its status to "New"
    await t.expect(Selector(`#badge-${exams[0].exam_uuid}`, { timeout: 500 }).textContent).eql("New");

    await t.expect(Selector("#header-badge-4", { timeout: 500 }).exists).ok();
    // 9) Attach one sample to all exams in order.
    await t.expect(examsByOrderLogger.contains(record => record.response.statusCode === 200)).ok();
    const examsResponse3 = await examsListByOrderPromise(indexOfTheLastReq());
    exams = examsResponse3.data;

    // iterating through all order's examinations and attaching sample to them
    for (let index = 0; index < exams.length; index++) {
        await t.click(OrdersModel.orderExamCheckbox(exams[index].exam_uuid)).click(OrdersModel.addSampleToExamsButton);

        await OrderDetailsModel.fillAddSampleForm({
            sample_type_id: 1,
            si_measurement_units_id: 1,
            volume: 150,
        });
    }
});

test.skip("For negative case 1", async () => {
    await t.useRole(adminUser).maximizeWindow().navigateTo("/orders");

    // 1) Try to "mark sample as damaged"/"resample"/"remove sample" on exam that has status "On validation" or "Done".
    //    Checkbox for this exam should be disabled

    // setting up the filters to find by "done" || "onValidation" statuses
    await OrdersModel.fillFindOrderFilters({
        status: OrderStatus.DONE,
    });

    // listening  and setting orders list request
    await t.expect(ordersListLogger.contains(record => record.response.statusCode === 200)).ok();
    const ordersListResponse = await ordersListPromise(ordersListLogger.requests.length - 1);
    orders = ordersListResponse.data;

    // checking if the order is found
    await t.expect(OrdersModel.orderDetailsLink(orders[0].order_number).exists).ok();
    await OrdersModel.redirectToOrderDetails(orders[0].order_number);

    // listening  and setting exams list request
    await t.expect(examsByOrderLogger.contains(record => record.response.statusCode === 200)).ok();
    const examsResponse = await examsListByOrderPromise(0);
    exams = examsResponse.data;

    // iterating through all exams
    // 1) in dropdown it shouldnt be item with this action
    for (let index = 0; index < exams.length; index++) {
        await t.expect(Selector(`#badge-${exams[index].exam_uuid}`, { timeout: 500 }).textContent).eql("Done");
        await t.expect(OrdersModel.orderExamCheckbox(exams[index].exam_uuid).withAttribute("disabled").exists).ok();
        const dropdown = OrderDetailsModel.dropdownButton(exams[index].exam_uuid);
        await t
            .click(dropdown)
            .expect(SampleActionsDropdownModel.markAsDamagedButton.exists)
            .notOk()
            .expect(SampleActionsDropdownModel.resampleButton.exists)
            .notOk()
            .expect(SampleActionsDropdownModel.removeButton.exists)
            .notOk();
    }
});
// TODO: Think on refactoring reused blocks of code
// Continue working on negative scenarios after all main modules positive scenarios are worked through
// Need descripton of Examinations module first
// 2) Try to add sample which has been already closed (status: done) it shouldn't be possible to attach exam to sample
test.skip("For negative case 2", async () => {
    // listening  and setting orders list request
    await t.expect(ordersListLogger.contains(record => record.response.statusCode === 200)).ok();
    const ordersListResponse = await ordersListPromise(ordersListLogger.requests.length - 1);
    orders = ordersListResponse.data;

    // checking if the order is found
    await t.expect(OrdersModel.orderDetailsLink(orders[0].order_number).exists).ok();
    await OrdersModel.redirectToOrderDetails(orders[0].order_number);

    // listening  and setting exams list request
    await t.expect(examsByOrderLogger.contains(record => record.response.statusCode === 200)).ok();
    const examsResponse2 = await examsListByOrderPromise(examsByOrderLogger.requests.length - 1);
    exams = examsResponse2.data;

    // opening actions dropdown and clicking at add sample
    await t.click(OrdersModel.orderExamCheckbox(exams[0].exam_uuid)).click(OrdersModel.addSampleToExamsButton);

    await OrderDetailsModel.fillAddSampleForm({
        sample_type_id: 1,
        si_measurement_units_id: 1,
        volume: 150,
        isPrintable: false,
        shouldSubmit: false,
    });

    const barcodeNum = await OrderDetailsModel.sampleNumberInput.textContent;
    await t.click(DrawerModel.submitButton);

    await t.click(OrdersModel.orderExamCheckbox(exams[0].exam_uuid)).click(OrdersModel.addSampleToExamsButton);
    await t.typeText(OrderDetailsModel.sampleNumberInput, barcodeNum);
});

test.skip("For negative case 3", async () => {
    await t.useRole(adminUser).maximizeWindow().navigateTo("/orders");

    // 3) Try to create sample with future date, it should not be possible  to create sample with message "Can not be a future date in Datetime field"
    // setting up the filters to find by "new" statuses
    await OrdersModel.fillFindOrderFilters({
        status: OrderStatus.NEW,
    });

    // listening  and setting orders list request
    await t.expect(ordersListLogger.contains(record => record.response.statusCode === 200)).ok();
    const ordersListResponse2 = await ordersListPromise(ordersListLogger.requests.length - 1);
    orders = ordersListResponse2.data;

    // checking if the order is found
    await t.expect(OrdersModel.orderDetailsLink(orders[0].order_number).exists).ok();
    await OrdersModel.redirectToOrderDetails(orders[0].order_number);

    // listening  and setting exams list request
    await t.expect(examsByOrderLogger.contains(record => record.response.statusCode === 200)).ok();
    const examsResponse2 = await examsListByOrderPromise(examsByOrderLogger.requests.length - 1);
    exams = examsResponse2.data;

    // opening actions dropdown and clicking at add sample
    await t.click(OrdersModel.orderExamCheckbox(exams[0].exam_uuid)).click(OrdersModel.addSampleToExamsButton);

    // adding future date
    await OrderDetailsModel.fillAddSampleForm({
        sampling_datetime: addMinutes(new Date(), 1).getTime(),
    });
    await t
        .expect(Selector("div").withAttribute("data-testid", "field-sampling_datetime-error-container").textContent)
        .eql("Can not be a future date in Datetime field");
});

test.skip("Negative case 4", async () => {
    await t.useRole(adminUser).maximizeWindow().navigateTo("/orders");

    // 4) Try to add sample which already used in another order, this order created  for different user error message should be "Order’s User and Sample’s User do not match"
    // Order’s User and Sample’s User do not match
});
