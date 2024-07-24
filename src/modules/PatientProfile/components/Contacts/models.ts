export interface ContactsContainerProps {
    uuid: string;
}

export interface ContactCardProps {
    uuid: string;
}

export enum ContactActionsEnum {
    ADD_EMAIL,
    EDIT_EMAIL,
    DELETE_EMAIL,
    VERIFY_EMAIL,
    ADD_PHONE,
    EDIT_PHONE,
    DELETE_PHONE,
    VERIFY_PHONE,
}
