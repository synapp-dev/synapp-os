import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Execute the Node.js script
    const { stdout } = await execAsync('node ./misc/fetch-cdrs-daily.js');
    
    // Parse the CSV content
    const rows = stdout.trim().split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1);

    return NextResponse.json({ headers, data });
  } catch (error) {
    console.error('Error executing Node.js script:', error);
    return NextResponse.json({ error: 'Failed to fetch CDR data' }, { status: 500 });
  }
} 