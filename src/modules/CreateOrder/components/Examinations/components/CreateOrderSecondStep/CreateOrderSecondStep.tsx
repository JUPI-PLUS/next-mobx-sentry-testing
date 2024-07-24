import { useMutation, useQuery } from "react-query";
import { ORDERS_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { useCreateOrderStore } from "../../../../store";
import { observer } from "mobx-react";
import { getOrderConditionsByExamTemplateUUIDs, patchOrderConditions } from "../../../../../../api/orderConditions";
import FormContainer from "../../../../../../components/uiKit/forms/FormContainer/FormContainer";
import SecondStepForm from "./components/SecondStepForm/SecondStepForm";
import { schema } from "./schema";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import { ROUTES } from "../../../../../../shared/constants/routes";
import { useRouter } from "next/router";
import { createOrder } from "../../../../../../api/orders";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";
import { AxiosError } from "axios";
import { CreateOrder, PatchOrderConditionsRequest } from "../../../../models";

const CreateOrderSecondStep = () => {
    const { push, replace } = useRouter();
    const {
        createOrderStore: {
            getAllSelectedExamTemplatesUUIDs,
            conditions,
            setupConditions,
            setupIsConditionsFetching,
            secondStepFormValues,
            setupSecondStepFormValues,
            createOrderMutationBody,
            updateOrderConditionsMutationBody,
            setupCreatedOrderUUID,
            isConditionsRequired,
        },
    } = useCreateOrderStore();

    const { data: conditionsData, isFetching: isConditionsFetching } = useQuery(
        ORDERS_QUERY_KEYS.CONDITIONS(getAllSelectedExamTemplatesUUIDs),
        getOrderConditionsByExamTemplateUUIDs({ exam_templates: getAllSelectedExamTemplatesUUIDs }),
        {
            enabled: Boolean(getAllSelectedExamTemplatesUUIDs.length),
            // TODO: check if this staleTime is necessary
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => queryData.data.data,
        }
    );

    const submitOrderConditions = async (orderUUID: string) => {
        try {
            await mutateOrderConditions({ ...updateOrderConditionsMutationBody, uuid: orderUUID });
        } catch (e) {}
    };

    const { mutateAsync: mutateCreateOrder } = useMutation<
        ServerResponse<{ uuid: string }>,
        AxiosError<BaseFormServerValidation>,
        CreateOrder
    >(createOrder, {
        async onSuccess(queryData) {
            const orderUUID = queryData.data.data.uuid;
            showSuccessToast({ title: "Order has been successfully created" });
            setupCreatedOrderUUID(orderUUID);
            if (isConditionsRequired) {
                await submitOrderConditions(orderUUID);
                return;
            }

            push(ROUTES.orders.list.route);
        },
        onError() {
            showErrorToast({ title: "Couldn't create order" });
            replace(ROUTES.orders.list.route);
        },
    });

    const { mutateAsync: mutateOrderConditions } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>,
        PatchOrderConditionsRequest
    >(patchOrderConditions, {
        onSuccess() {
            push(ROUTES.orders.list.route);
        },
        onError() {
            showErrorToast({ title: "Couldn't add order conditions" });
        },
    });

    const onSubmit = async <T extends typeof secondStepFormValues>({ referral_doctor, referral_notes, ...rest }: T) => {
        setupSecondStepFormValues({ ...rest, ...secondStepFormValues, referral_doctor, referral_notes });
        try {
            await mutateCreateOrder({
                ...createOrderMutationBody,
                referral_doctor: (referral_doctor as string) ?? "",
                referral_notes: (referral_notes as string) ?? "",
            });
        } catch (e) {}
    };

    useEffect(() => {
        setupIsConditionsFetching(isConditionsFetching);
    }, [isConditionsFetching]);

    useEffect(() => {
        if (conditionsData && !isConditionsFetching) {
            setupConditions(conditionsData);
        }
    }, [conditionsData, isConditionsFetching]);

    return (
        <FormContainer
            schema={schema(conditions)}
            defaultValues={secondStepFormValues}
            onSubmit={onSubmit}
            className="w-full h-full flex flex-col"
            toObserveFormValue
        >
            <SecondStepForm />
        </FormContainer>
    );
};

export default observer(CreateOrderSecondStep);
