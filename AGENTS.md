<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## ValaTube Studio architecture
- Phase 01 is frontend-only: no backend, auth server, or external API calls; actions needing them must show an "unavailable" notice, never a false success.
- Signed-in pages live under the pathless `_studio` layout (`src/routes/_studio.*.tsx`), which wraps them in `AppShell`; add new modules there and register them in `src/lib/nav.ts`.
- Demo credentials live only in `src/lib/demo-auth.ts` so they can be swapped for real auth later.
- All sample data lives in `src/data/`; route files must not export non-route values (breaks code splitting).
- Local edits persist through `useLocalState` (prefix `vt:data:`) so "Reset demo data" can clear them.
- Shared UI building blocks are in `src/components/app/kit.tsx`, charts in `charts.tsx`; reuse them rather than re-styling per page.
- Dark theme is default (`html.dark`); colours come only from tokens in `src/styles.css`.
