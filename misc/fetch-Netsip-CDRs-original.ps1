param (
  [string]$User,
  [string]$Password
)

# Get yesterday's date in the format YYYY-MM-DD
$Date = (Get-Date).AddDays(-50).ToString("yyyy-MM-dd")

# Update the URL with yesterday's date
$Url = "https://portal.overthewire.com.au/voice/cdrs/11282/$Date"

# Fetch the CDR data
$SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
$Credential = New-Object System.Management.Automation.PSCredential($User, $SecurePassword)

try {
  $Response = Invoke-WebRequest -Uri $Url -Credential $Credential -UseBasicParsing
  $Response.Content
} catch {
  Write-Error "Failed to fetch CDRs: $_"
}
