import React from "react";
import { ToastContainer as Container } from "react-toastify";

const TOAST_VISIBILITY_DURATION = 5000;

const ToastContainer = () => {
    return (
        <Container
            position="top-right"
            className="flex flex-col items-end p-0 ml-4"
            bodyClassName="border border-gray-200 border-inset rounded-lg"
            toastClassName="bg-white relative flex justify-between min-h-10 mb-4 rounded-lg overflow-hidden cursor-pointer text-gray-90 drop-shadow-datepicker before:bg-dark-600 before:w-full before:absolute before:h-[5px] before:z-[-1] before:bottom-0 before:left-0"
            autoClose={TOAST_VISIBILITY_DURATION}
            newestOnTop={false}
            closeOnClick={false}
            pauseOnFocusLoss
            pauseOnHover
            draggable
            icon={false}
            closeButton={false}
        />
    );
};

export default ToastContainer;
