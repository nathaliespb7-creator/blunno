<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## QA before deploy

Before production deploy, run:

```bash
npm run build
npm run test:e2e
```

E2E tests cover all Blunno routes (`/`, `/choose`, `/sos`, `/planner`, `/play`, `/relax`), navigation buttons, and key interactions. See [`.cursor/rules/qa-navigation.mdc`](.cursor/rules/qa-navigation.mdc) for the full checklist. Do not deploy on red E2E.
