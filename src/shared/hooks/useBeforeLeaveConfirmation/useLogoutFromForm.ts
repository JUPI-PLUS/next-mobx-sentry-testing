import { useRootStore } from "../../store";

export const useLogoutFromForm = () => {
    const { auth } = useRootStore();
    return () => {
        auth.logout();
        auth.setAccessToken(null);
    };
};
