import React from "react";

const ChevronDownIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M16 10L12 14L8 10" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default React.memo(ChevronDownIcon);
