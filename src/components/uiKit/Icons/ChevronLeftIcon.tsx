import React from "react";

const ChevronLeftIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="24" y="24" width="24" height="24" rx="12" stroke="none" transform="rotate(-180 24 24)" />
            <path d="M13 15L10 12L13 9" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default React.memo(ChevronLeftIcon);
