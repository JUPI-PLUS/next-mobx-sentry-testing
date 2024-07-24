// libs
import { FC, useMemo } from "react";
import { observer } from "mobx-react";

// store
import { useExamTemplateStore } from "../../../../../../store";

// models
import { ExamTemplateParamDetailsProps } from "./models";
import { getLookupItem } from "../../../../../../../../shared/utils/lookups";

const ExamTemplateParamDetails: FC<ExamTemplateParamDetailsProps> = ({ details }) => {
    const {
        examTemplateStore: { examTemplateDictionaries },
    } = useExamTemplateStore();

    const measureUnit = useMemo(
        () =>
            getLookupItem(examTemplateDictionaries.measurementUnitsLookup, details.si_measurement_units_id)?.label ||
            "",
        [details, examTemplateDictionaries]
    );

    return (
        <div className="flex flex-col gap-1 pt-7 pb-1">
            <div className="flex">
                <p className="w-48 shrink-0 text-sm leading-5 text-dark-800">Parameter code</p>
                <p className="flex-1 text-sm leading-5">{details.code}</p>
            </div>
            <div className="flex">
                <p className="w-48 shrink-0 text-sm leading-5 text-dark-800">Parameter name</p>
                <p className="flex-1 text-sm leading-5">{details.name}</p>
            </div>
            <div className="flex">
                <p className="w-48 shrink-0 text-sm leading-5 text-dark-800">Measure unit ID</p>
                <p className="flex-1 text-sm leading-5">{measureUnit}</p>
            </div>
            <div className="flex">
                <p className="w-48 shrink-0 text-sm leading-5 text-dark-800">Notes</p>
                <p className="flex-1 text-sm leading-5" dangerouslySetInnerHTML={{ __html: details.notes || "" }} />
            </div>
            <div className="flex">
                <p className="w-48 shrink-0 text-sm leading-5 text-dark-800">Biological reference intervals</p>
                <p className="flex-1 text-sm leading-5">{details.biological_reference_intervals}</p>
            </div>
        </div>
    );
};

export default observer(ExamTemplateParamDetails);
