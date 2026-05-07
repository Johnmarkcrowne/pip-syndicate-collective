import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const NotificationSchema = z.object({
  type: z.enum(["class_reminder", "class_starting", "welcome", "newsletter"]),
  classId: z.string().uuid().optional(),
  classTitle: z.string().max(200).optional(),
  classTime: z.string().max(100).optional(),
  userId: z.string().uuid().optional(),
  email: z.string().trim().email().max(255).optional(),
  name: z.string().trim().max(100).optional(),
});

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "class_reminder" | "class_starting" | "welcome" | "newsletter";
  classId?: string;
  classTitle?: string;
  classTime?: string;
  userId?: string;
  email?: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let parsed: z.infer<typeof NotificationSchema>;
    try {
      parsed = NotificationSchema.parse(await req.json());
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { type, classId, classTitle, classTime, userId, email, name } = parsed;

    console.log(`Processing ${type} notification request`);

    let recipientEmail = email;
    let recipientName = name || "Trader";

    // If userId is provided, fetch user email from profiles
    if (userId && !email) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      if (profileError || !profile?.email) {
        console.error("Could not fetch user email:", profileError);
        throw new Error("Could not fetch user email");
      }
      recipientEmail = profile.email;
    }

    if (!recipientEmail) {
      throw new Error("No recipient email provided");
    }

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "class_reminder":
        subject = `Reminder: ${classTitle} starts soon!`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #22c55e; margin: 0;">FX<span style="color: #ffffff;">Pulse</span></h1>
            </div>
            <h2 style="color: #22c55e;">Class Reminder</h2>
            <p>Hi ${recipientName},</p>
            <p>Don't forget! <strong>${classTitle}</strong> is starting at <strong>${classTime}</strong>.</p>
            <p>Make sure you're ready to join and learn with the community.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://fxpulse.lovable.app/live-classes" style="background-color: #22c55e; color: #0f0f0f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Join Class</a>
            </div>
            <p style="color: #888;">See you there!<br>The FX Pulse Team</p>
          </div>
        `;
        break;

      case "class_starting":
        subject = `${classTitle} is starting NOW!`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #22c55e; margin: 0;">FX<span style="color: #ffffff;">Pulse</span></h1>
            </div>
            <h2 style="color: #22c55e;">🔴 Class is LIVE!</h2>
            <p>Hi ${recipientName},</p>
            <p><strong>${classTitle}</strong> has started! Join now to not miss anything.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://fxpulse.lovable.app/live-classes" style="background-color: #22c55e; color: #0f0f0f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Join Now</a>
            </div>
            <p style="color: #888;">Happy trading!<br>The FX Pulse Team</p>
          </div>
        `;
        break;

      case "welcome":
        subject = "Welcome to FX Pulse! 🎉";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #22c55e; margin: 0;">FX<span style="color: #ffffff;">Pulse</span></h1>
            </div>
            <h2 style="color: #22c55e;">Welcome to the Community!</h2>
            <p>Hi ${recipientName},</p>
            <p>Thank you for subscribing to FX Pulse! You now have access to:</p>
            <ul style="color: #ccc;">
              <li>Live trading classes with expert instructors</li>
              <li>Exclusive educational content</li>
              <li>Community discussions and support</li>
              <li>Class recordings and resources</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://fxpulse.lovable.app/live-classes" style="background-color: #22c55e; color: #0f0f0f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Classes</a>
            </div>
            <p style="color: #888;">Happy trading!<br>The FX Pulse Team</p>
          </div>
        `;
        break;

      case "newsletter":
        subject = "FX Pulse Weekly Update";
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #22c55e; margin: 0;">FX<span style="color: #ffffff;">Pulse</span></h1>
            </div>
            <h2 style="color: #22c55e;">Weekly Trading Update</h2>
            <p>Hi ${recipientName},</p>
            <p>Here's your weekly update from FX Pulse with the latest market insights and upcoming classes.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://fxpulse.lovable.app" style="background-color: #22c55e; color: #0f0f0f; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Visit FX Pulse</a>
            </div>
            <p style="color: #888;">Happy trading!<br>The FX Pulse Team</p>
          </div>
        `;
        break;

      default:
        throw new Error("Invalid notification type");
    }

    console.log(`Sending ${type} email to ${recipientEmail}`);

    const emailResponse = await resend.emails.send({
      from: "FX Pulse <onboarding@resend.dev>",
      to: [recipientEmail],
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log notification in database
    if (userId) {
      await supabase.from("notifications").insert({
        user_id: userId,
        title: subject,
        message: `${type} notification sent`,
        type,
        class_id: classId || null,
      });
    }

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
