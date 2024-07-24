import React from "react";

const CheckIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M1.5 4L4.5 7L10.5 1" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};

export default React.memo(CheckIcon);
