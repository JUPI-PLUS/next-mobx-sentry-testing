// libs
import React from "react";

// components
import PrintableLayout from "../../src/components/Layouts/PrintableLayout/PrintableLayout";
import PrintBarcodeModule from "../../src/modules/PrintBarcode/PrintBarcodeModule";

const PrintBarcode = () => {
    return (
        <PrintableLayout title="Barcode">
            <PrintBarcodeModule />
        </PrintableLayout>
    );
};

export default PrintBarcode;
