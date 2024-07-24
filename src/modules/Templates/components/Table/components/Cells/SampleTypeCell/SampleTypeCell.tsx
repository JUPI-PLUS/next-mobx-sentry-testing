// libs
import { FC, memo } from "react";

// helpers
import { getLookupItem } from "../../../../../../../shared/utils/lookups";

// models
import { Lookup } from "../../../../../../../shared/models/form";
import { ID } from "../../../../../../../shared/models/common";
import TextCell from "../../../../../../../components/Table/components/TextCell/TextCell";

const SampleTypeCell: FC<{ sampleTypeId: number; sampleTypesLookup: Array<Lookup<ID>> }> = ({
    sampleTypeId,
    sampleTypesLookup,
}) => {
    const sampleType = getLookupItem(sampleTypesLookup, sampleTypeId)?.label ?? "";

    return <TextCell text={sampleType} />;
};

export default memo(SampleTypeCell);
