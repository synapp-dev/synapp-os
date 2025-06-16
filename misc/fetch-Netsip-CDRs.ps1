param (
  [string]$User,
  [string]$Password,
  [string]$SupabaseUrl,
  [string]$SupabaseServiceRoleKey
)

# Configuration
$Date = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
$Url = "https://portal.overthewire.com.au/voice/cdrs/11282/$Date"
$RpcUrl = "$SupabaseUrl/rest/v1/rpc/ingest_netsip_cdrs"
$LogPath = "logs/netsip-cdr-$Date.txt"
$Success = $false
$Retries = 3
$WaitSeconds = 10
$InsertedCount = 0
$ErrorMessage = ""

# Retry wrapper function
function Retry-Block($Label, [ScriptBlock]$Block) {
  for ($i = 1; $i -le $Retries; $i++) {
    try {
      & $Block
      return $true
    } catch {
      Write-Warning "$Label failed (attempt $i of $Retries): $_"
      Start-Sleep -Seconds $WaitSeconds
    }
  }
  return $false
}

# Step 1: Fetch CDRs from Netsip
$CDRContent = ""
$netsipSuccess = Retry-Block "Fetch CDRs" {
  $SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
  $Creds = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $User, $SecurePassword
  $Response = Invoke-WebRequest -Uri $Url -Credential $Creds -UseBasicParsing
  $CDRContent = $Response.Content
}

if (-not $netsipSuccess) {
  $ErrorMessage = "Failed to fetch CDRs after $Retries attempts."
  goto SaveLog
}

# Step 2: Supabase RPC call
$Headers = @{
  "apikey"        = $SupabaseServiceRoleKey
  "Authorization" = "Bearer $SupabaseServiceRoleKey"
  "Content-Type"  = "application/json"
}

$BodyObject = @{
  "payload"      = $CDRContent
  "trigger_type" = "automatic"
  "triggered_by" = $null
}

$Body = $BodyObject | ConvertTo-Json -Compress -Depth 3

$supabaseSuccess = Retry-Block "Supabase RPC" {
  $RpcResponse = Invoke-RestMethod -Uri $RpcUrl -Method POST -Body $Body -Headers $Headers
  $InsertedCount = $RpcResponse.inserted
  $Success = $true
}

if (-not $supabaseSuccess) {
  $ErrorMessage = "Failed to ingest via Supabase after $Retries attempts."
}

:SaveLog
# Step 3: Write summary log
$LogContent = @"
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Status: $($Success -eq $true ? "SUCCESS" : "FAILURE")
Records Inserted: $InsertedCount
Error: $ErrorMessage
"@

New-Item -ItemType Directory -Force -Path "logs" | Out-Null
$LogContent | Set-Content -Path $LogPath -Encoding UTF8

# Exit status for GitHub Actions
if (-not $Success) {
  Write-Error $ErrorMessage
  exit 1
}
