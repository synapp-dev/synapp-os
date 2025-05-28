const https = require('https');

// Set credentials
const user = "admin@synfo.com.au";
const password = "23789Shak1ng-p0pcorn@custodian";

// Get yesterday's date in the format YYYY-MM-DD
const date = new Date();
date.setDate(date.getDate() - 50);
const formattedDate = date.toISOString().split('T')[0];

// Update the URL with yesterday's date
const url = `https://portal.overthewire.com.au/voice/cdrs/11282/${formattedDate}`;

// Create base64 encoded credentials
const auth = Buffer.from(`${user}:${password}`).toString('base64');

// Make the request
const options = {
  headers: {
    'Authorization': `Basic ${auth}`
  }
};

https.get(url, options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
}); 