export const ORDER_CONDITIONS_ENDPOINTS = {
    root: "order_conditions",
    item(uuid: string) {
        return `${this.root}/${uuid}`;
    },
};
