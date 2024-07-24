import React from "react";

const IndeterminateIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-4 h-4"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
    );
};

export default React.memo(IndeterminateIcon);
