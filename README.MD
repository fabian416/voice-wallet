# Walll-E

Your AI Voice assistant powered by Verida AI & cheqd

How to run: 

1. Setup your enviroment variables (default db variables will work with compose db)
2. First you have to launch your postgres database (if you have docker installed you can just do)

```bash
    docker compose up
```

3. Run the server

```bash
    ce backend
    yarn install
    yarn dev
```

4. Run the frontend

```bash
    cd frontend
    npm install
    npm run dev
```

(Yes, we are using different package managers for each repo, if you have a prefered one please let us know we have an internal debate going on haha (npm vs pnpm vs yarn))

