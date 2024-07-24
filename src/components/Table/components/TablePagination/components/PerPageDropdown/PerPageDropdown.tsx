import React, { FC } from "react";
import { PaginationPerPageDropdownProps } from "../../models";
import Select from "../../../../../uiKit/forms/selects/Select/Select";
import { PER_PAGE_VALUES } from "../../../../constants";

const PaginationPerPageDropdown: FC<PaginationPerPageDropdownProps> = ({ perPage }) => {
    return (
        <div className="flex items-center mr-8" data-testid="table-per-page-select-container">
            <label htmlFor="per-page-selector" className="mr-2">
                {perPage}:
            </label>
            <Select
                menuPlacement="top"
                options={PER_PAGE_VALUES}
                onChange={() => {}}
                value={PER_PAGE_VALUES.find(p => p.value === perPage)}
            />
        </div>
    );
};

export default React.memo(PaginationPerPageDropdown);
