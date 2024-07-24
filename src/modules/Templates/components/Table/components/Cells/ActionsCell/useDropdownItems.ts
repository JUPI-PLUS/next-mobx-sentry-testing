// libs
import { useRouter } from "next/router";
import { useMemo } from "react";

// components
import { DropdownItem } from "../../../../../../../components/uiKit/Dropdown/models";

// stores
import { useTemplatesStore } from "../../../../../store";

// constants
import { ROUTES } from "../../../../../../../shared/constants/routes";
import { MAX_GROUP_NEST_LVL } from "../../../../../../../shared/constants/templates";

// models
import { DialogTypeEnum } from "../../../../../models";
import { TemplateTypeEnum, Template } from "../../../../../../../shared/models/business/template";

export const useDropdownItems = (template: Template, onClose?: () => void) => {
    const { uuid, has_child: hasChild, item_type: type, parent_uuid: parentUuid } = template;

    const {
        templatesStore: {
            nestedLvl,
            templatesFiltersQueryString,
            addResetCount,
            cleanupTemplatesFilters,
            setupIsMoveToFolder,
            setupCopiedTemplate,
            setUpdatingPositionTemplate,
            setDialogType,
            setTemplateDetails,
            setupParentGroupUUID,
        },
    } = useTemplatesStore();

    const {
        push,
        query: { folder },
    } = useRouter();

    const onEditHandler = () => {
        switch (type) {
            case TemplateTypeEnum.GROUP:
                setTemplateDetails(template!);
                setDialogType(DialogTypeEnum.GROUP_NAME);
                break;
            case TemplateTypeEnum.KIT:
                push({
                    pathname: ROUTES.editKitTemplate.route,
                    query: { uuid },
                });
                break;
            case TemplateTypeEnum.EXAM:
                push({
                    pathname: ROUTES.examTemplate.edit.route,
                    query: { uuid },
                });
                break;
        }
        onClose?.();
    };

    const onDeleteHandler = () => {
        setTemplateDetails(template!);
        setDialogType(DialogTypeEnum.DELETE);
        onClose?.();
    };

    const onAddGroupHandler = () => {
        setTemplateDetails(template!);
        setDialogType(DialogTypeEnum.ADD);
        onClose?.();
    };

    const onAddExamHandler = () => {
        push(ROUTES.examTemplate.create.route);
        setupParentGroupUUID(uuid!);
        onClose?.();
    };

    const onAddKitHandler = () => {
        push(ROUTES.createKitTemplate.route);
        setupParentGroupUUID(uuid!);
        onClose?.();
    };

    const onMoveHandler = () => {
        setUpdatingPositionTemplate(template!);
        onClose?.();
    };

    const onCopyHandler = () => {
        setupCopiedTemplate(type!, uuid as string);
        switch (type) {
            case TemplateTypeEnum.KIT:
                push(ROUTES.createKitTemplate.route);
                break;
            case TemplateTypeEnum.EXAM:
                push(ROUTES.examTemplate.create.route);
                break;
        }
        onClose?.();
    };

    const cleanupQueryParameter = () => {
        push({});
    };

    const setupQueryParameter = () => {
        push({ query: { folder: parentUuid } });
    };

    const onOpenInFolderHandler = () => {
        addResetCount();
        onClose?.();
        if (parentUuid === folder || (!parentUuid && !folder)) {
            cleanupTemplatesFilters();
            return;
        }
        setupIsMoveToFolder(true);
        if (!parentUuid && folder) {
            cleanupQueryParameter();
        } else {
            setupQueryParameter();
        }
    };

    const dropdownItems = useMemo(() => {
        const items: Array<DropdownItem> = [{ title: "Move to", onClick: onMoveHandler }];
        const childNestedLvl = nestedLvl + 1;
        if (type === TemplateTypeEnum.GROUP) {
            const childItems: Array<DropdownItem> = [
                { title: "Add kit", onClick: onAddKitHandler },
                { title: "Add exam", onClick: onAddExamHandler },
            ];
            if (childNestedLvl < MAX_GROUP_NEST_LVL) {
                childItems.unshift({ title: "Add group", onClick: onAddGroupHandler });
            }
            items.push({
                title: "Add",
                child: childItems,
            });
        }
        if (type !== TemplateTypeEnum.GROUP) {
            items.push({
                title: "Copy",
                onClick: onCopyHandler,
            });
        }
        items.push({
            title: "Edit",
            onClick: onEditHandler,
        });
        if (!hasChild) {
            items.push({
                title: "Delete",
                onClick: onDeleteHandler,
            });
        }
        if (templatesFiltersQueryString) {
            items.push({
                title: "Open in folder",
                onClick: onOpenInFolderHandler,
            });
        }
        return items;
    }, [nestedLvl, type, hasChild, templatesFiltersQueryString]);

    return dropdownItems;
};
