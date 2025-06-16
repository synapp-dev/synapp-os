import { NextResponse } from 'next/server';
import https from 'https';

const USER = "synfo";
const PASSWORD = "QKwA36h4ffjM5c8eJibl";
const BASE_URL = "https://cdrapi.envoip.com.au/";

function makeRequest(url: string, options: https.RequestOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      ...options,
      rejectUnauthorized: false // Allow self-signed certificates
    };
    
    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function getAuthTokens() {
  const tokenUrl = `${BASE_URL}getauth?username=${USER}&password=${PASSWORD}`;
  console.log('Attempting to authenticate with URL:', tokenUrl);
  
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    rejectUnauthorized: false
  };

  try {
    const data = await makeRequest(tokenUrl, options);
    console.log('Auth response:', data);
    
    if (data.includes('<!DOCTYPE html>')) {
      throw new Error('Received HTML response instead of JSON. Check API endpoint and credentials.');
    }

    const response = JSON.parse(data);
    if (!response.user_token || !response.access_token) {
      throw new Error('Invalid response format: missing tokens');
    }

    return {
      userToken: response.user_token,
      bearerToken: response.access_token,
    };
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

async function fetchCDRs(type: 'standard' | 'special', startDate: string, endDate: string, userToken: string, bearerToken: string) {
  const endpoint = type === 'standard' ? 'mycdr' : 'mycdrspecial';
  const requestUrl = `${BASE_URL}auth/${endpoint}?start_date=${startDate}&end_date=${endDate}&user_token=${userToken}&token=${bearerToken}`;
  
  const options = {
    headers: {
      'Authorization': `Bearer ${bearerToken}`,
    },
  };

  const data = await makeRequest(requestUrl, options);
  const response = JSON.parse(data);
  return response.data.call;
}

export async function GET() {
  try {
    // Get authentication tokens
    const { userToken, bearerToken } = await getAuthTokens();

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Fetch both standard and special CDRs
    const [standardCDRs, specialCDRs] = await Promise.all([
      fetchCDRs('standard', formattedStartDate, formattedEndDate, userToken, bearerToken),
      fetchCDRs('special', formattedStartDate, formattedEndDate, userToken, bearerToken),
    ]);

    return NextResponse.json({
      standard: standardCDRs,
      special: specialCDRs,
    });
  } catch (error) {
    console.error('Error fetching CDRs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CDR data' },
      { status: 500 }
    );
  }
}
