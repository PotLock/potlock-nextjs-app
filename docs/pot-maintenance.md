# Historical Pots during maintenance

Pot service mode remains `indefinite-maintenance` in
`src/common/_config/pot-service.ts`, with no expiry or browser override.

## Visitor flow

`/pots`, `/pots/history` and the homepage expose historical Pot cards in a
swipeable carousel with arrow controls. Cards link to `/pot/<account>` inside
the app. The route boundary renders a dedicated read-only dashboard, never the
original transaction page, callback handlers or admin layout. On arrival, a
historical/maintenance dialog explains the status. “View historical data”
dismisses it and focuses the page heading. A permanent notice remains visible,
and the dialog can be reopened. NearBlocks opens the exact account in a new tab.

The dashboard displays public and matching donations, gross/net NEAR amounts,
unique donor/sponsor counts, application status counts,
matching payout allocations and recorded payment status, round dates, roles and
fees. Monthly totals and status tables paginate locally. Individual wallet/transaction
records remain on NearBlocks; donor, applicant and payout-recipient identities
are not republished in this repository or the app snapshots.

## Data provenance

The snapshot at finalized mainnet block 224508089 contains 4,130 recorded
donations and 241 applications across all ten factory-listed Pots. Summary
metrics are included in `historical-pots.snapshot.json`. Each Pot's aggregate historical
metrics are loaded separately from `public/pot-history/<account>.json` to keep
the catalog bundle small. Capture time and block height are visible in the UI.
These are historical contract ledger records, not current spendable balances or
independent confirmation of transfers/refunds. No historical USD estimates use
today's exchange rate. The mainnet snapshot is not displayed on testnet.

Reproduce the capture with `python3 scripts/capture-pot-history.py`. The script
uses only public RPC view calls, pins every read to one finalized block,
paginates all donations/applications, checks record counts and duplicate IDs,
and writes only after all captures succeed. Only aggregate amounts, counts and period/status summaries are published.
Individual donor, applicant and recipient identities and free-text messages are
omitted. The client validates the account and block before
using a detail file. If it fails, saved summary metrics and explorer/source
links remain usable. Unknown accounts show an unavailable-record message.

## Transaction containment

All Pot client writes and deployment quotes remain guarded. Direct-wallet and
DAO application/contribution handlers reject before submission. Pot election
voting is blocked after a read-only type lookup; non-Pot elections are unchanged.
Payout justification publication is blocked before upload. Donation matching
selectors exclude Pots, and stale Pot allocations are rejected. Wallet-return
parameters cannot mount a success dialog through an original Pot page.
`/deploy` continues to show maintenance. This frontend change does not pause
deployed contracts or third-party applications.

Reopening requires a reviewed release after replacement contracts and integration
are verified. The legacy factory namespace block in `pot/safety.ts` is independent
of service mode and remains blocked if service mode changes.

## Verification

Run `NEXT_PUBLIC_ENV=test yarn test:unit`, `yarn typecheck` and
`NEXT_PUBLIC_ENV=production yarn build`. Reconciliation tests check all captured
records against the summary counts and exact integer amounts. Browser checks
cover carousel arrows, swipe-sized mobile layout, card navigation, automatic
notice, dismiss/reopen, metrics and table pagination, direct Pot/admin URLs,
unknown accounts, and the retained deployment/write guards.
