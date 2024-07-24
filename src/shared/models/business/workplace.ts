// models
import { ID } from "../common";

export interface Workplace {
    id: number;
    name: string;
    code: string;
    notes: string;
    uuid: string;
    status_id: ID;
}
