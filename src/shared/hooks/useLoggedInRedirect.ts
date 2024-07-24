import { useRootStore } from "../store";
import { useFetchMe } from "./useMe";
import { useEffect, useState } from "react";
import { AUTH_LOCAL_STORAGE_KEYS } from "../constants/auth";
import { ROUTES } from "../constants/routes";
import { useRouter } from "next/router";

export const useLoggedInRedirect = () => {
    const {
        user: { user, setUser },
        auth: { isLoggedIn, memorizedRoute, setAccessToken, setMemorizedRoute },
    } = useRootStore();
    const router = useRouter();
    const [copyMemorizedRoute] = useState(memorizedRoute);

    useEffect(() => {
        setAccessToken(window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN));
    }, [setAccessToken]);

    useEffect(() => {
        if (isLoggedIn && Boolean(user)) {
            setMemorizedRoute(null);
            router.replace(copyMemorizedRoute || ROUTES.dashboard.route);
        }
    }, [isLoggedIn, user, copyMemorizedRoute]);

    const { data, isLoading: isMeLoading } = useFetchMe(Boolean(isLoggedIn));

    useEffect(() => {
        if (!user && data) {
            setUser(data);
        }
    }, [user, data]);

    return isLoggedIn === null || isMeLoading || Boolean(user);
};
