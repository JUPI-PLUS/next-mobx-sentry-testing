import React from "react";

const DoubleChevronLeftIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.5303 8.46967C15.2374 8.17678 14.7626 8.17678 14.4697 8.46967L10.9393 12L14.4697 15.5303C14.7626 15.8232 15.2374 15.8232 15.5303 15.5303C15.8232 15.2374 15.8232 14.7626 15.5303 14.4697L13.0607 12L15.5303 9.53033C15.8232 9.23744 15.8232 8.76256 15.5303 8.46967Z"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.5303 8.46967C11.2374 8.17678 10.7626 8.17678 10.4697 8.46967L6.93934 12L10.4697 15.5303C10.7626 15.8232 11.2374 15.8232 11.5303 15.5303C11.8232 15.2374 11.8232 14.7626 11.5303 14.4697L9.06066 12L11.5303 9.53033C11.8232 9.23744 11.8232 8.76256 11.5303 8.46967Z"
            />
        </svg>
    );
};

export default React.memo(DoubleChevronLeftIcon);
