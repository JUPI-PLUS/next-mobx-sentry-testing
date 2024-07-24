import { faker } from "@faker-js/faker";
import { OrderStatus } from "../../shared/models/business/order";

export const MOCKED_ORDER = (props?: { status?: OrderStatus }) => ({
    uuid: faker.datatype.uuid(),
    user_uuid: faker.datatype.uuid(),
    first_name: faker.random.alpha(10),
    last_name: faker.random.alpha(10),
    order_number: faker.datatype.uuid(),
    status:
        props?.status ||
        faker.helpers.arrayElement([
            OrderStatus.PRE_ORDER,
            OrderStatus.NEW,
            OrderStatus.DONE,
            OrderStatus.FAILED,
            OrderStatus.BIOMATERIALS_RECEIVED,
            OrderStatus.IN_PROGRESS,
        ]),
    referral_doctor: faker.random.alpha(20),
    referral_notes: faker.random.alpha(20),
    created_at: faker.date.past().toISOString(),
    created_at_timestamp: faker.date.past().getTime() / 1000,
    updated_at: faker.date.past().toISOString(),
    updated_at_timestamp: faker.date.past().getTime() / 1000,
});
