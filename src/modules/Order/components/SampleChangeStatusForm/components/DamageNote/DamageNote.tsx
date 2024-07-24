import { FC } from "react";

const DamageNote: FC<{ note: null | string }> = ({ note }) => {
    if (!note) return null;

    return (
        <div>
            <div className="font-bold mb-1.5">Notes:</div>
            <div>{note}</div>
        </div>
    );
};

export default DamageNote;
