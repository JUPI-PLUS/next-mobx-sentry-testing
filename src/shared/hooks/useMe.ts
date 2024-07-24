// libs
import { useQuery } from "react-query";

// api
import { me } from "../../api/users";

// constants
import { USERS_QUERY_KEYS } from "../constants/queryKeys";
import { ME_STALE_TIME } from "../constants/queries";

export const useFetchMe = (enabled: boolean, retry = 1) => {
    return useQuery(USERS_QUERY_KEYS.ME, me, {
        enabled,
        refetchOnWindowFocus: false,
        staleTime: ME_STALE_TIME,
        select: queryData => queryData.data.data,
        retry,
    });
};
