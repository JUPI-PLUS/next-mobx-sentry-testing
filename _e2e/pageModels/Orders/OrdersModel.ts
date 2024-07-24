import { Selector, t } from "testcafe";
import { selectOption } from "../../utils";
import { OrdersFilters, UserFilters } from "../../../src/modules/Orders/models";
import DatepickerModel from "../../components/Datepicker/DatepickerModel";
import { Order } from "../../../src/shared/models/business/order";

export class OrdersModel {
    // filtering users
    showMoreButton: Selector = Selector("span").withAttribute("data-testid", "show-more-link");
    filterUsersByUUIDInput: Selector = Selector("#barcode");
    filterUsersByFirstNameInput: Selector = Selector("#first_name");
    filterUsersByLastNameInput: Selector = Selector("#last_name");
    filterUsersByBirthdayInput: Selector = Selector("#birthday");
    filterUsersByEmailInput: Selector = Selector("#email");
    resetUsersFiltersButton: Selector = Selector("button").withAttribute("data-testid", "reset-filters");

    // filtering orders
    filterOrdersByDateOfCreationInput: Selector = Selector("#created_at");
    filterOrdersByNumberInput: Selector = Selector("#order_number");
    filterOrdersByStatusInput: Selector = Selector("#status");

    // pagination
    paginationNextButton: Selector = Selector("button").withAttribute("data-testid", "pagination-next-button");
    paginationPreviousButton: Selector = Selector("button").withAttribute("data-testid", "pagination-last-button");

    //order row actions
    selectPatientLink: Selector = Selector("li").withAttribute("data-testid", "select-patient-link");
    downloadOrderButton: Selector = Selector("li").withAttribute("data-testid", "download-order-button");

    //other
    viewProfileLink: Selector = Selector("button").withAttribute("data-testid", "view-profile-link");
    addOrderLink: Selector = Selector("button").withAttribute("data-testid", "add-order-link");
    closeOrderButton: Selector = Selector("button").withAttribute("data-testid", "close-patient-orders-button");
    removeSampleFromExamsButton: Selector = Selector("button").withAttribute("data-testid", "sample-remove-item");

    addSampleToExamsButton: Selector = Selector("button").withAttribute("data-testid", "add-sample-item");
    statusesSelect: Selector = Selector("#status");
    statusesSelectOption = (value: string) => selectOption(this.statusesSelect, value);

    orderActionsButton(orderNumber: string) {
        return Selector("button").withAttribute("data-testid", `order-${orderNumber}-actions-button`);
    }

    orderDetailsLink(orderNumber: string) {
        return Selector("a").withAttribute("data-testid", `order-${orderNumber}-details-link`);
    }

    orderExamCheckbox(uuid: string) {
        return Selector("input", { timeout: 100 }).withAttribute("data-testid", `exam-checkbox-${uuid}`);
    }

    orderDropdownField(uuid: string) {
        return Selector("button").withAttribute("data-testid", `dropdown-field-${uuid}`);
    }

    patientFilteredCard(name: string) {
        return Selector("div").withAttribute("data-testid", `user-details-card-${name}`);
    }

    async expandFilters() {
        await t.click(this.showMoreButton);
    }

    async redirectToOrderDetails(orderNumber: string) {
        await t.click(this.orderDetailsLink(orderNumber));
    }

    async openActionsPopperOnOrderRow(orderNumber: string) {
        await t.click(this.orderActionsButton(orderNumber));
    }

    async openPatientOrders() {
        await t.click(this.selectPatientLink);
    }

    async closePatientOrders() {
        await t.click(this.closeOrderButton);
    }

    async openPatientProfile() {
        await t.click(this.viewProfileLink);
    }

    async redirectToAddOrder() {
        await t.click(this.addOrderLink);
    }

    async fillFindPatientFilters({ barcode, birth_date_from, email, first_name, last_name }: Partial<UserFilters>) {
        if (barcode) {
            await t.typeText(this.filterUsersByUUIDInput, barcode, { paste: true });
        }
        if (first_name) {
            await t.typeText(this.filterUsersByFirstNameInput, first_name);
        }
        if (last_name) {
            await t.typeText(this.filterUsersByLastNameInput, last_name);
        }
        if (birth_date_from) {
            await t.typeText(
                this.filterUsersByBirthdayInput,
                DatepickerModel.formatDateForDatepicker(new Date(birth_date_from))
            );
        }
        if (email) {
            await t.typeText(this.filterUsersByEmailInput, email);
        }
    }

    async fillFindOrderFilters({ status, order_number, created_at_from }: Partial<OrdersFilters>) {
        if (status) {
            await selectOption(this.filterOrdersByStatusInput, String(status));
        }
        if (order_number) {
            await t.typeText(this.filterOrdersByNumberInput, String(order_number));
        }
        if (created_at_from) {
            await DatepickerModel.filterdatepickerByCalendar(this.filterOrdersByDateOfCreationInput, created_at_from);
            await t.click(DatepickerModel.submitButton);
        }
    }

    async filterAndSelectPatient(order: Order) {
        // Filtering patients
        await this.expandFilters();
        await this.fillFindPatientFilters({
            barcode: order.user_barcode,
            first_name: order.first_name,
            last_name: order.last_name,
        });
        await this.redirectToAddOrder();
    }
}

export default new OrdersModel();
