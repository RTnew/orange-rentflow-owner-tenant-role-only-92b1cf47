-- Create documents table for tenant document storage
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  file_url text,
  file_type text,
  file_size text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create payments table for rent payments and receipts
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  property_id uuid REFERENCES public.properties(id),
  amount numeric NOT NULL,
  payment_date timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  payment_method text,
  status text DEFAULT 'completed',
  receipt_id text,
  month_year text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Documents RLS policies
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all documents" ON public.documents
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Payments RLS policies
CREATE POLICY "Tenants can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can insert their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

CREATE POLICY "Owners can view payments for their properties" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = payments.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();