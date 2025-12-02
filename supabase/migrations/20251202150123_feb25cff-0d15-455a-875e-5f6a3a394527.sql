-- Create a trigger function to automatically create user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert the role from user metadata into user_roles table
  -- The role is passed during signup in the user metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    COALESCE(
      (new.raw_user_meta_data->>'role')::app_role,
      'tenant'::app_role  -- Default to tenant if no role specified
    )
  );
  RETURN new;
END;
$$;

-- Create trigger to fire after user creation
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();