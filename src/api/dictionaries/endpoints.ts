export const DICTIONARIES_ENDPOINTS = {
    root: "dictionary",
    orderStatuses() {
        return `${this.root}/order_statuses`;
    },
    measurementUnits() {
        return `${this.root}/measurement_units`;
    },
    examStatuses() {
        return `${this.root}/exam_statuses`;
    },
    kitTemplateStatuses() {
        return `${this.root}/kit_template_statuses`;
    },
    examTemplateStatuses() {
        return `${this.root}/exam_template_statuses`;
    },
    generalStatuses() {
        return `${this.root}/general_statuses`;
    },
    sampleStatuses() {
        return `${this.root}/sample_statuses`;
    },
    examTemplates() {
        return `${this.root}/exam_templates`;
    },
    sampleTypes() {
        return `${this.root}/sample_types`;
    },
    userRoles() {
        return `${this.root}/user_roles`;
    },
    sexTypes() {
        return `${this.root}/sex_types`;
    },
    organizations() {
        return `${this.root}/organizations`;
    },
    positions() {
        return `${this.root}/positions`;
    },
    parameterTypes() {
        return `${this.root}/param_types`;
    },
    parameterViewTypes() {
        return `${this.root}/param_view_types`;
    },
    conditionTypes() {
        return `${this.root}/conditions_types`;
    },
    referenceColors() {
        return `${this.root}/colors_web`;
    },
    phoneTypes() {
        return `${this.root}/phone_types`;
    },
    emailTypes() {
        return `${this.root}/email_types`;
    },
};
