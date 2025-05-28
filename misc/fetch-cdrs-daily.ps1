# Set credentials
$User = "admin@synfo.com.au"
$Password = "23789Shak1ng-p0pcorn@custodian"

# Get yesterday's date in the format YYYY-MM-DD
$Date = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")

# Update the URL with yesterday's date
$Url = "https://portal.overthewire.com.au/voice/cdrs/11282/$Date"

# Fetch the CDR data
$Credential = New-Object System.Management.Automation.PSCredential($User, (ConvertTo-SecureString $Password -AsPlainText -Force))
$Response = (Invoke-WebRequest -Uri $Url -Credential $Credential)

$Response.Content