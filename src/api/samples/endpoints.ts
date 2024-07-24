import { SampleStatuses } from "../../shared/models/business/enums";

export const SAMPLES_ENDPOINTS = {
    root: "samples",
    details(uuid: string) {
        return `${this.root}/${uuid}`;
    },
    detailsByBarcode(barcode: string) {
        return `${this.root}?barcode=${barcode}`;
    },
    changeStatus(uuid: string) {
        return `${this.root}/${uuid}/status`;
    },
    detachExamsFromSample(uuid: string) {
        return `${this.root}/${uuid}/detach`;
    },
    attachExamsFromSample(uuid: string) {
        return `${this.root}/${uuid}/attach`;
    },
    list(page: number, filters: string) {
        return `${this.root}?page=${page}&order_by=created_at&order_way=DESC&limit=15&${filters}`;
    },
    generateBarcode() {
        return `${this.root}/create_bar_code`;
    },
    examinationsList(filters: string) {
        return `${this.root}?sample_statuses_id[]=${SampleStatuses.IN_PROGRESS}&sample_statuses_id[]=${SampleStatuses.FAILED_ON_VALIDATION}&${filters}`;
    },
    examinationValidate() {
        return `results`;
    },
    // TODO: can change
    examinationCreate() {
        return `results`;
    },
    examinationListBySample(uuid: string) {
        return `${this.root}/${uuid}/full`;
    },
    ordersConditionsBySample(uuid: string) {
        return `${this.details(uuid)}/orders_conditions`;
    },
};
