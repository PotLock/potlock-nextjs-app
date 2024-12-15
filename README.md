# PotLock Next

PotLock frontend application built on NextJS featuring project exploration, pages, donations, and Pots (quadratic funding for now) on the NEAR Blockchain

The backlog to the NextJS App can be found at <https://potlock.org/next-backlog>

You can access BOS PotLock version using one of the environments below:

- [Production](https://bos.potlock.org/)
- [Staging](https://bos.potlock.org/staging.potlock.near/widget/IndexLoader)
- [Repo](https://github.com/potlock/bos-alem-app)

You can see original features <https://potlock.notion.site/All-Features-Potlock-NextJS-App-5f543fa8b31840aa88bf5b8cf57ead3d?pvs=4>

Core contracts can be found at <https://github.com/PotLock/core>
Contract documentation: <https://docs.potlock.io/contracts/contracts-overview>

## Getting Started

### IDE setup

First, make sure to install **every extension** from the "recommended" section of VSCode extension panel!

### Environment setup

```bash
# using the right node version
nvm use;
# enable Yarn support
corepack enable;
# create config for environment variables
cp .env.example .env.local;
# if required, edit .env.local
# then run the development server ( dependencies will be installed automatically )
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend ( Indexer API )

Swagger docs: <https://test-dev.potlock.io/api/schema/swagger-ui/#/>

**URI**: <http://ec2-100-27-57-47.compute-1.amazonaws.com/api/v1>

**Swagger UI**: <https://dev.potlock.io/api/schema/swagger-ui/#/>

## Dependencies

### UnoCSS

More performant and flexible drop-in replacement for Tailwind CSS, created by [Anthony Fu](https://antfu.me)

[Documentation](https://unocss.dev)

### Nice Modal

Versatile abstraction for modals

[Documentation](https://github.com/eBay/nice-modal-react?tab=readme-ov-file#nice-modal)
[Examples](https://opensource.ebay.com/nice-modal-react/)

### React Truncate

Painless dynamic text truncation

[Documentation](https://truncate.js.org/reference/middle-truncate/)

## Project Structure

The architectural doctrine of the project is heavily based on [Feature-Sliced Design](https://feature-sliced.design/docs/reference/layers).
This provides explicit separation between abstract and business-logic-heavy parts of the codebase,
for which it offers a highly modular approach, defining clear boundaries for different
aspects of the application within each module:

```sh

[ src/ ]
│
├── global.d.ts <--- # Globally available type definitions
│
│
│
├── [ common ] <--- # Low-level foundation of the app, containing endpoint bindings,
│   │               # utility libraries, reusable primitives, and assets, used in layouts and
│   │               # business logic across the codebase. MUST NOT contain business logic by itself.
│   │               # AKA "shared" ( see link 1. )
│   │
│   ├── constants.ts <--- # Static reusable values, e.g.
│   │                      export const NATIVE_TOKEN_ID = "near";
│   │                      export const MAX_GAS = 100;
│   │
│   ├── [ api ] <--- # Basic network and data layer
│   │
│   ├── [ assets ] <--- # Globally used assets, e.g. images or icons
│   │
│   ├── [ contracts ] <--- # Smart contract services and interfaces
│   │
│   ├── [ hooks ] <--- # Shared React hooks for low-level functionalities
│   │
│   ├── [ lib ] <--- # Universal utilities, e.g. string manipulations,
│   │                # mathematic calculations, browser API bindings, etc.
│   │
│   └── [ ui ] <--- # Project UI kit
│       │
│       ├── [ components ] <--- # React components implementing UI design primitives
│       │
│       └── [ utils ] <--- # UI-specific utilities, like DOM manipulations
│                          # or TailwindCSS class transformers
│
│
│
├── [ entities ] <--- # Business units organized into codebase slices ( See link 2. )
│   │
│  ...
│   │
│   │
│   ├── [ pot ] <--- # An entity-specific codebase slice
│   │   │
│   │   ├── index.ts <--- # Entry point for public exports ( available for external use )
│   │   │
│   │   ├── constants.ts <--- # Module-specific static reusable values, e.g.
│   │   │                       export const POT_MIN_NAME_LENGTH = 3;
│   │   │
│   │   ├── model.ts <--- # Entity state definitions ( See link 4. )
│   │   │
│   │   ├── types.ts <--- # Entity-specific shared types and interfaces
│   │   │
│   │   ├── [ components ] <--- # Entity-specific React components
│   │   │
│   │   ├── [ hooks ] <--- # Entity-specific React hooks
│   │   │
│   │   └── [ utils ] <--- # Entity-specific utilities, like value converters or validators
│   │
│   │
│   ├── ...
│   │
│  ...
│
│
│
├── [ features ] <--- # A collection of codebase slices implementing various use cases
│   │                 # and are named after functionalities they provide. ( See link 3. )
│   │
│  ...
│   │
│   │
│   ├── [ donation ] <--- # A feature-specific module
│   │   │
│   │   ├── index.ts <--- # Entry point for public exports ( available for external use )
│   │   │
│   │   ├── constants.ts <--- # Module-specific static reusable values, e.g.
│   │   │                       export const DONATION_MIN_NEAR_AMOUNT = 0.1;
│   │   │
│   │   ├── model.ts <--- # Feature state definitions ( See link 4. )
│   │   │
│   │   ├── types.ts <--- # Feature-specific shared types and interfaces
│   │   │
│   │   ├── [ components ] <--- # Feature-specific React components
│   │   │
│   │   ├── [ hooks ] <--- # Feature-specific React hooks
│   │   │
│   │   └── [ utils ] <--- # Feature-specific utilities, like value converters or validators
│   │
│   │
│   ├── ...
│   │
│  ...
│
│
│
├── [ layout ] <--- # Since Next's Pages Router doesn't support non-routable page subdirectories
│   │               # ( components / hooks ), layout composition is addressed in this layer.
│   │               # It allows to keep complex page-related UI elements that combine
│   │               # ( A pattern where each page's tab is treated by the router as a sub-page )
│  ...              # more than one feature and/or entity without introducing cross-imports
│   │               # within those codebase slices, which helps to avoid circular dependencies.
│   │               # In addition to conditional redirects, it addresses the routable tab navigation 
│   │               # ( A pattern where each page's tab is treated by the router as a sub-page )
│   │
│   ├── [ pot ]
│   │   │
│   │   ├── [ components ] <--- # ONLY components specific to the pages within the /pot namespace.
│   │   │
│   │   └── [ hooks ] <--- # ONLY hooks specific to the pages within the /pot namespace.
│   │
│  ...
│
│
│
├── [ pages ] <--- # Entry point of the application.
│                  # Follows Nextjs Pages routing specification ( see link 5. )
│
│
│   # TODO: Should be gradually refactored into separate Zustand stores and SWR hooks
└── [ store ] <--- # Shared application state root.
                   # Uses Rematch state management library, based on Redux.

```

### Links

1. [Shared layer from Feature-Sliced Design methodology](https://feature-sliced.design/docs/reference/layers#shared)
2. [Entities layer specification](https://feature-sliced.design/docs/reference/layers#entities)
3. [Features layer specification](https://feature-sliced.design/docs/reference/layers#features)
4. [Rematch models](https://rematchjs.org/docs/api-reference/models)
5. [Nextjs Routing](https://nextjs.org/docs/pages/building-your-application/routing)

## Testing

We use Vitest testing framework coupled with React Testing Library to specifically target UI.

For details, please refer to the corresponding documentation resources:

- [Vitest API reference](https://vitest.dev/api/)
- [React Testing Library guideline](https://testing-library.com/docs/react-testing-library/example-intro)

All tests should be located in the `_tests/` directory. ... for each specific page or group of use cases.

```bash

[ _tests/ ]
│
├── donation.tests.tsx <--- # Tests for donation scenarios
│
├── homepage.tests.tsx <--- # Tests for the homepage
│
...
│
└── test-env.tsx <--- # Testing environment setup

```

### Commands

Execute all unit tests:

```bash
yarn test:unit
```

Run dev server for unit tests:

```bash
yarn dev:test
```
