@echo off
rem ============================================================================
rem  run-local.bat
rem
rem  Builds the latest backend + frontend and runs DueQ locally so the app is
rem  usable end-to-end against a local SQL Server Express database.
rem
rem    Backend : http://localhost:5054  (DueQ.Api, http launch profile)
rem    Frontend: http://localhost:4200  (ng serve due-q)
rem    Database: Server=.\SQLEXPRESS;Database=DueQ  (created/migrated on startup)
rem
rem  The API applies EF Core migrations automatically on startup
rem  (Program.cs -> context.Database.MigrateAsync()), so no separate
rem  "dotnet ef database update" step is required here.
rem
rem  The backend and frontend each launch in their own window so their logs
rem  stay readable. Close a window to stop that process.
rem ============================================================================

setlocal

rem --- Resolve repo paths relative to this script (eng\scripts) -------------
set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%..\.." || (echo [ERROR] Could not resolve repo root.& exit /b 1)
set "ROOT=%CD%"
popd
set "BACKEND=%ROOT%\backend"
set "FRONTEND=%ROOT%\frontend"

echo ============================================================
echo  DueQ - local run
echo  Repo root: %ROOT%
echo ============================================================

rem --- 1. Build the backend solution ----------------------------------------
echo.
echo [1/4] Building backend (DueQ.sln)...
pushd "%BACKEND%"
dotnet build DueQ.sln
if errorlevel 1 (
    echo.
    echo [ERROR] Backend build failed.
    popd
    exit /b 1
)
popd

rem --- 2. Ensure frontend dependencies are installed ------------------------
echo.
echo [2/4] Checking frontend dependencies...
pushd "%FRONTEND%"
if not exist "node_modules" (
    echo node_modules not found - running npm install...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed.
        popd
        exit /b 1
    )
)

rem --- 3. Build the frontend libraries in dependency order ------------------
rem  tsconfig maps "api" and "components" imports to ./dist/<lib>, so the
rem  libraries must be built before the due-q app can resolve them.
echo.
echo [3/4] Building frontend libraries (api, then components)...
call npx ng build api
if errorlevel 1 (
    echo.
    echo [ERROR] Building 'api' library failed.
    popd
    exit /b 1
)
call npx ng build components
if errorlevel 1 (
    echo.
    echo [ERROR] Building 'components' library failed.
    popd
    exit /b 1
)
popd

rem --- 4. Launch backend + frontend -----------------------------------------
echo.
echo [4/4] Starting backend and frontend...

start "DueQ API (http://localhost:5054)" cmd /k ^
    "cd /d ""%BACKEND%"" && dotnet run --project src\DueQ.Api --launch-profile http --no-build"

rem  --host 0.0.0.0 binds all IPv4 interfaces (incl. 127.0.0.1). By default the
rem  dev server only binds IPv6 loopback (::1), so browsers that resolve
rem  "localhost" to 127.0.0.1 get "connection refused". Binding 0.0.0.0 makes
rem  http://localhost:4200/ work regardless of how localhost resolves.
rem  --open launches the browser once the first bundle finishes compiling
rem  (Angular's initial build takes a while - the page 404s/refuses until then).
start "DueQ Web (http://localhost:4200)" cmd /k ^
    "cd /d ""%FRONTEND%"" && npx ng serve due-q --host 0.0.0.0 --port 4200 --open"

echo.
echo ============================================================
echo  DueQ is starting up in two new windows:
echo    API : http://localhost:5054
echo    Web : http://localhost:4200
echo  Close either window to stop that process.
echo ============================================================

endlocal
exit /b 0
