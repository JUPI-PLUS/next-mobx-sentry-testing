//  libs
import { FC } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

//  helpers
import { getSampleDetails } from "../../../api/samples";
import { toLookupList } from "../../../shared/utils/lookups";
import { getSampleTypes } from "../../../api/dictionaries";

//  models
import { CommonServerResponse } from "../../../shared/models/axios";
import { SampleDetails } from "../../../shared/models/business/sample";
import { SampleDetailsDrawerProps } from "./models";

//  constants
import { DICTIONARIES_QUERY_KEYS, SAMPLES_QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { ROUTES } from "../../../shared/constants/routes";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../shared/constants/queries";

//  components
import { TextButton } from "../../uiKit/Button/Button";
import Drawer from "../../uiKit/Drawer/Drawer";
import SampleDetailsDrawerContent from "./components/SampleDetailsDrawerContent";
import LinkComponent from "../../uiKit/LinkComponent/LinkComponent";

const SampleDetailsDrawer: FC<SampleDetailsDrawerProps> = ({ onClose, isOpen, sampleUUID = "" }) => {
    const { data: dataSample, isFetching } = useQuery<
        AxiosResponse<CommonServerResponse<SampleDetails>>,
        AxiosError,
        SampleDetails
    >(SAMPLES_QUERY_KEYS.DETAILS(sampleUUID), getSampleDetails(sampleUUID), {
        enabled: Boolean(sampleUUID) && isOpen,
        select: queryData => queryData.data.data,
    });

    const { data: sampleTypesLookup = [], isFetching: isSampleTypesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
        getSampleTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    if (!isOpen || isFetching || isSampleTypesFetching) return null;

    return (
        <Drawer
            isOpen
            onClose={onClose}
            onCancel={onClose}
            title="Sample details"
            couldCloseOnBackdrop
            couldCloseOnEsc
            side="right"
            size="md"
            headerButton={
                <LinkComponent
                    href={{
                        pathname: ROUTES.printBarcode.route,
                        query: { user_uuid: dataSample!.user_uuid, sample_uuid: sampleUUID },
                    }}
                    aTagProps={{ target: "_blank", rel: "noopener noreferrer" }}
                >
                    <TextButton
                        text="Print"
                        variant="neutral"
                        className="text-sm hover:bg-dark-500 !p-1"
                        data-testid="print-button"
                    />
                </LinkComponent>
            }
        >
            <SampleDetailsDrawerContent data={dataSample!} examSampleTypes={sampleTypesLookup} />
        </Drawer>
    );
};

export default SampleDetailsDrawer;
