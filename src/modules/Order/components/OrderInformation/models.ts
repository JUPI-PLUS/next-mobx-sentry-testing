import { OrderDetails } from "../../models";

export interface OrderInformationProps {
    order: OrderDetails;
    onSelectedTemplatesDrawerOpen: () => void;
}

export interface DownloadResultsProps {
    isDownloading: boolean;
    startDownload: () => void;
}
