export interface SampleTodoListRow {
    orderNumber: string;
    sampleNumber: string;
    examNames: string[];
    referralDoctor: string | null;
    samplingDatetime: number;
    firstName: string | null;
    lastName: string | null;
    birthdateTimestamp: number | null;
}

export interface SampleTodoListItemProps extends SampleTodoListRow {
    onBarcodeMounted: () => void;
}
