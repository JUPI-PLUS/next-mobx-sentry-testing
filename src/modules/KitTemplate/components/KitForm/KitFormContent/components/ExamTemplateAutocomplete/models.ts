// models
import { AutocompleteProps } from "../../../../../../../components/uiKit/forms/selects/Autocomplete/models";
import { ExamTemplateOption } from "../../models";

export type ExamTemplateAutocompleteProps = Pick<
    AutocompleteProps<ExamTemplateOption>,
    "loadOptions" | "onChange" | "errorMessage"
> & {
    onHide: () => void;
    shouldScrollToBottom: boolean;
};
