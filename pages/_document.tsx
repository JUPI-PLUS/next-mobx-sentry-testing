import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import React from "react";

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <title>Enver lims</title>
                <Script
                    src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/barcodes/JsBarcode.code128.min.js"
                    strategy="afterInteractive"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
