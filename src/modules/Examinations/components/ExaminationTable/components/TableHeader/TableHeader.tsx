// libs
import React from "react";

// components
import ParameterPicker from "./components/ParameterPicker/ParameterPicker";
import StatusPicker from "./components/StatusPicker/StatusPicker";

const TableHeader = () => {
    return (
        <div className="grid grid-cols-12 px-3 pb-3 border-b border-inset border-dark-400 text-dark-600 uppercase text-xs font-semibold bg-light-200 sticky top-0 z-10">
            <ParameterPicker />
            <p className="col-span-4">Value</p>
            <p className="col-span-3">Intervals</p>
            <StatusPicker />
        </div>
    );
};

export default TableHeader;
