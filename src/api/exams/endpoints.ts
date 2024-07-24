export const EXAMS_ENDPOINTS = {
    root: "exam_templates",
    list(filters: string) {
        return `${this.root}/?${filters}`;
    },
    group(uuid: string) {
        return `${this.root}/${uuid}/group`;
    },
};
