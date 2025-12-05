-- Allow owners to view profiles of users who have tenant role (for tenant search)
CREATE POLICY "Owners can view tenant profiles" 
ON public.profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'owner'::app_role) 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = profiles.id 
    AND user_roles.role = 'tenant'
  )
);