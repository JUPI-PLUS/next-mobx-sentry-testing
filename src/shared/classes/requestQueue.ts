import { removeAuthTokenFromAxiosConfig, setAuthTokenToOriginalRequest } from "../utils/auth";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type RequestCallback = (token: string) => void;

export class RequestQueue {
    private _queue: RequestCallback[] = [];

    add(
        axiosConfig: AxiosRequestConfig,
        resolve: (response: AxiosResponse) => void,
        reject: (error: AxiosError) => void
    ) {
        this._queue.push((token: string) => {
            removeAuthTokenFromAxiosConfig(axiosConfig);
            setAuthTokenToOriginalRequest(axiosConfig, token);
            axios(axiosConfig).then(resolve).catch(reject);
        });
    }

    execute(accessToken: string) {
        for (const cb of this._queue) {
            cb(accessToken);
        }
        this.clear();
    }

    clear() {
        this._queue = [];
    }
}
