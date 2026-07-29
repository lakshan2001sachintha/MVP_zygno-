# Princeton IMS — Frontend

Full-stack React application built with TanStack Start, Supabase, and LinguiJS.

**Engines:** Node ≥ 24, pnpm ≥ 11.

---

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # fill in SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, Sentry vars
pnpm dev                     # starts dev server (default Vite port)
```

## Scripts

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Start dev server (Vite default port)                    |
| `pnpm build`           | check + lingui:compile + build + typecheck → `.output/` |
| `pnpm start`           | Run production server                                   |
| `pnpm test`            | Run Vitest (single pass)                                |
| `pnpm typecheck`       | TypeScript type check                                   |
| `pnpm lint`            | oxlint                                                  |
| `pnpm lint:fix`        | oxlint --fix                                            |
| `pnpm fmt`             | oxfmt (format)                                          |
| `pnpm fmt:check`       | oxfmt --check                                           |
| `pnpm check`           | lint + fmt:check                                        |
| `pnpm check:all`       | lint + fmt:check + typecheck                            |
| `pnpm lingui:extract`  | Extract i18n messages                                   |
| `pnpm lingui:compile`  | Compile .po catalogs                                    |
| `pnpm generate-routes` | Regenerate TanStack Router route tree                   |

## Stack

| Layer          | Technology                                                                        |
| -------------- | --------------------------------------------------------------------------------- |
| Framework      | [TanStack Start](https://tanstack.com/start) (SSR full-stack React)               |
| Routing        | [TanStack Router](https://tanstack.com/router) (file-based)                       |
| Server         | [Nitro](https://nitro.build/) (`node-server` preset)                              |
| Auth & DB      | [Supabase](https://supabase.com/) (`@supabase/ssr`)                               |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| i18n           | [LinguiJS](https://lingui.dev/) (en, si, ta)                                      |
| Forms          | [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev/)              |
| Data tables    | [TanStack Table](https://tanstack.com/table)                                      |
| Data fetching  | [TanStack Query](https://tanstack.com/query)                                      |
| Hotkeys        | [TanStack Hotkeys](https://tanstack.com/hotkeys)                                  |
| Images         | [@unpic/react](https://unpic.pics/img/react/)                                     |
| Error tracking | [Sentry](https://sentry.io/)                                                      |
| Linter         | [oxlint](https://oxc.rs/docs/guide/usage/linter)                                  |
| Formatter      | [oxfmt](https://github.com/nicolo-ribaudo/oxfmt)                                  |
| Testing        | [Vitest](https://vitest.dev/)                                                     |

## Deployment

The build output is a self-contained Node server:

```bash
pnpm build
pnpm start          # runs .output/server/index.mjs
```

For host-specific Nitro presets (Vercel, Netlify, Cloudflare, AWS Lambda, etc.) see [nitro.build/deploy](https://nitro.build/deploy).

---

## Learn More

- [TanStack Docs](https://tanstack.com) — Router, Start, Query, Form, Table, Hotkeys
- [Supabase Docs](https://supabase.com/docs)
- [LinguiJS Docs](https://lingui.dev)
- [Unpic React Docs](https://unpic.pics/img/react/)
