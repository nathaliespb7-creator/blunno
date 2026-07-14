<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Blunno project rules

Versioned project guidance lives in:

- `.cursor/rules/technical.mdc`
- `.cursor/rules/design.mdc`
- `.cursor/rules/pwa.mdc`
- `.cursor/rules/qa-navigation.mdc`

Before a production deploy, run `npm run verify`. It performs lint, type checking, one production build, and all Playwright E2E specs. Do not run a separate production build before it, and do not deploy when verification is red.

The repository has no Jest/React Testing Library suite. Do not claim or require unit tests unless that test stack and actual unit tests are added.
