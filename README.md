## PotLock - NextJS App

PotLock application.

You can access BOS Potlock Version using one of the environments below:

- [Production](https://app.potlock.org/)
- [Staging](https://app.potlock.org/staging.potlock.near/widget/IndexLoader)

## Getting Started

```bash
# using the right node version
nvm use;
# enable Yarn support
corepack enable
# install dependencies
yarn install;
# then run the development server (create the .env.local file with its content first)
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Env vars

Create an env file named `.env.local` at the root of the project with the following content:

```sh
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_NADABOT_CONTRACT_ID=v2new.staging.nadabot.near
NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID=social.near
```

## DJango Indexer API

This project is using a indexer service. You can access its docs here: <https://github.com/PotLock/django-indexer?tab=readme-ov-file#api-endpoints>

**URI**: `http://ec2-100-27-57-47.compute-1.amazonaws.com/api/v1`

## Project Structure

Maintains explicit separation between abstract and business-logic-heavy parts of the codebase.
This structure offers a highly modular approach, defining clear boundaries for different aspects of the application within each module:

```sh
[ src/ ]
│
├── [ app ] <--- # Entry point of the application. Follows Nextjs App routing specification ( see link 1. )
│   │
│  ...
│   │
│   └── [ _store ] <--- # Application state root. Uses Redux state management library
│
│
│
│
│
├── [ common ] <--- # Low-level foundation of the app, containing endpoint bindings, utility libraries, reusable primitives,
│   │               # and assets, used in layouts and business logic across the codebase. MUST NOT itself contain business logic.
│   │               # AKA "shared" ( see link 2. )
│   │
│   ├── constants.ts <--- # Static reusable values, e.g.
│   │                      export const DEFAULT_NETWORK = "testnet"
│   │                      export const MAX_GAS = 100
│   │
│   ├── [ api ] <--- # Facilitates network interaction with backend(s)
│   │
│   ├── [ assets ] <--- # Globally used assets, e.g. images or icons
│   │
│   ├── [ contracts ] <--- # Smart contract services and interfaces
│   │
│   ├── [ hooks ] <--- # Shared React hooks for low-level functionalities
│   │
│   ├── [ lib ] <--- # Universal utilities, e.g. string manipulations, mathematic calculations, browser API bindings, etc.
│   │
│   └── [ ui ] <--- # Project UI kit
│       │
│       ├── [ components ] <--- # React components implementing UI design primitives
│       │
│       └── [ utils ] <--- # UI-specific utilities, like DOM manipulations or TailwindCSS class transformers
│
│
│
│
│
└── [ modules ] <--- # Business logic units broken down into categories.
    │                # Simply put, this is a collection of directories that contain code implementing specific
    │                # groups of app use cases and are named after functionalities they provide.
    │
    ├── auth
    │
    ├── [ core ] <--- # Follows the same structure as any other module, but contains business logic,
    │                 # that is shared between all or some of the other modules
    │
    ├── [ profile ] <--- # A feature-specific module
    │   │
    │   ├── constants.ts <--- # Module-specific static reusable values, e.g.
    │   │                       export const POTLOCK_REGISTRY_LIST_ID = 1
    │   │
    │   ├── state.ts <--- # Feature state (rematch/redux)
    │   │
    │   ├── types.d.ts <--- # Module-specific shared types and interfaces
    │   │
    │   ├── [ components ] <--- # Feature-specific React components
    │   │
    │   ├── [ hooks ] <--- # Feature-specific React hooks
    │   │
    │   ├── [ lib ] <--- # Feature-specific utilities, like value converters or validators
    │   │
    │   └── [ services ] <--- # Data-centric # TODO
    │
    │
    ├── ...
    │
   ...

```

### Links

1. [Nextjs Routing](https://nextjs.org/docs/app/building-your-application/routing)
2. [Shared layer from Feature-Sliced Design methodology](https://feature-sliced.design/docs/reference/layers#shared)
