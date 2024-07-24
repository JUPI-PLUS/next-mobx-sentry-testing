export const PARAMETERS_ENDPOINTS = {
    root: "params",
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    list(page: number, filters: string) {
        return `${this.root}?page=${page}&${filters}`;
    },
    autocomplete(search?: string) {
        return `${this.root}?${search}`;
    },
    examTemplatesByUUID(uuid: string) {
        return `${this.item(uuid)}/exam_templates`;
    },
    conditions(uuid: string) {
        return `${this.item(uuid)}/conditions`;
    },
};
