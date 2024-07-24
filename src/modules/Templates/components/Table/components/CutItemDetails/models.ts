import { Template } from "../../../../../../shared/models/business/template";

export interface CutItemDetailsProps {
    templateParents: Array<Pick<Template, "name" | "uuid">>;
    isFetching: boolean;
}
