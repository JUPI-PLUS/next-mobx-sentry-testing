import React from "react";

const UserIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="12" cy="7.2959" r="5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M5 19.2959C5 17.4346 5 16.504 5.24472 15.7508C5.73931 14.2286 6.93273 13.0352 8.45492 12.5406C9.20808 12.2959 10.1387 12.2959 12 12.2959V12.2959C13.8613 12.2959 14.7919 12.2959 15.5451 12.5406C17.0673 13.0352 18.2607 14.2286 18.7553 15.7508C19 16.504 19 17.4346 19 19.2959V20.2959H5V19.2959Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default React.memo(UserIcon);
