import { FC } from "react";
import Dialog from "../../../../../../../components/uiKit/Dialog/Dialog";
import { useOrderStore } from "../../../../../store";
import { observer } from "mobx-react";
import { DeleteDialogProps } from "./models";
import { useMutation } from "react-query";
import { ORDERS_QUERY_KEYS } from "../../../../../../../shared/constants/queryKeys";
import { deleteOrder } from "../../../../../../../api/orders";
import { showErrorToast, showSuccessToast } from "../../../../../../../components/uiKit/Toast/helpers";
import { useRouter } from "next/router";
import { ROUTES } from "../../../../../../../shared/constants/routes";

const DeleteDialog: FC<DeleteDialogProps> = ({ onClose, isOpen }) => {
    const {
        orderStore: { orderDetails },
    } = useOrderStore();

    const { push } = useRouter();

    const { mutateAsync: mutateDeleteOrder, isLoading } = useMutation(
        ORDERS_QUERY_KEYS.ONE(orderDetails?.uuid ?? ""),
        deleteOrder,
        {
            async onSuccess() {
                showSuccessToast({ title: "Order has been successfully deleted" });
                onClose();
                push(ROUTES.orders.list.route);
            },
            onError() {
                showErrorToast({ title: "Couldn't delete order" });
            },
        }
    );

    const onSubmit = async () => {
        try {
            await mutateDeleteOrder(orderDetails!.uuid);
        } catch (e) {}
    };

    return (
        <Dialog
            isOpen={isOpen}
            title="Delete order"
            submitText="Delete"
            cancelText="Cancel"
            onSubmit={onSubmit}
            isCancelButtonDisabled={isLoading}
            isSubmitButtonDisabled={isLoading}
            onClose={onClose}
            onCancel={onClose}
        >
            <div>Are you sure want to delete order #{orderDetails?.order_number}?</div>
        </Dialog>
    );
};

export default observer(DeleteDialog);
