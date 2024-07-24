import { limsClient } from "../config";
import { RESULTS_ENDPOINTS } from "./endpoints";
import { PromisedServerResponse } from "../../shared/models/axios";

export const downloadOrderResultsPDF = (orderUUID: string) => (): PromisedServerResponse<BlobPart, "file"> =>
    limsClient.get(RESULTS_ENDPOINTS.downloadOrderResultsPDF(orderUUID), { responseType: "blob" });
