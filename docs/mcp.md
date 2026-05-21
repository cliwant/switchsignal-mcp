# SwitchSignal Hosted MCP Specification

Production endpoint:

```text
https://switchsignal.grindworks.ai/api/mcp
```

Manifest:

```text
https://switchsignal.grindworks.ai/mcp.json
```

Authentication:

```text
Authorization: Bearer <SWITCHSIGNAL_MCP_KEY>
```

## Contract

SwitchSignal exposes tools, resources, and prompts for evidence-grounded market
dislocation work against a hosted SwitchSignal workspace. Hosted calls enforce:

- user-scoped API keys
- documented scopes only
- plan entitlement
- monthly and burst usage limits
- audit logging with redacted arguments
- output shape validation
- operator-only workflow exclusion

## Safe first calls

Start with these read-only calls:

1. `tools/list`
2. `resources/read` for `switchsignal://tool-contracts`
3. `switchsignal.audit_categories`
4. `switchsignal.capture_plan`

Use write calls only after confirming user intent and usage budget.

## Write boundaries

Bounded write tools can create user-owned watchlists, snapshots, signals, or
campaign packs. They do not send cold outreach, cold DMs, automated social
posts, or destructive production actions.

## Not the OSS local kit

This MCP connector is not the no-account open-source product core. It requires
a hosted SwitchSignal account and MCP API key because it reads or writes hosted
workspace data. For local-first analysis without hosted service access, use:

```text
https://github.com/cliwant/switchsignal-oss
```
