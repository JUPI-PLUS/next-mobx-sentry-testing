import React, { FC, useEffect } from "react";
import { PrivateLayoutProps } from "./models";
import FullPageLoading from "../../uiKit/FullPageLoading/FullPageLoading";
import Menu from "../Menu/Menu";
import { useLoggedOutRedirect } from "../../../shared/hooks/useLoggedOutRedirect";
import { observer } from "mobx-react";
import CommonHead from "../CommonHead/CommonHead";
import Header from "../../uiKit/Header/Header";
import { useRootStore } from "../../../shared/store";
import { injectAxiosInterceptors } from "../../../shared/utils/interceptors";
import { recheckVerificationInStorage } from "../../../shared/utils/verification";

const PrivateLayout: FC<PrivateLayoutProps> = ({
    title = "",
    className = "",
    containerClassName = "",
    thin = false,
    children,
    overflowHidden = true,
}) => {
    const {
        menu: { toggle, isOpen },
    } = useRootStore();
    const isLoading = useLoggedOutRedirect();
    const {
        user: { name },
    } = useRootStore();

    useEffect(() => {
        recheckVerificationInStorage();
        injectAxiosInterceptors();
    }, []);

    return (
        <>
            <CommonHead title={title} />
            <main className={`grid h-screen grid-rows-[auto_1fr] bg-mint-100 text-dark-900 ${className}`}>
                {isLoading ? (
                    <FullPageLoading />
                ) : (
                    <>
                        <Header title={name} />
                        <div
                            className={`grid h-[calc(100vh - 60px)] grid-cols bg-mint-100 text-dark-900 ${containerClassName} ${
                                overflowHidden ? "overflow-hidden" : ""
                            }`}
                        >
                            <Menu isMenuToggled={isOpen} toggle={toggle} />
                            <div
                                className={`transition-all duration-300 flex-grow grid grid-cols-[auto] overflow-y-auto ${
                                    isOpen ? "pl-72" : "pl-20"
                                } ${thin ? "" : "p-6"}`}
                                data-testid="content-container"
                            >
                                {children}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default observer(PrivateLayout);
