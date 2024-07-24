import { CurrentAccess, RequiredAccess } from "../../shared/models/permissions";
import { ReactNode } from "react";

export interface UserAccessProps {
    tolerant?: boolean;
    children: JSX.Element | JSX.Element[] | ReactNode;
    required: RequiredAccess;
    current: CurrentAccess;
}
