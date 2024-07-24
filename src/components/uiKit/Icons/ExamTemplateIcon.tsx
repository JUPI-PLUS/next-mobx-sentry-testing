import React from "react";

const ExamTemplateIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...props}>
            <path
                opacity="0.8"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.6108 4H8.22222C6.99492 4 6 4.97683 6 6.18182V25.8182C6 27.0232 6.99492 28 8.22222 28H23.7778C25.0051 28 26 27.0232 26 25.8182V12.3892L17.6108 4Z"
                fill="#4F5EEE"
            />
            <path opacity="0.48" d="M17.6172 4L25.9961 12.3867H17.6172V4Z" fill="white" />
            <path
                opacity="0.64"
                d="M11 16.8185C11 16.3667 11.3663 16.0004 11.8181 16.0004L20.1818 16C20.6337 16 21 16.3663 21 16.8182C21 17.2701 20.6337 17.6364 20.1819 17.6364L11.8182 17.6367C11.3663 17.6367 11 17.2704 11 16.8185Z"
                fill="white"
            />
            <path
                opacity="0.64"
                d="M11 21.1815C11 20.7296 11.3663 20.3633 11.8182 20.3633H20.1818C20.6337 20.3633 21 20.7296 21 21.1815C21 21.6333 20.6337 21.9996 20.1818 21.9996H11.8182C11.3663 21.9996 11 21.6333 11 21.1815Z"
                fill="white"
            />
        </svg>
    );
};

export default React.memo(ExamTemplateIcon);
