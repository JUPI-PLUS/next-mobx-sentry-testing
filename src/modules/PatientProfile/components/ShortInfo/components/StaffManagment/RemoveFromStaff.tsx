import React, { FC } from "react";
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";
import Dialog from "../../../../../../components/uiKit/Dialog/Dialog";
import { usePatientStore } from "../../../../store";
import { observer } from "mobx-react";
import { RemoveFromStaffDialogProps } from "./models";

const RemoveFromStaff: FC<RemoveFromStaffDialogProps> = ({ onSubmit, isLoading }) => {
    const {
        patientStore: { name },
    } = usePatientStore();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            <p className="underline text-center cursor-pointer" onClick={onOpen} title="Remove from staff">
                Remove from staff
            </p>
            <Dialog
                onClose={onClose}
                isOpen={isOpen}
                onSubmit={onSubmit}
                title="Remove from staff"
                submitText="Remove"
                cancelText="Cancel"
                isSubmitButtonDisabled={isLoading}
                isCancelButtonDisabled={isLoading}
            >
                <p>
                    Are you sure you want to remove <strong>{name}</strong> from staff?
                </p>
            </Dialog>
        </div>
    );
};

export default observer(RemoveFromStaff);
