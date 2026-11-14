# Pot maintenance

Pot service mode is set to `indefinite-maintenance` in
`src/common/_config/pot-service.ts`. It has no expiry or browser-side override.

The application boundary renders the maintenance screen for `/pots`, `/deploy`,
and every `/pot/*` route before mounting page layouts, transaction modals or
callback handlers. `/pots/history` provides read-only round records. Old Pot URLs
remain valid and display read-only round details when the indexer is available.
Public source links remain available when the indexer is unavailable.

All Pot client writes and deployment quotes are guarded. Direct-wallet and DAO
application/contribution handlers are guarded before submission. Pot election
voting is blocked after a read-only election-type lookup; non-Pot elections are
unchanged. Payout justification publication is blocked before upload. Donation
matching selectors exclude Pots, and stale Pot allocations are rejected instead
of being rerouted. Pot wallet-return parameters do not show success dialogs.

This changes application behavior only. It does not stop deployed contracts,
third-party applications or previously created DAO proposals.

## Validation

```sh
yarn typecheck
yarn test:unit _tests/pot-safety.tests.ts _tests/pot-form-safety.tests.ts \
  _tests/pot-maintenance.tests.tsx _tests/pot-voting-maintenance.tests.ts
yarn build
```

Check `/pots`, `/deploy`, `/pot/example.near/settings?done=true`, a historical Pot
URL and `/pots/history` on desktop and mobile. Check that no transaction controls
appear, source links work without signing in, and an unavailable indexer leaves
the notice usable. Check unrelated direct-donation and campaign/list navigation.

Reopening is an intentional reviewed code/configuration release after replacement
contracts and their app integration are verified. The legacy factory namespace
block in `src/common/contracts/core/pot/safety.ts` remains independent of service
mode; changing the mode alone does not unblock those contracts. Rollback should
use a maintenance-enabled release, rather than enabling Pot transactions again.
