import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PESAPAL_API_URL = "https://pay.pesapal.com/v3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse IPN data from query params or body
    const url = new URL(req.url);
    const orderTrackingId = url.searchParams.get("OrderTrackingId");
    const orderMerchantReference = url.searchParams.get("OrderMerchantReference");

    console.log("IPN received:", { orderTrackingId, orderMerchantReference });

    if (!orderTrackingId) {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get auth token
    const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");

    const tokenResponse = await fetch(`${PESAPAL_API_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      }),
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    // Get transaction status
    const statusResponse = await fetch(
      `${PESAPAL_API_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const statusData = await statusResponse.json();
    console.log("Transaction status:", statusData);

    // Payment status codes: 0 = INVALID, 1 = COMPLETED, 2 = FAILED, 3 = REVERSED
    if (statusData.payment_status_description === "Completed" || statusData.status_code === 1) {
      // Find pending subscription
      const { data: pending } = await supabase
        .from("pending_subscriptions")
        .select("*")
        .eq("order_tracking_id", orderTrackingId)
        .single();

      if (pending) {
        // Calculate subscription dates
        const startsAt = new Date();
        let endsAt: Date | null = null;

        if (pending.subscription_type === "monthly") {
          endsAt = new Date(startsAt);
          endsAt.setMonth(endsAt.getMonth() + 1);
        } else if (pending.subscription_type === "yearly") {
          endsAt = new Date(startsAt);
          endsAt.setFullYear(endsAt.getFullYear() + 1);
        }
        // Lifetime has no end date

        // Create subscription
        await supabase.from("subscriptions").insert({
          user_id: pending.user_id,
          type: pending.subscription_type,
          status: "active",
          starts_at: startsAt.toISOString(),
          ends_at: endsAt?.toISOString() || null,
        });

        // Update pending subscription status
        await supabase
          .from("pending_subscriptions")
          .update({ status: "completed" })
          .eq("id", pending.id);

        console.log("Subscription created for user:", pending.user_id);
      }
    }

    return new Response(JSON.stringify({ 
      orderNotificationType: "IPNCHANGE",
      orderTrackingId: orderTrackingId,
      orderMerchantReference: orderMerchantReference,
      status: statusData.payment_status_description
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Pesapal IPN error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
