import { FC } from "react";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";
import CircularProgressLoader from "../../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { DownloadIcon } from "../../../../../../components/uiKit/Icons";
import { DownloadResultsProps } from "../../models";

const DownloadResults: FC<DownloadResultsProps> = ({ isDownloading, startDownload }) => {
    return (
        <TextButton
            text={isDownloading ? "Downloading…" : "Download results"}
            startIcon={isDownloading ? <CircularProgressLoader iconSize="sm" /> : undefined}
            endIcon={isDownloading ? undefined : <DownloadIcon className="fill-dark-900" />}
            variant="neutral"
            size="thin"
            className="font-medium mt-6"
            onClick={startDownload}
            data-testid="download-order-button"
            disabled={isDownloading}
        />
    );
};

export default DownloadResults;
