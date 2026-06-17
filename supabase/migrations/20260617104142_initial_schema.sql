-- LetLogic initial schema

-- profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- properties
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  postcode text not null,
  jurisdiction text not null default 'england_wales'
    check (jurisdiction in ('england_wales', 'scotland', 'ni')),
  tenancy_start date,
  tenancy_end date,
  rent_amount numeric(10, 2),
  deposit_scheme text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index properties_user_id_idx on public.properties (user_id) where deleted_at is null;

-- tenants
create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  full_name text not null,
  email text,
  sort_order int not null default 0
);

create index tenants_property_id_idx on public.tenants (property_id);

-- document types (seeded reference)
create table public.document_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  prompt_version text not null default 'v1',
  stripe_price_id_oneoff text,
  oneoff_price_pence int not null default 0,
  jurisdiction text[] not null default array['england_wales'],
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- documents
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  property_id uuid references public.properties (id) on delete set null,
  document_type_id uuid not null references public.document_types (id),
  status text not null default 'draft'
    check (status in ('draft', 'preview', 'purchased', 'expired', 'archived')),
  form_data jsonb not null default '{}'::jsonb,
  generated_content jsonb,
  preview_storage_path text,
  final_storage_path text,
  watermark boolean not null default true,
  purchase_id uuid,
  edit_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_user_id_idx on public.documents (user_id);
create index documents_property_id_idx on public.documents (property_id);

-- purchases
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  type text not null check (type in ('single_doc', 'pack', 'subscription')),
  pack_slug text,
  amount_pence int not null default 0,
  credits_total int not null default 1,
  credits_used int not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'refunded')),
  created_at timestamptz not null default now()
);

create index purchases_user_id_idx on public.purchases (user_id);

alter table public.documents
  add constraint documents_purchase_id_fkey
  foreign key (purchase_id) references public.purchases (id) on delete set null;

-- subscriptions
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_subscription_id text not null unique,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);

-- compliance items
create table public.compliance_items (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  type text not null check (type in (
    'gas_safety', 'epc', 'eicr', 'deposit', 'right_to_rent'
  )),
  due_date date,
  completed_at timestamptz,
  notes text,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index compliance_items_property_id_idx on public.compliance_items (property_id);

-- reminders
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  compliance_item_id uuid not null references public.compliance_items (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  remind_at timestamptz not null,
  sent_at timestamptz,
  channel text not null default 'email',
  created_at timestamptz not null default now()
);

create index reminders_remind_at_idx on public.reminders (remind_at) where sent_at is null;

-- prompt versions
create table public.prompt_versions (
  id uuid primary key default gen_random_uuid(),
  document_type_id uuid not null references public.document_types (id) on delete cascade,
  version text not null,
  system_prompt text not null,
  output_schema jsonb not null default '{}'::jsonb,
  effective_from date not null default current_date,
  created_at timestamptz not null default now(),
  unique (document_type_id, version)
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger properties_updated_at before update on public.properties
  for each row execute function public.set_updated_at();
create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger compliance_items_updated_at before update on public.compliance_items
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.tenants enable row level security;
alter table public.document_types enable row level security;
alter table public.documents enable row level security;
alter table public.purchases enable row level security;
alter table public.subscriptions enable row level security;
alter table public.compliance_items enable row level security;
alter table public.reminders enable row level security;
alter table public.prompt_versions enable row level security;

-- profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- properties
create policy "Users can view own properties"
  on public.properties for select
  using (auth.uid() = user_id and deleted_at is null);

create policy "Users can insert own properties"
  on public.properties for insert
  with check (auth.uid() = user_id);

create policy "Users can update own properties"
  on public.properties for update
  using (auth.uid() = user_id);

create policy "Users can delete own properties"
  on public.properties for delete
  using (auth.uid() = user_id);

-- tenants (via property ownership)
create policy "Users can view tenants on own properties"
  on public.tenants for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.user_id = auth.uid() and p.deleted_at is null
    )
  );

create policy "Users can manage tenants on own properties"
  on public.tenants for all
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.user_id = auth.uid() and p.deleted_at is null
    )
  )
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.user_id = auth.uid() and p.deleted_at is null
    )
  );

-- document_types (public read for active types)
create policy "Anyone can view active document types"
  on public.document_types for select
  using (active = true);

-- documents
create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- purchases
create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- compliance items (via property ownership)
create policy "Users can view compliance on own properties"
  on public.compliance_items for select
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.user_id = auth.uid() and p.deleted_at is null
    )
  );

create policy "Users can manage compliance on own properties"
  on public.compliance_items for all
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.user_id = auth.uid() and p.deleted_at is null
    )
  )
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_id and p.user_id = auth.uid() and p.deleted_at is null
    )
  );

-- reminders
create policy "Users can view own reminders"
  on public.reminders for select
  using (auth.uid() = user_id);

-- prompt_versions (read-only for authenticated users)
create policy "Authenticated users can view prompt versions"
  on public.prompt_versions for select
  to authenticated
  using (true);

-- seed MVP document types
insert into public.document_types (slug, name, oneoff_price_pence, jurisdiction) values
  ('section-21', 'Section 21 Notice', 699, array['england_wales']),
  ('rent-increase', 'Rent Increase Letter', 499, array['england_wales']),
  ('right-to-rent', 'Right to Rent Checklist', 399, array['england_wales']),
  ('inventory', 'Inventory Report', 599, array['england_wales']);

-- storage bucket for generated documents (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

create policy "Users can read own document files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload own document files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own document files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own document files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
