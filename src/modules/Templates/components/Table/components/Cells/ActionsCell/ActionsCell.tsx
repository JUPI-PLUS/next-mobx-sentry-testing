// libs
import { FC } from "react";
import { observer } from "mobx-react";

// models
import { DialogTypeEnum, TemplateActionsProps } from "../../../../../models";
import { TemplateTypeEnum } from "../../../../../../../shared/models/business/template";

// stores
import { useTemplatesStore } from "../../../../../store";

// constants
import { MAX_GROUP_NEST_LVL } from "../../../../../../../shared/constants/templates";

// components
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import DropdownContainer from "../../../../../../../components/uiKit/Dropdown/DropdownContainer";
import CircleDownloadIcon from "../../../../../../../components/uiKit/Icons/CircleDownloadIcon";
import { useDropdownItems } from "./useDropdownItems";

const ActionsCell: FC<TemplateActionsProps> = ({ template, isInsertDisable }) => {
    const { uuid, item_type: type } = template;

    const {
        templatesStore: { nestedLvl, cutItemDetails, setDialogType, setTemplateDetails },
    } = useTemplatesStore();

    const dropdownItems = useDropdownItems(template);

    const onInsertHandler = async () => {
        setTemplateDetails(template);
        setDialogType(DialogTypeEnum.MOVE);
    };

    if (cutItemDetails) {
        if (isInsertDisable) return null;

        const isGroupType = type === TemplateTypeEnum.GROUP;

        if (!isGroupType) return null;

        const isCutItemGroupType = cutItemDetails.item_type === TemplateTypeEnum.GROUP;
        const isSameFolder = cutItemDetails.uuid === uuid;
        const isCutItemSameParentGroupFolder = cutItemDetails.parent_uuid === uuid;
        const childNestedLvl = nestedLvl + 1;

        if (isCutItemGroupType && childNestedLvl >= MAX_GROUP_NEST_LVL) return null;

        if (isSameFolder || isCutItemSameParentGroupFolder) return null;

        return (
            <CircleDownloadIcon
                className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                onClick={onInsertHandler}
                data-testid={`${uuid}-insert-icon`}
            />
        );
    }

    return (
        <DropdownContainer
            items={dropdownItems}
            direction="left"
            className="w-36"
            placement="bottom-end"
            offsetSkidding={-20}
        >
            <EllipsisHorizontalIcon className="w-6 h-6 fill-dark-700" data-testid={`${uuid}-actions`} />
        </DropdownContainer>
    );
};

export default observer(ActionsCell);
