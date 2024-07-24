import { FC, useState } from "react";
import Accordion from "../../../../../../components/uiKit/Accodion/Accordion";
import PermissionCheckbox from "../PermissionCheckbox/PermissionCheckbox";
import PermissionElement from "../PermissionElement";
import { observer } from "mobx-react";
import { usePermissionsStore } from "../../../../store";
import { GroupPermissionsProps } from "./models";

const GroupPermissions: FC<GroupPermissionsProps> = ({ title, permissions, isLoading }) => {
    const {
        permissionsStore: { activeRole },
    } = usePermissionsStore();
    const [isOpen, setIsOpen] = useState(false);

    const onCheckboxChange = (isChecked: boolean) => {
        if (isChecked) {
            setIsOpen(true);
        }
    };

    const onAccordionClose = () => {
        setIsOpen(false);
    };

    return (
        <Accordion
            title={title}
            isOpen={isOpen}
            onClose={onAccordionClose}
            containerClassName="mb-1.5"
            startActions={
                activeRole && (
                    <PermissionCheckbox
                        title={title}
                        permissions={permissions}
                        onChange={onCheckboxChange}
                        isLoading={isLoading}
                    />
                )
            }
        >
            {permissions.map(permission => (
                <div className="first:mt-1.5 last:mb-2 mt-0.5" key={permission.id}>
                    <PermissionElement
                        id={permission.id}
                        label={permission.name}
                        description={permission.description}
                        isLoading={isLoading}
                    />
                </div>
            ))}
        </Accordion>
    );
};

export default observer(GroupPermissions);
