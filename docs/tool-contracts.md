# Hosted Tool Contracts

SwitchSignal MCP tools are selected by external agents, so the hosted service
publishes machine-readable tool contracts in addition to human-readable docs.

Start every integration session with:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "switchsignal://tool-contracts"
  }
}
```

## What agents should inspect

Each hosted tool contract is expected to expose:

- `description`: compact selection guidance that starts with `Use this when`.
- `inputSchema`: the accepted JSON shape for arguments.
- `outputSchema`: the stable JSON shape returned by the hosted service.
- `authRequirement`: bearer-key authentication and user scope.
- `entitlement`: the plan capability or usage unit required by the call.
- `usageUnit`: the unit charged to the hosted usage ledger.
- `requiredScopes`: API-key scopes needed to call the tool.
- `readOnly`: whether the tool is safe for discovery or writes user data.
- `errorModes`: normalized errors agents should surface to users.
- `requiredOutputKeys`: the output keys the hosted service validates before
  returning a successful response.

The hosted `tools/list` response also includes MCP annotations such as
`readOnlyHint`. Treat those annotations as a quick selector, then read
`switchsignal://tool-contracts` before calling write tools.

## Safe tool selection

| User intent | First tool | Boundary |
| --- | --- | --- |
| "What categories can I inspect?" | `switchsignal.audit_categories` | Read-only category evidence summary |
| "What evidence should I capture next?" | `switchsignal.capture_plan` | Read-only worklist planning |
| "Create a watchlist for my client" | `switchsignal.materialize_capture_plan_watchlist` | Creates user-owned competitors and watched URLs |
| "Turn this changed snapshot into a signal" | `switchsignal.create_signal_from_snapshot` | Requires an owned snapshot with diff excerpts |
| "Build a client memo/report" | `switchsignal.generate_campaign_pack` or `switchsignal.client_report` | Consumes hosted quota and returns client-delivery artifacts |

Write tools do not send cold email, cold DMs, social posts, billing actions, or
destructive production changes. They create or package data inside the
authenticated SwitchSignal workspace and leave audit/usage records.

## Output quality contract

For signal, campaign-pack, and client-report tools, agents should preserve:

- evidence
- source boundary
- confidence
- before/after
- affected segment
- business impact
- urgency
- recommended action
- proof table
- client delivery decision
- execution checklist
- quality score
- cannot-claim guardrails
- outcome feedback path

If a hosted response lacks the keys named in `requiredOutputKeys`, treat it as a
tool failure rather than a client-ready artifact.

