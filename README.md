# PotLock - NextJS App

PotLock application built on NextJS featuring project exploration, pages, donations, and Pots (quadratic funding for now) on the NEAR Blockchain

To-Do
- Feeds
- Campaigns
- Lists

The backlog to the NextJS App can be found at https://potlock.org/next-backlog 

You can access BOS PotLock version using one of the environments below:

- [Production](https://bos.potlock.org/)
- [Staging](https://bos.potlock.org/staging.potlock.near/widget/IndexLoader)
= [Repo](https://github.com/potlock/bos-alem-app)

You can see original features https://potlock.notion.site/All-Features-Potlock-NextJS-App-5f543fa8b31840aa88bf5b8cf57ead3d?pvs=4 

Core contracts can be found at https://github.com/PotLock/core and documentation https://docs.potlock.io/contracts/contracts-overview 
## Development

### Getting Started

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

### DJango Indexer API

This project is using an indexer service.
You can access its docs here: <https://github.com/PotLock/django-indexer?tab=readme-ov-file#api-endpoints>

**URI**: <http://ec2-100-27-57-47.compute-1.amazonaws.com/api/v1>

**Swagger UI**: <https://dev.potlock.io/api/schema/swagger-ui/#/>

### Project Structure

Provides explicit separation between abstract and business-logic-heavy parts of the codebase,
for which it offers a highly modular approach, defining clear boundaries for different
aspects of the application within each module:

```sh

[ src/ ]
│
├── [ app ] <--- # Entry point of the application.
│   │            # Follows Nextjs App routing specification ( see link 1. )
│   │
│  ...
│   │
│   └── [ _store ] <--- # Application state root.
│                       # Uses Rematch state management library, based on Redux.
│
│
│
│
├── [ common ] <--- # Low-level foundation of the app, containing endpoint bindings,
│   │               # utility libraries, reusable primitives, and assets, used in layouts and
│   │               # business logic across the codebase. MUST NOT contain business logic by itself.
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
│
└── [ modules ] <--- # Business logic units broken down into categories. Simply put, this is
    │                # a collection of directories that contain code implementing specific
    │                # groups of app use cases and are named after functionalities they provide.
    │
   ...
    │
    │
    ├── [ core ] <--- # Follows the same structure as any other module, but contains business logic,
    │                 # that is shared between all or some of the other modules
    │
    ├── [ profile ] <--- # A feature-specific module
    │   │
    │   ├── constants.ts <--- # Module-specific static reusable values, e.g.
    │   │                       export const POTLOCK_REGISTRY_LIST_ID = 1
    │   │
    │   ├── models.ts <--- # Feature state definitions ( See link 3. )
    │   │                  # If this file grows over 300 LoC, consider turning it into a directory
    │   │                  # with the same name by applying code-splitting techniques.
    │   │
    │   ├── types.d.ts <--- # Module-specific shared types and interfaces
    │   │
    │   ├── [ components ] <--- # Feature-specific React components
    │   │
    │   ├── [ hooks ] <--- # Feature-specific React hooks
    │   │
    │   └── [ utils ] <--- # Feature-specific utilities, like value converters or validators
    │
    │
    ├── ...
    │
   ...

```

#### Links

1. [Nextjs Routing](https://nextjs.org/docs/app/building-your-application/routing)
2. [Shared layer from Feature-Sliced Design methodology](https://feature-sliced.design/docs/reference/layers#shared)
3. [Rematch models](https://rematchjs.org/docs/api-reference/models)

### Testing

We use Vitest testing framework coupled with React Testing Library to specifically target UI.

For details, please refer to the corresponding documentation resources:

- [Vitest API reference](https://vitest.dev/api/)
- [React Testing Library guideline](https://testing-library.com/docs/react-testing-library/example-intro)

#### Commands

Execute all unit tests:

```bash
yarn test:unit
```

Run dev server for unit tests:

```bash
yarn dev:test
```

#### File colocation

The project convention implies keeping the test scenarios alongside the code they're meant for
( See examples below ).

##### Pages

Tests for each page must be placed in `tests.tsx`
within the same directory where `page.tsx` is located:

```bash

─── [ app ]
    │
    ├── page.tsx <--- # Homepage ( URL "/" )
    │
    ├── tests.tsx <--- # Tests for Homepage
    │
    ├── [ pots ]
    │   │
    │   ├── page.tsx <--- # Pots page ( URL "/pots" )
    │   │
    │   └── tests.tsx <--- # Tests for Pots page
    │
    └── [ users ]
        │
        └── [ [userId] ]
            │
            ├── page.tsx <--- # User page ( e.g. "/users/builder.near" )
            │
            └── tests.tsx <--- # Tests for User page

```

##### Modules

For modules, we target specific implementation details:

```bash

─── [ modules ]
    │
    └── [ profile ] <--- # Profile module
        │
        ├── [ components ]
        │   │
        │   ├── ProfileCard.tsx <--- # Profile card component
        │   │
        │   └── ProfileCard.test.tsx <--- # Tests for profile card component
        │
        └── [ utils ]
            │
            ├── validation.ts <--- # Profile validation functions
            │
            └── validation.test.ts <--- # Profile validation tests

```


# Important Links
- All Potlock Links can be found at https://bento.me/potlock 
