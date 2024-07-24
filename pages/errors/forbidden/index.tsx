import React from "react";
import ForbiddenModule from "../../../src/modules/Errors/Forbidden";
import ErrorLayout from "../../../src/components/Layouts/ErrorLayout/ErrorLayout";

const Forbidden = () => {
    return (
        <ErrorLayout title="Forbidden">
            <ForbiddenModule />
        </ErrorLayout>
    );
};

export default Forbidden;
