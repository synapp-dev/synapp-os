# Get credentials from environment variables
$User = $env:NEXT_PUBLIC_ENCOO_USER
$Password = $env:NEXT_PUBLIC_ENCOO_PASSWORD

# Update the URL with yesterday's date
$BaseURL = "https://cdrapi.envoip.com.au/"

# Fetch Token
$TokenURL = "${BaseURL}getauth?username=$($User)&password=$($Password)"
$TokenResponse = (Invoke-WebRequest -Method POST -Uri $TokenURL -SkipCertificateCheck)
$UserToken = ($TokenResponse.Content | ConvertFrom-Json).user_token
$BearerToken = ($TokenResponse.Content | ConvertFrom-Json).access_token

# Get yesterday's date in the format YYYY-MM-DD
$StartDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")
$EndDate = (Get-Date).ToString("yyyy-MM-dd")

# Create Request URL (Standard CDRs)
$RequestURL = "$BaseURL/auth/mycdr?start_date=$($StartDate)&end_date=$($EndDate)&user_token=$($UserToken)&token=$($BearerToken)"

# Make API Request
$Request = Invoke-WebRequest -Uri $RequestURL -Method POST -Headers @{Authorization = "Bearer $($BearerToken)"} -SkipCertificateCheck

# Fetch the CDR data
($Request.Content | ConvertFrom-Json).data.call | Format-Table * -AutoSize

# Create Request URL (Special CDRs)
$RequestURL = "$BaseURL/auth/mycdrspecial?start_date=$($StartDate)&end_date=$($EndDate)&user_token=$($UserToken)&token=$($BearerToken)"

# Make API Request
$Request = Invoke-WebRequest -Uri $RequestURL -Method POST -Headers @{Authorization = "Bearer $($BearerToken)"} -SkipCertificateCheck

# Fetch the CDR data
($Request.Content | ConvertFrom-Json).data.call | Format-Table * -AutoSize