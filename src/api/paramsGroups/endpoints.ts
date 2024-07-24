export const PARAMS_GROUPS_ENDPOINTS = {
    root: "params_groups",
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
};
