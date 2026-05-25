# Azure deployment

Cheapest viable Azure footprint for DueQ:

| Resource              | Tier                           | Cost                   |
| --------------------- | ------------------------------ | ---------------------- |
| Azure SQL Database    | Free serverless (32 GB)        | $0 (Basic ~$5 fallback) |
| App Service Plan      | F1 (Linux)                     | $0                     |
| Web App (API)         | F1                             | $0 (shared CPU)        |
| Static Web App (SPA)  | Free                           | $0                     |

Total: **$0/month** in the happy path (SQL Free tier available); **~$5/month** if the
subscription/region doesn't offer the Free SQL serverless tier and it falls back to Basic.

## One-time provisioning

```bash
# 1. Sign in
az login

# 2. Set a strong SQL admin password (>=12 chars, upper/lower/digit/symbol)
export DUEQ_SQL_PWD='ChangeMe-Now!42'

# 3. Run the provision script (Git Bash on Windows, or any bash shell)
bash infra/azure-provision.sh
```

The script prints the four secrets you need to register on the GitHub repo
under **Settings → Secrets and variables → Actions**:

- `AZURE_WEBAPP_NAME` — the API web app name
- `DUEQ_API_BASE_URL` — public URL of the API
- `AZURE_STATIC_WEB_APPS_API_TOKEN` — SWA deployment token
- `AZURE_WEBAPP_PUBLISH_PROFILE` — full XML publish profile (multi-line)

## Continuous deployment

`.github/workflows/deploy.yml` runs on every push to `main`:

1. Publishes the .NET API and deploys to App Service via the publish profile.
2. Builds the Angular workspace (`api` lib → `components` lib → `due-q` app)
   with `DUEQ_API_BASE_URL` baked into `environment.ts`.
3. Uploads the built SPA to the Static Web App.

Trigger a deploy manually from **Actions → Deploy to Azure → Run workflow**.

## Database migrations

The API runs `Database.MigrateAsync()` on startup against the connection string
in the `DueQ` app setting. The first deploy creates the schema automatically; no
extra step needed. Seeding is opt-in via the local CLI (`docq reset-database --yes --seed`)
and is never auto-applied.

## Notes & caveats

- **F1 plan limits**: shared CPU (60 minutes/day), 1 GB RAM, no Always On, 165 MB/day
  outbound. Fine for a two-person split-bill app. First request after idle may cold-start
  for several seconds.
- **SQL serverless auto-pause**: 1-hour idle pause is set. First request after pause
  takes ~10s while the DB warms up.
- **.NET 10 runtime**: if Linux App Service hasn't surfaced .NET 10 yet in your region,
  edit the `--runtime` argument in `azure-provision.sh` and the workflow to `DOTNETCORE:9.0`
  *and* change `<TargetFramework>net10.0</TargetFramework>` to `net9.0` in the API csproj,
  *or* publish self-contained: append `-r linux-x64 --self-contained true` to the
  `dotnet publish` step in the workflow.
- **CORS**: the provision script seeds `Cors__AllowedOrigins__0` with the SWA URL.
  Add more origins by setting `Cors__AllowedOrigins__1`, `__2`, ... via
  `az webapp config appsettings set`.
- **Tearing down**: `az group delete -n dueq-rg --yes` removes everything.
