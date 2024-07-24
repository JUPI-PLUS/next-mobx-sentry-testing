import { FC, useMemo } from "react";
import CircularProgressLoader from "../../../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { PrintReportActionProps } from "../../models";

const PrintReportAction: FC<PrintReportActionProps> = ({ isDownloading, startDownload }) => {
    const className = useMemo(
        () => (isDownloading ? "bg-gray-200 flex items-center" : "cursor-pointer hover:bg-gray-300"),
        [isDownloading]
    );

    const onClickHandler = () => {
        if (isDownloading) return;

        startDownload();
    };

    return (
        <li
            className={`py-2 px-5 text-md ${className}`}
            onClick={onClickHandler}
            data-testid={isDownloading ? "download-order-loading" : "download-order-button"}
        >
            {isDownloading && <CircularProgressLoader iconSize="sm" />}
            <span>{isDownloading ? "Downloading…" : "Print report"}</span>
        </li>
    );
};

export default PrintReportAction;
