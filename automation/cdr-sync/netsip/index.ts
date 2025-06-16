import dotenv from "dotenv";
import fetch from "node-fetch";
import { Buffer } from "buffer";

if (!process.env.GITHUB_ACTIONS) {
  dotenv.config({ path: ".env.local" });
}

// Only use server-safe keys here — no NEXT_PUBLIC_ needed
const NETSIP_USERNAME = process.env.NETSIP_USERNAME || "";
const NETSIP_PASSWORD = process.env.NETSIP_PASSWORD || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Sanity check
if (!NETSIP_USERNAME || !NETSIP_PASSWORD || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const rpcUrl = `${SUPABASE_URL}/rest/v1/rpc/ingest_netsip_cdrs`;

async function syncCDRsForDate(dateStr: string) {
  const cdrUrl = `https://portal.overthewire.com.au/voice/cdrs/11282/${dateStr}`;

  try {
    const cdrRes = await fetch(cdrUrl, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${NETSIP_USERNAME}:${NETSIP_PASSWORD}`).toString("base64"),
      },
    });

    if (!cdrRes.ok) {
      const error = await cdrRes.text();
      throw new Error(`Fetch failed: ${cdrRes.status} - ${error}`);
    }

    const cdrText = await cdrRes.text();
    console.log(`✅ Fetched CDRs for ${dateStr}`);

    const supabaseRes = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: cdrText,
        trigger_type: "automatic",
        triggered_by: null,
      }),
    });

    if (!supabaseRes.ok) {
      const error = await supabaseRes.text();
      throw new Error(`Supabase RPC failed: ${supabaseRes.status} - ${error}`);
    }

    const result = (await supabaseRes.json()) as { inserted: number };
    console.log(`✅ Supabase RPC succeeded for ${dateStr}. Inserted:`, result.inserted);
  } catch (err) {
    console.error(`❌ Error on ${dateStr}:`, err instanceof Error ? err.message : err);
  }
}

(async () => {
  const today = new Date();

  for (let i = 50; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    await syncCDRsForDate(dateStr);
  }

  console.log("✅ All dates processed.");
})();
