import { FC } from "react";
import { observer } from "mobx-react";
import { IconButton, SolidButton } from "../../../../../../components/uiKit/Button/Button";
import ChevronLeftIcon from "../../../../../../components/uiKit/Icons/ChevronLeftIcon";
import { useCreateOrderStore } from "../../../../store";
import { CreateOrderStepsEnum, StepperSummaryProps } from "../../../../models";

const StepperSummary: FC<StepperSummaryProps> = ({ isDisabled, submitButton }) => {
    const {
        createOrderStore: { activeStep, makeStepForward, makeStepBack },
    } = useCreateOrderStore();

    const isExaminationsStep = activeStep === CreateOrderStepsEnum.EXAMINATIONS;

    return (
        <div className={`flex items-center border-t p-4 ${isExaminationsStep ? "justify-end" : "justify-between"}`}>
            {!isExaminationsStep && (
                <IconButton
                    variant="transparent"
                    size="thin"
                    type="button"
                    disabled={false}
                    data-testid="back-button"
                    onClick={makeStepBack}
                >
                    <div className="flex items-center gap-1 text-md">
                        <ChevronLeftIcon className="w-8 h-8 stroke-black stroke-2" />
                        <span>Back</span>
                    </div>
                </IconButton>
            )}
            <SolidButton
                size="sm"
                text="Continue"
                type="submit"
                onClick={makeStepForward}
                data-testid="continue-button"
                disabled={isDisabled}
                {...submitButton}
            />
        </div>
    );
};

export default observer(StepperSummary);
