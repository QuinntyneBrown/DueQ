#!/usr/bin/env bash
#
# DueQ — one-shot Azure provisioning (cheapest tier targets)
#
# Resources (all in the same RG, all free or close to it):
#   - Azure SQL Database  → Free serverless tier if available, else Basic (~$5/mo)
#   - App Service Plan F1 → free, Linux, .NET 10
#   - Web App             → hosts the API
#   - Static Web App Free → hosts the Angular SPA
#
# Idempotent: re-running on an existing RG is safe; create commands tolerate
# already-existing resources.
#
# Prerequisites:
#   - `az login` already done
#   - DUEQ_SQL_PWD env var set (strong password — uppercase, lowercase, digit, symbol, >= 12 chars)
#
# Output: GitHub secrets to register on the repo for the workflow.

set -euo pipefail

RG="${DUEQ_RG:-dueq-rg}"
LOCATION="${DUEQ_LOCATION:-eastus2}"
SUFFIX="${DUEQ_SUFFIX:-$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 6)}"

SQL_SERVER="dueq-sql-${SUFFIX}"
SQL_DB="DueQ"
SQL_ADMIN_USER="${DUEQ_SQL_USER:-dueqadmin}"
SQL_ADMIN_PASSWORD="${DUEQ_SQL_PWD:?Set DUEQ_SQL_PWD (strong password)}"
PLAN_NAME="dueq-plan"
WEBAPP_NAME="dueq-api-${SUFFIX}"
SWA_NAME="dueq-ui-${SUFFIX}"

echo ">> Resource group: $RG ($LOCATION)"
az group create -n "$RG" -l "$LOCATION" -o none

echo ">> SQL server: $SQL_SERVER"
az sql server create -g "$RG" -n "$SQL_SERVER" -l "$LOCATION" \
  --admin-user "$SQL_ADMIN_USER" --admin-password "$SQL_ADMIN_PASSWORD" -o none

az sql server firewall-rule create -g "$RG" -s "$SQL_SERVER" \
  -n AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 -o none >/dev/null 2>&1 || true

echo ">> SQL database: $SQL_DB (trying free tier first)"
if ! az sql db create -g "$RG" -s "$SQL_SERVER" -n "$SQL_DB" \
    --edition GeneralPurpose --compute-model Serverless --family Gen5 --capacity 2 \
    --auto-pause-delay 60 --min-capacity 0.5 --use-free-limit 2>/dev/null; then
  echo "   Free serverless tier unavailable — falling back to Basic (~\$5/mo)"
  az sql db create -g "$RG" -s "$SQL_SERVER" -n "$SQL_DB" --service-objective Basic -o none
fi

echo ">> App Service plan: $PLAN_NAME (F1 free, Linux)"
az appservice plan create -g "$RG" -n "$PLAN_NAME" --sku F1 --is-linux -o none

echo ">> Web app: $WEBAPP_NAME"
az webapp create -g "$RG" -p "$PLAN_NAME" -n "$WEBAPP_NAME" --runtime "DOTNETCORE:10.0" -o none

CONN="Server=tcp:${SQL_SERVER}.database.windows.net,1433;Database=${SQL_DB};User ID=${SQL_ADMIN_USER};Password=${SQL_ADMIN_PASSWORD};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

az webapp config connection-string set -g "$RG" -n "$WEBAPP_NAME" \
  --connection-string-type SQLAzure --settings DueQ="$CONN" -o none

az webapp config appsettings set -g "$RG" -n "$WEBAPP_NAME" \
  --settings ASPNETCORE_ENVIRONMENT=Production -o none

echo ">> Static Web App: $SWA_NAME (Free)"
az staticwebapp create -g "$RG" -n "$SWA_NAME" -l "$LOCATION" --sku Free -o none

SWA_HOSTNAME=$(az staticwebapp show -g "$RG" -n "$SWA_NAME" --query defaultHostname -o tsv)
SWA_URL="https://${SWA_HOSTNAME}"
WEBAPP_URL="https://${WEBAPP_NAME}.azurewebsites.net"

echo ">> Wiring CORS: API → $SWA_URL"
az webapp config appsettings set -g "$RG" -n "$WEBAPP_NAME" \
  --settings "Cors__AllowedOrigins__0=${SWA_URL}" -o none

SWA_DEPLOY_TOKEN=$(az staticwebapp secrets list -g "$RG" -n "$SWA_NAME" --query properties.apiKey -o tsv)
WEBAPP_PUBLISH_PROFILE=$(az webapp deployment list-publishing-profiles -g "$RG" -n "$WEBAPP_NAME" --xml)

cat <<EOF

============================================================
  Provisioning complete.
============================================================

Frontend (SWA) : $SWA_URL
API (App Svc)  : $WEBAPP_URL

Register these as GitHub repository secrets
(Settings → Secrets and variables → Actions → New repository secret):

  AZURE_WEBAPP_NAME
  $WEBAPP_NAME

  DUEQ_API_BASE_URL
  $WEBAPP_URL

  AZURE_STATIC_WEB_APPS_API_TOKEN
  $SWA_DEPLOY_TOKEN

  AZURE_WEBAPP_PUBLISH_PROFILE
  (paste the entire XML block below, including the wrapping <publishData>)

----- AZURE_WEBAPP_PUBLISH_PROFILE -----
$WEBAPP_PUBLISH_PROFILE
----------------------------------------

Push to main to trigger the first deploy.
============================================================
EOF
