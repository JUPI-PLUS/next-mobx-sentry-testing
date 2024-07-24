import React from "react";
import ControlSkeleton from "../../../../../../../components/uiKit/Skeletons/ControlSkeleton/ControlSkeleton";

const FormEditMeasureUnitInputsSkeleton = () => {
    return (
        <div className="mb-8">
            <ControlSkeleton withLabel />
        </div>
    );
};

export default React.memo(FormEditMeasureUnitInputsSkeleton);
