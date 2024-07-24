import { faker } from "@faker-js/faker";
import { ExamStatusesEnum } from "../../shared/models/business/exam";
import { OrderStatus } from "../../shared/models/business/order";
import { Sex } from "../../shared/models/business/user";

export const MOCKED_ORDERS = new Array(10).fill(null).map(() => ({
    uuid: faker.datatype.uuid(),
    user_uuid: faker.datatype.uuid(),
    first_name: faker.random.alpha(10),
    last_name: faker.random.alpha(10),
    order_number: faker.datatype.uuid(),
    status: faker.helpers.arrayElement([
        OrderStatus.PRE_ORDER,
        OrderStatus.NEW,
        OrderStatus.DONE,
        OrderStatus.FAILED,
        OrderStatus.BIOMATERIALS_RECEIVED,
        OrderStatus.IN_PROGRESS,
    ]),
    referral_doctor: faker.random.alpha(20),
    number_of_exams: faker.datatype.number({ min: 5, max: 10 }),
    created_at: faker.date.past().toISOString(),
    created_at_timestamp: faker.date.past().getTime() / 1000,
    updated_at: faker.date.past().toISOString(),
    updated_at_timestamp: faker.date.past().getTime() / 1000,
    type: "MASTER",
    expanded: false,
}));

export const MOCKED_ORDER_USERS = new Array(2).fill(null).map(() => ({
    birth_date_at_timestamp: faker.date.birthdate().getTime() / 100,
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    sex_id: faker.helpers.arrayElement([Sex.FEMALE, Sex.MALE, Sex.UNKNOWN]),
    uuid: faker.datatype.uuid(),
}));

export const MOCKED_ORDER_EXAM = (props?: { exam_status?: ExamStatusesEnum; sample_type?: number }) => ({
    exam_id: faker.datatype.number(),
    exam_uuid: faker.datatype.uuid(),
    exam_name: faker.random.alpha(10),
    volume: faker.random.alpha(10),
    si_measurement_unit_id: faker.datatype.number(),
    exam_status:
        props?.exam_status ||
        faker.helpers.arrayElement([
            ExamStatusesEnum.DONE,
            ExamStatusesEnum.NEW,
            ExamStatusesEnum.BIOMATERIAL_RECEIVED,
            ExamStatusesEnum.FAILED,
            ExamStatusesEnum.TECHNICAL_VALIDATION,
            ExamStatusesEnum.IN_PROGRESS,
            ExamStatusesEnum.ON_VALIDATION,
        ]),
    sample_id: faker.datatype.number(),
    sample_num: faker.random.alpha(10),
    sample_type: props?.sample_type || 1,
});

export const MOCKED_ORDER_EXAMS_LIST = new Array(5).fill(null).map(() => MOCKED_ORDER_EXAM());
