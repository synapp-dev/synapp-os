param (
  [string]$User,
  [string]$Password,
  [string]$SupabaseUrl,
  [string]$SupabaseServiceRoleKey
)

# Construct request URLs
$Date = (Get-Date).AddDays(-50).ToString("yyyy-MM-dd")
$CDRUrl = "https://portal.overthewire.com.au/voice/cdrs/11282/$Date"
$SupabaseRpcUrl = "$SupabaseUrl/rest/v1/rpc/ingest_netsip_cdrs"

# Authenticate to Netsip
$SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
$Creds = New-Object System.Management.Automation.PSCredential($User, $SecurePassword)

# Fetch CDR content
try {
  $Response = Invoke-WebRequest -Uri $CDRUrl -Credential $Creds -UseBasicParsing
  $CDRContent = $Response.Content
  Write-Output "✅ Successfully fetched CDRs from Netsip."
} catch {
  Write-Error "❌ Failed to fetch CDRs from Netsip: $_"
  exit 1
}

# Prepare Supabase headers and payload
$Headers = @{
  "apikey"        = $SupabaseServiceRoleKey
  "Authorization" = "Bearer $SupabaseServiceRoleKey"
  "Content-Type"  = "application/json"
}

$Payload = @{
  "payload"      = $CDRContent
  "trigger_type" = "automatic"
  "triggered_by" = $null
} | ConvertTo-Json -Compress -Depth 3

# Send to Supabase
try {
  $RpcResponse = Invoke-RestMethod -Uri $SupabaseRpcUrl -Method POST -Headers $Headers -Body $Payload
  Write-Output "✅ Supabase RPC call succeeded: $($RpcResponse | ConvertTo-Json -Depth 2)"
} catch {
  Write-Error "❌ Supabase RPC call failed: $_"
  exit 1
}
