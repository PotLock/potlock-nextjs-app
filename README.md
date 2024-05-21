## PotLock - NextJS App

PotLock application.

You can access BOS Potlock Version using one of the environments below:

- [Production](https://app.potlock.org/)
- [Staging](https://app.potlock.org/staging.potlock.near/widget/IndexLoader)

## Getting Started

```bash
# using the right node version
nvm use;
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

This project is using a indexer service. You can access its docs here: https://github.com/PotLock/django-indexer?tab=readme-ov-file#api-endpoints

**URI**: `http://ec2-100-27-57-47.compute-1.amazonaws.com/api/v1`

## Folder Structure

Group by feature/modules. This structure offers a highly modular approach, defining clear boundaries for different aspects of the application within each module:

```
└── src/
    ├── api/
    ├── app/
    |   ├── project/...
    |   ├── page.tsx
    |   ├── Providers.tsx
    ├── constants.ts
    ├── contracts/
    |   ├── potlock/
    │       ├── interfaces/
    │       │   └── lists.interfaces.ts
    │       └── lists.ts
    ├── assets/
    ├── store/
    ├── utils/
    ├── modules/
    |   ├── core/
    │   │   ├── components/
    │   │   ├── common/
    │   │   │   |── avatar.tsx
    │   │   │   └── button.tsx
    │   │   ├── hooks/
    │   │   ├── helpers/
    │       ├── types.d.ts
    │   │   └── utils.ts
    │   ├── project/
    │   │   ├── components/
    │   │   │   |── ProjectForm.tsx
    │   │   │   └── ProjectForm.test.tsx
    │   │   ├── hooks/
    │   │   │   |── useProjectInfo.ts
    │   │   │   └── useProjectInfo.test.ts
    │   │   ├── services/
    │   │   ├── state.ts
    │       ├── types.d.ts
    │   │   └── utils.ts
    │   └── auth/
    │       ├── components/
    │       │   |── SignUpForm.tsx
    │       │   └── SignUpForm.test.tsx
    │       ├── hooks/
    │       │   |── useAuth.ts
    │       │   |── useAuth.test.ts
    │       │   └── useWallet.ts
    │       ├── services/
    │       ├── state.ts
    │       ├── types.d.ts
    │       └── utils.ts
    └── ...
```

### Top-Level Items

- **constants**: Constant, unchanged values (e.g. export `export const POTLOCK_REGISTERY_LIST_ID = 1`).
- **contracts**: Smart Contract services and their interfaces.
- **api**: For logic that communicates with the server(s).
- **app**: nextjs app pages. Get to know more about how to route application here: [NextJS Routing](https://nextjs.org/docs/app/building-your-application/routing)
- **assets**: global app's assets.
- **store**: main redux state manager.
- **utils**: Utilities for universal logic that is not related to business logic or any technologies, e.g. string manipulations, mathematic calculations, DOM manipulations, HTML-related logic, localStorage, IndexedDB, etc.
- **types.d.ts**: Used to create the shared types and interfaces within core module.

### Core Modules (modules/core)

Global/main resources used over the app, all the shared items should be placed here.

### Feature Modules (modules/resource)

Each resource must be placed inside the modules folder.

### Modules-Level Items

- **components**: React components.
- **hooks**: Custom React hooks for shared logic.
- **utils.ts**: Same as the top level utils, but this is specific to modules.
- **services**: Encapsulates main business & application logic.
- **helpers**: Provides business-specific utilities.
- **state.ts**: Feature state (rematch/redux).
- **types.d.ts**: Used to create the shared types and interfaces within this module.
