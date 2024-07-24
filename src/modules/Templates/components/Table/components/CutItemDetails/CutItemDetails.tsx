// libs
import { observer } from "mobx-react";
import { FC, useMemo } from "react";

// constants
import { MAX_GROUP_NEST_LVL } from "../../../../../../shared/constants/templates";

// models
import { DialogTypeEnum } from "../../../../models";
import { CutItemDetailsProps } from "./models";
import { TemplateTypeEnum } from "../../../../../../shared/models/business/template";

// stores
import { useTemplatesStore } from "../../../../store";

// components
import { OutlineButton, SolidButton } from "../../../../../../components/uiKit/Button/Button";
import NameCell from "../Cells/NameCell/NameCell";

const CutItemDetails: FC<CutItemDetailsProps> = ({ templateParents, isFetching }) => {
    const {
        templatesStore: {
            cutItemDetails,
            parentGroupUUID,
            nestedLvl,
            setTemplateDetails,
            setDialogType,
            cleanupUpdatingPositionTemplate,
        },
    } = useTemplatesStore();

    const isCutItemInParent = useMemo(
        () => templateParents.some(({ uuid }) => uuid === cutItemDetails?.uuid),
        [cutItemDetails?.uuid, templateParents]
    );

    const isInsertInCurrentFolderDisable = useMemo(() => {
        if (isFetching || !cutItemDetails) return true;

        const isCutItemSameParentGroupFolder = cutItemDetails.parent_uuid === parentGroupUUID;
        const isCutItemGroupType = cutItemDetails.item_type === TemplateTypeEnum.GROUP;
        const isNestedLvlIncorrect = isCutItemGroupType && nestedLvl >= MAX_GROUP_NEST_LVL;

        return isCutItemInParent || isNestedLvlIncorrect || isCutItemSameParentGroupFolder;
    }, [cutItemDetails, isCutItemInParent, isFetching, nestedLvl, parentGroupUUID]);

    if (!cutItemDetails) return null;

    const onInsertInCurrentFolderHandler = async () => {
        setTemplateDetails({ uuid: parentGroupUUID || undefined });
        setDialogType(DialogTypeEnum.MOVE);
    };

    return (
        <div className="bg-white rounded-b-lg text-end border-t border-dark-400 flex pt-6 px-2">
            <NameCell type={cutItemDetails.item_type} name={cutItemDetails.name} uuid={cutItemDetails.uuid} />
            <div className="flex gap-2 flex-shrink-0">
                <SolidButton
                    data-testid="paste-here-btn"
                    text="Paste here"
                    onClick={onInsertInCurrentFolderHandler}
                    disabled={isInsertInCurrentFolderDisable}
                />
                <OutlineButton text="Cancel" onClick={cleanupUpdatingPositionTemplate} />
            </div>
        </div>
    );
};
export default observer(CutItemDetails);
