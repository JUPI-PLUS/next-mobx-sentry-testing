import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ROUTES } from "../constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../constants/auth";
import { setAuthTokenToAxiosLocalizeClient } from "../utils/auth";

export const useLoggedIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        if (!token) {
            setIsLoggedIn(false);
            setIsLoading(false);
            router.replace(ROUTES.login.route);
        } else {
            setAuthTokenToAxiosLocalizeClient(token);
            setIsLoading(false);
        }
    }, []);

    return { isLoading, isLoggedIn };
};
