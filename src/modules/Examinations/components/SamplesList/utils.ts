import { ROUTES } from "../../../../shared/constants/routes";
import { stringify } from "query-string";
import { ID } from "../../../../shared/models/common";
import { openInNewTab } from "../../../../shared/utils/events";

export const openPrintTodoListToPrint = (sampleIds: ID[], workplaceName: string, exams: ID[]) => {
    const url = ROUTES.printSamplesTodoList.route;
    const query = stringify(
        { ids: sampleIds, workplaceName, exams },
        {
            arrayFormat: "comma",
        }
    );

    openInNewTab(`${url}?${query}`);
};
