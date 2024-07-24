// models
import { SortingWay } from "../../../shared/models/common";

export interface SortingButtonProps {
    sortDirection: SortingWay;
    onClick: (value: SortingWay) => void;
    className?: string;
}

export type SortingIconProps = Pick<SortingButtonProps, "sortDirection">;
