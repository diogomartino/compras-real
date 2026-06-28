# AGENTS.md

## Transport

- tRPC uses WebSocket transport only.
- The server uses `trpc-bun-adapter` with `createBunWSHandler`.
- Keep the WebSocket endpoint at `/trpc`.
- Browser WebSockets cannot send custom headers, so auth must use `connectionParams`.

## tRPC Style

- Define one route file per procedure when the procedure is non-trivial.
- Export procedures as `const getUserRoute = ...` and compose them in the feature `index.ts` router.
- Use Zod inputs on every procedure that accepts input inline.
- Throw `TRPCError` for authorization, validation, and not-found errors.
- Keep `publicProcedure`, `protectedProcedure`, and `adminProcedure` in `apps/server/src/trpc.ts`.
- Prefer returning plain serializable objects. Superjson is configured for transport support.
- When using react query hooks, always destructure. Example: `const login = useLogin();` should be `const { mutate: login } = useLogin();`.

## Database Style

- Keep Drizzle schema definitions in `packages/db/src/schema.ts`.
- Keep app-level query helpers in `apps/server/src/db/queries`.
- Keep app-level mutation helpers in `apps/server/src/db/mutations`.
- Do not edit migrations unless the task explicitly asks for migration work.
- Run `bun db:gen` to generate Drizzle types after schema changes.
- Shared table types in `packages/shared/src/tables.ts` must only export tables that exist in the current schema.

## Code Style

- TypeScript is strict; avoid `any` unless there is a clear boundary reason.
- Use single quotes, semicolons, two-space indentation, and no trailing commas.
- Prefer named exports.
- Keep changes small and local; avoid adding helpers until reuse is clear.
- Use `@/` imports inside the client app.
- Use workspace package imports such as `@myapp/db`, `@myapp/shared`, and `@myapp/logger` across packages.
- Use agressive memoization for ALL React components and hooks.
- Exports are at the bottom of the file, not inline with definitions.
- DRY up code by creating helpers, hooks, and shared types.
- Keep components small and focused; avoid large monolithic components.
- Separation of concerns, prefer multiple files with a single responsibility over one large file.
- Always destruct when using `useForm`, example: `{ setTrpcErrors, values } = useForm<TLoginForm>({ ... })`.
- Always use `useForm` to handle form state, validation errors, and submission. Avoid using `useState` for form state.

## Environment

- Client-exposed env vars must use the `VITE_` prefix.
- `VITE_API_URL` points to the HTTP origin of the API, for example `http://localhost:4000`; the client derives `ws://` or `wss://` automatically.
- Server requires `PORT`, `CLIENT_URL`, `JWT_SECRET`, and Postgres connection variables.
- Never commit real secrets. Keep examples in `.env.example` only.
