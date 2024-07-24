import React, { FC, useEffect } from "react";
import { PublicLayoutProps } from "./models";
import ToastContainer from "../../uiKit/Toast/ToastContainer";
import { useLoggedInRedirect } from "../../../shared/hooks/useLoggedInRedirect";
import FullPageLoading from "../../uiKit/FullPageLoading/FullPageLoading";
import { observer } from "mobx-react";
import CommonHead from "../CommonHead/CommonHead";
import { injectAxiosInterceptors } from "../../../shared/utils/interceptors";

const PublicLayout: FC<PublicLayoutProps> = ({ title = "", className = "", children }) => {
    const isLoading = useLoggedInRedirect();

    useEffect(() => {
        injectAxiosInterceptors();
    }, []);

    return (
        <>
            <CommonHead title={title} />
            <main className={`bg-mint-100 text-dark-900 ${className}`}>
                {isLoading ? <FullPageLoading /> : <>{children}</>}
                <ToastContainer />
            </main>
        </>
    );
};

export default observer(PublicLayout);
