import { FC } from "react";
import { observer } from "mobx-react";
import Drawer from "../../../../../../components/uiKit/Drawer/Drawer";
import { useOrderStore } from "../../../../store";
import TemplatesAccordions from "../../../../../../components/TemplatesAccordions/TemplatesAccordions";
import { ExamTemplateItem, TemplateItem } from "../../../../../CreateOrder/models";
import { SelectedTemplatesDrawerProps } from "./models";
import { getLookupItem } from "../../../../../../shared/utils/lookups";

const SelectedTemplatesDrawer: FC<SelectedTemplatesDrawerProps> = ({ onClose, isOpen }) => {
    const {
        orderStore: { groupedSelectedTemplates, examSampleTypes },
    } = useOrderStore();

    if (!groupedSelectedTemplates) return null;

    const kitTemplates = Object.keys(groupedSelectedTemplates).reduce<Array<TemplateItem> | []>((acc, key) => {
        if (key !== "null") {
            return [...acc, { uuid: key, name: key }];
        }
        return acc;
    }, []);

    const getExamTemplatesByKitUUID = (uuid: string): Array<ExamTemplateItem> | undefined => {
        const [, foundExamTemplatesValues] =
            Object.entries(groupedSelectedTemplates).find(([key]) => key === uuid) ?? [];

        return foundExamTemplatesValues?.map(template => ({
            uuid: template.exam_uuid,
            name: template.exam_name,
            urgencyStatus: template.urgency_id,
            sample_types_id: template.sample_type,
            sample_types_name: getLookupItem(examSampleTypes, template.sample_type!)?.label ?? "",
        }));
    };

    const otherExamTemplates = getExamTemplatesByKitUUID("null");

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            onCancel={onClose}
            title="Order templates"
            couldCloseOnBackdrop
            couldCloseOnEsc
            side="right"
            size="md"
        >
            <TemplatesAccordions
                title="Examinations list"
                kitTemplates={kitTemplates}
                examTemplates={otherExamTemplates}
                getExamTemplatesByKitUUID={getExamTemplatesByKitUUID}
                isReadOnly
            />
        </Drawer>
    );
};

export default observer(SelectedTemplatesDrawer);
