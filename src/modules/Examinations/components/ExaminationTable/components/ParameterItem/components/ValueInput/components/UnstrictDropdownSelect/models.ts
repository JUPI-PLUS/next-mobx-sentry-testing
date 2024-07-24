// models
import { CreatableSelectProps } from "../../../../../../../../../../components/uiKit/forms/selects/CreatableSelect/models";

export type UnstrictDropdownSelectProps<Option> = Omit<CreatableSelectProps<Option>, "label" | "defaultValue">;
