// models
import { Template, TemplateTypeEnum } from "../../../../shared/models/business/template";
import { ID } from "../../../../shared/models/common";
import { Lookup } from "../../../../shared/models/form";

// components
import { CustomColumn } from "../../../../components/Table/models";
import ActionsCell from "./components/Cells/ActionsCell/ActionsCell";
import NameCell from "./components/Cells/NameCell/NameCell";
import SampleTypeCell from "./components/Cells/SampleTypeCell/SampleTypeCell";
import StatusCell from "./components/Cells/StatusCell/StatusCell";

export const getColumns = (
    isInsertDisable: boolean,
    sampleTypesLookup: Array<Lookup<ID>>
): CustomColumn<Template>[] => [
    {
        id: "name",
        header: "name",
        cell: ({
            row: {
                original: { uuid, item_type, name },
            },
        }) => <NameCell type={item_type} uuid={uuid} name={name} />,
    },
    {
        id: "type",
        header: "type",
        cell: ({
            row: {
                original: { item_type },
            },
        }) => {
            switch (item_type) {
                case TemplateTypeEnum.EXAM:
                    return <div>Exam</div>;
                case TemplateTypeEnum.KIT:
                    return <div>Kit</div>;
                case TemplateTypeEnum.GROUP:
                default:
                    return null;
            }
        },
        maxWidth: 200,
    },
    {
        id: "code",
        header: "code",
        cell: ({
            row: {
                original: { item_type, code },
            },
        }) => {
            if (item_type !== TemplateTypeEnum.GROUP && code) return <div>{code}</div>;
            return null;
        },
        maxWidth: 200,
    },
    {
        id: "sample_type",
        header: "Sample type",
        cell: ({ row: { original } }) => {
            if (original.item_type === TemplateTypeEnum.EXAM)
                return <SampleTypeCell sampleTypeId={original.sample_type_id!} sampleTypesLookup={sampleTypesLookup} />;

            return null;
        },
        maxWidth: 200,
    },
    {
        id: "status",
        header: "status",
        cell: ({
            row: {
                original: { item_type, status },
            },
        }) => {
            if (item_type !== TemplateTypeEnum.GROUP && status) return <StatusCell type={item_type} status={status} />;
            return null;
        },
        maxWidth: 200,
    },
    {
        id: "action",
        cell: ({ row: { original } }) => <ActionsCell template={original} isInsertDisable={isInsertDisable} />,
        maxWidth: 44,
    },
];
