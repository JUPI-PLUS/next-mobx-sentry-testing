// libs
import React from "react";

// components
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import TemplatesModule from "../../src/modules/Templates/TemplatesModule";

const Templates = () => {
    return (
        <PrivateLayout title="Templates" thin>
            <TemplatesModule />
        </PrivateLayout>
    );
};

export default Templates;
