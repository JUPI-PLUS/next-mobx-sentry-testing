//  libs
import React, { FC } from "react";
import { observer } from "mobx-react";
import { useMutation } from "react-query";

//  stores
import { useOrderStore } from "../../store";

//  helpers
import { queryClient } from "../../../../../pages/_app";
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { detachExamsFromSample } from "../../../../api/samples";

//  models
import { SampleActionType } from "../../../../shared/models/business/sample";
import { SamplingActionsContainerProps } from "./models";

//  constants
import { ORDERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

//  components
import SampleDetailsDrawer from "../../../../components/SamplingDrawers/SampleDetailsDrawer/SampleDetailsDrawer";
import SampleDetachExamsDialog from "../SampleChangeStatusDialog/SampleChangeStatusDialog";
import SamplingDrawer from "../../../../components/SamplingDrawers/SamplingDrawer/SamplingDrawer";

const SamplingActionsContainer: FC<SamplingActionsContainerProps> = ({
    orderUUID,
    isSamplingDrawerOpen,
    onSamplingDrawerClose,
}) => {
    const {
        orderStore: {
            sampleActionType,
            selectedExams,
            lastRequestedOrdersQueryKey,
            oneOfSelectedExam,
            resetOrderExams,
            resetSampleActionType,
            resetIsSingleItemAction,
            orderDetails,
        },
    } = useOrderStore();

    const { mutate: mutateDetachExams } = useMutation(detachExamsFromSample, {
        async onSuccess() {
            await queryClient.refetchQueries(ORDERS_QUERY_KEYS.ORDER_EXAMS_DETAILS(orderUUID));
            await queryClient.refetchQueries(ORDERS_QUERY_KEYS.ONE(orderUUID));
            if (lastRequestedOrdersQueryKey) {
                await queryClient.refetchQueries(lastRequestedOrdersQueryKey);
            }
            showSuccessToast({ title: "Sample successfully removed" });
            resetIsSingleItemAction();
            resetOrderExams();
        },
    });

    const onDetachExamsSubmit = async () => {
        await mutateDetachExams({
            exams: { exams: Array.from(selectedExams.values()).map(exam => ({ exam_uuid: exam.exam_uuid })) },
            uuid: oneOfSelectedExam.sample_uuid,
        });
        resetSampleActionType();
    };

    const onCloseDrawer = () => {
        resetOrderExams();
        resetSampleActionType();
        resetIsSingleItemAction();
    };

    return (
        <>
            <SampleDetailsDrawer
                isOpen={sampleActionType === SampleActionType.Details}
                onClose={onCloseDrawer}
                sampleUUID={oneOfSelectedExam?.sample_uuid}
            />
            <SampleDetachExamsDialog onSubmit={onDetachExamsSubmit} />
            {isSamplingDrawerOpen && (
                <SamplingDrawer
                    onClose={onSamplingDrawerClose}
                    orderUUID={orderUUID}
                    userUUID={orderDetails?.user_uuid ?? ""}
                    orderNumber={orderDetails?.order_number ?? ""}
                />
            )}
        </>
    );
};

export default observer(SamplingActionsContainer);
