-- Create expenses table for tracking property-related expenses
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own expenses
CREATE POLICY "Owners can view their own expenses"
ON public.expenses FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own expenses"
ON public.expenses FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own expenses"
ON public.expenses FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own expenses"
ON public.expenses FOR DELETE
USING (auth.uid() = owner_id);

-- Admins can view all expenses
CREATE POLICY "Admins can manage all expenses"
ON public.expenses FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create tenant_assignments table to link tenants to properties
CREATE TABLE public.tenant_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL,
  rent_status text DEFAULT 'pending',
  move_in_date date,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(property_id, tenant_id)
);

-- Enable RLS
ALTER TABLE public.tenant_assignments ENABLE ROW LEVEL SECURITY;

-- Owners can manage tenant assignments for their properties
CREATE POLICY "Owners can view tenant assignments for their properties"
ON public.tenant_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = tenant_assignments.property_id
    AND properties.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can insert tenant assignments for their properties"
ON public.tenant_assignments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = tenant_assignments.property_id
    AND properties.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can update tenant assignments for their properties"
ON public.tenant_assignments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = tenant_assignments.property_id
    AND properties.owner_id = auth.uid()
  )
);

CREATE POLICY "Owners can delete tenant assignments for their properties"
ON public.tenant_assignments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = tenant_assignments.property_id
    AND properties.owner_id = auth.uid()
  )
);

-- Tenants can view their own assignments
CREATE POLICY "Tenants can view their own assignments"
ON public.tenant_assignments FOR SELECT
USING (auth.uid() = tenant_id);

-- Admins can manage all
CREATE POLICY "Admins can manage all tenant assignments"
ON public.tenant_assignments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tenant_assignments_updated_at
BEFORE UPDATE ON public.tenant_assignments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();