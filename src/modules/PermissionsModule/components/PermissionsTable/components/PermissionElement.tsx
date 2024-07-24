import { ChangeEvent, FC, useRef } from "react";
import { IconButton } from "../../../../../components/uiKit/Button/Button";
import RoleIcon from "../../../../../components/uiKit/Icons/RoleIcon";
import Popper from "../../../../../components/uiKit/Popper/Popper";
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";
import { PermissionElementProps } from "./models";
import { usePermissionsStore } from "../../../store";
import { observer } from "mobx-react";
import FormCheckbox from "../../../../../components/uiKit/forms/Checkbox/FormCheckbox";
import RolesByPermissionList from "./RolesByPermissionList";

const PermissionElement: FC<PermissionElementProps> = ({ id, label = "", description = "", isLoading }) => {
    const {
        permissionsStore: { setupPermissionValue, activeRole },
    } = usePermissionsStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buttonRef = useRef(null);

    const onRoleIconClick = () => {
        onOpen();
    };

    const onPermissionChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
        setupPermissionValue(id, checked);
    };

    return (
        <div
            className={`flex pl-4 pr-2 py-2 ml-9 border rounded-md transition-colors hover:border-dark-900 cursor-pointer ${
                isOpen ? "border-dark-900" : "border-dark-400"
            }`}
        >
            <div className="w-full flex items-start justify-between">
                <div className="flex items-center w-full max-w-xs">
                    {activeRole && (
                        <FormCheckbox
                            disabled={isLoading}
                            className="mr-3"
                            name={String(id)}
                            onChange={onPermissionChange}
                        />
                    )}
                    <span>{label}</span>
                </div>
                <span className="flex-1 text-md">{description}</span>
                <IconButton
                    aria-label={`Open ${label.replaceAll("_", " ")} role permission popper`}
                    type="button"
                    size="thin"
                    variant="transparent"
                    className="w-6 h-6 fill-dark-700 hover:fill-dark-900 transition-colors"
                    onClick={onRoleIconClick}
                    ref={buttonRef}
                    data-testid={`roles-with-${id}-permission-button`}
                >
                    <RoleIcon />
                </IconButton>
            </div>
            <Popper
                placement="right-start"
                offsetDistance={-33}
                offsetSkidding={-10}
                isOpen={isOpen}
                onClose={onClose}
                sourceRef={buttonRef}
                data-testid="roles-by-permission-popper"
            >
                <RolesByPermissionList id={id} />
            </Popper>
        </div>
    );
};

export default observer(PermissionElement);
