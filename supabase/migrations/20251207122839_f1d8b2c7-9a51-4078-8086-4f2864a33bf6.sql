-- Create table for pending subscriptions (to track payment status)
CREATE TABLE public.pending_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_tracking_id TEXT NOT NULL,
  merchant_reference TEXT NOT NULL,
  subscription_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pending_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own pending subscriptions
CREATE POLICY "Users can view their own pending subscriptions"
ON public.pending_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_pending_subscriptions_updated_at
BEFORE UPDATE ON public.pending_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();