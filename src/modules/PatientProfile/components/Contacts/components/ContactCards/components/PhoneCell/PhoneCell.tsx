// helpers
import { usePhone } from "react-international-phone";

// models
import { PhoneCellProps } from "./models";

const PhoneCell = ({ number }: PhoneCellProps) => {
    const { phone } = usePhone(number);

    return <span>{phone}</span>;
};

export default PhoneCell;
