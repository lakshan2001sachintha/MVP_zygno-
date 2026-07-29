// src/instrument.server.ts
import * as Sentry from "@sentry/tanstackstart-react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  environment: process.env.VITE_SENTRY_ENV ? process.env.VITE_SENTRY_ENV : "local",
});
