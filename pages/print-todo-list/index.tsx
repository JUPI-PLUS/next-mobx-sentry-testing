import React, { useEffect } from "react";
import PrintableLayout from "../../src/components/Layouts/PrintableLayout/PrintableLayout";
import PrintTodoListModule from "../../src/modules/PrintTodoList/PrintTodoListModule";
import { injectAxiosInterceptors } from "../../src/shared/utils/interceptors";

const PrintTodoList = () => {
    useEffect(() => {
        injectAxiosInterceptors();
    }, []);

    return (
        <PrintableLayout title="Todo list">
            <PrintTodoListModule />
        </PrintableLayout>
    );
};

export default PrintTodoList;
