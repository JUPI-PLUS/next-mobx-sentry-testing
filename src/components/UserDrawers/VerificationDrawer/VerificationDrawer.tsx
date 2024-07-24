//  libs
import { useMemo } from "react";

//  helpers
import { schema } from "./schema";

//  models
import { VerificationDrawerProps } from "./models";

// constants
import { VERIFICATION_FIELD_TYPES } from "./constants";

//  components
import CodeVerificationForm from "./components/CodeVerificationForm";
import TimeCounter from "./components/TimeCounter";
import FormDrawer from "../../uiKit/Drawer/FormDrawer";

const VerificationDrawer = ({
    verificationField,
    codeLength,
    onSubmit,
    onResend,
    isResendDisabled,
    onClose,
    isOpen,
    error,
    type,
}: VerificationDrawerProps) => {
    const defaultValues = useMemo(
        () => ({
            code: "",
        }),
        []
    );

    const title = useMemo(() => {
        switch (type) {
            case VERIFICATION_FIELD_TYPES.EMAIL:
                return "Email verification";
            case VERIFICATION_FIELD_TYPES.PHONE:
                return "Phone verification";
            default:
                return "";
        }
    }, [type]);

    if (!isOpen) return null;

    return (
        <FormDrawer
            isOpen
            schema={schema(codeLength)}
            defaultValues={defaultValues}
            onClose={onClose}
            onCancel={onClose}
            onSubmit={onSubmit}
            submitText="Submit"
            title={title}
            couldCloseOnBackdrop
            couldCloseOnEsc
            side="right"
            size="lg"
            containerClass="z-50"
        >
            <>
                <div className="mt-6 mb-12 flex flex-col items-center">
                    <CodeVerificationForm
                        codeLength={codeLength}
                        verificationField={verificationField}
                        error={error}
                        type={type}
                    />
                </div>
                <div className="flex justify-center">
                    <TimeCounter
                        onResend={onResend}
                        isResendDisabled={isResendDisabled}
                        targetTime={verificationField.targetTime}
                    />
                </div>
            </>
        </FormDrawer>
    );
};

export default VerificationDrawer;
