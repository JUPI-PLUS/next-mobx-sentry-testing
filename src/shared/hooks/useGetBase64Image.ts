import { useQuery } from "react-query";
import { DEFAULT_LOOKUP_STALE_TIME } from "../constants/queries";
import { blobToBase64 } from "../utils/images";

export const useGetBase64Image = (keys: string[], cb: () => Promise<{ data: string }>, enabled = false) => {
    return useQuery(keys, cb, {
        refetchOnWindowFocus: false,
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        enabled: enabled,
        select: queryData => queryData?.data && blobToBase64(queryData?.data),
    });
};
