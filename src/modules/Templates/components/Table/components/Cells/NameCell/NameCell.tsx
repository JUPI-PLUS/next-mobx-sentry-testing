// libs
import { FC, useCallback } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { stringify } from "query-string";

// models
import { TemplateNameCellProps } from "../../../../../models";
import { TemplateTypeEnum } from "../../../../../../../shared/models/business/template";

// stores
import { useTemplatesStore } from "../../../../../store";

// constants
import { ROUTES } from "../../../../../../../shared/constants/routes";

// components
import IconSwitcher from "./components/IconSwitcher/IconCell";

const NameCell: FC<TemplateNameCellProps> = ({ type, uuid, name }) => {
    const {
        query: { folder },
        push,
    } = useRouter();

    const {
        templatesStore: {
            templatesFiltersQueryString,
            addResetCount,
            cleanupTemplatesFilters,
            setupIsMoveToFolder,
            setupCurrentFolderUUID,
        },
    } = useTemplatesStore();

    const onDoubleClick = useCallback(() => {
        switch (type) {
            case TemplateTypeEnum.GROUP:
                if (uuid === folder) {
                    cleanupTemplatesFilters();
                    addResetCount();
                    return;
                }
                if (templatesFiltersQueryString.length) {
                    setupIsMoveToFolder(true);
                }
                setupCurrentFolderUUID(uuid);
                push({
                    query: stringify({ folder: uuid }, { skipEmptyString: true, skipNull: true }),
                });
                return;
            case TemplateTypeEnum.KIT:
                push({
                    pathname: ROUTES.editKitTemplate.route,
                    query: { uuid },
                });
                return;
            case TemplateTypeEnum.EXAM:
                push({
                    pathname: ROUTES.examTemplate.edit.route,
                    query: { uuid },
                });
                return;
            default:
                return;
        }
    }, [folder, templatesFiltersQueryString.length, type, uuid]);

    return (
        <div className="flex w-full items-center gap-4 cursor-pointer" onDoubleClick={onDoubleClick}>
            <IconSwitcher type={type} />
            <span className="text-md break-word pr-4">{name}</span>
        </div>
    );
};

export default observer(NameCell);
