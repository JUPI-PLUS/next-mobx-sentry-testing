// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import packageJSON from "./package.json";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

(() => {
    if (process.env.NODE_ENV !== "production") return;
    Sentry.init({
        dsn:
            SENTRY_DSN ||
            "https://4270e66c37d946749ca63d4a4cc8c716@o4503976910979072.ingest.sentry.io/4504599659937792",
        // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 1.0,
        release: packageJSON.version,
        // ...
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
    });
})();
