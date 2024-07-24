// libs
import { FC } from "react";

// models
import { DialogTypeEnum, TemplatesTreeNodeActionsProps, TemplatesTypesEnum } from "../../../../../models";

// helpers
import { useDisclosure } from "../../../../../../../shared/hooks/useDisclosure";

// components
import PencilIcon from "../../../../../../uiKit/Icons/PencilIcon";
import ShearsIcon from "../../../../../../uiKit/Icons/ShearsIcon";
import DeleteIcon from "../../../../../../uiKit/Icons/DeleteIcon";
import CopyIcon from "../../../../../../uiKit/Icons/CopyIcon";
import TemplatesFolderActions from "./TemplatesFolderActions";
import { useTemplatesTreeViewStore } from "../../../../../TemplatesTreeViewStore";
import { observer } from "mobx-react";
import CircleDownloadIcon from "../../../../../../uiKit/Icons/CircleDownloadIcon";
import { MAX_GROUP_NEST_LVL } from "../../../../../../../shared/constants/templates";
import { useTemplatesStore } from "../../../../../../../modules/Templates/store";
import { useRouter } from "next/router";
import { ROUTES } from "../../../../../../../shared/constants/routes";

const TemplatesActions: FC<TemplatesTreeNodeActionsProps> = ({
    type,
    deleteAllowed,
    nestedLvl,
    name,
    fullPath,
    uuid,
}) => {
    const {
        updatingNodePositionPath,
        updatingNodePositionType,
        templatesFiltersQueryString,
        updatingNodePositionParentPath,
        setNodeDetails,
        setDialogType,
        copyPositionNodePath,
    } = useTemplatesTreeViewStore();

    const {
        templatesStore: { setupCopiedTemplate, setupParentGroupUUID },
    } = useTemplatesStore();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { push } = useRouter();

    const isUpdatePathAvailable = !Boolean(templatesFiltersQueryString);
    const isUpdatingPath = Boolean(updatingNodePositionPath);

    const onClickEditIcon = () => {
        switch (type) {
            case TemplatesTypesEnum.GROUP:
                setNodeDetails({ uuid, path: fullPath, name });
                setDialogType(DialogTypeEnum.GROUP_NAME);
                return;
            case TemplatesTypesEnum.KIT:
                push({
                    pathname: ROUTES.editKitTemplate.route,
                    query: { uuid },
                });
                return;
            case TemplatesTypesEnum.EXAM:
                push({
                    pathname: ROUTES.examTemplate.edit.route,
                    query: { uuid },
                });
                return;
        }
    };

    const onClickDeleteIcon = () => {
        setNodeDetails({ uuid, path: fullPath, name, type });
        setDialogType(DialogTypeEnum.DELETE);
    };

    const onClickAddGroup = () => {
        onClose();
        setNodeDetails({ uuid, path: fullPath, name, type });
        setDialogType(DialogTypeEnum.ADD);
    };

    const onClickAddExam = () => {
        setupParentGroupUUID(uuid);
        onClose();
        push(ROUTES.examTemplate.create.route);
    };

    const onClickAddKit = () => {
        setupParentGroupUUID(uuid);
        onClose();
        push(ROUTES.createKitTemplate.route);
    };

    const onClickUpdateNodePathIcon = () => {
        copyPositionNodePath(fullPath);
    };

    const onClickInsertNodeIcon = async () => {
        setNodeDetails({ uuid, path: fullPath, name, type });
        setDialogType(DialogTypeEnum.MOVE);
    };

    const onClickCopyIcon = () => {
        // const groupUUID = getLastUuidFromPath(parentPath);
        setupCopiedTemplate(type, uuid as string);

        switch (type) {
            case TemplatesTypesEnum.KIT:
                push(ROUTES.createKitTemplate.route);
                return;
            case TemplatesTypesEnum.EXAM:
                push(ROUTES.examTemplate.create.route);
                return;
        }
    };

    if (isUpdatingPath) {
        const isGroupType = type === TemplatesTypesEnum.GROUP;
        const isUpdatingNodePathGroupType = updatingNodePositionType === TemplatesTypesEnum.GROUP;
        const isUnavailablePath =
            fullPath.includes(updatingNodePositionPath!) || updatingNodePositionParentPath === fullPath;

        if (
            !isGroupType ||
            isUnavailablePath ||
            (isGroupType && isUpdatingNodePathGroupType && nestedLvl >= MAX_GROUP_NEST_LVL)
        )
            return null;

        return (
            <CircleDownloadIcon
                className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                onClick={onClickInsertNodeIcon}
                data-testid="template-insert-icon"
            />
        );
    }

    return (
        <div className="flex items-center">
            <div className={`flex gap-3 ${isOpen ? "" : "invisible group-hover:visible"}`}>
                {type === TemplatesTypesEnum.GROUP && (
                    <TemplatesFolderActions
                        isOpen={isOpen}
                        nestedLvl={nestedLvl}
                        onOpen={onOpen}
                        onClose={onClose}
                        onClickAddGroup={onClickAddGroup}
                        onClickAddExam={onClickAddExam}
                        onClickAddKit={onClickAddKit}
                    />
                )}
                {type !== TemplatesTypesEnum.GROUP && (
                    <CopyIcon
                        className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                        onClick={onClickCopyIcon}
                        data-testid="template-copy-icon"
                    />
                )}
                {isUpdatePathAvailable && (
                    <ShearsIcon
                        className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                        onClick={onClickUpdateNodePathIcon}
                        data-testid={`template-move-icon-${type}`}
                    />
                )}
                <PencilIcon
                    className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                    onClick={onClickEditIcon}
                    data-testid="template-edit-icon"
                />
                {deleteAllowed && (
                    <DeleteIcon
                        className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                        onClick={onClickDeleteIcon}
                        data-testid="template-delete-icon"
                    />
                )}
            </div>
        </div>
    );
};

export default observer(TemplatesActions);
