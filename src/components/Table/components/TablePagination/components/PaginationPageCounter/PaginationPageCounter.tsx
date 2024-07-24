import React, { FC } from "react";
import { PaginationPageCounterProps } from "../../models";
import { paginate } from "../../../../utils";

const PaginationPageCounter: FC<PaginationPageCounterProps> = ({ total, page, perPage }) => {
    const { startIndex, endIndex } = paginate(total, page, perPage);
    return (
        <div className="flex">
            <p className="mr-1">
                {startIndex >= 0 ? startIndex + 1 : 0}-{endIndex + 1}
            </p>
            <p>of {total}</p>
        </div>
    );
};

export default React.memo(PaginationPageCounter);
