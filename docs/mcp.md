# SwitchSignal MCP Specification

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
dislocation work. Hosted calls enforce:

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
