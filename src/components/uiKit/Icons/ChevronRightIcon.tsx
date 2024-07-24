import React from "react";

const ChevronRightIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect width="24" height="24" rx="12" stroke="none" />
            <path d="M11 9L14 12L11 15" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default React.memo(ChevronRightIcon);
