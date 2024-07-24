export const EXAM_TEMPLATES_ENDPOINTS = {
    root: "exam_templates",
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    params(uuid: string) {
        return `${this.item(uuid)}/params`;
    },
    kitTemplates(uuid: string) {
        return `${this.item(uuid)}/kit_templates`;
    },
    orderConditions() {
        return `${this.root}/order_conditions`;
    },
};
