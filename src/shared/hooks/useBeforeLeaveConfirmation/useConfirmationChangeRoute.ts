import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "../../constants/routes";
import { useLogoutFromForm } from "./useLogoutFromForm";
import { UseBeforeLeaveConfirmationProps } from "./models";

export const useConfirmationChangeRoute = ({
    isConfirmed,
    leaveFromRouteValue,
    leaveToRouteValue,
    setIsUserWarnedChange,
}: UseBeforeLeaveConfirmationProps) => {
    const onConfirmLogoutFromForm = useLogoutFromForm();
    const { push } = useRouter();
    useEffect(() => {
        if (isConfirmed && leaveFromRouteValue) {
            setIsUserWarnedChange(true);
            const isNextRouteRedirectsToLogin = leaveToRouteValue === ROUTES.login.route;

            if (isNextRouteRedirectsToLogin) {
                onConfirmLogoutFromForm();
                return;
            }

            push(leaveToRouteValue, leaveToRouteValue, { shallow: true });
        }
    }, [isConfirmed]);
};
