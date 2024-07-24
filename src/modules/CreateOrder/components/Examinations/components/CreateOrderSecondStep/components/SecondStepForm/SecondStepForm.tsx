import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";
import AdditionalInformation from "../AdditionalInformation/AdditionalInformation";
import Conditions from "../Conditions/Conditions";
import StepperSummary from "../../../StepperSummary/StepperSummary";
import { useCreateOrderStore } from "../../../../../../store";
import { CreateOrderStepsEnum } from "../../../../../../models";

const SecondStepForm = () => {
    const {
        formState: { dirtyFields, isSubmitting },
    } = useFormContext();

    const {
        createOrderStore: { filteredConditions, conditionsValues, secondStepFormValues, activeStep },
    } = useCreateOrderStore();

    // disabled if their any filteredConditions, dirtyFields or conditionsValues are present
    const isStepperDisabled = Boolean(filteredConditions.length)
        ? !(Object.values({ ...dirtyFields, ...conditionsValues, ...secondStepFormValues }).filter(Boolean).length > 0)
        : false;

    const isSaveOrderDisabled =
        activeStep !== CreateOrderStepsEnum.ADDITIONAL_INFO || isStepperDisabled || isSubmitting;

    return (
        <>
            <div className="overflow-hidden w-full h-full max-w-2xl mx-auto pb-4">
                <div className="h-full overflow-auto">
                    <Conditions />
                    <AdditionalInformation />
                </div>
            </div>
            <StepperSummary
                isDisabled={isSaveOrderDisabled}
                submitButton={{
                    text: "Save order",
                    className: "text-center",
                }}
            />
        </>
    );
};

export default observer(SecondStepForm);
