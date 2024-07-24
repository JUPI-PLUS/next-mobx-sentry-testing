import React, { FC } from "react";
import ToastContainer from "../../uiKit/Toast/ToastContainer";
import { ErrorLayoutProps } from "./models";
import CommonHead from "../CommonHead/CommonHead";

const ErrorLayout: FC<ErrorLayoutProps> = ({ title = "Error", children }) => {
    return (
        <>
            <CommonHead title={title} />
            <main className="bg-mint-100 text-dark-900">
                {children}
                <ToastContainer />
            </main>
        </>
    );
};

export default ErrorLayout;
