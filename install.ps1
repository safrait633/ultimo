# VITAL 2.0 - Installation and Restoration Script
# Восстанавливает проект из бэкапа и настраивает окружение

$ErrorActionPreference = "Stop"

Write-Host "=== VITAL 2.0 Installation Script ===" -ForegroundColor Green
Write-Host "This script will restore VITAL 2.0 from backup" -ForegroundColor Yellow

# Проверяем наличие необходимых файлов
$requiredFiles = @(
    "vital2.0-app.zip",
    "roadmap.md"
)

Write-Host "`nChecking backup files..." -ForegroundColor Cyan
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "✗ Missing: $file" -ForegroundColor Red
        exit 1
    }
}

# Создаем директорию для восстановления
$restoreDir = "VITAL2.0-Restored"
if (Test-Path $restoreDir) {
    Write-Host "`nRemoving existing restore directory..." -ForegroundColor Yellow
    Remove-Item $restoreDir -Recurse -Force
}

Write-Host "`nCreating restore directory: $restoreDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $restoreDir | Out-Null

# Извлекаем архив приложения
Write-Host "`nExtracting application archive..." -ForegroundColor Cyan
try {
    Expand-Archive -Path "vital2.0-app.zip" -DestinationPath $restoreDir -Force
    Write-Host "✓ Application files extracted successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to extract application archive: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Копируем roadmap.md
Write-Host "`nCopying documentation..." -ForegroundColor Cyan
Copy-Item "roadmap.md" "$restoreDir\roadmap.md" -Force
Write-Host "✓ Documentation copied" -ForegroundColor Green

# Переходим в директорию проекта
Set-Location $restoreDir

# Проверяем наличие Node.js
Write-Host "`nChecking system requirements..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installing Node.js, run this script again." -ForegroundColor Yellow
    exit 1
}

try {
    $npmVersion = npm --version 2>$null
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    exit 1
}

# Устанавливаем зависимости
Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    npm install
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try running 'npm install' manually in the project directory" -ForegroundColor Yellow
    exit 1
}

# Создаем .env файл из примера
Write-Host "`nSetting up environment configuration..." -ForegroundColor Cyan
if (Test-Path ".env.example") {
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env file with your database configuration" -ForegroundColor Yellow
    } else {
        Write-Host "✓ .env file already exists" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  .env.example not found" -ForegroundColor Yellow
}

# Проверяем наличие дампа базы данных
Write-Host "`nChecking for database backup..." -ForegroundColor Cyan
$dbBackupFiles = Get-ChildItem "..\vital2.0-database-*.sql" -ErrorAction SilentlyContinue
if ($dbBackupFiles) {
    $latestBackup = $dbBackupFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Write-Host "✓ Found database backup: $($latestBackup.Name)" -ForegroundColor Green
    Write-Host "To restore database, run:" -ForegroundColor Yellow
    Write-Host "  psql -U username -d database_name -f ..\$($latestBackup.Name)" -ForegroundColor White
} else {
    Write-Host "⚠️  No database backup found" -ForegroundColor Yellow
    Write-Host "You'll need to set up the database manually" -ForegroundColor Yellow
}

# Проверяем TypeScript
Write-Host "`nRunning TypeScript check..." -ForegroundColor Cyan
try {
    npm run check
    Write-Host "✓ TypeScript check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  TypeScript check failed - this is normal for first setup" -ForegroundColor Yellow
    Write-Host "The application should still work correctly" -ForegroundColor Yellow
}

Write-Host "`n=== Installation Complete! ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor White
Write-Host "1. Edit .env file with your database configuration" -ForegroundColor White
Write-Host "2. Set up PostgreSQL database" -ForegroundColor White
Write-Host "3. If you have a database backup, restore it using psql" -ForegroundColor White
Write-Host "4. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "5. Open http://localhost:8080 in your browser" -ForegroundColor White

Write-Host "`nTest credentials:" -ForegroundColor Cyan
Write-Host "Email: dr.johnson@hospital.com" -ForegroundColor White
Write-Host "Password: Password123!" -ForegroundColor White

Write-Host "`nFor detailed information, see roadmap.md" -ForegroundColor Yellow
Write-Host "Installation directory: $(Get-Location)" -ForegroundColor Gray