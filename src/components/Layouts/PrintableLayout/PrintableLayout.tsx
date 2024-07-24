import React, { FC } from "react";
import { PrintableLayoutProps } from "./models";
import FullPageLoading from "../../uiKit/FullPageLoading/FullPageLoading";
import { useLoggedOutRedirect } from "../../../shared/hooks/useLoggedOutRedirect";
import { observer } from "mobx-react";
import CommonHead from "../CommonHead/CommonHead";

const PrintableLayout: FC<PrintableLayoutProps> = ({ title = "", containerClassName = "", children }) => {
    const isLoading = useLoggedOutRedirect();

    return (
        <>
            <CommonHead title={title} />
            <main className={`overflow-hidden ${containerClassName}`}>
                {isLoading ? <FullPageLoading /> : children}
            </main>
        </>
    );
};

export default observer(PrintableLayout);
