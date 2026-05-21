# Security Boundary

This public repository is intentionally narrow.

## Public

- MCP bridge source code
- MCP manifest copy
- JSON-RPC examples
- Setup documentation
- Security boundary documentation

## Hosted and private

- SwitchSignal account database
- Customer workspaces, watchlists, snapshots, reports, outcomes, and billing
- Production credentials and provider project IDs
- Private evidence history and operator-only workflow
- Outreach batches and lead lists

## Key handling

Use local environment variables or your agent client's secret storage. Do not
commit MCP keys, bearer tokens, OAuth secrets, database URLs, Stripe secrets,
webhook secrets, private keys, customer data, or logs.
