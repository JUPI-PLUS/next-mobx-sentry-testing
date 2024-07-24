import { TemplateTypeEnum } from "../../shared/models/business/template";
import { FolderTemplateIcon } from "../../components/uiKit/Icons";
import ExamTemplateIcon from "../../components/uiKit/Icons/ExamTemplateIcon";
import KitTemplateIcon from "../../components/uiKit/Icons/KitTemplateIcon";

export const getIcon = (type: TemplateTypeEnum) => {
    switch (type) {
        case TemplateTypeEnum.GROUP:
            return <FolderTemplateIcon className="mr-5 flex-auto flex-shrink-0" />;

        case TemplateTypeEnum.KIT:
            return <KitTemplateIcon className="mr-5 flex-auto flex-shrink-0" />;

        case TemplateTypeEnum.EXAM:
            return <ExamTemplateIcon className="mr-5 flex-auto flex-shrink-0" />;
    }
    return;
};
