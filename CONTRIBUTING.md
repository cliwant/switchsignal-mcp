# Contributing

Contributions should stay inside the public MCP boundary:

- bridge behavior
- manifest/spec documentation
- examples that use placeholders or environment variables
- install and local smoke-test improvements

Do not contribute hosted product internals, private operator workflows,
customer data, production credentials, or lead/outreach material.

Before opening a PR:

```bash
npm run check:json
npm run smoke
```
