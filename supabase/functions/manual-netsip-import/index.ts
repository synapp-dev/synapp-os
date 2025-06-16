import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { parse } from "https://deno.land/std@0.168.0/csv/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    );

    const NETSIP_USERNAME = Deno.env.get("NETSIP_USERNAME")!;
    const NETSIP_PASSWORD = Deno.env.get("NETSIP_PASSWORD")!;
    const carrierName = "Netsip";

    const today = new Date();
    const date = new Date(today.setDate(today.getDate() - 50))
      .toISOString()
      .split("T")[0];

    const url = `https://portal.overthewire.com.au/voice/cdrs/11282/${date}`;

    const credentials = btoa(`${NETSIP_USERNAME}:${NETSIP_PASSWORD}`);

    const start = new Date();
    let rawPayload = "";
    let parsedRecords = [];
    let carrierId: string | null = null;

    const { data: carrierData } = await supabase
      .from("sc_carriers")
      .select("id")
      .eq("name", carrierName)
      .single();

    if (!carrierData) throw new Error("Carrier not found in DB");
    carrierId = carrierData.id;

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    rawPayload = await response.text();

    const { data: rawLog } = await supabase
      .from("sc_raw_cdr_logs")
      .insert({
        carrier_id: carrierId,
        payload: rawPayload,
        metadata: {
          status: response.status,
          date_fetched: date,
        },
      })
      .select()
      .single();

    parsedRecords = await parse(rawPayload, {
      skipFirstRow: true,
      columns: [
        "call_id",
        "datetime",
        "source_number",
        "destination_number",
        "duration",
        "state",
        "direction",
        "rate_plan",
        "price",
        "invoice_number",
        "sip_auth_user",
        "divert_reason",
      ],
    });

    let inserted = 0;

    for (const row of parsedRecords) {
      const hash = btoa(`${carrierId}_${row.call_id}`);
      const startTime = new Date(row.datetime);

      const { error } = await supabase.from("sc_consolidated_cdrs").upsert([{
        carrier_id: carrierId,
        raw_cdr_id: rawLog.id,
        import_id: null,
        call_id: row.call_id,
        call_direction: row.direction.toLowerCase(),
        call_state: row.state.toLowerCase(),
        source_number: row.source_number,
        destination_number: row.destination_number,
        start_time: startTime.toISOString(),
        duration_seconds: parseInt(row.duration),
        divert_reason: row.divert_reason,
        rate_plan: row.rate_plan,
        cost: parseFloat(row.price || "0"),
        billable: null,
        billed_duration: null,
        org_id: null,
        site_id: null,
        hash,
      }], { onConflict: ['hash'] });

      if (!error) inserted++;
    }

    await supabase.from("sc_cdr_imports").insert({
      carrier_id: carrierId,
      started_at: start.toISOString(),
      ended_at: new Date().toISOString(),
      status: "success",
      record_count: inserted,
      triggered_by: null,
      trigger_type: "manual",
    });

    return new Response(
      JSON.stringify({ success: true, records: inserted }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (carrierId) {
      await supabase.from("sc_cdr_imports").insert({
        carrier_id: carrierId,
        started_at: start.toISOString(),
        ended_at: new Date().toISOString(),
        status: "failed",
        error: errorMessage,
        record_count: 0,
        triggered_by: null,
        trigger_type: "manual",
      });
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}); 