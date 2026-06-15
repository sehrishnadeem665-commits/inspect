# Start-Database.ps1
# Windows PowerShell script to start local PostgreSQL or MySQL and verify connection
# Run: powershell -ExecutionPolicy Bypass -File Start-Database.ps1

param(
    [ValidateSet("PostgreSQL", "MySQL", "auto")]
    [string]$DatabaseType = "auto",
    [string]$PostgresUser = "postgres",
    [string]$PostgresDb = "postgres",
    [string]$MySQLUser = "root",
    [string]$MySQLPassword = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Database Server Startup Utility" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if PostgreSQL is running
function Test-PostgreSQL {
    try {
        $pgProcesses = Get-Process postgres -ErrorAction SilentlyContinue
        if ($pgProcesses) {
            Write-Host "✅ PostgreSQL is already running (PID: $($pgProcesses.Id -join ', '))" -ForegroundColor Green
            return $true
        }
    }
    catch {}
    return $false
}

# Function to start PostgreSQL
function Start-PostgreSQL {
    Write-Host "🔄 Attempting to start PostgreSQL..." -ForegroundColor Yellow
    
    # Check if PostgreSQL service exists
    $pgService = Get-Service -Name "postgresql-x64-*" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($pgService) {
        try {
            Start-Service -Name $pgService.Name
            Write-Host "✅ PostgreSQL service started successfully" -ForegroundColor Green
            Start-Sleep -Seconds 3
            return $true
        }
        catch {
            Write-Host "❌ Failed to start PostgreSQL service: $_" -ForegroundColor Red
            return $false
        }
    }
    else {
        Write-Host "⚠️  PostgreSQL service not found" -ForegroundColor Yellow
        Write-Host "   Please ensure PostgreSQL is installed and the service is registered" -ForegroundColor Yellow
        return $false
    }
}

# Function to check if MySQL is running
function Test-MySQL {
    try {
        $mysqlProcesses = Get-Process mysqld -ErrorAction SilentlyContinue
        if ($mysqlProcesses) {
            Write-Host "✅ MySQL is already running (PID: $($mysqlProcesses.Id -join ', '))" -ForegroundColor Green
            return $true
        }
    }
    catch {}
    return $false
}

# Function to start MySQL
function Start-MySQL {
    Write-Host "🔄 Attempting to start MySQL..." -ForegroundColor Yellow
    
    # Check if MySQL service exists
    $mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($mysqlService) {
        try {
            Start-Service -Name $mysqlService.Name
            Write-Host "✅ MySQL service started successfully" -ForegroundColor Green
            Start-Sleep -Seconds 3
            return $true
        }
        catch {
            Write-Host "❌ Failed to start MySQL service: $_" -ForegroundColor Red
            return $false
        }
    }
    else {
        Write-Host "⚠️  MySQL service not found" -ForegroundColor Yellow
        Write-Host "   Please ensure MySQL is installed and the service is registered" -ForegroundColor Yellow
        return $false
    }
}

# Function to test PostgreSQL connection
function Test-PostgreSQLConnection {
    Write-Host "`n🧪 Testing PostgreSQL connection..." -ForegroundColor Cyan
    
    # Check if psql is available
    $psql = Get-Command psql -ErrorAction SilentlyContinue
    
    if (-not $psql) {
        Write-Host "⚠️  psql client not found in PATH" -ForegroundColor Yellow
        Write-Host "   Connection test skipped. Please add PostgreSQL bin directory to PATH" -ForegroundColor Yellow
        return
    }
    
    try {
        $output = psql -h localhost -U $PostgresUser -d $PostgresDb -c "\dt" 2>&1
        Write-Host "✅ PostgreSQL connection successful!" -ForegroundColor Green
        Write-Host "   Database: $PostgresDb | User: $PostgresUser" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ PostgreSQL connection failed: $_" -ForegroundColor Red
    }
}

# Function to test MySQL connection
function Test-MySQLConnection {
    Write-Host "`n🧪 Testing MySQL connection..." -ForegroundColor Cyan
    
    # Check if mysql is available
    $mysql = Get-Command mysql -ErrorAction SilentlyContinue
    
    if (-not $mysql) {
        Write-Host "⚠️  mysql client not found in PATH" -ForegroundColor Yellow
        Write-Host "   Connection test skipped. Please add MySQL bin directory to PATH" -ForegroundColor Yellow
        return
    }
    
    try {
        if ($MySQLPassword) {
            $output = mysql -h localhost -u $MySQLUser -p$MySQLPassword -e "SHOW TABLES;" 2>&1
        }
        else {
            $output = mysql -h localhost -u $MySQLUser -e "SHOW TABLES;" 2>&1
        }
        Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
        Write-Host "   User: $MySQLUser" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ MySQL connection failed: $_" -ForegroundColor Red
    }
}

# Auto-detect which database to use
if ($DatabaseType -eq "auto") {
    Write-Host "🔍 Auto-detecting database type..." -ForegroundColor Yellow
    
    if ((Test-PostgreSQL) -or (Get-Service -Name "postgresql-x64-*" -ErrorAction SilentlyContinue)) {
        $DatabaseType = "PostgreSQL"
    }
    elseif ((Test-MySQL) -or (Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue)) {
        $DatabaseType = "MySQL"
    }
    else {
        Write-Host "⚠️  Could not auto-detect database. Attempting PostgreSQL first..." -ForegroundColor Yellow
        $DatabaseType = "PostgreSQL"
    }
    
    Write-Host "📌 Using: $DatabaseType`n" -ForegroundColor Cyan
}

# Main logic
if ($DatabaseType -eq "PostgreSQL") {
    if (Test-PostgreSQL) {
        Write-Host "No action needed - PostgreSQL is running" -ForegroundColor Green
    }
    else {
        Start-PostgreSQL
    }
    Test-PostgreSQLConnection
}
elseif ($DatabaseType -eq "MySQL") {
    if (Test-MySQL) {
        Write-Host "No action needed - MySQL is running" -ForegroundColor Green
    }
    else {
        Start-MySQL
    }
    Test-MySQLConnection
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ Database startup check complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
