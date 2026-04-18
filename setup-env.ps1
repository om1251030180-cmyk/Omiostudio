# setup-env.ps1 - Helper script to set up .env from .env.example (Windows)
# Usage: .\setup-env.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔐 Omio Studio Security Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Skipped."
        exit 0
    }
}

# Copy template
Copy-Item ".env.example" -Destination ".env" -Force
Write-Host "✅ Created .env from .env.example" -ForegroundColor Green
Write-Host ""

# Verify .gitignore
$gitignoreContent = Get-Content ".gitignore" -Raw
if ($gitignoreContent -match "^\.env$") {
    Write-Host "✅ Verified: .env is in .gitignore" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: .env not in .gitignore" -ForegroundColor Red
    Write-Host "Add this line to .gitignore:"
    Write-Host "  .env"
    exit 1
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Edit .env with your credentials"
Write-Host "  2. Run: npm install"
Write-Host "  3. Run: npm start"
Write-Host ""
Write-Host "📌 Credentials needed:" -ForegroundColor Cyan
Write-Host "  • Twilio: https://www.twilio.com/console"
Write-Host "  • Gmail: https://myaccount.google.com/apppasswords"
Write-Host "  • JWT Secret: node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`""
Write-Host ""
Write-Host "Ready to go! Edit .env and add your credentials." -ForegroundColor Green
