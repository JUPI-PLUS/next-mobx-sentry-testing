export const RESULTS_ENDPOINTS = {
    root: "results",
    downloadOrderResultsPDF(orderUUID: string) {
        return `${this.root}/orders/${orderUUID}/download`;
    },
};
