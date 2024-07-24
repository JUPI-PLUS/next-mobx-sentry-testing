// models
import { CustomColumn } from "../../../../components/Table/models";
import { SampleType } from "../../../../shared/models/business/sampleTypes";

// components
import ActionCell from "../Cells/ActionCell/ActionCell";
import TextCell from "../../../../components/Table/components/TextCell/TextCell";

const columns: CustomColumn<SampleType>[] = [
    {
        id: "code",
        accessorKey: "code",
        header: "Code",
    },
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <TextCell text={row.original.name} />,
    },
    {
        id: "action",
        maxWidth: 80,
        cell: ({ row }) => <ActionCell row={row} />,
    },
];

export default columns;
