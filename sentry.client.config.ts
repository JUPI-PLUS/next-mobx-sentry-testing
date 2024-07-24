// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/nextjs";
import { Dedupe as DedupeIntegration } from "@sentry/integrations";
import packageJSON from "./package.json";
import {
    BLOCK_ROUTING_BEFORE_LEAVE_CONFIRMATION_ERROR,
    SERVER_VALIDATION_ERROR_MESSAGE,
    UNAUTHORIZED_SERVER_ERROR_MESSAGE,
} from "./src/shared/errors/errorMessages";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

(() => {
    if (process.env.NODE_ENV !== "production") return;
    Sentry.init({
        dsn:
            SENTRY_DSN ||
            "https://4270e66c37d946749ca63d4a4cc8c716@o4503976910979072.ingest.sentry.io/4504599659937792",
        // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 1.0,
        integrations: [new BrowserTracing(), new DedupeIntegration()],
        release: packageJSON.version,
        beforeSend: (event, hint) => {
            const error = hint.originalException;
            if (
                error === BLOCK_ROUTING_BEFORE_LEAVE_CONFIRMATION_ERROR ||
                (error as Error)?.message === SERVER_VALIDATION_ERROR_MESSAGE ||
                (error as Error)?.message === UNAUTHORIZED_SERVER_ERROR_MESSAGE
            ) {
                return null;
            }
            return event;
        },
        // ...
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
    });
})();
