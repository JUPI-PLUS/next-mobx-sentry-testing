import React, { FC } from "react";
import OrganizationDrawer from "../../../OrganizationDrawer/OrganizationDrawer";
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";
import { MakeStaffDrawerContainerProps } from "./models";

const MakeStaff: FC<MakeStaffDrawerContainerProps> = ({ onSubmit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            <p className="underline text-center cursor-pointer" onClick={onOpen}>
                Make a staff
            </p>
            <OrganizationDrawer
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                defaultValues={{ organization: null, position: null }}
            />
        </div>
    );
};

export default MakeStaff;
