export const TEMPLATES_ENDPOINTS = {
    root: "templates_groups",
    list(queryFilters: string) {
        return `${this.root}?${queryFilters}`;
    },
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    parent(uuid: string) {
        return `${this.item(uuid)}/parent`;
    },
    parents(uuid: string) {
        return `${this.item(uuid)}/parents`;
    },
};
