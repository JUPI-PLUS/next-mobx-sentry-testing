// libs
import { FC } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

// helpers
import { postOrderKitActivation } from "../../../../api/orders";
import { kitCodeSchema, conditionsSchema } from "../../schema";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";

// constants
import { ROUTES } from "../../../../shared/constants/routes";

// stores
import { useKitActivationStore } from "../../store";

// models
import { KitActivationContainerProps, KitActivationFormData } from "./models";

// components
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import AdditionalInformation from "../AdditionalInformation/AdditionalInformation";
import Conditions from "../Conditions/Conditions";
import KitCodeForm from "./components/KitCodeForm/KitCodeForm";
import SubmitFormButton from "./components/SubmitFormButton/SubmitFormButton";
import { prepareConditionData } from "./utils";

const KitActivationContainer: FC<KitActivationContainerProps> = ({
    isConditionsListFetching,
    errors,
    isError = false,
}) => {
    const {
        push,
        query: { userId },
    } = useRouter();

    const {
        kitActivationStore: { kitCode, orderPatient, conditions, setupKitCode },
    } = useKitActivationStore();

    const { mutateAsync, isLoading } = useMutation(postOrderKitActivation, {
        onSuccess() {
            showSuccessToast({ title: `Kit with code ${kitCode} has been activated` });
            push(ROUTES.orders.list.route);
        },
        onError() {
            showErrorToast({ title: "Validation error" });
        },
    });

    const onSubmitKitCodeHandler = async (formData: { kit_number: string }) => {
        setupKitCode(formData.kit_number);
    };

    const onSubmitOrderActivateHandler = async (formData: KitActivationFormData) => {
        const payloadData = {
            user_uuid: userId as string,
            kit_number: kitCode,
            order_conditions: prepareConditionData(conditions, formData, orderPatient!),
            referral_doctor: formData.referral_doctor,
            referral_notes: formData.referral_notes,
        };

        try {
            await mutateAsync(payloadData);
        } catch {}
    };

    const isSubmitFormButtonDisabled = isConditionsListFetching || !kitCode || isError;

    return (
        <>
            <FormContainer
                schema={kitCodeSchema}
                defaultValues={{ kit_number: "" }}
                onSubmit={onSubmitKitCodeHandler}
                className="w-full max-w-2xl mx-auto flex my-8 gap-4"
            >
                <KitCodeForm errors={errors} isError={isError} isLoading={isConditionsListFetching || isLoading} />
            </FormContainer>
            <FormContainer
                schema={conditionsSchema(conditions)}
                defaultValues={{}}
                onSubmit={onSubmitOrderActivateHandler}
                className="grid grid-rows-frAuto h-full overflow-hidden divide-y divide-dark-400"
                shouldShowConfirmationDialog={false}
            >
                <>
                    <div className="h-full overflow-auto pb-8">
                        <Conditions isLoading={isConditionsListFetching} isDisabled={!kitCode || isError} />
                        <AdditionalInformation isDisabled={isSubmitFormButtonDisabled} />
                    </div>
                    <div className="flex justify-end px-6 py-4">
                        <SubmitFormButton isDisabled={isSubmitFormButtonDisabled} />
                    </div>
                </>
            </FormContainer>
        </>
    );
};

export default observer(KitActivationContainer);
