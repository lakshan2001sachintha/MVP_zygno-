// Sentry server initialization must be imported first
import "./instrument.server";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import { createStartHandler } from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";

import { customHandler } from "./server-handler";

const startFetch = createStartHandler(customHandler);

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      return startFetch(request);
    },
  }),
);
