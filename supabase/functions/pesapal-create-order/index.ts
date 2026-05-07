import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const OrderSchema = z.object({
  subscriptionType: z.enum(["monthly", "yearly", "lifetime"]),
  email: z.string().trim().email().max(255),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20).optional(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PESAPAL_API_URL = "https://pay.pesapal.com/v3";

interface OrderRequest {
  subscriptionType: "monthly" | "yearly" | "lifetime";
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const PRICES = {
  monthly: 29,
  yearly: 249,
  lifetime: 499,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth token first
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
    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }

    const token = tokenData.token;

    // Validate request body
    let body: z.infer<typeof OrderSchema>;
    try {
      body = OrderSchema.parse(await req.json());
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { subscriptionType, email, firstName, lastName, phone } = body;
    const amount = PRICES[subscriptionType];

    // Require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: { user: authedUser } } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (!authedUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const merchantReference = `FXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const userId = authedUser.id;

    // Register IPN URL first
    const ipnUrl = `${supabaseUrl}/functions/v1/pesapal-ipn`;
    const ipnResponse = await fetch(`${PESAPAL_API_URL}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "POST",
      }),
    });

    const ipnData = await ipnResponse.json();
    console.log("IPN registration response:", ipnData);

    const ipnId = ipnData.ipn_id;

    // Create order
    const callbackUrl = `${Deno.env.get("SUPABASE_URL")?.replace("supabase.co", "lovable.app") || req.headers.get("origin")}/live-classes?payment=complete`;
    
    const orderPayload = {
      id: merchantReference,
      currency: "USD",
      amount: amount,
      description: `FX Pulse ${subscriptionType} subscription`,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone || "",
        first_name: firstName,
        last_name: lastName,
        country_code: "",
        city: "",
        state: "",
        postal_code: "",
        line_1: "",
        line_2: "",
      },
    };

    console.log("Creating order with payload:", orderPayload);

    const orderResponse = await fetch(`${PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderResponse.json();
    console.log("Order response:", orderData);

    if (orderData.error) {
      throw new Error(orderData.error.message || "Failed to create order");
    }

    // Store pending subscription
    if (userId) {
      await supabase.from("pending_subscriptions").upsert({
        user_id: userId,
        order_tracking_id: orderData.order_tracking_id,
        merchant_reference: merchantReference,
        subscription_type: subscriptionType,
        amount: amount,
        status: "pending",
      });
    }

    return new Response(JSON.stringify({
      redirectUrl: orderData.redirect_url,
      orderTrackingId: orderData.order_tracking_id,
      merchantReference: merchantReference,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Pesapal order error:", error);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
