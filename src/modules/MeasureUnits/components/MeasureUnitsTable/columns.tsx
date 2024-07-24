// models
import { CustomColumn } from "../../../../components/Table/models";
import { MeasureUnit } from "../../../../shared/models/business/measureUnits";

// components
import ActionCell from "../Cells/ActionCell/ActionCell";

const columns: CustomColumn<MeasureUnit>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "action",
        maxWidth: 80,
        cell: ({ row }) => <ActionCell row={row} />,
    },
];

export default columns;
