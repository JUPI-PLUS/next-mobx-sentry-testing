import React from "react";
import ErrorLayout from "../../../src/components/Layouts/ErrorLayout/ErrorLayout";
import NotFoundModule from "../../../src/modules/Errors/NotFound";

const NotFound = () => {
    return (
        <ErrorLayout title="Not found">
            <NotFoundModule />
        </ErrorLayout>
    );
};

export default NotFound;
