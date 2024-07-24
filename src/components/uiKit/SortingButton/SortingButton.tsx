// libs
import { forwardRef } from "react";

// models
import { SortingButtonProps } from "./models";
import { SortingWay } from "../../../shared/models/common";

// components
import { IconButton } from "../Button/Button";
import SortingIcon from "./components/SortingIcon";

const SortingButton = forwardRef<HTMLButtonElement, SortingButtonProps>(
    ({ sortDirection, onClick, className }, ref) => {
        const onSortingButtonClick = () => {
            switch (sortDirection) {
                case SortingWay.ASC:
                    onClick(SortingWay.DESC);
                    return;
                case SortingWay.DESC:
                    onClick(SortingWay.NONE);
                    return;
                default:
                    onClick(SortingWay.ASC);
                    return;
            }
        };

        return (
            <IconButton
                aria-label="Sorting way"
                className={className}
                variant="transparent"
                size="thin"
                onClick={onSortingButtonClick}
                data-testid="order-way-button"
                ref={ref}
            >
                <SortingIcon sortDirection={sortDirection} />
            </IconButton>
        );
    }
);

export default SortingButton;
