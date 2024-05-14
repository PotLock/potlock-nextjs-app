## PotLock - NextJS App

PotLock application.

You can access BOS Potlock Version using one of the environments below:

- [Production](https://app.potlock.org/)
- [Staging](https://app.potlock.org/staging.potlock.near/widget/IndexLoader)

## Getting Started

```bash
# install dependencies
npm install;
# using the right node version
nvm use;
# then run the development server (create the .env.local file with its content first)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Env vars

Create an env file named `.env.local` at the root of the project with the following content:

```sh
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_NADABOT_CONTRACT_ID=v2new.staging.nadabot.near
NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID=social.near
```
