import { queryClient } from "../../../pages/_app";
import { PROJECTS_QUERY_KEYS, USERS_QUERY_KEYS } from "../constants/queryKeys";

export const clearQueriesLogout = () => {
    queryClient.removeQueries(USERS_QUERY_KEYS.ME);
    queryClient.removeQueries(PROJECTS_QUERY_KEYS.LIST);
};
