export const WORKPLACES_ENDPOINTS = {
    root: "workplaces",
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    list(page: number, filters: string) {
        return `${this.root}?page=${page}&${filters}`;
    },
    examTemplatesByUUID(uuid: string) {
        return `${this.item(uuid)}/exam_templates`;
    },
};
