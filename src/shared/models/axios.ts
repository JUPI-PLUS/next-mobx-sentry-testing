import { AxiosResponse } from "axios";

export interface ServerFormValidationError {
    field: string;
    message: string[];
    messageLocaliseId: string[];
}

export type BaseFormServerValidation = { status: string; message: string; errors: ServerFormValidationError[] };

export interface PaginationServerResponse<DataT> {
    current_page: number;
    data: DataT[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface CommonServerResponse<DataT> {
    status: string;
    message: string;
    data: DataT;
}

export interface CommonServerListResponse<DataT> extends Pick<CommonServerResponse<DataT>, "status" | "message"> {
    data: DataT[];
    total: number;
}

export enum ResponseStatuses {
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    NOT_EXECUTABLE_CONTENT = 422,
    SERVER_ERROR = 500,
}

type ServerResponseTypeName = "common" | "pagination" | "list" | "file";

export type PromisedServerResponse<DataT = null, ResponseType extends ServerResponseTypeName = "common"> = Promise<
    ServerResponse<DataT, ResponseType>
>;

export type ServerResponse<DataT = null, ResponseType extends ServerResponseTypeName = "common"> = AxiosResponse<
    ServerResponseType<DataT, ResponseType>
>;

export type ServerResponseType<
    DataT,
    ResponseType extends ServerResponseTypeName = "common"
> = ResponseType extends "common"
    ? CommonServerResponse<DataT>
    : ResponseType extends "list"
    ? CommonServerListResponse<DataT>
    : ResponseType extends "pagination"
    ? PaginationServerResponse<DataT>
    : ResponseType extends "file"
    ? BlobPart
    : never;
