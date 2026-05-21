# SwitchSignal MCP

Public MCP bridge and specification for
[SwitchSignal](https://switchsignal.grindworks.ai), the evidence-grounded
market dislocation desk for B2B SaaS growth teams.

SwitchSignal detects competitor pricing, packaging, free-tier, and policy
changes, then turns them into bounded migration campaign work. This public repo
contains the safe integration layer for external agents. It does not contain
hosted product code, customer data, private snapshots, billing state,
production credentials, or operator workflows.

## What you can do

- Connect Claude, Codex, Gemini-style local clients, or custom MCP clients to
  the hosted SwitchSignal MCP endpoint.
- Inspect the public MCP manifest, tools, resources, prompts, scopes, usage
  metering, and audit contract.
- Run a local stdio bridge without storing secrets in this repository.
- Copy JSON-RPC request examples for read and bounded-write flows.

## Hosted MCP endpoint

```text
https://switchsignal.grindworks.ai/api/mcp
```

Public manifest:

```text
https://switchsignal.grindworks.ai/mcp.json
```

Developer setup page:

```text
https://switchsignal.grindworks.ai/developers
```

## Quick install

Create a SwitchSignal MCP key in the hosted product, then configure your local
agent client with:

```json
{
  "mcpServers": {
    "switchsignal": {
      "command": "npx",
      "args": ["-y", "github:cliwant/switchsignal-mcp"],
      "env": {
        "SWITCHSIGNAL_MCP_KEY": "<SWITCHSIGNAL_MCP_KEY>"
      }
    }
  }
}
```

For local development from a clone:

```bash
git clone https://github.com/cliwant/switchsignal-mcp.git
cd switchsignal-mcp
cp .env.example .env.local
# Fill SWITCHSIGNAL_MCP_KEY in your shell or client secret store.
node bin/switchsignal-mcp-bridge.mjs
```

The bridge reads the key from the environment and forwards newline-delimited
stdio JSON-RPC to the hosted Streamable HTTP endpoint. It does not persist or
print the key.

## Direct HTTP smoke

```bash
curl https://switchsignal.grindworks.ai/api/mcp \
  -H "Authorization: Bearer $SWITCHSIGNAL_MCP_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

Read-only keys should only list read tools. Keys with write scopes expose
bounded write tools according to the key scopes, plan entitlement, rate limit,
and usage budget.

## Public tool families

- Category intelligence audit
- Evidence backlog and capture planning
- User-scoped watchlist materialization
- Snapshot capture for owned watched URLs
- Snapshot-to-signal conversion
- Category-backed signal creation
- Campaign pack generation
- Client report packaging

Every hosted call remains user-scoped, entitlement-checked, metered,
rate-limited, and audit-logged by SwitchSignal. This bridge does not bypass the
hosted security model.

## Examples

- [`examples/tool-calls.json`](examples/tool-calls.json) contains copyable
  JSON-RPC request shapes with no real keys.
- [`examples/smoke-local.mjs`](examples/smoke-local.mjs) validates that the
  bridge starts and that public JSON files parse.

## Security boundary

This public repository may include:

- MCP bridge code
- Public request examples
- Public manifest/spec copies
- Documentation for scopes, tools, resources, prompts, and safe setup

This public repository must not include:

- Real MCP keys or API tokens
- Customer workspaces, snapshots, reports, or outcomes
- Production database URLs, OAuth secrets, Stripe secrets, or webhook secrets
- Private billing state or operator console exports
- Outreach batches, lead lists, or internal launch notes

Report security issues privately through the hosted product contact path or the
GitHub Security policy in this repository.
