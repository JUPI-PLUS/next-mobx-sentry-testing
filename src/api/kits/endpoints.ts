export const KITS_ENDPOINTS = {
    root: "kits_templates",
    kitTemplate(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    orderConditions(kitCode: string) {
        return `${this.root}/${kitCode}/order_conditions`;
    },
    examsTemplates(kitCode: string) {
        return `${this.root}/${kitCode}/exams_templates`;
    },
    examTemplates(uuid: string) {
        return `${this.root}/${uuid}/exam_templates`;
    },
    group(uuid: string) {
        return `${this.kitTemplate(uuid as string)}/group`;
    },
};
