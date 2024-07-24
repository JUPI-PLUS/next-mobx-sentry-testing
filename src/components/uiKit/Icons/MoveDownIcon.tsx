import React from "react";

const MoveDownIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 13.75C4.0335 13.75 3.25 12.9665 3.25 12V5C3.25 4.0335 4.0335 3.25 5 3.25H19C19.9665 3.25 20.75 4.0335 20.75 5V12C20.75 12.9665 19.9665 13.75 19 13.75H5ZM4.75 12C4.75 12.1381 4.86193 12.25 5 12.25H19C19.1381 12.25 19.25 12.1381 19.25 12V5C19.25 4.86193 19.1381 4.75 19 4.75H5C4.86193 4.75 4.75 4.86193 4.75 5V12Z"
            />
            <path d="M12 22L8.46967 18.4697C8.17678 18.1768 8.17678 17.7019 8.46967 17.409C8.76256 17.1161 9.23744 17.1161 9.53033 17.409L12 19.8787L14.4697 17.409C14.7626 17.1161 15.2374 17.1161 15.5303 17.409C15.8232 17.7019 15.8232 18.1768 15.5303 18.4697L12 22Z" />
        </svg>
    );
};

export default React.memo(MoveDownIcon);
