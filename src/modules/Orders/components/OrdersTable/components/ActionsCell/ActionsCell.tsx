// libs
import React, { FC, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { observer } from "mobx-react";

// hooks
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";
import { usePermissionsAccess } from "../../../../../../shared/hooks/useUserAccess";

// helpers
import { downloadOrderResultsPDF } from "../../../../../../api/results";
import { downloadFile } from "../../../../../../shared/utils/download";
import { showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";

// constants
import { ORDER_RESULTS_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

// models
import { OrderStatus } from "../../../../../../shared/models/business/order";
import { ActionsCellProps } from "./models";
import { OrdersPermission, ProfilePermission } from "../../../../../../shared/models/permissions";

// components
import Popper from "../../../../../../components/uiKit/Popper/Popper";
import PermissionAccessElement from "../../../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { IconButton } from "../../../../../../components/uiKit/Button/Button";
import PrintReportAction from "./components/PrintReportAction/PrintReportAction";

const ActionsCell: FC<ActionsCellProps> = ({
    onSelectPatient,
    orderUUID,
    orderStatus,
    orderNumber,
    isPatientDeleted,
}) => {
    const [isDownloadTriggered, setIsDownloadTriggered] = useState(false);
    const iconRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const hasAbilityToViewUser = usePermissionsAccess([OrdersPermission.CREATE, ProfilePermission.VIEW_ONE], true);
    const hasAbilityToDownloadOrder = usePermissionsAccess(OrdersPermission.DOWNLOAD);
    const isOrderNew = orderStatus === OrderStatus.NEW;

    useQuery(ORDER_RESULTS_QUERY_KEYS.DOWNLOAD_ORDER_PDF(orderUUID), downloadOrderResultsPDF(orderUUID), {
        enabled: isDownloadTriggered,
        onSuccess: queryData => {
            setIsDownloadTriggered(false);
            downloadFile(new Blob([queryData.data]), `Laborbefund-${orderNumber}`);
        },
    });

    const startDownloadOrderResultsPDF = () => {
        setIsDownloadTriggered(true);
        showSuccessToast({ title: "Download report has been started" });
    };

    const onSelectPatientClick = () => {
        onSelectPatient();
        onClose();
    };

    const shouldShowActionButton = useMemo(() => {
        if (hasAbilityToDownloadOrder && !isOrderNew) {
            return true;
        }

        return hasAbilityToViewUser;
    }, [hasAbilityToDownloadOrder, hasAbilityToViewUser, isOrderNew]);

    const shouldShowPrintReportAction = !isOrderNew && !isPatientDeleted;

    return (
        <PermissionAccessElement
            required={[OrdersPermission.CREATE, OrdersPermission.DOWNLOAD, ProfilePermission.VIEW_ONE]}
            tolerant
        >
            {shouldShowActionButton && (
                <div className="h-full">
                    <div className="flex h-full w-full items-center justify-center">
                        <IconButton
                            aria-label="Action"
                            variant="transparent"
                            size="thin"
                            onClick={onOpen}
                            ref={iconRef}
                            data-testid={`order-${orderNumber}-actions-button`}
                        >
                            <EllipsisHorizontalIcon className="w-6 h-6 fill-dark-700" />
                        </IconButton>
                    </div>
                </div>
            )}
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end">
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    <PermissionAccessElement required={[OrdersPermission.CREATE, ProfilePermission.VIEW_ONE]} tolerant>
                        <li
                            className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                            onClick={onSelectPatientClick}
                            data-testid="select-patient-link"
                        >
                            Select patient
                        </li>
                    </PermissionAccessElement>
                    {shouldShowPrintReportAction && (
                        <PermissionAccessElement required={[OrdersPermission.DOWNLOAD]}>
                            <PrintReportAction
                                isDownloading={isDownloadTriggered}
                                startDownload={startDownloadOrderResultsPDF}
                            />
                        </PermissionAccessElement>
                    )}
                </ul>
            </Popper>
        </PermissionAccessElement>
    );
};

export default observer(ActionsCell);
