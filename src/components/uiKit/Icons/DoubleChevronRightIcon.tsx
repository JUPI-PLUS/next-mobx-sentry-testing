import React from "react";

const DoubleChevronRightIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.46967 8.46967C8.76256 8.17678 9.23744 8.17678 9.53033 8.46967L13.0607 12L9.53033 15.5303C9.23744 15.8232 8.76256 15.8232 8.46967 15.5303C8.17678 15.2374 8.17678 14.7626 8.46967 14.4697L10.9393 12L8.46967 9.53033C8.17678 9.23744 8.17678 8.76256 8.46967 8.46967Z"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.4697 8.46967C12.7626 8.17678 13.2374 8.17678 13.5303 8.46967L17.0607 12L13.5303 15.5303C13.2374 15.8232 12.7626 15.8232 12.4697 15.5303C12.1768 15.2374 12.1768 14.7626 12.4697 14.4697L14.9393 12L12.4697 9.53033C12.1768 9.23744 12.1768 8.76256 12.4697 8.46967Z"
            />
        </svg>
    );
};

export default React.memo(DoubleChevronRightIcon);
