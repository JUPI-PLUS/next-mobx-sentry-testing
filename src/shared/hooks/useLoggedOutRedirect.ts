// libs
import { useEffect } from "react";
import { useRouter } from "next/router";

// stores
import { useRootStore } from "../store";

// helpers
import { useFetchMe } from "./useMe";

// constants
import { ROUTES } from "../constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../constants/auth";

export const useLoggedOutRedirect = () => {
    const { replace } = useRouter();
    const {
        user: { user, setUser },
        auth: { setAccessToken, setMemorizedRoute, isLoggedIn },
    } = useRootStore();

    const { data } = useFetchMe(Boolean(isLoggedIn));

    useEffect(() => data && setUser(data), [data]);

    useEffect(() => {
        const token = window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
            setMemorizedRoute(`${window.location.pathname}${window.location.search}${window.location.hash}`);
            replace(ROUTES.login.route);
        }
        setAccessToken(token);
    }, []);

    return !isLoggedIn || !user;
};
