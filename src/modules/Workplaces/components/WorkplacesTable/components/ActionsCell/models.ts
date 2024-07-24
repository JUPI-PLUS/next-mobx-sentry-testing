// models
import { Workplace } from "../../../../../../shared/models/business/workplace";

export type ActionsCellProps = {
    row: Workplace;
    onDeleteWorkplace: () => void;
};
