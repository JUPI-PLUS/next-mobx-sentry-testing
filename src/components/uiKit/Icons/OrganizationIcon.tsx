import React from "react";

const OrganizationIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 3.25C3.58579 3.25 3.25 3.58579 3.25 4V19.25H2V20.75H22V19.25H20.75V4C20.75 3.58579 20.4142 3.25 20 3.25H4ZM9.75 19.25H4.75V4.75H19.25V19.25H14.25V16V15.25H13.5H10.5H9.75V16V19.25ZM12.75 16.75V19.25H11.25V16.75H12.75ZM7 7H9V9H7V7ZM11 7H13V9H11V7ZM15 7H17V9H15V7ZM7 11H9V13H7V11ZM11 11H13V13H11V11ZM15 11H17V13H15V11Z"
            />
        </svg>
    );
};

export default React.memo(OrganizationIcon);
