import { OrderStatus } from "../../../../../../shared/models/business/order";

export interface ActionsCellProps {
    orderNumber: string;
    orderUUID: string;
    orderStatus: OrderStatus;
    onSelectPatient: () => void;
    isPatientDeleted: boolean;
}

export interface PrintReportActionProps {
    isDownloading: boolean;
    startDownload: () => void;
}
