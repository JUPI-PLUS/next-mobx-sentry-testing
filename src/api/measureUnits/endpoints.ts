export const MEASURE_UNITS = {
    root: "measure_unit",
    item(id: number) {
        return `${this.root}/${id}`;
    },
    examTemplates(id: number) {
        return `${this.item(id)}/exam_templates`;
    },
    params(id: number) {
        return `${this.item(id)}/params`;
    },
    list(page: number, filter: string) {
        return `${this.root}?page=${page}&${filter}`;
    },
};
