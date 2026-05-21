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

## Client-delivery output contract

Hosted MCP is meant for agent workflows that need client-ready work, not just
raw database rows. The highest-value calls should preserve these fields when
applicable:

- evidence
- source boundary
- confidence
- before/after
- affected segment
- business impact
- urgency
- recommended next action
- proof table
- client delivery decision
- execution checklist
- quality score
- cannot-claim guardrails
- outcome feedback path

`switchsignal.generate_campaign_pack` returns the campaign-pack `valueBrief`
with this contract. `switchsignal.client_report` returns the same delivery
discipline at the client/workspace level by summarizing watchlist coverage,
changed snapshots, quality-gated signals, ready campaign packs, and next action
recommendations.

## Write boundaries

Bounded write tools can create user-owned watchlists, snapshots, signals, or
campaign packs. They do not send cold outreach, cold DMs, automated social
posts, or destructive production actions.

## Example write sequence

Use this sequence only with a key that has the required write scopes and after
confirming user intent:

1. `switchsignal.capture_plan` to select category targets.
2. `switchsignal.materialize_capture_plan_watchlist` to create owned watched
   competitors and URLs.
3. `switchsignal.capture_snapshot` for one owned watched URL.
4. `switchsignal.create_signal_from_snapshot` when the snapshot has diff
   excerpts.
5. `switchsignal.generate_campaign_pack` for a quality-gated owned signal.
6. `switchsignal.client_report` to package the current client workspace for
   review.

Every step is scoped to the authenticated user and writes usage/audit events in
the hosted service.

## Not the OSS local kit

This MCP connector is not the no-account open-source product core. It requires
a hosted SwitchSignal account and MCP API key because it reads or writes hosted
workspace data. For local-first analysis without hosted service access, use:

```text
https://github.com/cliwant/switchsignal-oss
```
