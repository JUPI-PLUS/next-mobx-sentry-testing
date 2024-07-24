import React from "react";

const MoveUpIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M12 2L8.46967 5.53033C8.17678 5.82322 8.17678 6.2981 8.46967 6.59099C8.76256 6.88388 9.23744 6.88388 9.53033 6.59099L12 4.12132L14.4697 6.59099C14.7626 6.88388 15.2374 6.88388 15.5303 6.59099C15.8232 6.2981 15.8232 5.82322 15.5303 5.53033L12 2Z" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 10.25C4.0335 10.25 3.25 11.0335 3.25 12V19C3.25 19.9665 4.0335 20.75 5 20.75H19C19.9665 20.75 20.75 19.9665 20.75 19V12C20.75 11.0335 19.9665 10.25 19 10.25H5ZM4.75 12C4.75 11.8619 4.86193 11.75 5 11.75H19C19.1381 11.75 19.25 11.8619 19.25 12V19C19.25 19.1381 19.1381 19.25 19 19.25H5C4.86193 19.25 4.75 19.1381 4.75 19V12Z"
            />
        </svg>
    );
};

export default React.memo(MoveUpIcon);
