import React, { useEffect } from "react";
import FullPageLoading from "../src/components/uiKit/FullPageLoading/FullPageLoading";
import { useRootStore } from "../src/shared/store";
import { useFetchMe } from "../src/shared/hooks/useMe";
import Router from "next/router";
import { ROUTES } from "../src/shared/constants/routes";
import { observer } from "mobx-react";

const EntryPoint = () => {
    const {
        auth: { isLoggedIn },
    } = useRootStore();

    const { data } = useFetchMe(Boolean(isLoggedIn));

    useEffect(() => {
        if (isLoggedIn && data) {
            Router.replace(ROUTES.dashboard.route);
        } else if (!isLoggedIn) {
            Router.replace(ROUTES.login.route);
        }
    }, [data, isLoggedIn]);

    return <FullPageLoading />;
};

export default observer(EntryPoint);
