// libs
import { faker } from "@faker-js/faker";

// models
import { ExamTemplateStatusesEnum } from "../../shared/models/business/examTemplate";

export const MOCKED_SAMPLE_TYPES = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(10),
    code: faker.random.numeric(2),
}));

export const MOCKED_MEASUREMENT_UNITS = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(10),
}));

export const MOCKED_DAMAGE_REASONS = new Array(5).fill(null).map((_, index) => ({
    id: index,
    code: faker.random.alpha(10),
    description: faker.random.alpha(20),
    notes: faker.random.alpha(30),
}));

export const MOCKED_EXAM_STATUSES = new Array(7).fill(null).map((_, index) => ({
    id: index + 1,
    name: faker.random.alpha(10),
}));

export const MOCKED_ORDER_STATUSES = new Array(6).fill(null).map((_, index) => ({
    id: index + 1,
    name: faker.random.alpha(10),
}));

export const MOCKED_PARAMETER_VIEW_TYPES = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(15),
}));

export const MOCKED_WORKPLACES = new Array(5).fill(null).map((_, index) => ({
    id: index + 1,
    name: faker.random.alpha(10),
    uuid: faker.datatype.uuid(),
}));

export const MOCKED_REFERENCE_COLORS = [
    {
        id: 1,
        name: "FFFFFF",
    },
    {
        id: 2,
        name: "A5E091",
    },
    {
        id: 3,
        name: "FFE381",
    },
    {
        id: 4,
        name: "F64444",
    },
    {
        id: 5,
        name: "B10E0E",
    },
];

export const MOCKED_EXAM_TEMPLATE_STATUSES = [
    {
        id: ExamTemplateStatusesEnum.ACTIVE,
        name: "Active",
    },
    {
        id: ExamTemplateStatusesEnum.INACTIVE,
        name: "Inactive",
    },
];

export const MOCKED_GENERAL_STATUSES = [
    {
        id: ExamTemplateStatusesEnum.ACTIVE,
        name: "Active",
    },
    {
        id: ExamTemplateStatusesEnum.INACTIVE,
        name: "Inactive",
    },
];

export const MOCKED_SEX_TYPES = [
    {
        id: 1,
        name: "Male",
    },
    {
        id: 2,
        name: "Female",
    },
    {
        id: 3,
        name: "Not determined",
    },
];

export const MOCKED_USER_ROLES = [
    {
        id: 10,
        name: "Admin",
        attribute: "admin",
    },
    {
        id: 20,
        name: "Lab Worker",
        attribute: "lab_worker",
    },
];

export const MOCKED_ORGANIZATIONS = [
    {
        id: 1,
        name: "Organization 1",
    },
    {
        id: 2,
        name: "Organization 2",
    },
];

export const MOCKED_POSITIONS = [
    {
        id: 1,
        name: "Admin",
    },
    {
        id: 2,
        name: "Lab Worker",
    },
];

export const MOCKED_EMAIL_TYPES = [
    {
        id: 1,
        name: "Personal",
    },
    {
        id: 2,
        name: "Work",
    },
];

export const MOCKED_PHONE_TYPES = [
    {
        id: 1,
        name: "Personal",
    },
    {
        id: 2,
        name: "Work",
    },
];
