import React from "react";

const ExclamationMarkIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z"
                fill="#E83E50"
            />
            <path d="M12 11.4004L12 9.00039" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            <path
                d="M13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14Z"
                fill="white"
            />
        </svg>
    );
};

export default React.memo(ExclamationMarkIcon);
