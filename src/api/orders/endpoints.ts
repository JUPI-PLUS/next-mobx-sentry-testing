export const ORDERS_ENDPOINTS = {
    root: "orders",
    create() {
        return `${this.root}/employee`;
    },
    mutate(uuid: string) {
        return `${this.root}/${uuid}/employee`;
    },
    details(uuid: string) {
        return `${this.root}/${uuid}/short`;
    },
    list(page: number, filters: string) {
        return `${this.root}?page=${page}&order_by=created_at&order_way=DESC&limit=15&${filters}`;
    },
    orderExamsList(uuid: string) {
        return `${this.root}/${uuid}/exams`;
    },
    orderKitActivation() {
        return `${this.root}/employee_kit_activation`;
    },
};
