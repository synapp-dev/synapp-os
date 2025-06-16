# Function to load environment variables from .env.local
function Load-EnvFile {
    $envPath = Join-Path $PSScriptRoot ".." ".env.local"
    if (Test-Path $envPath) {
        Get-Content $envPath | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                $name = $matches[1]
                $value = $matches[2]
                [Environment]::SetEnvironmentVariable($name, $value, 'Process')
            }
        }
        Write-Host "Environment variables loaded successfully!" -ForegroundColor Green
    } else {
        Write-Host "Warning: .env.local file not found at $envPath" -ForegroundColor Yellow
    }
}

# Load the environment variables
Load-EnvFile 