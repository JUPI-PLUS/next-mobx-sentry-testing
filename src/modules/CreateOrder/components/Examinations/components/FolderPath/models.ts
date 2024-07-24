import { Template } from "../../../../../../shared/models/business/template";

export interface FolderPathProps {
    isFetching: boolean;
    templateParents: Array<Pick<Template, "name" | "uuid">>;
}
