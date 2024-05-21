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

## Folder Structure

Group by feature/modules. This structure offers a highly modular approach, defining clear boundaries for different aspects of the application within each module:

```
└── src/
    ├── constants.ts/
    ├── api/
    ├── app/
    |   ├── project/...
    |   ├── page.tsx
    |   ├── Providers.tsx
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
    │   │   └── utils.ts
    │   ├── project/
    │   │   ├── components/
    │   │   │   └── ProjectForm.tsx
    │   │   ├── hooks/
    │   │   │   └── useProjectInfo.ts
    │   │   ├── services/
    │   │   ├── state.ts
    │   │   └── utils.ts
    │   └── auth/
    │       ├── components/
    │       │   └── SignUpForm.tsx
    │       ├── hooks/
    │       │   └── useAuth.ts
    │       │   └── useWallet.ts
    │       ├── services/
    │       ├── state.ts
    │       └── utils.ts
    └── ...
```

### Top Level Items

- **constants**: Constant, unchanged values (e.g. export `export const POTLOCK_REGISTERY_LIST_ID = 1`).
- **api**: For logic that communicates with the server(s).
- **app**: nextjs app pages. Get to know more about how to route application here: [NextJS Routing](https://nextjs.org/docs/app/building-your-application/routing)
- **assets**: global app's assets.
- **store**: main redux state manager.
- **utils**: Utilities for universal logic that is not related to business logic or any technologies, e.g. string manipulations, mathematic calculations, DOM manipulations, HTML-related logic, localStorage, IndexedDB, etc.

### Core Modules (modules/core)

Global/main resources used over the app, all the shared items should be placed here.

### Feature Modules (modules/resource)

Each resource must be placed inside the modules folder.

### Modules Sub-items

- **components**: React components.
- **hooks**: Custom React hooks for shared logic.
- **utils.ts**: Same as the top level utils, but this is specific to modules.
- **services**: Encapsulates main business & application logic.
- **helpers**: Provides business-specific utilities.
- **state.ts**: Feature state (rematch/redux).
