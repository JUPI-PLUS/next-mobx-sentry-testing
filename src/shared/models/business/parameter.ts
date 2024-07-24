// models
import { ID } from "../common";
import { ParameterViewTypeEnum } from "./enums";

export interface Parameter {
    id: number;
    uuid: string;
    si_measurement_units_id: ID;
    name: string;
    code: string;
    biological_reference_intervals: string;
    notes: string | null;
    type_id: number;
    type_view_id: ParameterViewTypeEnum;
    is_printable: boolean;
    is_required: boolean;
    options: { id: number; name: string }[] | null;
}

export interface ShortParameter {
    id: number;
    uuid: string;
    name: string;
    code: string;
}
