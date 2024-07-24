// libs
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { DateRange } from "react-day-picker";
import { endOfDay, getUnixTime, startOfDay } from "date-fns";
import { useFormContext } from "react-hook-form";

// store
import { useOrdersStore } from "../../store";

// helpers
import { removeOffsetFromDate } from "../../../../shared/utils/date";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";

// models
import { UsersPermission } from "../../../../shared/models/permissions";
import { UserFilters } from "../../models";

// constants
import { CURRENT_YEAR } from "../../../../components/uiKit/DatePickers/constants";

// components
import FormDatePicker from "../../../../components/uiKit/DatePickers/DatePicker/FormDatePicker";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import UserNameFilterInput from "./components/UserNameFilterInput";
import { TextButton } from "../../../../components/uiKit/Button/Button";

const UsersFilterForm = () => {
    const {
        ordersStore: { setupUserFilterValue, usersFiltersQueryString, isUserHiddenFiltersFilled, resetUserFilter },
    } = useOrdersStore();
    const { isOpen, toggle } = useDisclosure(isUserHiddenFiltersFilled);
    const isAllowedToSeeUserList = usePermissionsAccess(UsersPermission.VIEW_LIST);
    const { reset } = useFormContext();

    const onFullFormReset = () => {
        reset();
        resetUserFilter();
    };

    const onBirthdateChange = (value?: DateRange) => {
        if (!value || !value.from) {
            setupUserFilterValue("birth_date_from", null);
            setupUserFilterValue("birth_date_to", null);
            return;
        }

        setupUserFilterValue("birth_date_from", getUnixTime(removeOffsetFromDate(startOfDay(value.from))));
        setupUserFilterValue("birth_date_to", getUnixTime(removeOffsetFromDate(endOfDay(value.to || value.from))));
    };

    const filtersContainerClassname = useMemo(() => (isOpen ? "h-full" : "h-auto"), [isOpen]);
    const hiddenInputsContainerClassname = useMemo(() => (isOpen ? "h-full" : "h-0 overflow-hidden"), [isOpen]);
    const isHiddenInputDisabled = !isOpen || !isAllowedToSeeUserList;

    return (
        <div className="bg-dark-200 rounded-md py-5 px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md font-bold">Find patient</h2>
                {usersFiltersQueryString && (
                    <TextButton
                        text="Reset"
                        onClick={onFullFormReset}
                        variant="transparent"
                        size="thin"
                        className="font-medium px-1"
                        data-testid="reset-filters"
                    />
                )}
            </div>
            <div className={`${filtersContainerClassname} flex flex-col gap-3`}>
                <UserNameFilterInput<UserFilters>
                    fieldName="barcode"
                    placeholder="UUID"
                    onFieldChange={setupUserFilterValue}
                    disabled={!isAllowedToSeeUserList}
                    data-testid="users-filter-uuid"
                />
                <div className={`${hiddenInputsContainerClassname} flex flex-col gap-3`}>
                    <UserNameFilterInput<UserFilters>
                        fieldName="first_name"
                        placeholder="First name"
                        onFieldChange={setupUserFilterValue}
                        disabled={isHiddenInputDisabled}
                        data-testid="users-filter-first-name"
                    />
                    <UserNameFilterInput<UserFilters>
                        fieldName="last_name"
                        placeholder="Last name"
                        onFieldChange={setupUserFilterValue}
                        disabled={isHiddenInputDisabled}
                        data-testid="users-filter-last-name"
                    />
                    <FormDatePicker
                        name="birthday"
                        placeholder="Birthday"
                        onChange={onBirthdateChange}
                        isFilter
                        disabled={isHiddenInputDisabled}
                        disabledDate={{ after: new Date() }}
                        maxYear={CURRENT_YEAR}
                    />
                    <UserNameFilterInput<UserFilters>
                        fieldName="email"
                        placeholder="Email"
                        onFieldChange={setupUserFilterValue}
                        disabled={isHiddenInputDisabled}
                        data-testid="users-filter-email"
                    />
                </div>
            </div>
            <div className={isOpen ? "mt-5" : "mt-2"}>
                <TextButton
                    type="button"
                    text={!isOpen ? "Show more" : ""}
                    onClick={toggle}
                    variant="transparent"
                    size="thin"
                    endIcon={
                        isOpen ? <ChevronUpIcon className="w-4 h-4 -ml-2" /> : <ChevronDownIcon className="w-4 h-4" />
                    }
                    className="m-auto font-medium"
                    data-testid="show-more-link"
                />
            </div>
            <button type="submit" className="hidden" />
        </div>
    );
};

export default observer(UsersFilterForm);
