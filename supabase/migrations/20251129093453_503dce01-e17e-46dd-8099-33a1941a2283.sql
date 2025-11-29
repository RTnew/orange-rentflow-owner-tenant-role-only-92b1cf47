-- Create role enum
create type public.app_role as enum ('admin', 'owner', 'tenant');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Create user_roles table (separate from profiles for security)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create banners table
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  location text,
  roles text[] default '{}',
  page text,
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.banners enable row level security;

-- Create services table
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon_url text,
  roles text[] default '{}',
  page text,
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

-- Create properties table
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  address text,
  city text,
  state text,
  pincode text,
  property_type text,
  rent_amount decimal(10,2),
  status text default 'vacant',
  description text,
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.properties enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage all roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for banners
create policy "Everyone can view active banners"
  on public.banners for select
  using (is_active = true);

create policy "Admins can manage banners"
  on public.banners for all
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services
create policy "Everyone can view active services"
  on public.services for select
  using (is_active = true);

create policy "Admins can manage services"
  on public.services for all
  using (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for properties
create policy "Owners can view their own properties"
  on public.properties for select
  using (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'));

create policy "Owners can insert their own properties"
  on public.properties for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own properties"
  on public.properties for update
  using (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'));

create policy "Owners can delete their own properties"
  on public.properties for delete
  using (auth.uid() = owner_id or public.has_role(auth.uid(), 'admin'));

create policy "Tenants can view listed properties"
  on public.properties for select
  using (status = 'listed' and public.has_role(auth.uid(), 'tenant'));

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Triggers for updated_at
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_banners
  before update on public.banners
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_services
  before update on public.services
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_properties
  before update on public.properties
  for each row execute procedure public.handle_updated_at();