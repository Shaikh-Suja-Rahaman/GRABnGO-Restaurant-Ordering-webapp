# Dockerizing the Restaurant Ordering Web App

Build images locally:

```bash
docker-compose build
```

Run services in background:

```bash
docker-compose up -d
```

Open the frontend at http://localhost:3000 and the backend API at http://localhost:5000

To stop and remove containers:

```bash
docker-compose down
```

Swagger API docs (backend):

After building and running, open: http://localhost:5000/api-docs

If running backend locally (not via Docker) install new deps and start:

```bash
cd backend
npm install
npm run dev
```

If you change backend dependencies, rebuild images:

```bash
docker-compose build backend
docker-compose up -d

Notes about ports and Render deploys

- The backend listens on the port provided by `process.env.PORT` (or `5000` by default in container). This is important for deployment platforms like Render which inject a runtime `PORT` value — do not hardcode a different port in the source.
- Locally we map host port `5001` to the backend container port `5000` (see `docker-compose.yml`). So when running via Docker, open Swagger at: http://localhost:5001/api-docs
- If you deploy to Render, set the `PORT` environment variable there if required, or leave it unset — Render will set it automatically.

To prepare for Render:

1. Commit code that reads `process.env.PORT || 5000` (already done).
2. Provide any required secrets in Render's dashboard (e.g., `MONGO_URI`, `JWT_SECRET`).
3. Use a Docker deploy or a native Node service; both will work as long as the app binds to the provided `PORT`.

```
