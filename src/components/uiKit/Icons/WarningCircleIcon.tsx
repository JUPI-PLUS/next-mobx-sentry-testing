import { memo } from "react";

const WarningCircleIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
            <path
                d="M14.275 5.00007L3.27498 24.0001C3.09973 24.3036 3.00733 24.6478 3.00702 24.9983C3.00671 25.3488 3.0985 25.6932 3.27321 25.997C3.44791 26.3009 3.69939 26.5534 4.00244 26.7295C4.3055 26.9055 4.6495 26.9988 4.99998 27.0001H27C27.3505 26.9988 27.6944 26.9055 27.9975 26.7295C28.3006 26.5534 28.552 26.3009 28.7267 25.997C28.9014 25.6932 28.9932 25.3488 28.9929 24.9983C28.9926 24.6478 28.9002 24.3036 28.725 24.0001L17.725 5.00007C17.5511 4.69616 17.2999 4.44359 16.997 4.26793C16.6941 4.09227 16.3501 3.99976 16 3.99976C15.6498 3.99976 15.3059 4.09227 15.0029 4.26793C14.7 4.44359 14.4489 4.69616 14.275 5.00007Z"
                fill="#FE9C55"
                stroke="#FE9C55"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M16 13V18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M17.4375 22.5C17.4375 23.2939 16.7939 23.9375 16 23.9375C15.2061 23.9375 14.5625 23.2939 14.5625 22.5C14.5625 21.7061 15.2061 21.0625 16 21.0625C16.7939 21.0625 17.4375 21.7061 17.4375 22.5Z"
                fill="white"
                stroke="white"
                strokeWidth="0.125"
            />
        </svg>
    );
};

export default memo(WarningCircleIcon);
