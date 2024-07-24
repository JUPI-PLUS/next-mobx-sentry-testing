export const PARAMETER_OPTIONS_ENDPOINTS = {
    root: "params_options",
    item(id: number) {
        return `${this.root}/${id}`;
    },
    list(page: number, filters?: string) {
        return `${this.root}?page=${page}&${filters}`;
    },
    autocomplete(filters: string) {
        return `${this.root}?${filters}`;
    },
    assignedParams(id: number) {
        return `${this.item(id)}/params`;
    },
};
