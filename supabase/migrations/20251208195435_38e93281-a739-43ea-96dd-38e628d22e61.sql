-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Subscribers can join classes" ON public.class_participants;

-- Create new policy that allows subscribers OR instructors/admins to join
CREATE POLICY "Subscribers and staff can join classes" 
ON public.class_participants 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) AND (
    has_active_subscription(auth.uid()) OR 
    has_role(auth.uid(), 'instructor'::app_role) OR 
    has_role(auth.uid(), 'admin'::app_role)
  )
);