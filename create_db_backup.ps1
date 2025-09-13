# VITAL 2.0 - Database Backup Script
# Creates PostgreSQL database dump

$ErrorActionPreference = "Stop"

# Get current timestamp for filename
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "vital2.0-database-$timestamp.sql"

Write-Host "=== VITAL 2.0 Database Backup ===" -ForegroundColor Green
Write-Host "Creating database backup..." -ForegroundColor Yellow

# Check for .env file
$envFile = "../.env"
if (Test-Path $envFile) {
    Write-Host "Reading database configuration from .env file..." -ForegroundColor Cyan
    
    # Read DATABASE_URL from .env file
    $envContent = Get-Content $envFile
    $dbUrl = ($envContent | Where-Object { $_ -match "^DATABASE_URL=" }) -replace "^DATABASE_URL=", ""
    
    if ($dbUrl) {
        Write-Host "Found DATABASE_URL" -ForegroundColor Green
        
        # Parse PostgreSQL URL
        if ($dbUrl -match "postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)") {
            $user = $matches[1]
            $password = $matches[2]
            $dbhost = $matches[3]
            $port = $matches[4]
            $database = $matches[5]
            
            Write-Host "Database details:" -ForegroundColor Cyan
            Write-Host "  Host: $dbhost" -ForegroundColor Gray
            Write-Host "  Port: $port" -ForegroundColor Gray
            Write-Host "  Database: $database" -ForegroundColor Gray
            Write-Host "  User: $user" -ForegroundColor Gray
            
            # Set password environment variable
            $env:PGPASSWORD = $password
            
            # Create database dump command
            $pgDumpCmd = "pg_dump -h $dbhost -p $port -U $user -d $database --no-password --verbose --clean --if-exists --create"
            
            Write-Host "Creating database dump..." -ForegroundColor Yellow
            
            try {
                # Execute pg_dump
                Invoke-Expression "$pgDumpCmd > $backupFile"
                
                if (Test-Path $backupFile) {
                    $fileSize = [math]::Round((Get-Item $backupFile).Length / 1KB, 2)
                    Write-Host "Database backup created successfully!" -ForegroundColor Green
                    Write-Host "  File: $backupFile" -ForegroundColor White
                    Write-Host "  Size: $fileSize KB" -ForegroundColor White
                } else {
                    Write-Host "Backup file was not created" -ForegroundColor Red
                }
            }
            catch {
                Write-Host "Error creating database backup: $($_.Exception.Message)" -ForegroundColor Red
                
                # Create manual backup instructions file
                $instructions = "VITAL 2.0 - Manual Database Backup Instructions`n"
                $instructions += "============================================`n`n"
                $instructions += "Database Connection Details:`n"
                $instructions += "- Host: $dbhost`n"
                $instructions += "- Port: $port`n"
                $instructions += "- Database: $database`n"
                $instructions += "- Username: $user`n"
                $instructions += "- Password: [see .env file]`n`n"
                $instructions += "Manual backup command:`n"
                $instructions += "pg_dump -h $dbhost -p $port -U $user -d $database > $backupFile`n"
                
                Set-Content "database_backup_instructions.txt" $instructions
                Write-Host "Manual backup instructions saved to: database_backup_instructions.txt" -ForegroundColor Yellow
            }
            finally {
                # Clear password variable
                Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
            }
        } else {
            Write-Host "Invalid DATABASE_URL format" -ForegroundColor Red
        }
    } else {
        Write-Host "DATABASE_URL not found in .env file" -ForegroundColor Red
    }
} else {
    Write-Host ".env file not found" -ForegroundColor Red
    Write-Host "Please create .env file with DATABASE_URL configuration" -ForegroundColor Yellow
}

Write-Host "Backup process complete" -ForegroundColor Green