import React from "react";

const Dot = ({ className = "" }: { className?: string }) => (
    <span className={`w-[4px] h-[4px] shrink-0 rounded-full bg-dark-700 ${className}`} />
);

export default React.memo(Dot);
