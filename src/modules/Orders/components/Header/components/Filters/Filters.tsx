import React from "react";
import { useOrdersStore } from "../../../../store";
import { OnChangeValue } from "react-select/dist/declarations/src/types";
import { Lookup } from "../../../../../../shared/models/form";
import { ID } from "../../../../../../shared/models/common";
import { DateRange } from "react-day-picker";
import { removeOffsetFromDate } from "../../../../../../shared/utils/date";
import { endOfDay, getUnixTime, startOfDay } from "date-fns";
import FormSearchField from "../../../../../../components/uiKit/SearchField/FormSearchField";
import FormSelect from "../../../../../../components/uiKit/forms/selects/Select/FormSelect";
import FormFilterDatePicker from "../../../../../../components/uiKit/DatePickers/FilterDatePicker/FormFilterDatePicker";
import { observer } from "mobx-react";

const Filters = () => {
    const {
        ordersStore: { orderStatusesLookup, setupOrderFilter },
    } = useOrdersStore();

    const onDateOfCreationChange = (value?: DateRange) => {
        if (!value || !value.from) {
            setupOrderFilter("created_at_from", null);
            setupOrderFilter("created_at_to", null);
            return;
        }

        setupOrderFilter("created_at_from", getUnixTime(removeOffsetFromDate(startOfDay(value.from))));
        setupOrderFilter("created_at_to", getUnixTime(removeOffsetFromDate(endOfDay(value.to || value.from))));
    };

    const onOrderStatusChange = (value: OnChangeValue<Lookup<ID>, false>) => {
        setupOrderFilter("status", value?.value ?? null);
    };

    return (
        <div className="flex justify-end items-start">
            <FormSearchField
                name="order_number"
                onChange={value => setupOrderFilter("order_number", value)}
                onReset={() => setupOrderFilter("order_number", "")}
                placeholder="Order or sample number"
                data-testid="order-number-filter-input"
                containerClassName="max-w-xs w-full"
                isFilter
                autoFocus
            />
            <div className="w-px bg-dark-400 mx-4 h-8 self-center" />
            <div className="mr-3">
                <FormFilterDatePicker
                    name="created_at"
                    onChange={onDateOfCreationChange}
                    placeholder="Date of creation"
                    popperPlacement="bottom-end"
                    isFilter
                    disabledDate={{ after: new Date() }}
                />
            </div>
            <FormSelect
                name="status"
                className="w-60"
                disabled={!Boolean(orderStatusesLookup.length)}
                options={orderStatusesLookup}
                placeholder="Order status"
                onChange={onOrderStatusChange}
                clearable
                isFilter
            />
        </div>
    );
};

export default observer(Filters);
