// libs
import { faker } from "@faker-js/faker";

// models
import React from "react";

export const MOCKED_LIST_OF_TABLE_COLUMNS = [
    {
        id: faker.datatype.uuid(),
        accessorKey: faker.random.alpha(8),
        header: faker.random.alpha(9),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cell: ({ row }) => <p>{row.original.name}</p>,
    },
];

export const MOCKED_TABLE_DATA = () => ({
    name: faker.random.alpha(10),
});

export const MOCKED_LIST_OF_TABLE_DATA = new Array(10).fill(0).map(() => MOCKED_TABLE_DATA());
