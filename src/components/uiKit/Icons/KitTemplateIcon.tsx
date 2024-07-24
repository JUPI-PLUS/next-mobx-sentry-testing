import React from "react";

const KitTemplateIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" {...props}>
            <path
                d="M5 10.7778C5 9.79594 5.79594 9 6.77778 9H19.2222C20.2041 9 21 9.79594 21 10.7778V27.2222C21 28.2041 20.2041 29 19.2222 29H6.77778C5.79594 29 5 28.2041 5 27.2222L5 10.7778Z"
                fill="#CEB6FF"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.418 3H11.8889C10.8457 3 10 3.84568 10 4.88889V22.1111C10 23.1543 10.8457 24 11.8889 24H25.1111C26.1543 24 27 23.1543 27 22.1111V9.58203L20.418 3Z"
                fill="#A073FF"
            />
            <path opacity="0.48" d="M20.4299 3.00391L26.9983 9.58395H20.4299L20.4299 3.00391Z" fill="white" />
            <rect opacity="0.64" x="13.7778" y="13.3887" width="9.44444" height="1.41667" rx="0.708333" fill="white" />
            <rect opacity="0.64" x="13.7778" y="17.166" width="9.44444" height="1.41667" rx="0.708333" fill="white" />
        </svg>
    );
};

export default React.memo(KitTemplateIcon);
