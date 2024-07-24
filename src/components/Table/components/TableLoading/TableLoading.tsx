import React from "react";
import { CircularProgressLoader } from "../../../uiKit/CircularProgressLoader/CircularProgressLoader";

const TableLoading = () => {
    return (
        <tr className="flex items-center h-full justify-center">
            <td className="flex justify-center w-full text-xl font-bold mt-3 h-full">
                <div>
                    <CircularProgressLoader />
                </div>
            </td>
        </tr>
    );
};

export default React.memo(TableLoading);
