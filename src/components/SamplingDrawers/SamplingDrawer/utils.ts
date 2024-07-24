//  libs
import { stringify } from "query-string";

//  helpers
import { showSuccessToast } from "../../uiKit/Toast/helpers";

//  constants
import { ROUTES } from "../../../shared/constants/routes";
import { openInNewTab } from "../../../shared/utils/events";

export const printSample = (sampleUUID: string, userUUID: string) => {
    const url = ROUTES.printBarcode.route;
    const query = stringify({
        sample_uuid: sampleUUID,
        user_uuid: userUUID,
    });

    openInNewTab(`${url}?${query}`);
};

export const onSamplingFinish = async (
    isResampling: boolean,
    isPrintable: boolean,
    sampleUUID: string,
    userUUID: string
) => {
    showSuccessToast({
        title: isResampling ? "Sample has been successfully resampled" : "Sample has been successfully added",
    });
    if (isPrintable) {
        printSample(sampleUUID, userUUID);
    }
};
