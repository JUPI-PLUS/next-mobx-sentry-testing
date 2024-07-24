import React from "react";

const RoleIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.8792 1.00334C12.8808 0.946599 13.7778 1.61906 14.0043 2.59637C17.1533 3.27096 19.7561 5.47643 20.9383 8.47212L19.6807 8.96692C18.6775 6.44216 16.4953 4.57346 13.8462 3.97081C13.4038 4.87121 12.3776 5.32248 11.415 5.03987C10.4524 4.75725 9.83301 3.82279 9.94762 2.82616C10.0622 1.82953 10.8776 1.06007 11.8792 1.00334ZM11.3172 3.07055C11.3172 3.45009 11.6249 3.75777 12.0044 3.75777C12.1867 3.75777 12.3615 3.68537 12.4904 3.55649C12.6193 3.42761 12.6917 3.25281 12.6917 3.07055C12.6917 2.69101 12.384 2.38333 12.0044 2.38333C11.6249 2.38333 11.3172 2.69101 11.3172 3.07055ZM8.47212 3.07055L8.98066 4.32817C6.45061 5.32767 4.57623 7.51058 3.97081 10.1627C4.87121 10.6051 5.32249 11.6313 5.03987 12.5939C4.75725 13.5565 3.82279 14.1759 2.82616 14.0613C1.82953 13.9466 1.06007 13.1313 1.00334 12.1297C0.946599 11.1281 1.61906 10.2311 2.59637 10.0046C3.27096 6.85553 5.47643 4.25281 8.47212 3.07055ZM2.38333 12.0044C2.38333 12.384 2.69101 12.6917 3.07055 12.6917C3.45009 12.6917 3.75777 12.384 3.75777 12.0044C3.75777 11.6249 3.45009 11.3172 3.07055 11.3172C2.69101 11.3172 2.38333 11.6249 2.38333 12.0044ZM10.1627 20.0243C10.5093 19.3235 11.2226 18.879 12.0044 18.8767C13.0846 18.8624 13.9926 19.6844 14.0856 20.7607C14.1786 21.837 13.425 22.8025 12.3584 22.9738C11.2917 23.145 10.2738 22.4638 10.0252 21.4125C6.86835 20.7441 4.25675 18.5377 3.07055 15.5368L4.32817 15.0282C5.33133 17.553 7.51362 19.4217 10.1627 20.0243ZM11.3172 20.9383C11.3172 21.3179 11.6249 21.6255 12.0044 21.6255C12.384 21.6255 12.6917 21.3179 12.6917 20.9383C12.6917 20.5588 12.384 20.2511 12.0044 20.2511C11.6249 20.2511 11.3172 20.5588 11.3172 20.9383ZM21.2569 9.9613C22.2626 10.1186 23.0031 10.9864 23 12.0044C22.9875 12.9502 22.333 13.7662 21.4125 13.9836C20.7441 17.1405 18.5377 19.7521 15.5368 20.9383L15.0282 19.6807C17.553 18.6775 19.4217 16.4953 20.0243 13.8462C19.1118 13.3949 18.6653 12.3451 18.9732 11.3747C19.2811 10.4044 20.2511 9.80402 21.2569 9.9613ZM20.2511 12.0044C20.2511 12.384 20.5588 12.6917 20.9383 12.6917C21.3179 12.6917 21.6256 12.384 21.6256 12.0044C21.6256 11.6249 21.3179 11.3172 20.9383 11.3172C20.5588 11.3172 20.2511 11.6249 20.2511 12.0044ZM14.5463 8.90653C14.968 9.94165 14.7209 11.129 13.9213 11.91C14.8688 12.5471 15.438 13.6133 15.4401 14.7551V16.1296H8.56787V14.7551C8.56843 13.6146 9.13486 12.5487 10.0798 11.91C9.28019 11.129 9.03311 9.94165 9.45477 8.90653C9.87642 7.87142 10.8828 7.19466 12.0005 7.19466C13.1182 7.19466 14.1247 7.87142 14.5463 8.90653ZM12.004 8.57011C11.2449 8.57011 10.6295 9.18547 10.6295 9.94456C10.6295 10.7036 11.2449 11.319 12.004 11.319C12.7631 11.319 13.3784 10.7036 13.3784 9.94456C13.3784 9.18547 12.7631 8.57011 12.004 8.57011ZM12.004 12.6934C10.8654 12.6934 9.94232 13.6165 9.94232 14.7551H14.0656C14.0656 13.6165 13.1426 12.6934 12.004 12.6934Z"
            />
        </svg>
    );
};

export default React.memo(RoleIcon);
