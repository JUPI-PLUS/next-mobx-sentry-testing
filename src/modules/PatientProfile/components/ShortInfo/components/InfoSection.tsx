import { FC } from "react";
import { InfoSectionProps } from "./models";

const InfoSection: FC<InfoSectionProps> = ({ title, text, orientation = "horizontal" }) => {
    const orientationClassName = orientation === "horizontal" ? "justify-between" : "flex-col gap-2";

    return (
        <div className={`flex gap-2 border-b border-dark-400 py-2 ${orientationClassName}`}>
            <div className="text-dark-800">{title}</div>
            <div className="break-word">{text}</div>
        </div>
    );
};
export default InfoSection;
