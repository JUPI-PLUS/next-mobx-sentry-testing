// models
import { ID } from "../../shared/models/common";

export interface WorkplacesFilters {
    search_string: string;
    exam_template_id: Array<ID>;
}
