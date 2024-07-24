import React, { FC, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import FormPasswordInput from "../../../../components/uiKit/forms/Inputs/PasswordInput/FormPasswordInput";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";
import { rollbackErrorMessage } from "../../../../shared/errors/errorMessages";
import Notification from "../../../../components/uiKit/Notification/Notification";
import { handleServerNotificationError } from "../../../../shared/utils/form";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

const LoginForm: FC<CommonServerValidationProps> = ({ isError, errors }) => {
    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();
    useFormValidation({ isError, errors });

    const notificationError = useMemo(() => handleServerNotificationError(errors), [errors]);

    return (
        <div>
            {isError && (
                <div className="mt-4">
                    <Notification text={notificationError || rollbackErrorMessage} variant="error" />
                </div>
            )}
            <div className="my-3">
                <div className="mb-4">
                    <FormInput name="email" label="Email" disabled={isSubmitting} />
                </div>
                <div className="mb-4">
                    <FormPasswordInput name="password" label="Password" disabled={isSubmitting} />
                </div>
            </div>
            <p className="mb-10 text-xs">If you forgot you password, please use yours mobile app to reset it</p>
            <div className="flex justify-end mt-4">
                <SolidButton
                    data-testid="login-submit-button"
                    size="sm"
                    text="Login"
                    type="submit"
                    disabled={!isDirty}
                />
            </div>
        </div>
    );
};

export default LoginForm;
