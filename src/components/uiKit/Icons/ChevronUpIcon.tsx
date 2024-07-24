import React from "react";

const ChevronUpIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M16 14L12 10L8 14" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default React.memo(ChevronUpIcon);
