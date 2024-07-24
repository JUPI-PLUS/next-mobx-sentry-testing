import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PermissionAccessElement from "../../../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { IconButton } from "../../../../../../components/uiKit/Button/Button";
import { OrderStatus } from "../../../../../../shared/models/business/order";
import { FC, useRef } from "react";
import Popper from "../../../../../../components/uiKit/Popper/Popper";
import { useOrderStore } from "../../../../store";
import { observer } from "mobx-react-lite";
import { OrdersPermission } from "../../../../../../shared/models/permissions";
import { OrderActionsDropdownProps } from "./models";

const OrderActionsDropdown: FC<OrderActionsDropdownProps> = ({ onDeleteClick, onClose, onOpen, isOpen }) => {
    const {
        orderStore: { orderDetails },
    } = useOrderStore();
    const iconRef = useRef(null);
    const isOrderNew = orderDetails?.status === OrderStatus.NEW;

    return (
        <PermissionAccessElement required={[OrdersPermission.DELETE]}>
            {isOrderNew && (
                <div className="h-full">
                    <div className="flex h-full w-full items-center justify-center">
                        <IconButton
                            aria-label="Action"
                            variant="transparent"
                            size="thin"
                            onClick={onOpen}
                            ref={iconRef}
                            data-testid="order-actions-button"
                        >
                            <EllipsisHorizontalIcon className="w-6 h-6 fill-dark-700" />
                        </IconButton>
                    </div>
                </div>
            )}
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end">
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onDeleteClick}
                        data-testid="delete-order-button"
                    >
                        Delete
                    </li>
                </ul>
            </Popper>
        </PermissionAccessElement>
    );
};

export default observer(OrderActionsDropdown);
