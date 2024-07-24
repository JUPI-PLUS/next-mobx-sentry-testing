// models
import { CustomColumn } from "../../../../components/Table/models";

export type TableProps<TData> = {
    tableName: string;
    columns: CustomColumn<TData>[];
    data?: TData[];
    containerClassName?: string;
};
