import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import * as Sentry from "@sentry/tanstackstart-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient, i18n },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
    Wrap: (props: { children: React.ReactNode }) => (
      <I18nProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
      </I18nProvider>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  if (!router.isServer) {
    Sentry.addIntegration(Sentry.tanstackRouterBrowserTracingIntegration(router));
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
