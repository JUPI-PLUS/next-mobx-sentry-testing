// libs
import React from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./../src/lib/polyfills";

// components
import ToastContainer from "../src/components/uiKit/Toast/ToastContainer";

// helpers
import { DEFAULT_REACT_QUERY_OPTIONS } from "../src/shared/constants/queries";
import "../src/shared/validation/yupMethods";

// styles
import "../src/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-day-picker/dist/style.css";
import "react-quill/dist/quill.snow.css";
import "react-international-phone/style.css";

import packageJSON from "../package.json";

export const queryClient = new QueryClient(DEFAULT_REACT_QUERY_OPTIONS);

// eslint-disable-next-line no-console
console.log(`Front-end version: `, packageJSON.version);

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
    );
}

export default MyApp;
