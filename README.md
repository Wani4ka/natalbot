# NathalBot

## Build
```
yarn
yarn build
rm -rf node_modules
yarn install --immutable --immutable-cache --check-cache
```

## Run
```
cp .env.example .env
# paste your bot token in .env file
node dist/bot.js
```
