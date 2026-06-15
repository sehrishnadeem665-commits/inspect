@echo off
REM Start-Database.bat
REM Windows Batch script to start PostgreSQL or MySQL and verify connection
REM Run: Start-Database.bat

setlocal enabledelayedexpansion

echo.
echo ========================================
echo    Database Server Startup Utility
echo ========================================
echo.

REM Check for PostgreSQL process
tasklist /FI "IMAGENAME eq postgres.exe" 2>NUL | find /I /N "postgres.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] PostgreSQL is already running
    goto check_conn_pg
)

REM Check for MySQL process
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is already running
    goto check_conn_mysql
)

REM Try to start PostgreSQL service
echo.
echo [INFO] Attempting to start PostgreSQL...
net start "postgresql-x64-*" >NUL 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [OK] PostgreSQL service started
    timeout /t 3 /nobreak >NUL
    goto check_conn_pg
)

REM Try to start MySQL service
echo.
echo [INFO] Attempting to start MySQL...
net start "MySQL*" >NUL 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL service started
    timeout /t 3 /nobreak >NUL
    goto check_conn_mysql
)

echo.
echo [ERROR] Could not find running PostgreSQL or MySQL service
echo.
echo Options:
echo   1. Ensure PostgreSQL or MySQL is installed
echo   2. Check Services (services.msc) to verify the service exists
echo   3. Run this script as Administrator
echo.
goto end

:check_conn_pg
echo.
echo [INFO] Testing PostgreSQL connection...
psql -h localhost -U postgres -d postgres -c "\dt" >NUL 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [OK] PostgreSQL connection successful!
) else (
    echo [WARN] PostgreSQL connection test failed (psql not in PATH or connection refused)
)
goto end

:check_conn_mysql
echo.
echo [INFO] Testing MySQL connection...
mysql -h localhost -u root -e "SHOW TABLES;" >NUL 2>&1
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL connection successful!
) else (
    echo [WARN] MySQL connection test failed (mysql not in PATH or connection refused)
)
goto end

:end
echo.
echo ========================================
echo Database startup check complete
echo ========================================
echo.
