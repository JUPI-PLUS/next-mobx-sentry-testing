import React, { FC, useMemo, useState } from "react";
import PermissionAccessElement from "../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { OrdersPermission } from "../../../../shared/models/permissions";
import { OrderInformationProps } from "./models";
import { OrderStatus } from "../../../../shared/models/business/order";
import { format, fromUnixTime } from "date-fns";
import { addOffsetToUtcDate } from "../../../../shared/utils/date";
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { useQuery } from "react-query";
import { ORDER_RESULTS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { downloadOrderResultsPDF } from "../../../../api/results";
import { downloadFile } from "../../../../shared/utils/download";
import ViewRichText from "../../../../components/uiKit/RichText/ViewRichText";
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import DownloadResults from "./components/DownloadResult/DownloadResults";
import OrderActionsDropdown from "./components/OrderActionsDropdown/OrderActionsDropdown";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { observer } from "mobx-react";
import DeleteDialog from "./components/OrderActionsDropdown/DeleteDialog/DeleteDialog";
import { getOrderStatus } from "./utils";
import { TextButton } from "../../../../components/uiKit/Button/Button";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useOrderStore } from "../../store";

const OrderInformation: FC<OrderInformationProps> = ({
    order: { referral_doctor, uuid, order_number, status, referral_notes, created_at_timestamp },
    onSelectedTemplatesDrawerOpen,
}) => {
    const [isDownloadTriggered, setIsDownloadTriggered] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOrderOpened, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();

    const {
        orderStore: { isUserDeleted },
    } = useOrderStore();

    const orderStatus = useMemo(() => getOrderStatus(status), [status]);
    const isOrderNew = status === OrderStatus.NEW;
    const shouldShowDownloadResultsButton = !isOrderNew && !isUserDeleted;

    useQuery(ORDER_RESULTS_QUERY_KEYS.DOWNLOAD_ORDER_PDF(uuid), downloadOrderResultsPDF(uuid), {
        enabled: isDownloadTriggered,
        onSuccess: queryData => {
            setIsDownloadTriggered(false);
            downloadFile(new Blob([queryData.data]), `Laborbefund-${order_number}`);
        },
    });

    const startDownloadOrderResultsPDF = () => {
        setIsDownloadTriggered(true);
        showSuccessToast({ title: "Download report has been started" });
    };

    return (
        <div className="h-full bg-white border border-inset border-dark-400 rounded-lg overflow-x-auto p-6 shadow-card-shadow">
            <div className="flex justify-between">
                <h3 className="text-dark-900 text-md font-bold mb-2">Order</h3>
                <OrderActionsDropdown
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpen={onOpen}
                    onDeleteClick={onDeleteDialogOpen}
                />
            </div>
            <ul>
                <li className="flex justify-between py-3 border-b border-inset border-dark-400 text-md font-normal">
                    <span className="text-dark-800 mr-14">Doctor</span>
                    <span
                        className="text-dark-900 text-right break-word"
                        data-testid="order-information-referral-doctor"
                    >
                        {referral_doctor ?? "--"}
                    </span>
                </li>
                <li className="flex justify-between py-3 border-b border-inset border-dark-400 text-md font-normal">
                    <span className="text-dark-800">Status</span>
                    <span className="text-dark-900" data-testid="order-information-order-status">
                        {orderStatus}
                    </span>
                </li>
                <li className="flex justify-between py-3 border-b border-inset border-dark-400 text-md font-normal">
                    <span className="text-dark-800">Date of creation</span>
                    <span className="text-dark-900" data-testid="order-information-creation-date">
                        {format(addOffsetToUtcDate(fromUnixTime(created_at_timestamp ?? 0)), DATE_FORMATS.DATE_ONLY)}
                    </span>
                </li>
            </ul>
            <div className="text-md font-normal">
                <div className="py-3 border-b border-inset border-dark-400">
                    <p className="text-dark-800 mb-1.5">Refferal notes</p>
                    {referral_notes ? (
                        <ViewRichText
                            html={referral_notes}
                            className="line-clamp-3"
                            data-testid="order-information-referral-notes"
                        />
                    ) : (
                        <p className="line-clamp-3" data-testid="order-information-referral-notes">
                            --
                        </p>
                    )}
                </div>
                {shouldShowDownloadResultsButton && (
                    <PermissionAccessElement required={[OrdersPermission.DOWNLOAD]}>
                        <DownloadResults
                            isDownloading={isDownloadTriggered}
                            startDownload={startDownloadOrderResultsPDF}
                        />
                    </PermissionAccessElement>
                )}
            </div>
            <DeleteDialog isOpen={isDeleteOrderOpened} onClose={onDeleteDialogClose} />
            <TextButton
                className="font-medium mt-3"
                endIcon={<EyeIcon className="w-6 h-6" />}
                variant="neutral"
                size="thin"
                onClick={onSelectedTemplatesDrawerOpen}
                text="View selected templates"
            />
        </div>
    );
};

export default observer(OrderInformation);
