import React from "react";

const ShearsIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.04041 4.64218C4.12872 5.88621 4.39815 7.63376 5.64218 8.54544C6.88324 9.45495 8.62541 9.18898 9.53889 7.95257L9.54532 7.94367L9.55189 7.93484C10.4558 6.69138 10.1848 4.94993 8.94367 4.04041C7.69964 3.12872 5.95209 3.39815 5.04041 4.64218ZM4.75552 9.75533C6.46137 11.0055 8.78314 10.8108 10.2593 9.39673L13.8107 11.9994L10.2593 14.602C8.78314 13.1879 6.46137 12.9933 4.75552 14.2434C2.84328 15.6448 2.42914 18.331 3.83052 20.2432C5.23189 22.1554 7.9181 22.5696 9.83033 21.1682C11.5362 19.9181 12.0499 17.6454 11.146 15.8119L15.0795 12.9292L21.1368 17.3683C21.4709 17.6131 21.9402 17.5407 22.1851 17.2066C22.4299 16.8725 22.3575 16.4032 22.0234 16.1584L16.3483 11.9994L22.0234 7.84036C22.3575 7.59552 22.4299 7.12619 22.1851 6.79209C21.9402 6.45799 21.4709 6.38563 21.1368 6.63047L15.0795 11.0695L11.146 8.18686C12.0499 6.35334 11.5362 4.08067 9.83033 2.83052C7.9181 1.42914 5.23189 1.84328 3.83052 3.75552C2.42914 5.66775 2.84328 8.35396 4.75552 9.75533ZM5.04041 19.3566C4.12872 18.1125 4.39815 16.365 5.64218 15.4533C6.8832 14.5438 8.62531 14.8097 9.53882 16.0461L9.54532 16.0551L9.55197 16.064C10.4558 17.3074 10.1847 19.0488 8.94367 19.9583C7.69964 20.87 5.95209 20.6006 5.04041 19.3566Z"
            />
        </svg>
    );
};

export default React.memo(ShearsIcon);
