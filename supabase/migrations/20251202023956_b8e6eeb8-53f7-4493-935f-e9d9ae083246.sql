-- Drop existing restrictive policy for inserting roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create new policies that allow first admin creation
-- Allow admins to manage all roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow first admin creation: users can assign themselves admin role 
-- ONLY if no admin exists in the system yet
CREATE POLICY "Allow first admin creation"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND role = 'admin'::app_role
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role
  )
);