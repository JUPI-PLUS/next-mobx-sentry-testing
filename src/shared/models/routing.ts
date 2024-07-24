// models
import { SortingWay } from "./common";

export type FilterFieldsType = Record<string, Partial<{ isArray: boolean; isString: boolean; isNumber: boolean }>>;

export type Primitives = string | number;

export interface SortingFieldsType {
    order_by: string;
    order_way: SortingWay;
}
