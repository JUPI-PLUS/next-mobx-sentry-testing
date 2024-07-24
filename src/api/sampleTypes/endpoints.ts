export const SAMPLES_TYPES = {
    root: "sample_types",
    item(id: number) {
        return `${this.root}/${id}`;
    },
    examTemplates(id: number) {
        return `${this.item(id)}/exam_templates`;
    },
    list(page: number, filter: string) {
        return `${this.root}?page=${page}&${filter}`;
    },
};
