import { limsClient } from "../config";
import { ORDERS_ENDPOINTS } from "./endpoints";
import { PromisedServerResponse } from "../../shared/models/axios";
import { Order } from "../../shared/models/business/order";
import { OrderExamDetails } from "../../modules/Order/models";
import { CreateOrder } from "../../modules/CreateOrder/models";
import { OrderDetails } from "../../modules/Order/models";
import { KitActivationData } from "../../modules/KitActivation/models";

export const getOrderList = (page: number, filters: string): PromisedServerResponse<Order, "list"> =>
    limsClient.get(ORDERS_ENDPOINTS.list(page, filters));

export const getOrderExamsList = (uuid: string) => (): PromisedServerResponse<OrderExamDetails, "list"> =>
    limsClient.get(ORDERS_ENDPOINTS.orderExamsList(uuid));

export const createOrder = (orderFormData: CreateOrder): PromisedServerResponse<{ uuid: string }> =>
    limsClient.post(ORDERS_ENDPOINTS.create(), orderFormData);

export const deleteOrder = (uuid: string): PromisedServerResponse => limsClient.delete(ORDERS_ENDPOINTS.mutate(uuid));

export const getOrderDetails = (uuid: string) => (): PromisedServerResponse<OrderDetails> =>
    limsClient.get(ORDERS_ENDPOINTS.details(uuid));

export const postOrderKitActivation = (kitActivationData: KitActivationData): PromisedServerResponse =>
    limsClient.post(ORDERS_ENDPOINTS.orderKitActivation(), kitActivationData);
