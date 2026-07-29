import { I18n } from "@lingui/core";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HotkeysDevtoolsPanel } from "@tanstack/react-hotkeys-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";

import { PermissionsProvider } from "#/components/permissions-provider";
import { Toaster } from "#/components/ui/sonner";
import { fetchPermissionsFn } from "#/lib/permissions";
import { getSupabaseServerClient } from "#/utils/supabase";

import Footer from "../components/Footer";
import Header from "../components/Header";

import appCss from "#/styles/styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
  i18n: I18n;
}

const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error: _error } = await supabase.auth.getUser();

  if (!data.user?.email) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, is_approved")
    .eq("id", data.user.id)
    .single();

  return {
    id: data.user.id,
    email: data.user.email,
    role: profile?.role ?? "student",
    fullName: profile?.full_name ?? "Anonymous",
    isApproved: profile?.is_approved ?? true,
  };
});

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const [user, permissions] = await Promise.all([fetchUser(), fetchPermissionsFn()]);

    return { user, permissions };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Institute Management System",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootComponent,
  wrapInSuspense: true,
});

function RootComponent() {
  const { i18n, user, permissions } = useRouteContext({ from: "__root__" });
  return (
    <PermissionsProvider permissions={permissions}>
      <RootDocument locale={i18n.locale} user={user}>
        <Outlet />
      </RootDocument>
    </PermissionsProvider>
  );
}

function RootDocument({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
  user: { email: string } | null;
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans wrap-anywhere antialiased">
        <Header />
        {children}
        <Toaster />
        <Footer />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "TanStack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "TanStack Hotkeys",
              render: <HotkeysDevtoolsPanel theme="dark" devtoolsOpen={false} />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
