// libs
import React, { FC, useMemo } from "react";
import { observer } from "mobx-react";

// stores
import { useParametersStore } from "../../../../store";

//  helpers
import { getLookupItem } from "../../../../../../shared/utils/lookups";

// models
import { MeasurementUnitCellProps } from "./models";

// components
import TextCell from "../../../../../../components/Table/components/TextCell/TextCell";

const MeasurementUnitCell: FC<MeasurementUnitCellProps> = ({ row: { si_measurement_units_id: measureUnitId } }) => {
    const {
        parametersStore: { measurementUnitsLookup },
    } = useParametersStore();

    const measureUnitLabel = useMemo(
        () => getLookupItem(measurementUnitsLookup, measureUnitId)?.label || "",
        [measurementUnitsLookup, measureUnitId]
    );

    return <TextCell text={measureUnitLabel} />;
};

export default observer(MeasurementUnitCell);
